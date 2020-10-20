import React, {useState, useEffect, useContext} from 'react';
import {ContextApp} from '../store/reducer.js'
import {remote} from 'electron';
import { calcAllProductCost, calcIncome, calcNetIncome, calcPersonalExpenses } from '../store/calc.js';
import {Button, Dropdown, OverlayTrigger, Popover} from 'react-bootstrap';

import './Header.less';
let database = firebase.database();

export function Header() {

  const {state, dispatch} = useContext(ContextApp)

  const [inputChecked, setInputChecked] = useState(state.other.showInfo)
  const [onLine, setOnLine] = useState(true)

  useEffect(() => {
    setInputChecked(state.other.showInfo)
  }, [state.other.showInfo])

  const setSettings = (showInfo, color) => {
    dispatch({
      type: 'settings',
      payload: {
        showInfo: showInfo,
      }
    })
  }

  const toggleInput = (value) => {
    setInputChecked(value)
    setSettings(value)
  }

  const exitHandler = () => {
    database.ref('data/').set({...state}, (err) => err ? remote.getCurrentWindow().close() : (
      dispatch({
        type: 'settings',
        payload: {
          backup: Date.now()
        }
      }),
      remote.getCurrentWindow().close()))
  }

  const saveData = () => {
    database.ref('save/').set({...state}, (err) => err ? console.log(err) : (
      dispatch({
        type: 'settings',
        payload: {
          saveBackup: Date.now()
        }
      })))
  }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Title as="h3">Восстановление данных</Popover.Title>
      <Popover.Content>
        {onLine && <><strong>{new Date(Number(state.other.backup)).toLocaleString() || 'нет копий'}</strong> - последнее сохранение</>}
        {!onLine && <strong>Нет подключения к сети или проблеммы с сервером</strong>}
      </Popover.Content>
    </Popover>
  );

  return (
    <div className={'header-container'} style={{position: 'fixed', width: '-webkit-fill-available', zIndex: '1000'}}>
      <h1 style={{marginLeft: '10px'}}>Хомка</h1>
      <p style={{margin: '0 0 0 20px'}} className={state.other.showInfo ? 'hide' : ''}>
      <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-basket2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 10a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0v-2zm3 0a1 1 0 0 1 2 0v2a1 1 0 0 1-2 0v-2zm3 0a1 1 0 1 1 2 0v2a1 1 0 0 1-2 0v-2z"/>
        <path fillRule="evenodd" d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-.623l-1.844 6.456a.75.75 0 0 1-.722.544H3.69a.75.75 0 0 1-.722-.544L1.123 8H.5a.5.5 0 0 1-.5-.5v-1A.5.5 0 0 1 .5 6h1.717L5.07 1.243a.5.5 0 0 1 .686-.172zM2.163 8l1.714 6h8.246l1.714-6H2.163z"/>
      </svg>
        &ensp;Сумма товара: {Number(calcAllProductCost(state.products)).toLocaleString('ru-RU')}грн
      </p>
      <p style={{ margin: '0 0 0 20px' }} className={state.other.showInfo ? 'hide' : ''} title={`С учетом персональных расходов ${(calcIncome(state.products) - calcPersonalExpenses(state.personalExpensis)).toFixed(2)}грн`}>
      <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-cash-stack" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 3H1a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1h-1z"/>
        <path fillRule="evenodd" d="M15 5H1v8h14V5zM1 4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H1z"/>
        <path d="M13 5a2 2 0 0 0 2 2V5h-2zM3 5a2 2 0 0 1-2 2V5h2zm10 8a2 2 0 0 1 2-2v2h-2zM3 13a2 2 0 0 0-2-2v2h2zm7-4a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
      </svg>
        &ensp;Доход: {Number(calcIncome(state.products)).toLocaleString('ru-RU')}грн</p>
      <p style={{ margin: '0 0 0 20px' }} className={state.other.showInfo ? 'hide' : ''}>
      <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-wallet2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499L12.136.326zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484L5.562 3zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/>
      </svg>
        &ensp;Чистый доход: {Number(calcNetIncome(state.products)).toLocaleString('ru-RU')}грн
      </p>
      <div style={{display: 'inherit'}}>
        <Dropdown drop='left' className='mt-1'>
          <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
            <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-gear" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8.837 1.626c-.246-.835-1.428-.835-1.674 0l-.094.319A1.873 1.873 0 0 1 4.377 3.06l-.292-.16c-.764-.415-1.6.42-1.184 1.185l.159.292a1.873 1.873 0 0 1-1.115 2.692l-.319.094c-.835.246-.835 1.428 0 1.674l.319.094a1.873 1.873 0 0 1 1.115 2.693l-.16.291c-.415.764.42 1.6 1.185 1.184l.292-.159a1.873 1.873 0 0 1 2.692 1.116l.094.318c.246.835 1.428.835 1.674 0l.094-.319a1.873 1.873 0 0 1 2.693-1.115l.291.16c.764.415 1.6-.42 1.184-1.185l-.159-.291a1.873 1.873 0 0 1 1.116-2.693l.318-.094c.835-.246.835-1.428 0-1.674l-.319-.094a1.873 1.873 0 0 1-1.115-2.692l.16-.292c.415-.764-.42-1.6-1.185-1.184l-.291.159A1.873 1.873 0 0 1 8.93 1.945l-.094-.319zm-2.633-.283c.527-1.79 3.065-1.79 3.592 0l.094.319a.873.873 0 0 0 1.255.52l.292-.16c1.64-.892 3.434.901 2.54 2.541l-.159.292a.873.873 0 0 0 .52 1.255l.319.094c1.79.527 1.79 3.065 0 3.592l-.319.094a.873.873 0 0 0-.52 1.255l.16.292c.893 1.64-.902 3.434-2.541 2.54l-.292-.159a.873.873 0 0 0-1.255.52l-.094.319c-.527 1.79-3.065 1.79-3.592 0l-.094-.319a.873.873 0 0 0-1.255-.52l-.292.16c-1.64.893-3.433-.902-2.54-2.541l.159-.292a.873.873 0 0 0-.52-1.255l-.319-.094c-1.79-.527-1.79-3.065 0-3.592l.319-.094a.873.873 0 0 0 .52-1.255l-.16-.292c-.892-1.64.902-3.433 2.541-2.54l.292.159a.873.873 0 0 0 1.255-.52l.094-.319z" />
              <path fillRule="evenodd" d="M8 5.754a2.246 2.246 0 1 0 0 4.492 2.246 2.246 0 0 0 0-4.492zM4.754 8a3.246 3.246 0 1 1 6.492 0 3.246 3.246 0 0 1-6.492 0z" />
            </svg>
          </Dropdown.Toggle>

          <Dropdown.Menu as={CustomMenu}>
            <Dropdown.ItemText><HideIcon inputChecked={inputChecked} toggleInput={toggleInput} /></Dropdown.ItemText>
            {/* <Dropdown.ItemText><span style={{cursor: 'pointer'}} onClick={saveData}>Сохранить резервную копию</span></Dropdown.ItemText>
            <Dropdown.ItemText>
              <OverlayTrigger trigger={['hover', 'focus']} placement="left" overlay={popover}>
                <span style={{cursor: 'pointer'}} onClick={downloadData}>Загрузить резервную копию</span>
              </OverlayTrigger>
            </Dropdown.ItemText> */}
          </Dropdown.Menu>
        </Dropdown>
        <svg onClick={exitHandler} width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-x-circle mr-3 ml-3" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
          <path fillRule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
        </svg>
      </div>
    </div>
  );

}

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <span
    style={{cursor: 'pointer'}}
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </span>
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, className, 'aria-labelledby': labeledBy }, ref) => {

    return (
      <div
        ref={ref}
        style={{width: 'max-content'}}
        className={className}
        aria-labelledby={labeledBy}
      >
        {children}
      </div>
    );
  },
);

function HideIcon ({toggleInput, inputChecked}) {
  return (
    <label>
      <input
        type="checkbox"
        onChange={(e) => toggleInput(e.target.checked)}
        style={{
          position: 'absolute',
          zIndex: '- 1',
          opacity: '0',
          cursor: 'pointer'
        }}
      />
      <span style={{cursor: 'pointer'}}>
        Скрыть информацию
        {inputChecked && 
          <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-eye-slash ml-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299l.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
            <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709z" />
            <path fillRule="evenodd" d="M13.646 14.354l-12-12 .708-.708 12 12-.708.708z" />
          </svg>
        }
        {!inputChecked && 
          <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" className="bi bi-eye ml-1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.134 13.134 0 0 0 1.66 2.043C4.12 11.332 5.88 12.5 8 12.5c2.12 0 3.879-1.168 5.168-2.457A13.134 13.134 0 0 0 14.828 8a13.133 13.133 0 0 0-1.66-2.043C11.879 4.668 10.119 3.5 8 3.5c-2.12 0-3.879 1.168-5.168 2.457A13.133 13.133 0 0 0 1.172 8z" />
            <path fillRule="evenodd" d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
          </svg>
        }
      </span>
    </label>
  )
}