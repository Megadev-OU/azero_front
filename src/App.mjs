import './App.css';
import { useState, useEffect } from 'react';
import { web3Enable, web3Accounts } from "@polkadot/extension-dapp";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { createTokens, getLockBalance, getTokensBalance, sendNativeTokens, sendTime, transferTokens, withdraw } from './lib/tx.mjs';


const ALEPH_ZERO_TESTNET_WS_PROVIDER = new WsProvider("wss://ws.test.azero.dev");
const API_PROMISE = ApiPromise.create({provider: ALEPH_ZERO_TESTNET_WS_PROVIDER});

const time = 1698089432036;


function App() {
  const [accounts, setAccounts] = useState([]);
  const [api, setApi] = useState();

  useEffect(() => {
    API_PROMISE.then(setApi);
  }, []);

  const loadAccountsFromExtensions = async () => {
    const injectedExtensions = await web3Enable('COINSENDER');

    console.log('accounts - ', injectedExtensions); // нужно добавить выбор аккаунта

    const accs = await web3Accounts(
      { extensions: [injectedExtensions[0].name] }
    );

    setAccounts(accs);
  }

  const sendTz = async () => {
    await sendNativeTokens(
      api,
      accounts[0],
      [
        1000000, 
        1000000
      ],
      [
        '5GTfAZcc44wPJekN4Vtq1QegfVmZWh8xgRQd39eynatu7FXa', 
        '5CXzHP3exGqnDRTG5xHAwz5MPLZpXwWf9HrGeN76PbXndJrg'
      ],
      2002000 // сумма рассылки с учетом комиссии 0.1%
    );
  }

  const sendTimeTx = async () => {
    await sendTime(
      api,
      accounts[0],
      [
        1000000, 
        1000000
      ],
      [
        '5GTfAZcc44wPJekN4Vtq1QegfVmZWh8xgRQd39eynatu7FXa', 
        '5CXzHP3exGqnDRTG5xHAwz5MPLZpXwWf9HrGeN76PbXndJrg'
      ],
      [ // массив таймстемов окончания локовs
        Date.now() + 1000,
        time
      ],
      2002000 // сумма рассылки с учетом комиссии 0.1%
    );
  }

  const lockBallance = async () => {
    const res = await getLockBalance(api, '5CXzHP3exGqnDRTG5xHAwz5MPLZpXwWf9HrGeN76PbXndJrg', time);
    console.log('Balance - ' + res);
  }

  const withdrawTx = async () => {
    await withdraw(api, accounts[0], time); // 3й аргумент - timestam за который нужно вывести ZCOIN 
  }

  const createTokensTx = async () => {
    await createTokens(api, accounts[0], 1000000000); // 3й аргумент - количество выпускаемых токенов 
  }

  const getTokensBalanceTx = async () => {
    const res = await getTokensBalance(api, '5CXzHP3exGqnDRTG5xHAwz5MPLZpXwWf9HrGeN76PbXndJrg', 1); // 3й аргумент - id токена 
    console.log('Tokens - ' + res);
  }

  const TokensTransferTx = async () => {
    await transferTokens(
      api, 
      accounts[0], 
      '5CXzHP3exGqnDRTG5xHAwz5MPLZpXwWf9HrGeN76PbXndJrg', 
      '5GTfAZcc44wPJekN4Vtq1QegfVmZWh8xgRQd39eynatu7FXa', 
      1,
      10000
    );  
  }


  return (
    <div className="App">
      <button onClick={loadAccountsFromExtensions}>Connect to extensions</button>
      {accounts[0] && <div>
        <button onClick={sendTz}>Рассылка ZCOINS</button>
        <button onClick={sendTimeTx}>Рассылка ZCOINS c локом</button>
        <button onClick={withdrawTx}>Вывод ZCOINS</button>
        <button onClick={lockBallance}>Баланс залоченых ZCOINS</button>
        <button onClick={createTokensTx}>Создание токенов</button>
        <button onClick={getTokensBalanceTx}>Получить баланс токенов</button>
        <button onClick={TokensTransferTx}>Трансфер токенов</button>
      </div>}
    </div>
  );
}

export default App;
