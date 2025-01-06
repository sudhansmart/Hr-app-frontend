import React from 'react'
import '../styles/labels.css'

function Labels() { 
    const labels = [
        "name",
        "email",
        "mobileNo",
        "location",
        "qualification",
        "position",
        "currentCompany",
        "overallExperience",
        "relevantExperience",
        "currentCTC",
        "expectedCTC",
        "noticePeriod",
        "interviewMode",
        "remarksFirstRecruiter",
        "jobCode",
        "resumeId",
        "skill",
        "preferredLocation",
        "payrollOrg",
        "jobLevel",
        "communicationRating",
        "university",
        "shift",
        "resumeId",
        "gender",
        "band"
    ]
  return (
    <div className='labels-main w-50'>
          <h5 className='mb-3 text-decoration-underline text-primary'>Labels</h5>
        <ul>
            {labels.map((label,index) => (<li key={index}>{label}</li>))}
          
        </ul>
    </div>
  )
}

export default Labels