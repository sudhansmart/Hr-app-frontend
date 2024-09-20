import React,{useState} from 'react'
import '../styles/postschedule.css'
import ShortlistSheet from '../components/ShortlistSheet'
import PostScheduleButtons from '../components/PostScheduleButtons'
import OfferSheet from '../components/OfferSheet';
import Joined from '../components/Joined';
import Drops from '../components/Drops';
import ShorlistOnHold from '../components/ShorlistOnHold';
function PostSchedule() {
    const [form, setForm] = useState("common");
  return (
    <div className='postschedule-main '>
          <div className="d-flex w-100">
            <PostScheduleButtons setForm={setForm}/>
            <div className='preschedulecounter-main d-flex w-100 gap-3 m-3'>
               <div className="counterdatas">
                    <p className='counter-num1'>100</p>
                   <p className='counter-text1'>Total</p>  
               </div>
               <div className="counterdatas">
                    <p className='counter-num2'>100</p>
                   <p className='counter-text2'>Attended</p>
               </div>
               <div className="counterdatas">
                    <p className='counter-num3'>100</p>
                   <p className='counter-text3'>Not Attended</p>
               </div>
               <div className="counterdatas">
                    <p className='counter-num4'>100</p>
                   <p className='counter-text4'>Hold</p>
               </div>
            </div>
          </div>
          <div className="tablesection m-5">
            {form === "shortlist" && <ShortlistSheet/>}
            {form === "offer" && <OfferSheet/>}
            {form === "join" && <Joined/>}
            {form === "drop" && <Drops/>}
            {form === "hold" && <ShorlistOnHold/>}
            </div>
    </div>
  )
}

export default PostSchedule