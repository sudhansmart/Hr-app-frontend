import React, { useState } from 'react'
import { Button } from 'react-bootstrap'

function PostScheduleButtons({setForm}) {
    const [activeButton, setActiveButton] = useState('common');

    const handleClick = (formName) => {
        setActiveButton(formName);
        setForm(formName);
    };

  return (
    <div className="buttonsec  m-5 p-lg-3 gap-3 w-100 d-flex justify-content-evenly">
         <Button
                variant="primary"
                className={activeButton === 'shortlist' ? 'active-button' : ''}
                onClick={() => handleClick('shortlist')}
            >
               Shortlist
            </Button>
            <Button
                variant="primary"
                className={activeButton === 'offer' ? 'active-button' : ''}
                onClick={() => handleClick('offer')}
            >
                Offer Received
            </Button>
            <Button
                variant="primary"
                className={activeButton === 'join' ? 'active-button' : ''}
                onClick={() => handleClick('join')}
            >
                Joined
            </Button>
            <Button
                variant="primary"
                className={activeButton === 'drop' ? 'active-button' : ''}
                onClick={() => handleClick('drop')}
            >
                Drops
            </Button>
            <Button
                variant="primary"
                className={activeButton === 'hold' ? 'active-button' : ''}
                onClick={() => handleClick('hold')}
            >
                Shortlist On Hold
            </Button>
           
           
        </div>
  )
}

export default PostScheduleButtons