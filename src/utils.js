export function isArray(tar) {
    return Array.isArray(tar)
}

export function isObject(tar) {
    return (typeof tar === 'object') && (tar !== null) && !isArray(tar)
}
