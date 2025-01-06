import React,{useState,useEffect} from 'react'
import '../styles/adminDashboard.css'
import RecruiterLeaderBoard from '../components/RecruiterLeaderBoard';
import InterviewAlert from '../components/InterviewAlert';
import LiveNotification from '../components/LiveNotification';
import CounterAdminDashBoard from '../components/CounterAdminDashBoard';
import ScheduleBoard from '../components/ScheduleBoard';
import InterviewDetailSheet from '../components/InterviewDetailSheet';
import FollowUpData from '../components/FollowUpData';
import PersonalTrackerCount from '../components/PersonalTrackerCount';
function AdminDashBoard() {
  const [loading,setloading] = useState(true) ;
  
  useEffect(() => {
    setTimeout(() => {
      setloading(false);
    }, 1500);
  }, []);


  return (
    <>
   {loading? <div className="loader">
    <svg viewBox="0 0 100 100" >
	<g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6">
		
		<path d="M 21 40 V 59" stroke="#6A1E55">
			<animateTransform
      attributeName="transform"
      attributeType="XML"
      type="rotate"
      values="0 21 59; 180 21 59"
      dur="2s"
      repeatCount="indefinite" />
		</path>
		
		<path d="M 79 40 V 59" stroke="#6A1E55">
			<animateTransform
      attributeName="transform"
      attributeType="XML"
      type="rotate"
      values="0 79 59; -180 79 59"
      dur="2s"
      repeatCount="indefinite" />
		</path>
		
		<path d="M 50 21 V 40" stroke="#6A1E55">
			<animate
      attributeName="d"
      values="M 50 21 V 40; M 50 59 V 40"
      dur="2s"
      repeatCount="indefinite" />
		</path>
	
		<path d="M 50 60 V 79" stroke="#6A1E55">
			<animate
      attributeName="d"
      values="M 50 60 V 79; M 50 98 V 79"
      dur="2s"
      repeatCount="indefinite" />
		</path>
		
		<path d="M 50 21 L 79 40 L 50 60 L 21 40 Z" >
		<animate
      attributeName="stroke"
      values="#3B1C32; rgba(100,100,100,0)"
      dur="2s"
      repeatCount="indefinite" />
		</path>
		
		<path d="M 50 40 L 79 59 L 50 79 L 21 59 Z" stroke='#6A1E55'/>
		
		<path d="M 50 59 L 79 78 L 50 98 L 21 78 Z">
		<animate
      attributeName="stroke"
      values="#A64D79; rgba(255,255,255,1)"
      dur="2s"
      repeatCount="indefinite" />
		</path>
		<animateTransform
      attributeName="transform"
      attributeType="XML"
      type="translate"
      values="0 0; 0 -19"
      dur="2s"
      repeatCount="indefinite" />
	</g>
</svg>
    </div> :<>
    <div className='admindashboard-main'> 
          <div className="admin-leftsec">
            <CounterAdminDashBoard/>
             <RecruiterLeaderBoard/>
          </div>
          <div className="admin-rightsec">
          <InterviewAlert/>
          <ScheduleBoard/>
          {/* <LiveNotification/> */}
            </div>
    </div>
         <InterviewDetailSheet/>
         <FollowUpData/>  
         <PersonalTrackerCount/>
         </>}
    </>
  )
}

export default AdminDashBoard