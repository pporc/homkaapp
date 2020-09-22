import path from 'path';
import {app, BrowserWindow} from 'electron';

const entryUrl = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080/index.html'
  : `file://${path.join(__dirname, 'index.html')}`;

let window = null;

app.on('ready', () => {
  window = new BrowserWindow({show: false});
  window.maximize();
  window.show();
  //window = new BrowserWindow({width: 900, height: 600});
  window.loadURL(entryUrl);
  window.on('closed', () => window = null);
  //window.webContents.openDevTools();
});

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit();
  }
});