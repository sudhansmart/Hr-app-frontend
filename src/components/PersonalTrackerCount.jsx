import React, { useEffect, useState } from 'react';
import '../styles/personalTrackerCount.css';
import axios from 'axios';
import { monthlyCount } from '../utils/monthlyCount';

function PersonalTrackerCount() {
  const [adminLoggedIn, setAdminLoggedIn] = useState(localStorage.getItem('adminAuth') === 'true' || false);
  const [superAdminLoggedIn, setSuperAdminLoggedIn] = useState(localStorage.getItem('superadminAuth') === 'true');
  const [groupedData, setGroupedData] = useState([]);
  const [dailyCount, setDailyCount] = useState(0);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://103.38.50.152/nodejs/candidate/getpersonaltracker');
      const Totaldata = response.data;

      const today = new Date().toISOString().split('T')[0]; // Get today's date as YYYY-MM-DD
      const currentMonth = new Date().toISOString().split('T')[0].slice(0, 7); // Get current month as YYYY-MM

      // Grouping data by recruiter
      const grouped = Totaldata.reduce((acc, item) => {
        const recruiterName = item.recruiterName || 'Unknown';
        const itemDate = new Date(item.createdDate).toISOString().split('T')[0]; // Convert to YYYY-MM-DD
        const itemMonth = itemDate.slice(0, 7); // Extract YYYY-MM

        if (!acc[recruiterName]) {
          acc[recruiterName] = {
            recruiter: recruiterName,
            total: 0,
            monthly: 0,
            daily: 0,
          };
        }

        acc[recruiterName].total += 1; // Increment total profiles

        if (itemMonth === currentMonth) {
          acc[recruiterName].monthly += 1; // Increment current month profiles
        }

        if (itemDate === today) {
          acc[recruiterName].daily += 1; // Increment today's profiles
        }

        return acc;
      }, {});

      // Convert grouped object to an array
      const groupedArray = Object.values(grouped).sort((a, b) => b.total - a.total);
      setGroupedData(groupedArray);

      // Calculate total profiles
      const totalProfiles = groupedArray.reduce((acc, item) => acc + item.total, 0);
      setTotalProfiles(totalProfiles);

      // Calculate daily count
      const dailyCount = groupedArray.reduce((acc, item) => acc + item.daily, 0);
      setDailyCount(dailyCount);

      // Calculate monthly count
      const monthlyCount = groupedArray.reduce((acc, item) => acc + item.monthly, 0);
      setMonthlyCount(monthlyCount);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (adminLoggedIn || superAdminLoggedIn) {
      fetchData();
    }
  }, []);

   // Pagination logic
   const combinedCandidates = groupedData
   const totalItems = combinedCandidates.length;
   const totalPages = Math.ceil(totalItems / itemsPerPage);
   const startIndex = (currentPage - 1) * itemsPerPage;
   const endIndex = startIndex + itemsPerPage;
   const currentGroupedData = combinedCandidates.slice(startIndex, endIndex);

   const handlePageChange = (pageNumber) => {
       setCurrentPage(pageNumber);
   };

  return (
    <div className="personalTrackerCount-main">
      <h4>Personal Tracker</h4>
      <div className="number-display">
        <div className="total-number">
          <p className="digit">{dailyCount}</p>
          <p className="texttitle">Daily</p>
        </div>
        <div className="total-number">
          <p className="digit">{monthlyCount}</p>
          <p className="texttitle">Current Month</p>
        </div>
        <div className="daily-number">
          <p className="digit">{totalProfiles}</p>
          <p className="texttitle">Total</p>
        </div>
      </div>

      <div className="trackercounttable-sec">
        <table className="trackercount-table">
          <thead>
            <tr>
              <th>SL No</th>
              <th>Recruiter Name</th>
              <th>Today's Profiles</th>
              <th>Current Month Profiles</th>
              <th>Total Profiles</th>
            </tr>
          </thead>
          <tbody>
            {currentGroupedData.map((recruiterData, index) => (
              <tr key={recruiterData.recruiter}>
                <td>{index + 1}</td>
                <td>{recruiterData.recruiter}</td>
                <td>{recruiterData.daily}</td>
                <td>{recruiterData.monthly}</td>
                <td>{recruiterData.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='pagination1 d-flex justify-content-center gap-2 m-5'>
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={currentPage === i + 1 ? 'active text-center' : 'text-center'}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
      </div>
    </div>
  );
}

export default PersonalTrackerCount;
