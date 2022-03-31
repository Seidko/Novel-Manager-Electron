declare module '@/modules/booksHandle' {
  declare const sources
  declare class Book {
    public name
    public sources
    private _bookInfo
    constructor (s: any)
    getBookInfo (force?: boolean): Promise<any>
  }
  declare class UpdatingBook extends Book {
    public recentUpdateTimestamp: number
    public recentUpdateChapterName: string
    constructor(s: any)
  }
}
