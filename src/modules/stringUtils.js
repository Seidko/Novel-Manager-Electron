function editDistance (strA, strB) {
  // Levenshtein Edit Distance
  if (strA === strB) {
    return 1.0
  }
  if (!strA || !strB) {
    return 0.0
  }
  const arr = new Array(strA.length + 1)
  for (let i1 = 0; i1 <= strA.length; i1++) {
    arr[i1] = new Array(strB.length + 1)
  }
  for (let i1 = 0; i1 <= strA.length; i1++) {
    for (let i2 = 0; i2 <= strB.length; i2++) {
      if (i1 === 0) {
        arr[0][i2] = i2
      } else if (i2 === 0) {
        arr[i1][0] = i1
      } else if (strA.charAt(i1 - 1) === strB.charAt(i2 - 1)) {
        arr[i1][i2] = arr[i1 - 1][i2 - 1]
      } else {
        arr[i1][i2] = 1 + Math.min(arr[i1 - 1][i2 - 1], Math.min(arr[i1][i2 - 1], arr[i1 - 1][i2]))
      }
    }
  }
  return 1 - (arr[strA.length][strB.length] / Math.max(strA.length, strB.length))
}

function randomlyMatch (strA, strB, minWordSize = 3, maxWordSize = 8) {
  if (strA === strB) {
    return 1.0
  }
  if (!strA || !strB) {
    return 0.0
  }
  minWordSize = minWordSize / 2
  maxWordSize = maxWordSize / 2
  let counter = 0
  let m = 0
  let o = 0
  let temp
  for (let i = 0; i < 100000; i++) {
    do {
      m = Math.random() * (strA.length - 1)
      o = Math.random() * (maxWordSize - 0.25 - minWordSize) + 0.25 + minWordSize
      temp = strA.slice(m - o, m + o)
    } while (!temp)

    if (strB.includes(temp)) {
      counter++
    }
  }
  return counter / 100000
}

// todo: zh-cn / en-us cosine similarity
// zh-cn: use jieba to split word
