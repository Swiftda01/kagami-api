/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
declare const Parse: any;
import './generated/evmApi';
import './generated/solApi';
import { requestMessage } from '../auth/authService';
import Moralis from 'moralis'
import { EvmChain } from "@moralisweb3/evm-utils";

const chains = [EvmChain.MUMBAI];

Parse.Cloud.define('requestMessage', async ({ params }: any) => {
  const { address, chain, networkType } = params;

  const message = await requestMessage({
    address,
    chain,
    networkType,
  });

  return { message };
});

Parse.Cloud.define('getPluginSpecs', () => {
  // Not implemented, only excists to remove client-side errors when using the moralis-v1 package
  return [];
});

Parse.Cloud.define('getServerTime', () => {
  // Not implemented, only excists to remove client-side errors when using the moralis-v1 package
  return null;
});

Parse.Cloud.define("createStream", async (request: any) => {
  const { description, tag, webhookUrl } = request.params;

  const newStream = await Moralis.Streams.add({
    chains,
    description,
    tag,
    webhookUrl,
    includeNativeTxs: true,
  });

  return newStream.toJSON().id;
});

Parse.Cloud.define("deleteStream", async (request: any) => {
  const { id } = request.params;
  await Moralis.Streams.delete({ id });
});

Parse.Cloud.define("updateStreamAddresses", async (request: any) => {
  const { id, from, to } = request.params;
  const addressesToAdd = to.filter((address: string) => !from.includes(address));
  const addressesToRemove = from.filter((address: string) => !to.includes(address));

  Moralis.Streams.addAddress({ address: addressesToAdd, id });

  addressesToRemove.forEach((address: string) => {
    Moralis.Streams.deleteAddress({ address, id });
  });
});

Parse.Cloud.define("checkTransactionLimitBreach", async (request: any) => {
  const breaches: object[] = [];
  const confirmed = request.params.confirmed;
  const transactions = request.params.txs;

  // Only check for breaches if there are confirmed transactions
  if (!confirmed || transactions.length === 0) return breaches;

  // Get all clusters
  const Cluster = Parse.Object.extend("Cluster");
  const clusters = await new Parse.Query(Cluster).find({
    useMasterKey: true,
  });

  // Get all Transaction Limit policies
  const Policy = Parse.Object.extend("Policy");

  const policiesQuery = await new Parse.Query(Policy);
  policiesQuery.equalTo("type", "Transaction Limit");

  const policies = await policiesQuery.find({ useMasterKey: true });

  // Check all policies
  for (let index = 0; index < policies.length; index++) {
    const policy = policies[index];

    // Get policy cluster
    const cluster = clusters.find((searchedCluster: any) => {
      return policy.attributes.cluster.id === searchedCluster.id;
    });

    // Check all confirmed transactions
    for (let index = 0; index < transactions.length; index++) {
      const tx = transactions[index];

      // Only check policy for breaches if confirmed transaction amounts are
      // sent by addresses within cluster
      if (
        !cluster.attributes.addresses.some((address: string) => {
          return tx.fromAddress.toLowerCase() === address.toLowerCase();
        }) ||
        cluster.attributes.addresses.some((address: string) => {
          return tx.toAddress.toLowerCase() === address.toLowerCase();
        })
      ) {
        continue;
      }

      // Find who sent currency value from lowest denomination
      const valueWhole = tx.value / 1000000000000000000;

      // Find breach amount
      const breachAmount = parseFloat(
        (valueWhole - policy.attributes.rules.max).toPrecision(12)
      );

      // Create breach object if a breach has occurred
      if (breachAmount > 0) {
        const Breach = Parse.Object.extend("Breach");
        const breach = new Breach();

        breach.setACL(new Parse.ACL(policy.attributes.ACL.permissionsById));

        breach.set("policy", policy);
        breach.set("notified", policy.attributes.recipients);
        breach.set("rules", policy.attributes.rules);
        breach.set("violation", { exceededBy: breachAmount });

        breach.save();

        breaches.push({
          policyId: policy.id,
          sentAmount: valueWhole,
          breachAmount,
        });
      }
    }
  }

  return breaches;
});
