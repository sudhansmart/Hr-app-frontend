import React, { useEffect, useState } from 'react';
import '../styles/scheduleBoard.css';
import { decodeToken } from '../utils/decodeToken';
import axios from 'axios';

function ScheduleBoard() {
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterId, setRecruiterId] = useState('');
  const [sortedData, setSortedData] = useState([]);
  const [data, setData] = useState([]);
  const [totalSchedule,setTotalSchedule] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.name) {
        setRecruiterName(decodedToken.name);
        setRecruiterId(decodedToken.userId);
      }
    }
  }, []);

  const calculateRecruiterData = (data) => {
    const recruiterStats = {};
    let totalProfileSubmissions = 0;

    data.forEach((entry) => {
      const recruiter = entry.recruiterId; // Group by recruiterId
       
      if (!recruiterStats[recruiter]) {
        recruiterStats[recruiter] = {
          recruiterName: entry.recruiterName,
          profileSubmissions: 0,
          interviewAttended: 0,
          interviewFinalStatus: 0,
          joined: 0,
          joinedValue: 0,
        };
      }

      recruiterStats[recruiter].profileSubmissions += 1;
      totalProfileSubmissions += 1;
      if (entry.interviewStatus === 'attended') {
        recruiterStats[recruiter].interviewAttended += 1;
      }
      if (entry.interviewFinalStatus === 'selected') {
        recruiterStats[recruiter].interviewFinalStatus += 1;
      }
      if (entry.joinedStatus === 'joined') {
        recruiterStats[recruiter].joined += 1;
        const billValue = entry.billValue || 0;
        recruiterStats[recruiter].joinedValue += +billValue;
      }
    });

    // Convert object to array and sort by profileSubmissions
    const sortedArray = Object.values(recruiterStats).sort(
      (a, b) => b.profileSubmissions - a.profileSubmissions
    );
    setTotalSchedule(totalProfileSubmissions)
    setSortedData(sortedArray);
  };

  const fetchAllData = async () => {
    try {
      const response = await axios.get('http://103.38.50.152/nodejs/candidate/candidatesdata');
      // const response = await axios.get('http://localhost:5000/candidate/candidatesdata');
      const data = response.data;

      // Flatten the nested data if necessary
      const flattenedData = data.map((candidate) => ({
        ...candidate.common,
        ...candidate.infosys,
        ...candidate.jobDetails,
        ...candidate.wipro1,
        ...candidate.wipro2,
        ...candidate.accenture,
        ...candidate.other,
        _id: candidate._id, // Ensure _id is preserved
      }));

      const currDateData = flattenedData.filter((item) => {
        const itemDate = new Date(item.createdDate); // Assuming item.createdDate is a valid date string
        const currentDate = new Date();
      
        return (
          itemDate.getDate() === currentDate.getDate() &&
          itemDate.getMonth() === currentDate.getMonth() &&
          itemDate.getFullYear() === currentDate.getFullYear()
        );
      });

      setData(currDateData);
      calculateRecruiterData(currDateData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // const getBackgroundColor = (index) => {
  //   switch (index) {
  //     case 0:
  //       return 'gold';
  //     case 1:
  //       return 'silver';
  //     case 2:
  //       return 'bronze';
  //     default:
  //       return 'other';
  //   }
  // };

  const getIcon = (index) => {
    switch (index) {
      case 0:
        return '🥇'; // Gold medal icon
      case 1:
        return '🥈'; // Silver medal icon
      case 2:
        return '🥉'; // Bronze medal icon
      default:
        return null;
    }
  };
  const getColour = (index) => {
    console.log("colorcode :",index)
    switch (index) {
      case 3:
        return 'green'; 
      case 2:
        return 'blue'; 
      case 1:
        return 'orange'; 
      default:
        return "red";
    }
  };

  return (
    <div className='scheduleboard-main'>
      <h5 className='scheduleboard-heading'>Schedule Board <span className='scheduleboard-counter'>{totalSchedule}</span></h5>
    
      <table className='scheduleboardtable' border="0" cellPadding="10" style={{ width: '100%', textAlign: 'center' }}>
        <thead>
          <tr>
            <th>Position</th>
            <th>Name</th>
            <th>Scheduled</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((recruiter, index) => (
            <tr key={index} 
            // className={getBackgroundColor(index)}
            >
              <td>
                {getIcon(index)} {index > 2 ? index + 1 : ''}
              </td>
              <td style={{color : getColour(recruiter.profileSubmissions)}}>{recruiter.recruiterName}</td>
              <td>{recruiter.profileSubmissions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ScheduleBoard;
