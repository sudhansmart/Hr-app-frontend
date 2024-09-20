import React from 'react'
import '../styles/preschedulecounter.css'

function PreScheduleCounter({counterData}) {
  console.log("counterData :",counterData)
  return (
    <div className='preschedulecounter-main d-flex w-100 gap-3 m-3'>
               <div className="counterdatas">
                    <p className='counter-num1'>{counterData[0].count}</p>
                   <p className='counter-text1'>{counterData[0].name}</p>  
               </div>
               <div className="counterdatas">
                    <p className='counter-num2'>{counterData[1].count}</p>
                   <p className='counter-text2'>{counterData[1].name}</p>
               </div>
               <div className="counterdatas">
                    <p className='counter-num3'>{counterData[2].count}</p>
                   <p className='counter-text3'>{counterData[2].name}</p>
               </div>
               <div className="counterdatas">
                    <p className='counter-num4'>{counterData[3].count}</p>
                   <p className='counter-text4'>{counterData[3].name}</p>
               </div>
    </div>
  )
}

export default PreScheduleCounter
