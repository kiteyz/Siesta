export default (string: string, bool=false) => {
    return string.split('').filter((_, i, a) => a[i] != a[bool ? i+2 : i+1]).join('')
}