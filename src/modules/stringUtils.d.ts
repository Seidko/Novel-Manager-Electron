declare module '@/modules/stringUtils' {
  declare function editDistance(strA: string, strB: string): number
  declare function randomlyMatch(strA, strB, minWordSize?: number, maxWordSize?: number): number
}
