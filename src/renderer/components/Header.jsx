import React, {useState, useEffect, useContext} from 'react';
import {ContextApp} from '../store/reducer.js'
import {remote} from 'electron';
import { calcAllProductCost, calcIncome, calcNetIncome, calcPersonalExpenses } from '../store/calc.js';

import './Header.less';

export function Header() {

  const {state, dispatch} = useContext(ContextApp)

  return (
    <div className={'header-container'}>
      <h1 style={{marginLeft: '10px'}}>Хомка</h1>
      <p style={{margin: '0 0 0 20px'}}>
      <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-basket2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 10a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0v-2zm3 0a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0v-2zm3 0a1 1 0 1 1 2 0v2a1 1 0 0 1-2 0v-2z"/>
        <path fillRule="evenodd" d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-.623l-1.844 6.456a.75.75 0 0 1-.722.544H3.69a.75.75 0 0 1-.722-.544L1.123 8H.5a.5.5 0 0 1-.5-.5v-1A.5.5 0 0 1 .5 6h1.717L5.07 1.243a.5.5 0 0 1 .686-.172zM2.163 8l1.714 6h8.246l1.714-6H2.163z"/>
      </svg>
        &ensp;Сумма товара: {Number(calcAllProductCost(state.products)).toLocaleString('ru-RU')}грн
      </p>
      <p style={{margin: '0 0 0 20px'}} title={`С учетом персональных расходов ${(calcIncome(state.products) - calcPersonalExpenses(state.personalExpensis)).toFixed(2)}грн`}>
      <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-cash-stack" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 3H1a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1h-1z"/>
        <path fillRule="evenodd" d="M15 5H1v8h14V5zM1 4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H1z"/>
        <path d="M13 5a2 2 0 0 0 2 2V5h-2zM3 5a2 2 0 0 1-2 2V5h2zm10 8a2 2 0 0 1 2-2v2h-2zM3 13a2 2 0 0 0-2-2v2h2zm7-4a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
      </svg>
        &ensp;Доход: {Number(calcIncome(state.products)).toLocaleString('ru-RU')}грн</p>
      <p style={{margin: '0 0 0 20px'}}>
      <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-wallet2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/>
      </svg>
        &ensp;Чистый доход: {Number(calcNetIncome(state.products)).toLocaleString('ru-RU')}грн
      </p>
      <svg onClick={() => remote.getCurrentWindow().close()} width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-x-circle" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
      </svg>
    </div>
  );

}