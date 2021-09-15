export default (string: string, maxCharLengthPerLine: number) => {
    const split = string.split(' ')
    const chunks: string[] = []
  
    for (var i=0, j=0; i < split.length; i++) {
      if ((chunks[j] + split[i]).length > maxCharLengthPerLine) j++
  
      chunks[j] = (chunks[j] || '') + split[i] + ' '
    }
  
    return chunks.map(c => c.trim()).join('\n')
}