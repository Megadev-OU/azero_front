import { ContractPromise } from '@polkadot/api-contract';
import { web3FromSource } from '@polkadot/extension-dapp';
import { getGasLimit, readOnlyGasLimit } from './gasLimit.js';
import { BN } from "@polkadot/util";
import contractMetadata from "./coinsender.json";

const CONTRACT_ADDRESS = "5GZpoA5VoBKviqaxHurPtGiN8TCGHAePZynofgzo5WPz5R8j";


export const sendNativeTokens = async (
  api,
  loggedUser,
  amounts, 
  recipients,
  totalPrice
) => {
  if (!loggedUser.meta.source) return;

  const contract = new ContractPromise(api, contractMetadata, CONTRACT_ADDRESS);

  const injector = await web3FromSource(loggedUser.meta.source);

  const options = {
    value: totalPrice,
  };
  const gasLimitResult = await getGasLimit(
    api, 
    loggedUser.address, 
    'sendTz', 
    contract, 
    options, [
      amounts,
      recipients,
    ]
  );

  if (!gasLimitResult.ok) {
    console.log(gasLimitResult.error);
    return;
  }

  const { value: gasLimit } = gasLimitResult;
  
  await contract.tx
    .sendTz(
      {
        value: new BN(totalPrice),
        gasLimit,
      },
      amounts, 
      recipients
    )
    .signAndSend(loggedUser.address, { signer: injector.signer }, ({ events = [], status }) => {
      events.forEach(({ event }) => {
        const { method } = event;
        if (method === 'ExtrinsicSuccess' && status.type === 'InBlock') {
          console.log(status.type);
        } else if (method === 'ExtrinsicFailed') {
          console.log('err but sign - '+method);
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const sendTime = async (
  api,
  loggedUser,
  amounts, 
  recipients,
  times,
  totalPrice
) => {
  if (!loggedUser.meta.source) return;

  const contract = new ContractPromise(api, contractMetadata, CONTRACT_ADDRESS);

  const injector = await web3FromSource(loggedUser.meta.source);

  const options = {
    value: totalPrice,
  };
  const gasLimitResult = await getGasLimit(
    api, 
    loggedUser.address, 
    'sendTime', 
    contract, 
    options, [
      amounts,
      recipients,
      times
    ]
  );

  if (!gasLimitResult.ok) {
    console.log(gasLimitResult.error);
    return;
  }

  const { value: gasLimit } = gasLimitResult;
  
  await contract.tx
    .sendTime(
      {
        value: new BN(totalPrice),
        gasLimit,
      },
      amounts, 
      recipients,
      times
    )
    .signAndSend(loggedUser.address, { signer: injector.signer }, ({ events = [], status }) => {
      events.forEach(({ event }) => {
        const { method } = event;
        if (method === 'ExtrinsicSuccess' && status.type === 'InBlock') {
          console.log(status.type);
        } else if (method === 'ExtrinsicFailed') {
          console.log('err but sign - '+method);
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const withdraw = async (api, loggedUser, time) => {
  if (!loggedUser.meta.source) return;

  const contract = new ContractPromise(api, contractMetadata, CONTRACT_ADDRESS);

  const injector = await web3FromSource(loggedUser.meta.source);

  const options = {
    value: 0,
  };
  const gasLimitResult = await getGasLimit(
    api, 
    loggedUser.address, 
    'withdraw', 
    contract, 
    options, [
      time
    ]
  );

  if (!gasLimitResult.ok) {
    console.log(gasLimitResult.error);
    return;
  }

  const { value: gasLimit } = gasLimitResult;
  
  await contract.tx.withdraw({gasLimit}, time)
    .signAndSend(loggedUser.address, { signer: injector.signer }, ({ events = [], status }) => {
      events.forEach(({ event }) => {
        const { method } = event;
        if (method === 'ExtrinsicSuccess' && status.type === 'InBlock') {
          console.log(status.type);
        } else if (method === 'ExtrinsicFailed') {
          console.log('err but sign - '+method);
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const createTokens = async (api, loggedUser, amount) => {
  if (!loggedUser.meta.source) return;

  const contract = new ContractPromise(api, contractMetadata, CONTRACT_ADDRESS);

  const injector = await web3FromSource(loggedUser.meta.source);

  const options = {
    value: 0,
  };
  const gasLimitResult = await getGasLimit(
    api, 
    loggedUser.address, 
    'createTokens', 
    contract, 
    options, [
      amount
    ]
  );

  if (!gasLimitResult.ok) {
    console.log(gasLimitResult.error);
    return;
  }

  const { value: gasLimit } = gasLimitResult;
  
  await contract.tx.createTokens({gasLimit}, amount)
    .signAndSend(loggedUser.address, { signer: injector.signer }, ({ events = [], status }) => {
      events.forEach(({ event }) => {
        const { method } = event;
        if (method === 'ExtrinsicSuccess' && status.type === 'InBlock') {
          console.log(status.type);
        } else if (method === 'ExtrinsicFailed') {
          console.log('err but sign - '+method);
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getTokensBalance = async (api, user, tokenId) => {
  const gasLimit = readOnlyGasLimit(api);
  const contract = new ContractPromise(api, contractMetadata, CONTRACT_ADDRESS);

  const { output } = await contract.query.balanceOf(contract.address, {gasLimit}, user, tokenId);

  return output.toHuman()?.Ok
};

export const getLockBalance = async (api, user, time) => {
  const gasLimit = readOnlyGasLimit(api);
  const contract = new ContractPromise(api, contractMetadata, CONTRACT_ADDRESS);

  const { result, output } = await contract.query.timeOf(contract.address, {gasLimit}, user, time);

  console.log(result.toHuman(), output.toHuman());


  return output.toHuman()?.Ok
};

export const transferTokens = async (api, loggedUser, from, to, tokenId, amount) => {
  if (!loggedUser.meta.source) return;

  const contract = new ContractPromise(api, contractMetadata, CONTRACT_ADDRESS);

  const injector = await web3FromSource(loggedUser.meta.source);

  const options = {
    value: 0,
  };
  const gasLimitResult = await getGasLimit(
    api, 
    loggedUser.address, 
    'transferTokens', 
    contract, 
    options, [
      from,
      to,
      tokenId,
      amount
    ]
  );

  if (!gasLimitResult.ok) {
    console.log(gasLimitResult.error);
    return;
  }

  const { value: gasLimit } = gasLimitResult;
  
  await contract.tx.transferTokens({gasLimit}, from, to, tokenId, amount)
    .signAndSend(loggedUser.address, { signer: injector.signer }, ({ events = [], status }) => {
      events.forEach(({ event }) => {
        const { method } = event;
        if (method === 'ExtrinsicSuccess' && status.type === 'InBlock') {
          console.log(status.type);
        } else if (method === 'ExtrinsicFailed') {
          console.log('err but sign - '+method);
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
};