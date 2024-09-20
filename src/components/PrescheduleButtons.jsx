import React,{useState} from 'react'
import { Button } from 'react-bootstrap'

function PrescheduleButtons({setForm}) {
    const [activeButton, setActiveButton] = useState('common');

    const handleClick = (formName) => {
        setActiveButton(formName);
        setForm(formName);
    };
  return (
   
         <div className="buttonsec  m-5 p-lg-3 gap-3 w-100 d-flex justify-content-evenly">
         <Button
                variant="primary"
                className={activeButton === 'profilesubmission' ? 'active-button' : ''}
                onClick={() => handleClick('profilesubmission')}
            >
               Profile Submissions
            </Button>
            <Button
                variant="primary"
                className={activeButton === 'interview' ? 'active-button' : ''}
                onClick={() => handleClick('interview')}
            >
                Interview attended
            </Button>
            <Button
                variant="primary"
                className={activeButton === 't&d' ? 'active-button' : ''}
                onClick={() => handleClick('t&d')}
            >
                Turnup & Deficite
            </Button>
           
           
        </div>
   
  )
}

export default PrescheduleButtons