import React from "react";

type CurrencyProps = {
  currencyList: string[],
  currencySelected: string,
  handleCurrencyChange: React.ChangeEventHandler<HTMLSelectElement>,
  onChangeAmount: React.ChangeEventHandler<HTMLInputElement>,
  amount: number
}

export const Currency: React.FC<CurrencyProps> = ({ currencyList, currencySelected, handleCurrencyChange, onChangeAmount, amount }) => {

  return (
    <div className="currencyContainer">
      <input type="number" value={amount} onChange={onChangeAmount} min={0}/>
      <select value={currencySelected} onChange={handleCurrencyChange}>
        {currencyList?.map(currency =>
          <option key={currency} value={currency}>
            {currency}
          </option>
        )}
      </select>
    </div>
  )
}
