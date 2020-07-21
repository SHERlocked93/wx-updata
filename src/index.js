function isArray(tar) {
    return Array.isArray(tar)
}

function isObject(tar) {
    return (typeof tar === 'object') && (tar !== null) && !isArray(tar)
}

function isObjectOrArray(tar) {
    return (typeof tar === 'object') && (tar !== null)
}

/**
 * 对象转化为路径格式对象
 * @param obj 要转化的对象
 * @param prefix 路径前缀
 * @param store 结果
 */
export const objToPath = (obj,
                          prefix = '',
                          store = {}) => {
    for (const [key, value] of Object.entries(obj)) {
        const curPath = prefix === ''  // 当前路径
          ? key
          : prefix.endsWith(']')
            ? `${ prefix }${ key }`
            : `${ prefix }/${ key }`

        if (isObject(value)) {                    // 是对象
            objToPath(value, curPath, store)
        } else if (isArray(value)) {              // 是数组
            value.forEach((item, idx) => {        // forEach 会跳过数组空位
                const arrPath = `${ curPath }[${ idx }]`  // 拼接数组路径
                if (isObjectOrArray(item)) {
                    objToPath(item, arrPath, store)
                } else {
                    store[arrPath] = item
                }
            })
        } else {
            store[curPath] = value
        }
    }
    return store
}

const obj = { a: 1, b: { c: 2 }, d: [{ e: 3 }, , { f: 4, g: { h: 5 }, i: [{ j: 'k' }, 'hello', [{ l: 6 }, , 7, 'world']] }] }
// const obj = { a: [{ m: 6 }, , 7, 'hello'] }


console.log(
  objToPath(obj)
)
