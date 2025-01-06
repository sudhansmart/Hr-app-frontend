import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Row, Col, ListGroup } from 'react-bootstrap';
import axios from 'axios';

function ManageCandidates() {
    const [candidates, setCandidates] = useState([]);
    const [feedBack, setFeedBack] = useState('');
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const fileInputRef = useRef(null); // Reference for the file input
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        cv: null, // For handling CV upload
    });
    const [adminLoggedIn, setAdminLoggedIn] = useState(localStorage.getItem('adminAuth') === 'true');

    const fetchData = async () => {
        try {
            // const response = await axios.get('http://localhost:5000/candidate/candidatesdata');
            const response = await axios.get('http://103.38.50.152/nodejs/candidate/candidatesdata');
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
            setCandidates(flattenedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (adminLoggedIn) {
            fetchData();
        }
    }, [adminLoggedIn]);

    // Handle search input change
    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        if (searchValue === '') {
            setFilteredCandidates([]);
            setSelectedCandidate(false);
           
        } else {
            const filtered = candidates.filter(candidate => 
                candidate.email.toLowerCase().includes(searchValue) || 
                candidate.mobileNo.includes(searchValue)
            );
            setFilteredCandidates(filtered);
            setFeedBack(filtered.length === 0 ? 'No candidates found' : '');
        }
    };

    // Handle candidate selection
    const handleCandidateClick = (candidate) => {
        setSelectedCandidate(candidate);
        setFormData({ ...candidate, cv: null }); // Set CV to null initially
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle file (CV) input change
    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            cv: e.target.files[0] // Store the file in the formData state
        });
    };

    // Handle form submission to update candidate data
    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedFormData = new FormData();

        // Append form data fields (excluding immutable fields)
        Object.keys(formData).forEach((key) => {
            // if (!['recruiterName', 'recruiterId', 'formId', '_id', 'formType','joinedStatus','offerStatus','interviewStatus','shortlistedDate','interviewdate','interviewFinalStatus'].includes(key)) {
                updatedFormData.append(key, formData[key]);
            // }
        });

        // Append the CV file if one is selected
        if (formData.cv) {
            updatedFormData.append('file', formData.cv);
        }

        try {
            const response = await axios.put(`http://103.38.50.152/nodejs/candidate/updateCandidate/${selectedCandidate._id}`, updatedFormData, {
            // const response = await axios.put(`http://localhost:5000/candidate/updateCandidate/${selectedCandidate._id}`, updatedFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if(response.status === 200){
            const updatedCandidate = response.data;

            // Update the candidates list with the updated candidate data
            setCandidates(candidates.map(candidate => 
                candidate._id === updatedCandidate._id ? updatedCandidate : candidate
            ));
            setSelectedCandidate(false);
            alert('Candidate updated successfully!');
            fetchData();
            
        }else{
            alert('Error updating candidate!.Please Try After Some Time');
        }
        } catch (error) {
            console.error('Error updating candidate:', error);
        }
    };

    return (
        <div className='managecandidates-main p-4'>
            <Row>
                <Col md={6}>
                    <Form.Control
                        type="search"
                        placeholder="Enter email / Phone"
                        className="mb-3"
                        onChange={handleSearch}
                    />
                    {feedBack && <p className='text-danger'>{feedBack}</p>}
                  {!selectedCandidate && <ListGroup className='mb-3'>
                        {filteredCandidates.map(candidate => (
                            <ListGroup.Item 
                                key={candidate._id} 
                                onClick={() => handleCandidateClick(candidate)}
                                style={{ cursor: 'pointer' }}
                            >
                                <p>{candidate.name} - {candidate.mobileNo} - {candidate.email} - {candidate.clientName ? candidate.clientName : candidate.formType}</p>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>}
                </Col>
                <hr />
                {selectedCandidate && (
                    <Form  className='d-flex flex-wrap gap-0'>
                        {Object.keys(formData).map(key => (
                            key !== 'uploadCV' && key !== 'cv' && key !== '_id' && key !== 'formId' && key !== 'createdDate' &&
                            key !== 'formType' && key !== 'recruiterName' && key !== 'recruiterId' && key !== 'joinedStatus' && key !== 'offerStatus' &&
                            key !== 'interviewFinalStatus' &&  key !== 'interviewdate' && key !== 'shortlistedDate' && key !== 'interviewStatus' && (
                                <Col md={3} key={key}>
                                    <Form.Group className="mb-4 p-3">
                                        <Form.Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name={key}
                                            value={formData[key]}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                            )
                        ))}
                        <Col md={3}>
                            <Form.Group className="mb-1 p-3">
                                <Form.Label>Upload CV</Form.Label>
                                <Form.Control 
                                    type="file"
                                    name="cv"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                            </Form.Group>
                            {formData.uploadCV  && <p className='text-success ps-4'>{formData.uploadCV}</p>
                    }
                        </Col>
                        <Col md={3} className='align-self-center text-center'>
                        <Button variant="primary" onClick={handleSubmit} type="submit">Update</Button>
                        </Col>
                    </Form>
                )}
            </Row>
        </div>
    );
}

export default ManageCandidates;
