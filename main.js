const { app, BrowserWindow, Menu } = require("electron");

// *** Set mode: development or production ***
process.env.NODE_ENV = "development";
 
// --------------------------------------------------------------------
const isDev = process.env.NODE_ENV !== "production" ? true : false;
const isMac = process.platform === "darwin" ? true : false;

// --------------------------------------------------------------------
const menu = [
    ...(isMac ? [
        {
            label: app.name,
            submenu: [
                {
                    label: "about",
                    click: createAboutWindow,
                },
            ],
        },
    ] : []),
    
    {
        role: "fileMenu",
    },
    ...(!isMac ? [
        {
            label: "Help",
            submenu: [
                {
                    label: "About",
                    click: createAboutWindow,
                },
            ],
        },
    ] : []),
    ...(isDev ? [
        {
            label: "Developer",
            submenu: [
                { role: "reload" },
                { role: "forcereload" },
                { type: "separator" },
                { role: "toggleDevTools" },
            ],
        },
    ] : []),
];
  


// --------------------------------------------------------------------
// --------------------------------------------------------------------
let mainWindow;

// --------------------------------------------------------------------
function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: "Sauntering",
        width: isDev ? 1200 : 800,
        height: 800,
        icon: `${__dirname}/assets/icons/Icon_256x256.png`,
        //resizable: isDev ? true : false,
        backgroundColor: "white",
  
        // This is necessary to call node code from html file (?)
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        },
    
    });

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(`${__dirname}/app/index.html`);
    
}
  
// --------------------------------------------------------------------
function createAboutWindow() {
    aboutWindow = new BrowserWindow({
        title: "About Sauntering",
        width: 400,
        height: 300,
        icon: `${__dirname}/assets/icons/Icon_256x256.png`,
        resizable: false,
        frame: false,
    });
  
    aboutWindow.loadFile(`${__dirname}/app/about.html`);
}
    
// --------------------------------------------------------------------
app.on("ready", () => {
    createMainWindow();
  
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);
    mainWindow.on("ready", () => (mainWindow = null));
});
  
// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (!isMac) {
        app.quit();
    }
});
  
app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});
