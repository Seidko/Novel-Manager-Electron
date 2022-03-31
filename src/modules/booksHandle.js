// noinspection JSUnresolvedVariable

import fs from 'fs'
import https from 'https'
import buffer from 'buffer'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const encoding = require('encoding')

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

class BookSource {
  constructor (id, s) {
    this.priority = s.priority
    this.description = s.description
    this.patterns = s.patterns
    // noinspection JSUnusedLocalSymbols
    this.functions = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      bookInfo (a, b, c, d) {
        throw new ReferenceError('No "BookInfo" pattern in this source!')
      }
    }
    for (const i in s.patterns) {
      switch (s.patterns[i].method) {
        case 'js':
          this.functions[i] = new Fn('return ' + fs.readFileSync(`./data/patterns/${id}/bookInfo.js`, { encoding: 'utf-8' }))()
      }
    }
  }

  getBookInfo (id) {
    return this.functions.bookInfo(id, https.get, encoding, buffer.Buffer)
  }
}

class Book {
  constructor (s) {
    this.name = s.name
    this.sources = s.sources
    this._bookInfo = {}
    this.sources.sort((a, b) => {
      if (a.using && b.using) throw new Error('Two sources cannot be used at the same time!')
      if (a.using) return -1
      if (b.using) return 1
      return b.trustLevel - a.trustLevel
    })
  }

  async getBookInfo (force = false) {
    if (!this.sources.length) {
      return {
        name: this.name,
        author: null,
        status: null,
        category: null,
        updateTime: null,
        updateTimestamp: null,
        description: null,
        cover: null,
        wordCount: null,
        content: []
      }
    }
    if (this.sources[0].using) {
      await init
      if (force || (!this._bookInfo.name)) {
        this._bookInfo = await sources[this.sources[0].sourceId].getBookInfo(this.sources[0].bookId)
        return this._bookInfo
      } else {
        return this._bookInfo
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
