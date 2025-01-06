import React,{useState,useEffect} from 'react';
import '../styles/recruiterdashboard.css';
import CounterRecruiterDashBoard from '../components/CounterRecruiterDashBoard';
import RecruiterLeaderBoard from '../components/RecruiterLeaderBoard';
import InterviewAlert from '../components/InterviewAlert';
import LiveNotification from '../components/LiveNotification';
import ScheduleBoard from '../components/ScheduleBoard';
import { decodeToken } from '../utils/decodeToken';
import LineChartComponent from '../components/LineChartComponent';
import InterviewDetailSheet from '../components/InterviewDetailSheet';
import FollowUpData from '../components/FollowUpData';

function RecruiterDashBoard() {
  const [adminLoggedIn, setAdminLoggedIn] = useState();
 
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
     
      const decodedToken = decodeToken(token);
          if (decodedToken && decodedToken.name) {
            if(decodedToken.role === 'admin'){
              setAdminLoggedIn(true)
            }  
          }
    }
  }, [])

  return (
    <>
   
    <div className='recruiterdashboard-main'>
      <div className="recruiter-leftsec">
            <CounterRecruiterDashBoard/>
           {adminLoggedIn? <RecruiterLeaderBoard/>:<LineChartComponent/>}
      </div>
      <div className="recruiter-rightsec">
              <InterviewAlert/>
              <ScheduleBoard/>
              {/* <LiveNotification/> */}
      </div>
    </div>
           <InterviewDetailSheet/>
           <FollowUpData/>
    </>
  );
}

export default RecruiterDashBoard;
