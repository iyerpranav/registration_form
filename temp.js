const date = new Date("Wed Dec 31 2025 00:00:00 GMT+0530");
const formattedDate = date.toISOString().split("T")[0]

console.log(formattedDate);