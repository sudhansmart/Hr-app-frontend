import React,{useState,useRef} from 'react'
import '../styles/dataExportSheet.css'
import FormButtons from './FormButtons'
import InfosysTable from '../components/InfosysTable';
import AccentureTable from '../components/AccentureTable';
import CommonTable from '../components/CommonTable';
import WiproTable1 from '../components/WiproTable1';
import WiproTable2 from '../components/WiproTable2';
import OtherTable from '../components/OtherTable';
import {ButtonGroup,Dropdown,DropdownButton} from 'react-bootstrap';
function DataExportSheet() {
    const [form, setForm] = useState("personal");
    const [position,setPosition,] = useState('');
    const [wiproFormSelection, setWiproFormSelection,] = useState("form1");
    const [title, setTitle] = useState('Select Form');
    const tableRef = useRef(null);
    const [exportOn,setExportOn]  = useState(true)
 
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
    <div className='dataExportSheet-main'>
              <FormButtons setForm={setForm} exportOn={exportOn}/>
              <div className="tablesection m-5">
                {form === "infosys" && <InfosysTable position={position} ref={tableRef} />}
                {form === "accenture" && <AccentureTable position={position} ref={tableRef} exportOn={exportOn}/>}
                {form === "wipro" && 
                          <div>
                                 <DropdownButton
                                      variant={"secondary"}
                                      title={title}
                                      onSelect={handleSelect}
                                  >
                                      <Dropdown.Item eventKey="1">Form - I</Dropdown.Item>
                                      <Dropdown.Item eventKey="2">Form - II</Dropdown.Item> 
                                   </DropdownButton>
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

export default DataExportSheet