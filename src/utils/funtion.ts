export function formatDate(input: string) {
  var datePart = input.match(/\d+/g),
    year = datePart![0].substring(0, 4), // get only two digits
    month = datePart![1],
    day = datePart![2];

  return day + '/' + month + '/' + year;
}

export function unixToDate(input: string) {
  const date = new Date(input);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedDate = `${day}/${month}/${year} \n${hours}:${minutes}:${seconds}`;

  return formattedDate;
}
