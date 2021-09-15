export default (array: any[]) => {
    const auxArray = Array.from(array)
    auxArray.reduce((acc, curr, i, a) => a[i] = acc + curr.chance, 0)
  
    return array[auxArray.findIndex(w => Number(w) > Math.random()*Number(auxArray[auxArray.length-1]))]
} 