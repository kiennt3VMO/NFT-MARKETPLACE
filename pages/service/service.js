
const truncate = (text, startChars, endChars, maxLength) => {
  if (text.length > maxLength) {
    var start = text.substring(0, startChars)
    var end = text.substring(text.length - endChars, text.length)
    while (start.length + end.length < maxLength) {
      start = start + '.'
    }
    return start + end
  }
  return text
}
const regexTime = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Thêm số 0 đằng trước nếu là một chữ số
  const day = String(date.getDate()).padStart(2, '0'); // Thêm số 0 đằng trước nếu là một chữ số
  const hours = String(date.getHours()).padStart(2, '0'); // Thêm số 0 đằng trước nếu là một chữ số
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Thêm số 0 đằng trước nếu là một chữ số
  const seconds = String(date.getSeconds()).padStart(2, '0'); 

  const text = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  return text
}
export {
  truncate, regexTime
}