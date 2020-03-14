export function nextNumbers(len, eachCallback) {
    if (!len || len <= 0) {
        len = 16;
    }
    let d = new Date().getTime();
    const result = [];
    if (window && window.performance && typeof window.performance.now === 'function') {
        d += performance.now();
    }
    const needCallback = typeof eachCallback === 'function';
    while (len > 0) {
        result.push((d + Math.random() * 16) % 16 | 0);
        d = Math.floor(d / 16);
        if (needCallback) {
            eachCallback(result[result.length - 1]);
        }
        len--;
    }
    return result;
}
export function uuid() {
    const numbers = nextNumbers(31);
    let index = 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = numbers[index++];
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
export function shortUUID(table) {
    if (!table || !table.length || table.length < 16) {
        throw new Error('请指定字符表格，且长度不能小于16');
    }
    const result = new Array();
    nextNumbers(16, (num) => {
        result.push(table[num]);
    });
    return result;
}
//# sourceMappingURL=index.js.map