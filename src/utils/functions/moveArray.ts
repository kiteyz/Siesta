export default (array: any[], from: number, to: number) => {
    try {
        array = [...array];
        const startIndex = from < 0 ? array.length + from : from;
        if (startIndex >= 0 && startIndex < array.length) {
        const endIndex = to < 0 ? array.length + to : to;
        const [item] = array.splice(from, 1);
        array.splice(endIndex, 0, item);
        }
        return array;
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
}