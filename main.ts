import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

try {
  require('electron-reloader')(module, { debug: true });
} catch (err) {
  console.error('Failed to reload Electron:', err);
}

const createWindow = () => {
  console.log('Creating Electron window...');
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'My Electron App',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });


    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();


  mainWindow.on('closed', () => {
    console.log('Electron window closed.');
    mainWindow = null;
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    console.log('Exiting app...');
    app.quit();
  }
});

ipcMain.on('channel1', (event, data) => {
  console.log(`[Main] Received message on channel1:`, data);
  event.reply('channel1-reply', { status: 'success', message: 'Hello from Main Process!' });
});
