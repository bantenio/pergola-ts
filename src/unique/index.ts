export function nextNumbers(len?:number, eachCallback?:(num: number) => void): number[] {
  if (!len || len <= 0) {
    len = 16
  }
  let d = new Date().getTime()
  const result = []
  if (window && window.performance && typeof window.performance.now === 'function') {
    d += performance.now() //use high-precision timer if available
  }
  const needCallback = typeof eachCallback === 'function'
  while (len > 0) {
    result.push((d + Math.random() * 16) % 16 | 0)
    d = Math.floor(d / 16)
    if (needCallback) {
      eachCallback(result[result.length - 1])
    }
    len--
  }
  return result
}

export function uuid(): string {
  const numbers = nextNumbers(31)
  let index = 0
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = numbers[index++]
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

export function shortUUID (table: string | string[]) {
  if (!table || !table.length || table.length < 16) {
    throw new Error('请指定字符表格，且长度不能小于16')
  }
  const result = new Array<string>()
  nextNumbers(16, (num) => {
    result.push(table[num])
  })
  return result
}