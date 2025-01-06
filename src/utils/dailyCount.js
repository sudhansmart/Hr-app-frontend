export const dailyCount = (data) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0]; // Get current date in 'YYYY-MM-DD' format
        const DailyFiltered = data.filter(item => {
          const itemDate = new Date(item.createdDate).toISOString().split('T')[0]; // Convert item date to 'YYYY-MM-DD'
          return itemDate === currentDate;
        });
       return DailyFiltered 
    } catch (error) {
        console.log("Error occured in DailyCount utils :",error)
    }
}