import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { monthlyCount } from '../utils/monthlyCount';
import {getCurrentQuarterData}  from '../utils/getQuarterly'

function CounterAdminDashBoard() {
  const [counterData, setCounterData] = useState([]);
     

      const fetchAllData = async () => {
        try {
          const response = await axios.get('http://103.38.50.152/nodejs/candidate/candidatesdata');
          // const response = await axios.get('http://localhost:5000/candidate/candidatesdata');
          const data = response.data;
    
         
          const flattenedData = data.map(candidate => ({
            ...candidate.common,
            ...candidate.infosys,
            ...candidate.jobDetails,
            ...candidate.wipro1,
            ...candidate.wipro2,
            ...candidate.accenture,
            ...candidate.other,
            _id: candidate._id, 
          }));
          const QuarterlyData = getCurrentQuarterData(flattenedData);
         
          const interviewAttendedData = QuarterlyData.filter(item => item.interviewStatus === "attended");
          const shortlistedData = QuarterlyData.filter(item => 
                                                          item.interviewFinalStatus === "shortlisted" && 
                                                          item.joinedStatus !== "joined" && 
                                                          item.joinedStatus !== "dropped" &&
                                                          item.offerStatus !== 'hold'  &&
                                                          item.offerStatus !== 'drop' &&
                                                          item.offerStatus !== 'released'
                                                        );
          const shortlistedValueData = shortlistedData.reduce((sum, item) => sum + +(item.billValue || 0), 0);
        
          const joinedData = QuarterlyData.filter(item => item.joinedStatus === "joined");
          const  joinedValueData = joinedData.reduce((sum, item) => sum + +(item.billValue || 0), 0);
      
          const monthlyProfileSubmission =   monthlyCount(QuarterlyData);
          const monthlyInterviewAttended = monthlyCount(interviewAttendedData);
          const monthlyShortlistedvalue =   monthlyCount(shortlistedData);
          const monthlyShortlistvalue = monthlyShortlistedvalue.reduce((sum, item) => sum + +(item.billValue || 0), 0);
          const monthlyJoined = monthlyCount(joinedData);
          const monthlyJoinedvalue = monthlyJoined.reduce((sum, item) => sum + +(item.billValue || 0), 0);

          const counter = [
            {
              name: "Profile Submission",
              monthlycount: monthlyProfileSubmission.length,
              totalcount: QuarterlyData.length
              
            },
            {
              name: "Interview Attended",
              monthlycount: monthlyInterviewAttended.length,
              totalcount: interviewAttendedData.length
            },
            {
              name: "Shortlisted",
              monthlycount: monthlyShortlistedvalue.length,
              totalcount: shortlistedData.length
            },
            {
              name: "Shortlist Value",
              monthlycount: monthlyShortlistvalue ,
              totalcount: shortlistedValueData
            },
            {
              name: "Joined",
              monthlycount: monthlyJoined.length,
              totalcount: joinedData.length
            },
            {
              name: "Joined Value",
              monthlycount: monthlyJoinedvalue,
              totalcount: joinedValueData                                                       
            }, 
          ]  
          
          setCounterData(counter);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      useEffect(() => {
        fetchAllData();
      }, []);
   
  return (
    <div className='counterrecruiterdashboard-main'>
         {  counterData &&
            counterData.map((data,index) => (
         <div key={index} className="recruiterDashboard-countercard ">
              
               <p className='monthly' style={{fontSize:"25px"}}>{data.monthlycount}</p>
               <h4 style={{fontSize:"15px"}}>{data.name}</h4>
               <p className='daily' style={{fontSize:"15px"}}>{data.totalcount}</p>
                <h5 className='daily' >Total</h5>
               
               
         </div>
            ))
       }
    </div>
  )
}

export default CounterAdminDashBoard