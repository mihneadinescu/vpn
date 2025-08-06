const {app, BrowserWindow}=require('electron');
const cale = require('path');

function window ()
{
    const window = new BrowserWindow({
        width: 700,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    window.loadFile('interfata.html');
}

app.whenReady().then(window);