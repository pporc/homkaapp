import path from 'path';
import {app, BrowserWindow, Menu} from 'electron';
import {autoUpdater} from "electron-updater";
import log from 'electron-log';


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
  window.webContents.openDevTools();
});

//=======updater
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

function sendStatusToWindow(text) {
  log.info(text);
  window.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
  autoUpdater.quitAndInstall();
});

app.on('ready', function()  {
  autoUpdater.checkForUpdatesAndNotify();
});
//======= end updater

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit();
  }
});