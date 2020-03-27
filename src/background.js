"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import {
  createProtocol
  /* installVueDevtools */
} from "vue-cli-plugin-electron-builder/lib";
import sudo from "sudo-prompt";
import { NFC } from "nfc-pcsc";
import Member from "./model/Member";
import Record from "./model/Record";
const isDevelopment = process.env.NODE_ENV !== "production";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

const readers = [];

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.on("closed", () => {
    win = null;
  });
}

function initNFC() {
  const nfc = new NFC();

  nfc.on("reader", reader => {
    readers.push(reader.reader.name);

    reader.on("card", card => {
      win.show();
      win.webContents.send(
        "uid",
        card.uid
          .replace(/.{2}/g, "$& ")
          .trim()
          .toUpperCase()
      );
    });

    reader.on("end", () => {
      readers.splice(readers.indexOf(reader.reader.name), 1);
    });
  });

  nfc.on("error", console.error);
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }
  }
  createWindow();
  initNFC();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

ipcMain.on("db", async (event, { model, action, data }) => {
  try {
    switch (model) {
      case "member":
        event.returnValue = await new Member()[action](data);
        break;
      case "record":
        event.returnValue = await new Record()[action](data);
        break;
      default:
        throw "Call DB Error";
    }
  } catch (error) {
    console.error(error);
  }
});

ipcMain.on("readers", event => {
  event.returnValue = readers;
});

ipcMain.on("reinitNFC", () => {
  if (process.platform == "linux") {
    sudo.exec(
      "rmmod pn533_usb pn533 nfc & systemctl restart pcscd",
      { name: "USCC ATTENDANCE SYSTEM" },
      error => {
        if (error) {
          // TODO
        } else {
          initNFC();
        }
      }
    );
  } else {
    // TODO
  }
});
