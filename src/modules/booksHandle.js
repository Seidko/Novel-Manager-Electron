// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import fs from 'fs'
import encoding from 'encoding'
import got from 'got'
import { v4 as uuid, validate } from 'uuid'

const Fn = Function
const sources = {}

const init = (async function () {
  let temp1
  try {
    const raw = await fs.promises.readFile('./data/sources.json', { encoding: 'utf-8' })
    if (raw === '') {
      temp1 = {}
      await fs.promises.writeFile('./data/sources.json', JSON.stringify(temp1, null, '  '), { encoding: 'utf-8' })
      console.warn('WARN Sources file is empty.')
    } else {
      temp1 = JSON.parse(raw)
    }
  } catch (e) {
    if (e.errno === -4058) {
      temp1 = {}
      await fs.promises.writeFile('./data/sources.json', JSON.stringify(temp1, null, '  '), { encoding: 'utf-8' })
      console.warn('WARN No sources file, created one.')
    } else throw e
  }
  for (const i in temp1) {
    sources[i] = new BookSource(i, temp1[i])
  }

  return true
})()

// async function _getInfoRegexTemplate (url, regex) {
//
// }

// TODO: multipage support
async function _getChapterTemplate (url, regex, charMap) {
  const res = got.get(url)
  const data = await res.buffer()
  const dataEncoding = (await res).headers['content-type'].match(/(?<=charset=)\w+/)[0]
  let string
  if (!['UTF-8', 'utf8', 'utf-8', 'UTF8'].includes(dataEncoding)) {
    string = encoding.convert(data, 'utf8', dataEncoding).toString()
  } else {
    string = data.toString()
  }
  regex = new RegExp(regex, 's')
  string = string.match(regex)[1]
  for (const char in charMap) {
    string = string.replaceAll(char, charMap[char])
  }
  return string
}

class BookSource {
  constructor (id, s) {
    this.priority = s.priority
    this.description = s.description
    this.patterns = s.patterns
    for (const i in s.patterns) {
      switch (s.patterns[i].method) {
        case 'js-file':
          console.warn('WARN Use JavaScript src file is UNSAFE, recommend to use regex to get info from source')
          this._getBookInfo = new Fn('return ' + fs.readFileSync(`./data/patterns/${id}/bookInfo.js`, { encoding: 'utf-8' }))()
          break
        case 'regex':
          break
        default: {
          throw new Error(`Unexpect pattern method "${s.patterns[i].method}"`)
        }
      }
    }
  }

  getBookInfo (id) {
    switch (this.patterns.bookInfo.method) {
      case 'js-file':
        return this._getBookInfo(id, got.get, encoding)
      case 'regex':
        break
    }
  }
}

class Book {
  constructor (s) {
    this.uuid = validate(s.uuid) ? s.uuid : uuid()
    this.name = s.name
    this.sources = s.sources
    this._detail = {
      name: this.name,
      uuid: this.uuid,
      author: undefined,
      status: undefined,
      category: undefined,
      updateTime: undefined,
      updateTimestamp: s.recentUpdateTimestamp,
      description: undefined,
      cover: undefined,
      wordCount: undefined,
      content: []
    }
    this.sources.sort((a, b) => {
      if (a.using && b.using) throw new Error('Two sources cannot be used at the same time!')
      if (a.using) return -1
      if (b.using) return 1
      return b.trustLevel - a.trustLevel
    })
  }

  getSummary () {
    return {
      name: this.name,
      uuid: this.uuid,
      updateTimestamp: this._detail.recentUpdateTimestamp
    }
  }

  async getDetail (force = false) {
    if (!this.sources.length) {
      return this._detail
    }
    if (this.sources[0].using) {
      await init
      if (force || (!this._detail.status)) {
        this._detail = await sources[this.sources[0].sourceId].getBookInfo(this.sources[0].bookId)
        return this._detail
      } else {
        return this._detail
      }
    }
  }
}

class UpdatingBook extends Book {
  constructor (s) {
    super(s)
    this.recentUpdateTimestamp = s.recentUpdateTimestamp
    this.recentUpdateChapterName = s.recentUpdateChapterName
  }
}

export default { UpdatingBook, Book, BookSource }
export { UpdatingBook, Book, BookSource }
