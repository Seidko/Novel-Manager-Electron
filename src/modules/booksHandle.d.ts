declare module '@/modules/booksHandle' {
  interface BookSummary {
    name: string
    uuid: string
    updateTimestamp: number
  }
  interface BookDetail {
    name: string,
    uuid: string,
    author?: string,
    status?: string,
    category?: string,
    updateTime?: string,
    updateTimestamp?: number,
    description?: string,
    cover?: string,
    wordCount?: number | string,
    content?: string[][]
  }
  declare const sources
  declare class Book {
    public name
    public sources
    constructor (s: any)
    getDetail (force?: boolean): Promise<BookDetail>
    getSummary (): BookSummary
  }
  declare class UpdatingBook extends Book {
    public recentUpdateTimestamp: number
    public recentUpdateChapterName: string
    constructor(s: any)
  }
}
