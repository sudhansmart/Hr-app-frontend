import React from 'react'
import BillingCounts from '../components/BillingCounts'
import CounterAdminDashBoard from '../components/CounterAdminDashBoard'
import RecruiterLeaderBoard from '../components/RecruiterLeaderBoard'
import '../styles/superAdmin.css'
import ClientList from '../components/ClientList'
import PersonalTrackerCount from '../components/PersonalTrackerCount'

function SuperAdminDashBoard() {
  return (
    <div>
        <BillingCounts/>
        <div className='superadmin-sec p-5'>
               <CounterAdminDashBoard/>
               <br/>
                <RecruiterLeaderBoard/>
                
        </div>
        <ClientList/>
        <br/>
        <PersonalTrackerCount/>
       
    </div>
  )
}

export default SuperAdminDashBoard