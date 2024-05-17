  
  export default function formatDate(dateString: string): string {
    // Extract the date part from the string
    const datePart = dateString.split(' ')[0]; // "29.04.2024"
  
    // Split the date part by "."
    const [day, month, year] = datePart.split('.'); // ["29", "04", "2024"]
  
    // Create an array of month names
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    // Convert month number to month name
    const monthName = monthNames[parseInt(month, 10) - 1]; // Month is 0-indexed
  
    // Format the day as a number without leading zeros
    const formattedDay = parseInt(day, 10);
  
    // Format the date as "d-Month-yyyy"
    const formattedDate = `${formattedDay}-${monthName}-${year}`;
  
    return formattedDate;
  }
  