export const processChartData = (data) => {
    try {
      const dateCounts = {};
  
      // Iterate through the bulk data
      data.forEach(({ createdDate, interviewStatus, interviewFinalStatus }) => {
        // Format the createdDate to "YYYY-MM-DD"
        const formattedDate = new Date(createdDate).toISOString().split('T')[0];
  
        // Initialize the date entry if it doesn't exist
        if (!dateCounts[formattedDate]) {
          dateCounts[formattedDate] = { date: formattedDate, scheduled: 0, attended: 0, shortlisted: 0 };
        }
  
        // Increment scheduled count for each entry found
        dateCounts[formattedDate].scheduled += 1;
  
        // Calculate attended count based on interviewStatus
        if (interviewStatus === 'attended') {
          dateCounts[formattedDate].attended += 1;
        }
  
        // Calculate shortlisted count based on interviewFinalStatus
        if (interviewFinalStatus === 'shortlisted') {
          dateCounts[formattedDate].shortlisted += 1;
        }
      });
  
      // Ensure we include all dates in the range with scheduled counts
      const allDates = Object.keys(dateCounts);
      if (allDates.length > 0) {
        const minDate = new Date(Math.min(...allDates.map(date => new Date(date))));
        const maxDate = new Date(Math.max(...allDates.map(date => new Date(date))));
  
        // Populate missing dates between min and max with scheduled = 0
        for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          
          if (!dateCounts[dateStr]) {
            dateCounts[dateStr] = { date: dateStr, scheduled: 0, attended: 0, shortlisted: 0 };
          }
        }
      }
  
      // Convert the dateCounts object into an array sorted by date
      return Object.values(dateCounts).sort((a, b) => new Date(a.date) - new Date(b.date));
  
    } catch (err) {
      console.log("Error occurred in processChartData utils:", err);
    }
  };
  