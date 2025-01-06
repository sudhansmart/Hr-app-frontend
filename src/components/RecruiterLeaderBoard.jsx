import React,{useState,useEffect} from 'react'
import  '../styles/recruiterLeaderBoard.css'
import axios from 'axios';
import { Form,Col } from 'react-bootstrap';

function RecruiterLeaderBoard() {
    const [sortedData, setSortedData] = useState([]);
    const [data,setData] = useState();
    const [searchText, setSearchText] = useState('');
      
    const calculateRecruiterData = (data) => {
      const recruiterStats = {};
    
      data.forEach((entry) => {
        const recruiter = entry.recruiterId; // Group by recruiterId
    
        if (!recruiterStats[recruiter]) {
          recruiterStats[recruiter] = {
            recruiterName: entry.recruiterName,
            profileSubmissions: 0,
            interviewAttended: 0,
            interviewFinalStatus: 0,
            joined: 0,
            joinedValue: 0
          };
        }
    
        // Increment profile submissions count
        recruiterStats[recruiter].profileSubmissions += 1;
    
        // Increment interview attended count if the status is 'attended'
        if (entry.interviewStatus === 'attended') {
          recruiterStats[recruiter].interviewAttended += 1;
        }
    
        // Increment final interview status count if the final status is 'selected'
        if (entry.interviewFinalStatus === 'shortlisted' && entry.joinedStatus !== 'joined' && entry.offerStatus !== "drop" && entry.offerStatus !== "drop" ) {
          recruiterStats[recruiter].interviewFinalStatus += 1;
        }
    
        // Increment joined count and joined value if the status is 'joined'
        if (entry.joinedStatus === 'joined') {
          recruiterStats[recruiter].joined += 1;
          const billValue = entry.billValue || 0; // Use 0 if billValue is undefined
          recruiterStats[recruiter].joinedValue += +billValue;
        }
      }); 
    
      // Convert recruiterStats to an array, sort by joinedValue, and then by interviewAttended
      const valueSorted = Object.values(recruiterStats).sort((a, b) => {
        // First sort by joinedValue in descending order
        if (b.joinedValue !== a.joinedValue) {
          return b.joinedValue - a.joinedValue;
        }
        // If joinedValue is the same, sort by interviewAttended in descending order
        return b.interviewAttended - a.interviewAttended;
      });
    
      setSortedData(valueSorted); 
     
    };
    
       

      const fetchAllData = async () => {
          try {
            const response = await axios.get('http://103.38.50.152/nodejs/candidate/candidatesdata');
            // const response = await axios.get('http://localhost:5000/candidate/candidatesdata');
            const data = response.data;
      
            // Flatten the nested data if necessary
            const flattenedData = data.map(candidate => ({
              ...candidate.common,
              ...candidate.infosys,
              ...candidate.jobDetails,
              ...candidate.wipro1,
              ...candidate.wipro2,
              ...candidate.accenture,
              ...candidate.other,
              _id: candidate._id, // Ensure _id is preserved
            }));
            const currMonthData = flattenedData.filter(item => {
              // Parse the createdDate from the data and compare it to the current date
              const itemDate = new Date(item.createdDate); // Assuming item.createdDate is a valid date string
              const currentDate = new Date();
              
              return (
                itemDate.getMonth() === currentDate.getMonth() && 
                itemDate.getFullYear() === currentDate.getFullYear()
              );
            });

            setData(currMonthData);
            const sorted = [...currMonthData].sort((a, b) => b.joinedValue - a.joinedValue);
            calculateRecruiterData(sorted);
           
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
       

    useEffect(() => {
      fetchAllData();
    }, [searchText]);
  
    const getBackgroundColor = (joinedValue) => {
      
      if (+joinedValue > 100000) {
        return 'rgba( 99, 179, 5, 0.6 )';
      } else if (+joinedValue >= 60000 && +joinedValue <= 100000) {
        return 'rgba( 248, 232, 5, 0.65 )';
      } else {
        return 'white';
      }
    };
  
    const getIcon = (index) => {
      switch (index) {
        case 0:
          return "🥇"; // Gold medal icon
        case 1:
          return "🥈"; // Silver medal icon
        case 2:
          return "🥉"; // Bronze medal icon
        default:
          return null;
      }
    };

    const filteredData = sortedData.filter((item) => {
     
     const nameMatch = item.recruiterName?.toLowerCase().includes(searchText.toLowerCase());
    
    
    
     return (nameMatch  ) ;
    
   });

  return (
    <div className='recruiterLeaderBoard-main'>
           <h5 className='title'> Leader Board</h5>
           <hr />
          
        <Col md={4} >
       
            <Form.Control
              type="search"
              placeholder="Search..." 
              className="progress-searchbar"
              aria-label="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
           
        </Col>
               
      
           <div className="leadtab"  style={{ overflowY: "scroll" ,maxHeight: "70%"}}> 
        <table className='leadeboardtable' border="0" cellPadding="10" style={{ width: "100%", textAlign: "center" }}>
      <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
        <tr>
          <th>Position</th> 
          <th>Name</th>
          <th>Profile Submission</th>
          <th>Interview Attended</th>
          <th>Shortlisted</th>
          <th>Joined</th>
          <th>Joined Value</th>
        </tr>
      </thead>
     
      <tbody>
      {Object.keys(filteredData).map((recruiterId, index) => (
     
          <tr key={index} className='listdatas' style={{
            background: getBackgroundColor(filteredData[recruiterId].joinedValue),
          }}
>
            <td>{getIcon(index)} {index > 2 ? index + 1 : ''}</td>
              <td>{filteredData[recruiterId].recruiterName}</td>
              <td>{filteredData[recruiterId].profileSubmissions}</td>
              <td>{filteredData[recruiterId].interviewAttended}</td>
              <td>{filteredData[recruiterId].interviewFinalStatus}</td>
              <td>{filteredData[recruiterId].joined}</td>
              <td>{filteredData[recruiterId].joinedValue}</td>
          </tr>
        ))}
      </tbody>
   
    </table>
    </div>
    </div>
  )
}

export default RecruiterLeaderBoard