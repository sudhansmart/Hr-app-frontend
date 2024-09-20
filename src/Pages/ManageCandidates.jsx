import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, ListGroup, Container } from 'react-bootstrap';
import axios from 'axios';

function ManageCandidates() {
    const [candidates, setCandidates] = useState([]);
  const [feedBack, setFeedBack] = useState('');
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
    // Add more fields as necessary
  });
  const [adminLoggedIn, setAdminLoggedIn] = useState(localStorage.getItem('adminAuth') === 'true');


  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/candidate/candidatesdata');
      const data = response.data;

      // Flatten the nested data if necessary
      const flattenedData = data.map(candidate => ({
        ...candidate.common,
        ...candidate.infosys,
        ...candidate.jobDetails,
        ...candidate.wipro1,
        ...candidate.wipro2,
        ...candidate.accenture,
        _id: candidate._id, // Ensure _id is preserved
      }));
      setCandidates(flattenedData);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  console.log("fetched :",candidates)
  
  useEffect(() => {
    if(adminLoggedIn){
      fetchData();
    }
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    
    if (searchValue === '') {
      // If the search input is empty, clear the filteredCandidates
      setFilteredCandidates([]);
    } else {
      const filtered = candidates.filter(candidate => 
        candidate.email.toLowerCase().includes(searchValue) || 
        candidate.mobileNo.includes(searchValue)
      );
      console.log("filtered :",filtered)
      setFilteredCandidates(filtered);
     
      if(filtered.length == 0){
        setFeedBack('No candidates found');  
      }if(filtered.length > 0){
        setFeedBack('');
      }
     
    }
    
    
    
  };
  

  // Handle candidate selection
  const handleCandidateClick = (candidate) => {
    setSelectedCandidate(candidate);
    setFormData(candidate); 
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission to update candidate data
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/candidates/${selectedCandidate.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(updatedCandidate => {
      // Update the candidates list with the updated candidate data
      setCandidates(candidates.map(candidate => 
        candidate.id === updatedCandidate.id ? updatedCandidate : candidate
      ));
      setSelectedCandidate(updatedCandidate);
    });
  };

  return (
    <div className='managecandidates-main  p-4'>
      <Row>
        <Col md={6}>
          <Form.Control
            type="search"
            placeholder="Enter email / Phone"
            className="mb-3"
            onChange={handleSearch}
          />
           {feedBack && <p className='text-danger'>{feedBack}</p>}
          <ListGroup className='mb-3' >
            {filteredCandidates.map(candidate => (
              <ListGroup.Item 
                key={candidate._id} 
                onClick={() => handleCandidateClick(candidate)}
                style={{ cursor: 'pointer' }}
              >
              <p>{candidate.name} - {candidate.mobileNo} - {candidate.email}-{candidate.clientName? candidate.clientName : candidate.formType}</p>
              
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <hr />
       
          {selectedCandidate && (
          
            <Form onSubmit={handleSubmit} className='d-flex flex-wrap gap-0'>
              {Object.keys(formData).map((key) => (
               
                <Col md={4}>
                <Form.Group className="mb-4 p-3" key={key}>
                  <Form.Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Form.Label>
                  <Form.Control 
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleInputChange}
                   
                  />
                </Form.Group>
                </Col>
               
              ))}
              <Button variant="primary" type="submit">Update</Button>
            </Form>
           
          )}
       
      </Row>
    </div>
  );
}

export default ManageCandidates;
