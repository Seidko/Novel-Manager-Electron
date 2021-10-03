"use strict";
const electron = require('electron')
const fs = require('fs')
const request = require('request')
const xpath = require('xpath')
const xmldom = require('xmldom')

// const path = require('path')


// 返回延迟的数据，异步
async function returnDataWithDelay(data, delay) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data)
        }, delay);
    })
}

class WindowsEsistError extends Error {
    constructor(msg) {
        super(msg)
    }
}

String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}

function get_book_description(name) {
    return new Promise(resolve => {
        for (var item1 in data.update_list[name].source) {
            if (data.book_source[item1].enable) {
                var url = data.book_source[item1].match_rule.book_description.url.format({ book_id: data.update_list[name].source[item1] })
                request({ url: url, method: "GET" }, (err, res, body) => {
                    if (err) throw err;
                    var doc = new xmldom.DOMParser({
                        errorHandler: {
                            warning(w) { },
                            error(e) { },
                            fatalError(fe) { }
                        }
                    }).parseFromString(body)
                    var result = { name: name, url: data.book_source[item1].url }
                    var temp1 = data.book_source[item1].match_rule.book_description.rule
                    for (var i in temp1) {
                        if (temp1[i]) {
                            try {
                                var temp2 = xpath.select(temp1[i], doc)
                                result[i] = temp2[0].nodeValue
                            }
                            catch (err) {
                                if (err.message == "XPath parse error") {
                                    console.error('XPath语法错误: \n' + err.stack)
                                    result[i] = "书源错误"
                                }
                                else {
                                    throw err;
                                }
                            }
                        }
                        else {
                            result[i] = ""
                        }
                    }
                    resolve(result)
                })
                break
            }
        }
    })
}


// 获取小说信息
fs.readFile(`${__dirname}\\novel_manager.json`, (err, raw) => {
    if (err) throw err;
    global.data = JSON.parse(raw);
    console.log('loaded file')
})

function createWindow() {
    if (global.win) { throw new WindowsEsistError("Main window is esist."); };
    global.win = new electron.BrowserWindow({
        width: 890,
        height: 570,
        minWidth: 890,
        minHeight: 570,
        // maxWidth: 1600,
        // maxHeight: 900,
        autoHideMenuBar: true,
        // frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            // devTools: true,
            nativeWindowOpen: true,
            // contextIsolation: false, // 取消注释以后能够在渲染器进程中使用nodejs api
            nodeIntegration: true,
            // sandbox: true
            preload: `${__dirname}\\preload.js`

        },

    });
    global.win.loadFile('nmelec.html');
}

electron.app.on('ready', () => {
    createWindow();
});

electron.app.on('window-all-closed', () => {
    console.log('app quit');
    electron.app.quit();
});

// ----------------------- IPC Event Handle -------------------------------

electron.ipcMain.on('close_win', () => {
    electron.app.quit();
});

electron.ipcMain.on('minimize_win', () => {
    win.minimize();
});

electron.ipcMain.on('reload_html', () => {
    win.loadFile('nmelec.html');
});

electron.ipcMain.handle('get_nm_data', async (event) => {
    return data
})

electron.ipcMain.handle('get_book_description', async (event, name) => {
    return await get_book_description(name)
})
