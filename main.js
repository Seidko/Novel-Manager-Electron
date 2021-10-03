"use strict";
const electron = require('electron')
const fs = require('fs')
const request = require('request')
const xpath = require('xpath')
const xmldom = require('xmldom')

// ------------------------- utils -------------------------

// 返回延迟的数据，异步
async function returnDataWithDelay(data, delay) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data)
        }, delay);
    })
}

// 获取小说信息
fs.readFile(`${__dirname}\\novel_manager.json`, (err, raw) => {
    if (err) throw err;
    global.data = JSON.parse(raw);
    console.log('loaded file')
})

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

const dom_parser = new xmldom.DOMParser({
    errorHandler: {
        warning(w) { },
        error(e) { },
        fatalError(fe) { }
    }
})

function get_node_by_xpaths(xpaths, dom) {
    var result = {}
    for (var i in xpaths) {
        if (xpaths[i]) {
            try {
                result[i] = xpath.select(xpaths[i], dom)[0].nodeValue;
            }
            catch (err) {
                result[i] = "书源错误"
                if (err.message == "XPath parse error") {
                    console.error(`XPath语法错误 \nxpath:${xpaths[i]}`)
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
    return result;
}

function get_nodes_by_xpath(xp, dom) {
    var result = []
    try {
        var temp1 = xpath.select(xp, dom)
        for (var i in temp1) {
            console.log()
            result[result.length] = temp1[i].toString()
        }
        console.log()
    }
    catch (err) {
        result[i] = "书源错误"
        if (err.message == "XPath parse error") {
            console.error(`XPath语法错误 \nxpath:${xpaths[i]}`)
        }
        else {
            throw err;
        }
    }
}

function get_nodes_from_similar_doc_by_xpath(xpaths, docs) {
    // TODO
}

// -------------------------------- website parse ------------------------------

function get_book_description(name) {
    return new Promise(resolve => {
        for (var item1 in data.update_list[name].source) {
            if (data.book_source[item1].enable) {
                var url = data.book_source[item1].match_rule.book_description.url.format({ book_id: data.update_list[name].source[item1] })
                request({ url: url, method: data.book_source[item1].match_rule.book_description.method }, (err, res, body) => {
                    if (err) throw err;
                    var dom = dom_parser.parseFromString(body)
                    var result = { name: name, url: data.book_source[item1].url, ...get_node_by_xpaths(data.book_source[item1].match_rule.book_description.rule, dom) }

                    resolve(result)
                })
                break
            }
        }
    })
}

function get_book_contents(name) {
    return new Promise(resolve => {
        for (var item1 in data.update_list[name].source) {
            if (data.book_source[item1].enable) {
                var url = data.book_source[item1].match_rule.contents.url.format({ book_id: data.update_list[name].source[item1] })
                request({ url: url, method: data.book_source[item1].match_rule.contents.method }, (err, res, body) => {
                    if (err) throw err;
                    var dom = dom_parser.parseFromString(body)
                    var temp1 = get_nodes_by_xpath(data.book_source[item1].match_rule.contents.rule.list, dom)

                    var result = { name: name, url: data.book_source[item1].url, contents: null }
                })
                break
            }
        }
    })
}

// -------------------------------- application main ------------------------------

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

electron.ipcMain.handle('get_book_contents', async (event, name) => {
    return await get_book_contents(name)
})
