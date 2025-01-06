import React, { useState } from 'react'
import '../styles/counterDisplay.css'

function CounterDisplay({counterData,postCounterData}) {
     

   

  return (
    <div className='counterdisplay-main'>
        {  counterData &&
            counterData.map((data,index) => (
         <div className="countercard " key={index}>
              
               <p className='monthly'>{data.monthlycount}</p>
               <h4>{data.name}</h4>
               <p className='daily'>{data.dailycount} Today</p>
         </div>
            ))
       }
       {  postCounterData &&
            postCounterData.map((data,index) => (
         <div className="countercard " key={index} >
              
               <p className='monthly'>{data.monthlycount}</p>
               <h4>{data.name}</h4>
                <div></div>
         </div>
            ))
       }
    </div>
  )
}

export default CounterDisplay