import React,{useState} from 'react'
import { Modal, Button } from 'react-bootstrap'
import '../styles/interviewNote.css'
function InterviewNote({modalShow,setModalShow,data}) {

       const convertISODate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-GB'); // 'en-GB' locale gives 'DD-MM-YYYY' format
      };
  return (
    <Modal
      show={modalShow}
      onHide={() => setModalShow(false)}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
          
             <ul className='interview-notes'>
                 <li>Name : {data.name}</li>
                 <li>Recruiter Name : {data.recruiterName}</li>
                 <li>Email : {data.email}</li>
                 <li>Mobile No : {data.mobileNo}</li>
                 <li>Client Name : {data.clientName}</li>
                 <li>Designation : {data.position?data.position : data.role}</li>
                 <li>Location : {data.location}</li>
                 <li>Interview Date : {convertISODate(data.interviewdate)}</li>
                 <li>Interview Time : {data.interviewTime}</li>
                 <li>Current CTC : {data.currentCTC}</li>
                 <li>Expected CTC : {data.expectedCTC}</li>
                 <li>Notice Period : {data.noticePeriod == 0? "Immediate" : data.noticePeriod + " Days"}</li>
             </ul>
                
        
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setModalShow(false)}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default InterviewNote
