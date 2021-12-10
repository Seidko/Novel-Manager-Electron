const got = require('got')

async function getBookDetails (url, bookSource) {
  const temp1 = got(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/95.0.1020.44'
    },
    method: bookSource.match_rule.details.method,
    encoding: bookSource.match_rule.details.encoding
  })

  let temp2
  const temp3 = []
  const rules = bookSource.match_rule.details.rules
  let chapterName
  let chapterUrl

  switch (bookSource.match_rule.details.content) {
    case 'text/html':
      chapterName = new RegExp(rules.chapter_name, 'su')
      chapterUrl = new RegExp(rules.chapter_url, 'su')
      temp2 = await temp1.text()
      temp2 = temp2.match(new RegExp(rules.list, 'su'))
      temp2 = temp2[0].match(new RegExp(rules.chapter, 'gsu'))
      for (const i of temp2) {
        let url = i.match(chapterUrl)[0]
        if (!url.includes('http')) url = bookSource.url + url
        temp3.push({ name: i.match(chapterName)[0], url })
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

const bs = {
  name: '笔下文学bxwxorg',
  description: '',
  type: 'common',
  enable: true,
  url: 'https://www.bxwxorg.com',
  priorities: 2,
  match_rule: {
    details: {
      url: '/read/{bookId}',
      content: 'text/html',
      encoding: 'UTF-8',
      match_method: 'regexp',
      method: 'GET',
      rules: {
        list: '</a></dt>.*?</dl>',
        chapter: '<dd>.*?</dd>',
        chapter_name: '(?<=">).*?(?=</a>)',
        chapter_url: '(?<=href=").*?(?=")'
      }
    }
  }
};

(async function () {
  console.log(await getBookDetails('https://www.bxwxorg.com/read/174289', bs))
})()
