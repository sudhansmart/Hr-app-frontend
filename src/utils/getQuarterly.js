// Function to determine the quarter of a given date
function getQuarter(date) {
  const month = date.getMonth() + 1; // Months are 0-indexed, so we add 1
  return Math.ceil(month / 3); // Divide by 3 to get the quarter (1 to 4)
}

// Get the current quarter date range
function getCurrentQuarterDates() {
  const now = new Date();
  const currentYear = now.getFullYear();
  let currentQuarterStart, currentQuarterEnd;

  // Determine the current quarter
  const currentQuarter = getQuarter(now);

  // Calculate the current quarter start and end dates
  currentQuarterStart = new Date(currentYear, (currentQuarter - 1) * 3, 1); // Start of the current quarter
  currentQuarterEnd = new Date(currentYear, currentQuarter * 3, 0); // End of the current quarter

  return { start: currentQuarterStart, end: currentQuarterEnd };
}

// Filter data for the current quarter
export function getCurrentQuarterData(data) {
  const { start, end } = getCurrentQuarterDates();

  return data.filter(item => {
    const itemDate = new Date(item.createdDate); // Assuming `item.createdDate` is the date field
    return itemDate >= start && itemDate <= end;
  });
}

// Example usage
