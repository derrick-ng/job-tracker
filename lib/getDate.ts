export function getDate() {
  const newDate = new Date();
  const day = newDate.getDate();
  const month = newDate.getMonth() + 1;
  const year = newDate.getFullYear();

  const date = `${month}/${day}/${year}`;
  return date;
}
