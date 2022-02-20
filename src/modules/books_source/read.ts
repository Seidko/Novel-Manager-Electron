import * as fs from 'fs/promises'

let sourceFile: fs.FileHandle

async function read () {
  sourceFile = await fs.open('./data/books_source.json', 'a+')
  // TODO: fully implementation for function
  return sourceFile
}

export default { read }
