/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
declare const Parse: any;
import './generated/evmApi';
import './generated/solApi';
import { requestMessage } from '../auth/authService';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/evm-utils';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import config from '../config';

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

Parse.Cloud.define('assignToken', async (request: any) => {
  const owner = request.params.owner;

  const abi = [
    {
      inputs: [],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'approved',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'Approval',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'operator',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'bool',
          name: 'approved',
          type: 'bool',
        },
      ],
      name: 'ApprovalForAll',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'approve',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address',
        },
        {
          internalType: 'string',
          name: 'tokenURI',
          type: 'string',
        },
      ],
      name: 'assign',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'previousOwner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'safeTransferFrom',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
        {
          internalType: 'bytes',
          name: 'data',
          type: 'bytes',
        },
      ],
      name: 'safeTransferFrom',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'operator',
          type: 'address',
        },
        {
          internalType: 'bool',
          name: 'approved',
          type: 'bool',
        },
      ],
      name: 'setApprovalForAll',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'Transfer',
      type: 'event',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'transferFrom',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'getApproved',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'operator',
          type: 'address',
        },
      ],
      name: 'isApprovedForAll',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'name',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'ownerOf',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'bytes4',
          name: 'interfaceId',
          type: 'bytes4',
        },
      ],
      name: 'supportsInterface',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'symbol',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'tokenURI',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ];

  const contractAddress = config.TOKEN_CONTRACT;

  const privateKey = config.TREASURY_WALLET_PRIVATE_KEY;

  const web3 = new Web3(new Web3.providers.HttpProvider(config.WEB3_HTTP_PROVIDER));

  const myContract = new web3.eth.Contract(abi as AbiItem[], contractAddress);

  const metadataUri = await Parse.Cloud.run('metadata', { owner });

  if (!metadataUri) {
    return;
  }

  const tx = {
    to: contractAddress,
    gas: 963966,
    value: 0,
    data: myContract.methods.assign(owner, metadataUri).encodeABI(),
  };

  const signPromise = web3.eth.accounts.privateKeyToAccount(privateKey).signTransaction(tx);

  signPromise
    .then((signedTx: any) => {
      const sentTx = web3.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);

      sentTx.on('receipt', (receipt: any) => {
        return receipt;
      });

      sentTx.on('error', (err: any) => {
        return err;
      });
    })
    .catch((err: any) => {
      return err;
    });

  return await signPromise;
});

Parse.Cloud.define('metadata', async (request: any) => {
  const currentTime = new Date();
  const createdAt = currentTime.toISOString();
  const owner = request.params.owner;

  const metadata = { createdAt, owner };

  return await Parse.Cloud.httpRequest({
    method: 'POST',
    url: 'https://deep-index.moralis.io/api/v2/ipfs/uploadFolder',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': config.MORALIS_API_KEY,
      accept: 'application/json',
    },
    body: [
      {
        path: `${owner}.json`,
        content: metadata,
      },
    ],
  })
    .then(function (httpResponse: any) {
      return JSON.parse(httpResponse.text)[0].path;
    })
    .catch((error: any) => {
      return error;
    });
});

Parse.Cloud.define('getPluginSpecs', () => {
  // Not implemented, only excists to remove client-side errors when using the moralis-v1 package
  return [];
});

Parse.Cloud.define('getServerTime', () => {
  // Not implemented, only excists to remove client-side errors when using the moralis-v1 package
  return null;
});

