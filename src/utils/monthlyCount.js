export const monthlyCount = (data) => {
  
     try {
            // Get current year and month
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

      const monthlyFiltered = data.filter(item => {
      if (item.createdDate) {
        const createdDate = new Date(item.createdDate);

        // Ensure the date is valid and compare year and month
        if (!isNaN(createdDate.getTime())) {
          return createdDate.getFullYear() === currentYear && createdDate.getMonth() === currentMonth;
        }
      }
      return false; // Skip items with invalid or missing dates
    });
    return monthlyFiltered
        
     } catch (error) {
         console.log("Error Occured in monthlycounter utils :",error)
     }

 
}