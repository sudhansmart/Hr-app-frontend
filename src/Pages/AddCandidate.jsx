import React,{useState} from 'react'
import FormButtons from '../components/FormButtons'
import InfosysForm from '../components/InfosysForm';
import WiproForm1 from '../components/WiproForm1';
import AccentureForm from '../components/AccentureForm';
import CommonForm from '../components/CommonForm';
import InfosysTable from '../components/InfosysTable';
import AccentureTable from '../components/AccentureTable';
import '../styles/addCandidate.css'
import CommonTable from '../components/CommonTable';
import {ButtonGroup,Dropdown,DropdownButton} from 'react-bootstrap';
import WiproForm2 from '../components/WiproForm2';
import WiproTable1 from '../components/WiproTable1';
import WiproTable2 from '../components/WiproTable2';


function AddCandidate() { 
    const [form, setForm] = useState("common");
    const [wiproFormSelection, setWiproFormSelection,] = useState("form1");
    const [title, setTitle] = useState('Select Form');
    const handleSelect = (eventKey, event) => {
      setTitle(event.target.textContent);
      if (eventKey === "1") {
          setWiproFormSelection("form1");
      } else if (eventKey === "2") {
          setWiproFormSelection("form2");
      }
  };
    
  return (
    <div className='addcandidate-main container'>
        <FormButtons setForm={setForm} />
        <div className="formsection m-5">
            {form === "infosys" && <InfosysForm/>}
            {form === "wipro" && 
               <div className="wiprosection">
                       <DropdownButton
                          variant={"secondary"}
                          title={title}
                          onSelect={handleSelect}
          >
                 <Dropdown.Item eventKey="1">Form - I</Dropdown.Item>
                 <Dropdown.Item eventKey="2">Form - II</Dropdown.Item> 
            </DropdownButton>
                     {wiproFormSelection === "form1" && <WiproForm1/>}
                     {wiproFormSelection === "form2" && <WiproForm2/>}
                </div>}
            {form === "accenture" && <AccentureForm/>}
            {form === "common" && <CommonForm/>}
        </div>
        <div className="tablesection m-5">
                {form === "infosys" && <InfosysTable/>}
                {form === "accenture" && <AccentureTable/>}
                {form === "wipro" && 
                          <div>
                               {wiproFormSelection === "form1" && <WiproTable1/>}
                               {wiproFormSelection === "form2" && <WiproTable2/>}
                          </div>

                          }
                {form === "common" && <CommonTable/>}
        </div>
    </div>
  )
}

export default AddCandidate