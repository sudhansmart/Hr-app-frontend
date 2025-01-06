import React,{useState}from 'react'
import { Button } from 'react-bootstrap'
import '../styles/formButtons.css'
function FormButtons({setForm,exportOn}) {
  const [activeButton, setActiveButton] = useState('personal');
  const [adminLoggedIn, setAdminLoggedIn] = useState(localStorage.getItem('adminAuth') === 'true');

             const handleClick = (formName) => {
                 setActiveButton(formName);
                 setForm(formName);
             };
  return (
    <div>
         <div className="buttonsec  m-5 d-flex justify-content-evenly">
       {!adminLoggedIn && !exportOn &&  <Button
                variant="primary"
                className={activeButton === 'personal' ? 'active-button' : ''}
                onClick={() => handleClick('personal')}
            >
                Personal Tracker
            </Button>}
             <Button
                variant="primary"
                className={activeButton === 'common' ? 'active-button' : ''}
                onClick={() => handleClick('common')}
            >
                Common
            </Button>
            <Button
                variant="primary"
                className={activeButton === 'infosys' ? 'active-button' : ''}
                onClick={() => handleClick('infosys')}
            >
                Infosys
            </Button>
            <Button
                variant="primary"
                className={activeButton === 'wipro' ? 'active-button' : ''}
                onClick={() => handleClick('wipro')}
            >
                Wipro
            </Button>
            <Button
                variant="primary"
                className={activeButton === 'accenture' ? 'active-button' : ''}
                onClick={() => handleClick('accenture')}
            >
                Accenture
            </Button>
            <Button
                variant="primary"
                className={activeButton === 'other' ? 'active-button' : ''}
                onClick={() => handleClick('other')}
            >
                Other
            </Button>
           
        </div>
    </div>
  )
}

export default FormButtons