Parse.Cloud.define('createStream', async (request: any) => {
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

Parse.Cloud.define('deleteStream', async (request: any) => {
  const { id } = request.params;
  await Moralis.Streams.delete({ id });
});

Parse.Cloud.define('updateStreamAddresses', async (request: any) => {
  const { id, from, to } = request.params;
  const addressesToAdd = to.filter((address: string) => !from.includes(address));
  const addressesToRemove = from.filter((address: string) => !to.includes(address));

  if (addressesToAdd.length > 0) {
    await Moralis.Streams.addAddress({ address: addressesToAdd, id });
  }

  addressesToRemove.forEach((address: string) => {
    Moralis.Streams.deleteAddress({ address, id });
  });
});

// TODO: Fix this and schedule to run on a daily basis, not working since
// move to self-hosted server
Parse.Cloud.define('checkDailyLimitBreach', async (request: any) => {
  const breaches = [];

  const chain = chains[0];

  const Cluster = Parse.Object.extend('Cluster');
  const clusters = await new Parse.Query(Cluster).find({
    useMasterKey: true,
  });

  const Policy = Parse.Object.extend('Policy');
  const policiesQuery = await new Parse.Query(Policy);
  policiesQuery.equalTo('type', 'Daily Limit');

  const policies = await policiesQuery.find({ useMasterKey: true });

  const Breach = Parse.Object.extend('Breach');

  for (let index = 0; index < policies.length; index++) {
    const policy = policies[index];

    const cluster = clusters.find((searchedCluster: any) => {
      return policy.attributes.cluster.id === searchedCluster.id;
    });

    const date = new Date();

    const toDate = date.toISOString();
    date.setDate(date.getDate() - 1);
    const fromDate = date.toISOString();

    const txQueries = cluster.attributes.addresses.map(async (address: string) => {
      const options = { chain, address, to_date: toDate, from_date: fromDate };

      return await Parse.Web3API.account.getTransactions(options);
    });

    const txs = (await Promise.all(txQueries))
      .map((txQuery) => {
        return txQuery.result.filter((tx: any) => {
          return !cluster.attributes.addresses.some((address: string) => {
            return tx.to_address.toLowerCase() === address.toLowerCase();
          });
        });
      })
      .flat();

    if (txs.length > 0) {
      const sentAmount = txs.reduce((accumulator, tx) => {
        return accumulator + parseInt(tx.value);
      }, 0);

      const valueWhole = sentAmount / 1000000000000000000;
      const breachAmount = parseFloat((valueWhole - policy.attributes.rules.max).toPrecision(12));

      if (breachAmount > 0) {
        const breach = new Breach();

        breach.setACL(new Parse.ACL(policy.attributes.ACL.permissionsById));

        breach.set('clusterName', cluster.attributes.name);
        breach.set('policyType', policy.attributes.type);
        breach.set('policy', policy);
        breach.set('notified', policy.attributes.recipients);
        breach.set('rules', policy.attributes.rules);
        breach.set('violation', { exceededBy: breachAmount });

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

Parse.Cloud.define('checkTransactionLimitBreach', async (request: any) => {
  const breaches: object[] = [];
  const confirmed = request.params.confirmed;
  const transactions = request.params.txs;

  // Only check for breaches if there are confirmed transactions
  if (confirmed || transactions.length === 0) return breaches;

  // Get all clusters
  const Cluster = Parse.Object.extend('Cluster');
  const clusters = await new Parse.Query(Cluster).find({
    useMasterKey: true,
  });

  // Get all Transaction Limit policies
  const Policy = Parse.Object.extend('Policy');

  const policiesQuery = await new Parse.Query(Policy);
  policiesQuery.equalTo('type', 'Transaction Limit');

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
      // sent by addresses within cluster to addresses outside of the cluster
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

      // Find sent currency value from lowest denomination
      const valueWhole = tx.value / 1000000000000000000;

      // Find breach amount
      const breachAmount = parseFloat((valueWhole - policy.attributes.rules.max).toPrecision(12));

      // Create breach object if a breach has occurred
      if (breachAmount > 0) {
        const Breach = Parse.Object.extend('Breach');
        const breach = new Breach();

        breach.setACL(new Parse.ACL(policy.attributes.ACL.permissionsById));

        breach.set('clusterName', cluster.attributes.name);
        breach.set('policyType', policy.attributes.type);
        breach.set('policy', policy);
        breach.set('notified', policy.attributes.recipients);
        breach.set('rules', policy.attributes.rules);
        breach.set('violation', { exceededBy: breachAmount });

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
