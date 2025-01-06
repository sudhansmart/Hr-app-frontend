import React, { useState } from 'react'
import '../styles/billing.css'
import BillingButtons from '../components/BillingButtons'
import YetToRaise from '../components/YetToRaise'
import Raised from '../components/Raised'
import Received from '../components/Received'
import BillingDrops from '../components/BillingDrops'

function Billing() {
    const[table,setTable] = useState('')
  return (
    <div className='billing-main'>
            <BillingButtons setTable={setTable}/>
            <div className="billingtablesec">
               {table == 0 && <YetToRaise/>} 
               {table == 1 && <Raised/>}
               {table == 2 && <Received/>}
               {table == 3 && <BillingDrops/>}
            </div>
    </div>
  )
}

export default Billing
