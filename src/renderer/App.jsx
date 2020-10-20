import React, { useEffect, useReducer } from 'react';
import {ContextApp, initialState, reducer} from './store/reducer.js'
import {Header} from './components/Header.jsx';
import {Body} from './components/Body.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx'
import store from './store/bd.js';

import 'bootstrap/dist/css/bootstrap.min.css';

if (!store.has(store)) {
  store.set('other.currentId', 0)
  store.set('personalExpensis', {})
  store.set('products', {})
  store.set('statistics', {})
}

// const {ipcRenderer} = require('electron');
// ipcRenderer.on('message', function(event, text) {console.log('Message from update',text)})

export const App = () => {

  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    store.set({...state})
  }, [state])

  if (Date.now() >= 1604188799) {
    console.log('its end this months')
  }

  return (
    <ErrorBoundary bd={store.store}>
      <ContextApp.Provider value={{dispatch, state}}>
        <div style={styles.container}>
          <Header/>
          <Body/>
        </div>
      </ContextApp.Provider>
    </ErrorBoundary>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  }
}