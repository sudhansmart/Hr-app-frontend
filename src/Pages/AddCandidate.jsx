import React,{useState,useRef} from 'react'
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
import OtherForm from '../components/OtherForm';
import OtherTable from '../components/OtherTable';
import PersonalTracker from '../components/PersonalTracker';
import PersonalTrackerTable from '../components/PersonalTrackerTable';


function AddCandidate() { 
    const [form, setForm] = useState("personal");
    const [position,setPosition,] = useState('');
    const [wiproFormSelection, setWiproFormSelection,] = useState("form1");
    const [title, setTitle] = useState('Form - I');
    
    const tableRef = useRef(null);
    
    const handleSelect = (eventKey, event) => {
      setTitle(event.target.textContent);
      if (eventKey === "1") {
          setWiproFormSelection("form1");
      } else if (eventKey === "2") {
          setWiproFormSelection("form2");
      }
  };

  const handleFormSubmit = () => {
    // Call the table component's fetchData function after form submission
    if (tableRef.current) {
      tableRef.current.fetchData();
    }
  };
    
  return (
    <div className='addcandidate-main '>
        <FormButtons setForm={setForm} />
        <div className="formsection m-5">
            {form === "personal" && <PersonalTracker  onFormSubmit={handleFormSubmit}/>}
            {form === "infosys" && <InfosysForm onFormSubmit={handleFormSubmit}/>}
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
                     {wiproFormSelection === "form1" && <WiproForm1 onFormSubmit={handleFormSubmit}/>}
                     {wiproFormSelection === "form2" && <WiproForm2 onFormSubmit={handleFormSubmit}/>}
                </div>}
            {form === "accenture" && <AccentureForm onFormSubmit={handleFormSubmit}/>}
            {form === "common" && <CommonForm   onFormSubmit={handleFormSubmit} />}
            {form === "other" && <OtherForm setPosition={setPosition} onFormSubmit={handleFormSubmit}/> }
        </div>
        <div className="tablesection m-5">
                {form === "infosys" && <InfosysTable position={position} ref={tableRef} />}
                {form === "personal" && <PersonalTrackerTable position={position} ref={tableRef}/>}
                {form === "accenture" && <AccentureTable position={position} ref={tableRef}/>}
                {form === "wipro" && 
                          <div>
                               {wiproFormSelection === "form1" && <WiproTable1 position={position} ref={tableRef}/>}
                               {wiproFormSelection === "form2" && <WiproTable2 position={position} ref={tableRef}/>}
                          </div>

                          }
                {form === "common" && <CommonTable position={position} ref={tableRef}/>}
                {form === "other" && <OtherTable position={position} ref={tableRef}/>}
               
        </div>
    </div>
  )
}

export default AddCandidate