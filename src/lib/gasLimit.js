import { BN, BN_ONE } from '@polkadot/util';


const toContractAbiMessage = (
  contractPromise,
  message
) => {
  const value = contractPromise.abi.messages.find((m) => m.method === message);

  if (!value) {
    const messages = contractPromise?.abi.messages.map((m) => m.method).join(', ');

    const error = `"${message}" not found in metadata.spec.messages: [${messages}]`;
    console.error(error);

    return { ok: false, error };
  }

  return { ok: true, value };
};

export const getGasLimit = async (
  api,
  userAddress,
  message,
  contract,
  options = {},
  args = []
  // temporarily type is Weight instead of WeightV2 until polkadot-js type `ContractExecResult` will be changed to WeightV2
) => {
  const abiMessage = toContractAbiMessage(contract, message);
  if (!abiMessage.ok) return abiMessage;

  const { value, gasLimit, storageDepositLimit } = options;

  const result = await api.call.contractsApi.call(
    userAddress,
    contract.address,
    value ?? new BN(0),
    gasLimit ?? null,
    storageDepositLimit ?? null,
    abiMessage.value.toU8a(args)
  );

  return { ok: true, value: result.gasRequired };
};

export const readOnlyGasLimit = api => {
  return api.registry.createType('WeightV2', {
    refTime: new BN(1_000_000_000_000),
    proofSize: new BN(5_000_000_000_000).isub(BN_ONE)
  });
}