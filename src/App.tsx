import React, { useState, useEffect } from "react";
import CircleLoader from "react-spinners/ClipLoader";

import './App.css';

import { Currency } from "./Currency";

const apiUrl = 'https://v6.exchangerate-api.com/v6/';
const apiKey = 'daa9599420afe873a68c9652';

const App: React.FC = () => {
  const baseCurrency: string = 'EUR';
  const [loading, setLoading] = useState<boolean>(true);
  const [allCurrencies, setAllCurencies] = useState<string[]>([]);
  const [firstCurrency, setFirstCurrency] = useState<string>(baseCurrency);
  const [secondCurrency, setSecondCurrency] = useState<string>('USD');
  const [changeInFirstCurrency, setChangeInFirstCurrency] = useState<boolean>(true);
  const [amount, setAmount] = useState<number>(1);
  const [rate, setRate] = useState<number>(0);
  const [latestUpdate, setLatestUpdate] = useState<Date>();

  let firstAmount: number;
  let secondAmount: number;

  useEffect(() => {
    fetch(`${apiUrl}${apiKey}/latest/${baseCurrency}`)
      .then(blop => blop.json())
      .then(data => {
        console.log('data', data);
        setAllCurencies(Object.keys(data.conversion_rates))
        setRate(data.conversion_rates[baseCurrency])
        setLatestUpdate(data.time_last_update_utc);
        setLoading(false);
      })
  }, []);

  useEffect(() => {
    if (!!firstCurrency && !!secondCurrency) {
      setLoading(true);
      fetch(`${apiUrl}${apiKey}/latest/${firstCurrency}`)
        .then(blop => blop.json())
        .then(data => {
          setLatestUpdate(data.time_last_update_utc);
          setRate(data.conversion_rates[secondCurrency]);
          setLoading(false);
        })
    }
  }, [firstCurrency, secondCurrency])

  if (changeInFirstCurrency) {
    firstAmount = amount;
    secondAmount = parseFloat((amount * rate).toFixed(3));
  } else {
    firstAmount = parseFloat((amount / rate).toFixed(3));
    secondAmount = amount;
  }

  function handleFromAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAmount(e.target.valueAsNumber);
    setChangeInFirstCurrency(true);
  }

  function handleToAmountChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAmount(e.target.valueAsNumber);
    setChangeInFirstCurrency(false);
  }

  return (
    <div className="appContainer">
      {loading ?
        <CircleLoader />
        :
        <>
          <p className="fromAmount">{`${!!firstAmount ? firstAmount : 0} ${firstCurrency} égal`}</p>
          <p className="toAmount">{`${!!secondAmount ? secondAmount : 0} ${secondCurrency}`}</p>
          <p>{`Latest update : ${latestUpdate}`}</p>
          <Currency
            currencyList={allCurrencies}
            currencySelected={firstCurrency}
            amount={firstAmount}
            handleCurrencyChange={e => setFirstCurrency(e.target.value)}
            onChangeAmount={handleFromAmountChange}
          />
          <Currency
            currencyList={allCurrencies}
            currencySelected={secondCurrency}
            amount={secondAmount}
            handleCurrencyChange={e => setSecondCurrency(e.target.value)}
            onChangeAmount={handleToAmountChange}
          />
        </>
      }
    </div>
  );
}

export default App;
