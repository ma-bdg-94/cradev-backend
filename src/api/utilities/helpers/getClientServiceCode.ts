export const getClientServiceCode = (serviceName: string): string => {
  const words: string[] = serviceName.split(' ')
  let result: string = ''

  for (let word of words) {
    let first2letters: string = word.substring(0, 2)
    let last2letters: string = word.substring(word.length - 2)

    result = result + first2letters
    if (/[^\w]/.test(last2letters)) {
      result += first2letters + last2letters.replace(/[^\w]/g, '')
    } else {
      result += first2letters + '&' + last2letters
    }
  }

  if (words.length === 1) {
    result = result.substring(0, 2) + '&&' + result.substring(result.length - 2)
  }

  return result
}