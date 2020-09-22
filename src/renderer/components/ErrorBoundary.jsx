import React from 'react';
import { PRIVATE } from '../../../private/TELEGRAM.js'
const {getCurrentWindow} = require('electron').remote;

export default class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    componentDidCatch(error, errorInfo) {
      if (error) { this.setState({hasError: true})}
      fetch(`https://api.telegram.org/bot${PRIVATE.TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${PRIVATE.TELEGRAM_CHAT_ID}&text=error: ${error}, errorInfo: ${JSON.stringify(errorInfo, null, 2)}`)
    }

    reload = () => {
      getCurrentWindow().reload()
    }
  
    render() {
      if (this.state.hasError) {
        return (
        <div>
          <h1>Что-то пошло не так.</h1>
          <button className='btn btn-success' onClick={() => this.reload()}>Обновить</button>
        </div>
        );
      }
  
      return this.props.children; 
    }
  }