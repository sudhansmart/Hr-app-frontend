import React, { useEffect,useState } from 'react'
import '../styles/clientwisetracker.css'
import { Form,FloatingLabel,Button,Row,Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding,faClock,faLocationDot,faUserTie } from '@fortawesome/free-solid-svg-icons'
import { faClockFour } from '@fortawesome/free-regular-svg-icons'
import axios from 'axios'
import MultiStepProgressBar from './MultiStepProgressBar'
function ClientWiseTracker() {
    const[clientNames,setClientNames]=useState([]);
    const [candidateData,setCandidateData] =useState()
    const[positions,setPositions]=useState([]);
    const [selectClient ,setSelectClient] = useState("")
    const [ selectPosition ,setSelectPosition] = useState("");
    const [showResults ,setShowResults] = useState()

    const fetchData = async () => {
        try {
            const response = await axios.get('http://103.38.50.152/nodejs/candidate/candidatesdata');
            // const response = await axios.get('http://localhost:5000/candidate/candidatesdata');
            const data = response.data;
           
      
      
            // Flatten the nested data if necessary
            const flattenedData = data.map(candidate => ({
              ...candidate.common,
              ...candidate.infosys,
              ...candidate.jobDetails,
              ...candidate.wipro1,
              ...candidate.wipro2,
              ...candidate.accenture,
              ...candidate.other,
              _id: candidate._id, // Ensure _id is preserved
            }));     
            setCandidateData(flattenedData);
            const NameArray =   flattenedData.map(item => item.clientName);
            const ClientArray = [...new Set(NameArray)];
            console.log("actual array :",NameArray)
            console.log("SortedArray :",ClientArray)
            setClientNames(ClientArray)

          } catch (error) {
            console.error('Error in ClientWise Data Tracker fetching data:', error);
          }
    }
    useEffect(() => {
        fetchData();
      }, []);

      console
       const handleClientChange =(e)=>{
             setSelectPosition(" ")
             const selected = e.target.value
             setSelectClient(e.target.value);
           
             const positionFilter = candidateData.filter((item)=>(item.clientName ==  selected))
             const takeposition = positionFilter.map((item)=>(item.position ? item.position : item.role))
             const filterposition = [...new Set(takeposition)]
            //  console.log("client Name :",selected)
            //  console.log("actual array :",takeposition)
            //  console.log("SortedArray :",filterposition)
             setPositions(filterposition)
            
       }
      const handlePositionChange = (e)=>{
            setSelectPosition(e.target.value)   
      }
     
      const handleSubmit =(e)=>{
        e.preventDefault();
        const filterData = candidateData.filter(
          (item) =>
            item.clientName === selectClient && 
            (item.position ? item.position === selectPosition : item.role === selectPosition)
        );
        setShowResults(filterData)
            
      }
      function convertDateTime(isoDate) {
       
        const date = new Date(isoDate);
        
        // Extracting date components
        const day = String(date.getDate()).padStart(2, '0');
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
      
        // Extracting time components
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight
      
        return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
      }
      
  return (
    <div className='clientwisetracker-main'>
            <div className="clientsearchsec">
                   <Form className='w-100 d-flex justify-content-center align-items-center gap-4 '
                            onSubmit={handleSubmit} >
                   
                        <Col md={2}>
                        <FloatingLabel controlId="floatingSelect" label="Client Name">
                          <Form.Select aria-label="Floating label select example" 
                                value={selectClient} onChange={handleClientChange}>
                            <option>Please Select</option>
                            {clientNames.map((item, index) => (
                              <option key={index} value={item}>
                                {item.replace(/\b\w/g, c=>c.toUpperCase())}
                              </option>
                            ))}
                          </Form.Select>
                        </FloatingLabel>
                         </Col>
                         <Col md={3}>
                         <FloatingLabel controlId="floatingSelect" label="Positions">
                          <Form.Select aria-label="Floating label select example" 
                                value={selectPosition} onChange={handlePositionChange}>
                            <option>Please Select</option>
                            {positions.map((item, index) => (
                              <option key={index} value={item}>
                                {item.replace(/\b\w/g, c=>c.toUpperCase())}
                              </option>
                            ))}
                          </Form.Select>
                        </FloatingLabel>
                         </Col>
                         <Col md={2}>
                         <Button type='submit' variant="outline-success" className='getbtn w-75 '>Get Details</Button>
                         </Col>
                    </Form> 
            </div>

            <div className="clientwiseresult-sec">
            {showResults?.map((data,index) => (<div className="progresscard-cover" key={index}>
                <div className="progress-topsec p-4">
                   <div className="topsec-left">
                         <h3 className='progress-name'> {data.name}</h3>
                         <h5 className='progress-client'><FontAwesomeIcon icon={faBuilding}/>  {data.clientName}</h5>
                         <h5 className='progress-role'><FontAwesomeIcon icon={faUserTie} /> {data.position? data.position : data.role}</h5>
                         <h6 className='progress-location'> <FontAwesomeIcon icon={faLocationDot}/> {data.location}</h6>
                    </div>
                    <div className="topsec-right text-end">
                         <h3 className='progress-recruitername'>{data.recruiterName}</h3>
                         <h5 className='progress-client'><FontAwesomeIcon icon={faClockFour}/>  {data.lastUpdatedDate? convertDateTime(data.lastUpdatedDate) : "NA"}</h5>
                    </div>
                 </div>
                 <div className="progress">
                      <MultiStepProgressBar filteredData={[data]}/>
                 </div>

            </div>))}
            </div>
    </div>
  )
}

export default ClientWiseTracker