const got = require('got')
const fs = require('fs')

async function getBookDetail (url, bookSource) {
  bookSource = bookSource.contents
  const temp1 = got(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/95.0.1020.44'
    },
    method: bookSource.method,
    encoding: bookSource.encoding
  })
  let temp2
  const temp3 = []
  switch (bookSource.content) {
    case 'text/html':
      temp2 = await temp1.text()
      temp2 = temp2.match(new RegExp(bookSource.rules.list, 'gsu'))
      for (const i in temp2) {
        temp3.push({
          url: i.match(new RegExp(bookSource.rules.url, 'su')),
          name: i.match(new RegExp(bookSource.rules.name, 'su'))
        })
      }
      break
    case 'application/json':
      temp2 = await temp1.json()
      temp3.push({
        url: temp1
      })
      break
    default :
      throw new Error('Unsupported content')
  }
  return temp3
}

fs
