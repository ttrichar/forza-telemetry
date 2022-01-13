const url = require('url')
const path = require('path')
const { ConnectionBuilder } = require('electron-cgi')

import { app, BrowserWindow, ipcMain } from 'electron'

let window: BrowserWindow | null

const createWindow = () => {
    window = new BrowserWindow({
        width: 1920,
        height: 1080,
        backgroundColor: '#121212', // this is overwritten by the property in index.html
        autoHideMenuBar: true,
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: true, // these two preferences are critical
            contextIsolation: false, // to getting data from main to dashboard
        },

        icon: path.join('../', __dirname, 'build/', 'icon.ico'),
    })

    window.loadURL(
        url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true,
        })
    )

    window.on('closed', () => {
        window = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (window === null) {
        createWindow()
    }
})

// C# communication stuff ForzaDataDotNet
const connection = new ConnectionBuilder()
    .connectTo('dotnet', 'run', '--project', 'ForzaCore')
    .build()

connection.onDisconnect = () => {
    console.log('lost')
}

// receive
connection.on('new-data', (data: any) => {
    // parse data into object
    const dataObj = JSON.parse(data)
    // send the data from forza to the front-end
    window.webContents.send('new-data-for-dashboard', dataObj)
    // log this event
    // console.log(`FROM THE NORMAL CALL: ${JSON.stringify(dataObj)}`)
    console.log(
        `FROM THE NORMAL CALL: IsRaceOn ${dataObj.IsRaceOn} Lap ${dataObj.Lap} CurrentLapTime ${dataObj.CurrentLapTime} BestLapTime ${dataObj.BestLapTime} LastLapTime ${dataObj.LastLapTime}`
    )
})

connection.on('finish-race', (data: any) => {
    // parse data into object
    const dataObj = JSON.parse(data)
    // send the data from forza to the front-end
    window.webContents.send('finish-race-please', dataObj)
    // log this event
    console.log(
        `FROM THE finish-raceCALL: IsRaceOn ${dataObj.IsRaceOn} Lap ${dataObj.Lap} CurrentLapTime ${dataObj.CurrentLapTime} BestLapTime ${dataObj.BestLapTime} LastLapTime ${dataObj.LastLapTime}`
    )
})

connection.send()

connection.on('switch-recording-mode', (data: any) => {
    // parse data into object
    const dataObj = JSON.parse(data)
    // send the data from forza to the front-end
    window.webContents.send('new-data-for-dashboard', dataObj)
    // log this event
    // console.log(`${dataObj.Steer}`)
})

// send
ipcMain.on('switch-recording-mode', (event, arg) => {
    connection.send('switch-recording-mode', '', (response: any) => {})
})

ipcMain.on('finish-race', (event, arg) => {
    console.log(`Finish Race`)
    connection.send('finish-race', '', (error: any, data: any) => {
        // console.log(`${JSON.stringify(data)}`)
        // const dataObj = JSON.parse(data)
        // event.reply('finish-race-please', dataObj)
        // console.log(`Blah`)
    })
})
