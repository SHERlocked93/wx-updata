import { isObject, isArray } from './utils'

/**
 * 处理数组
 * @param value 当前值
 * @param curPath 当前路径
 * @param store 结果
 * @param config arrObjPath:是否开启数组路径表示功能
 */
const handleArray = (value, curPath, store, config = {}) => {
    value.forEach((item, idx) => {        // forEach 会跳过数组空位
        if (item !== Empty) {
            const arrPath = `${ curPath }[${ idx }]`  // 拼接数组路径
            if (isObject(item)) {
                if (config.arrObjPath) {
                    objToPath(item, arrPath + (Object.keys(item).every(key => /^\[\d+]$/.test(key) || config.arrObjPath) ? '' : '.'), store, config)
                } else {
                    objToPath(item, arrPath + '.', store, config)
                }
            } else if (isArray(item)) {
                handleArray(item, arrPath, store)
            } else {
                store[arrPath] = item
            }
        }
    })
}

// 可以使用 Symbol 跳过数组项
export const Empty = Symbol('updata empty array item')

/**
 * 对象转化为路径格式对象
 * @param obj 要转化的对象
 * @param prefix 路径前缀
 * @param store 结果
 * @param config arrObjPath:是否开启数组路径表示功能
 * @return {{}}
 */
export const objToPath = (obj,
                          prefix = '',
                          store = {},
                          config = {}) => {
    if (typeof prefix !== 'string') {  // 参数重载
        config = prefix
        prefix = ''
    }
    let arrPath = false  // 判断是否是数组路径
    if (config.arrObjPath) {
        if (Object.keys(obj).every(key => /^\[\d+]$/.test(key))) {
            arrPath = true
        } else if (!Object.keys(obj).some(key => /^\[\d+]$/.test(key))) {
            arrPath = false
        } else {
            throw new Error('wx-updata: 数组路径对象需要每个属性都是对象路径 [数组下标] 形式')
        }
    }

    for (const [key, value] of Object.entries(obj)) {
        const curPath = prefix === ''  // 当前路径
          ? key
          : (prefix.endsWith('].') || arrPath)
            ? `${ prefix }${ key }`
            : `${ prefix }.${ key }`

        if (isObject(value)) {                    // 是对象
            objToPath(value, curPath, store, config)
        } else if (!config.arrCover && isArray(value)) {              // 是数组
            handleArray(value, curPath, store, config)
        } else {
            store[curPath] = value
        }
    }
    return store
}

/**
 * 将函数挂载到 page 实例上
 * @param Page
 * @returns {function(any=): any}
 * @param conf
 */
export const updataInit = (Page, conf) => {
    const originalPage = Page
    return function(config) {
        config.upData = function(data, func) {
            const result = objToPath(data, { arrObjPath: conf.arrObjPath ?? false, arrCover: conf.arrCover ?? false })
            if (conf.debug) {
                console.log('转化后效果:', result)
            }
            return this.setData(result, func)
        }
        return originalPage(config)
    }
}
