import React,{useState}from 'react'
import { Button } from 'react-bootstrap'
import '../styles/formButtons.css'
function FormButtons({setForm}) {
  const [activeButton, setActiveButton] = useState('common');

             const handleClick = (formName) => {
                 setActiveButton(formName);
                 setForm(formName);
             };
  return (
    <div>
         <div className="buttonsec w-50 m-5 d-flex justify-content-evenly">
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
           
        </div>
    </div>
  )
}

export default FormButtons