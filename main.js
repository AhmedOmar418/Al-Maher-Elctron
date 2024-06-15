const { app, BrowserWindow, Menu, ipcMain, net, dialog } = require('electron');
const { exec } = require('child_process');
const Swal = require('sweetalert2');


let splash;
let mainWindow;

function createMainWindow() {
  splash = new BrowserWindow({
    fullscreen: true,
    frame: false,
    alwaysOnTop: true
  });
  splash.loadFile('renderer/splash/splash.html');

  mainWindow = new BrowserWindow({
    fullscreen: true,
    frame: false,
    icon: 'ico_logo.ico',
    show: false,
    opacity: 0,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  mainWindow.on('focus', () => {
    mainWindow.setFullScreen(true);
  });

  mainWindow.maximize();
  mainWindow.setFullScreen(true);
  mainWindow.loadFile("renderer/home/index.html");

  mainWindow.once('ready-to-show', () => {
    splash.hide();
    mainWindow.show();
    mainWindow.setOpacity(1);

    const https = require('https');
    let blockedApps = [];

    https.get('https://al-maher.net/api/get_block_app.php', (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const response = JSON.parse(data);
        blockedApps = response.data;
      });
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    });

    let intervalId = setInterval(() => {
      let cmd = process.platform === 'win32' ? 'tasklist' : 'ps -ax';
      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return;
        }
          tasks = stdout.toLowerCase().split('\n');
        for (let i = 0; i < blockedApps.length; i++) {
          for (let j = 0; j < tasks.length; j++) {
            if (tasks[j].indexOf(blockedApps[i].toLowerCase()) > -1 || tasks[j].indexOf('recexperts') > -1|| tasks[j].indexOf('bdcam') > -1) {
              let blockingApp = tasks[j].indexOf(blockedApps[i].toLowerCase()) > -1 ? blockedApps[i] : 'recexperts';
              mainWindow.loadFile('renderer/home/blocking_screen.html');
              clearInterval(intervalId); // Clear the interval
              return;
            }
          }
        }
      });
    }, 2000);
  });

  setTimeout(() => {
    splash.hide();
    mainWindow.show();
    mainWindow.setOpacity(1);
  }, 3000);

  mainWindow.webContents.on('context-menu', (e) => {
    e.preventDefault();
  });

  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && (input.control || input.meta)) {
      if (input.key.toLowerCase() === 'c' || input.key.toLowerCase() === 'v') {
        event.preventDefault();
      }
    }
  });

  mainWindow.setContentProtection(true);

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.insertCSS('* { user-select: none !important; }');
  });
}

app.whenReady().then(createMainWindow);

Menu.setApplicationMenu(null);

ipcMain.on('close-app', () => {
  app.quit();
});

ipcMain.on('login-success', () => {
  mainWindow.loadFile('renderer/home/index.html');
});

ipcMain.on('print-message3', (event, message) => {
  console.log(message);
});

ipcMain.on('courses', (event, message) => {
  console.log(message);
});