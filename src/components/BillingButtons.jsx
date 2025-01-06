import React, { useState } from 'react';
import '../styles/billingbuttons.css';

function BillingButtons({setTable}) {
  // State to track the active button
  const [activeIndex, setActiveIndex] = useState(0);

  const handleButtonClick = (index) => {
    setActiveIndex(index);
    setTable(index)
    
  };

  return (
    <ul className="billingbutton-main">
      {['Yet to Raise', 'Raised', 'Received', 'Drops'].map((label, index) => (
        <li
          key={index}
          className={`billingbtns ${activeIndex === index ? 'active' : ''}`}
          onClick={() => handleButtonClick(index)}
        >
          {label}
        </li>
      ))}
    </ul>
  );
}

export default BillingButtons;
