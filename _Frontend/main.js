import { app, BrowserWindow }from 'electron'; 
import path from 'path';

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile(path.join(app.getAppPath() ,'/build/index.html'));
    
    mainWindow.show();
    // mainWindow.loadURL('http://localhost:3001'); // Load your frontend URL here

    mainWindow.on('closed', () => {
        app.quit();
    });
});

