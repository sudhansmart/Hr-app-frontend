import React,{useState} from 'react'
import '../styles/preSchedule.css'
import PrescheduleButtons from '../components/PrescheduleButtons'
import ProfileSubmissions from '../components/ProfileSubmissions';
import InterviewAttendedSheet from '../components/InterviewAttendedSheet';
import PreScheduleCounter from '../components/PreScheduleCounter';
function PreSchedule() {
  const [form, setForm] = useState("common");
  const [counterData,setCounterData] = useState()
  return (
    <div  className='preschedule-main container'>
      <div className='d-flex w-100'>
            <PrescheduleButtons setForm={setForm}/>
          {counterData?  <PreScheduleCounter counterData={counterData} /> : <div className='w-100'></div>}
      </div>
         
          <div className="tablesection m-4">
            {form === "profilesubmission" && <ProfileSubmissions setCounterData={setCounterData}/>}
            {form === "interview" && <InterviewAttendedSheet setCounterData={setCounterData}/>}
            </div>
    </div>
  )
}

export default PreSchedule