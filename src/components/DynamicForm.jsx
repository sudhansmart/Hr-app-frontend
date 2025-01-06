import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Labels from './Labels';
import "../styles/dynamicForm.css"

function DynamicForm() {
  const [labelName, setLabelName] = useState('');
  const [position, setPosition] = useState('');
  const [clientName, setClientName] = useState('');
  const [labels, setLabels] = useState([]);

  const handleLabelChange = (e) => {
    setLabelName(e.target.value);
  };

  const handlePositionChange = (e) => {
    setPosition(e.target.value);
  };

  const handleClientNameChange = (e) => {
    setClientName(e.target.value);
  };

  const handleAddLabel = () => {
    if (labelName.trim() !== '') {
      setLabels([...labels, labelName]); // Add label to labels array
      setLabelName(''); // Clear the input field after adding the label
    }
  };

  const handleRemoveLabel = (index) => {
    // Remove the label at the given index
    const updatedLabels = labels.filter((_, i) => i !== index);
    setLabels(updatedLabels);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Post the labels, position, and clientName to the backend
      const response = await axios.post('http://103.38.50.152/nodejs/labels/addlabel', {
      // const response = await axios.post('http://localhost:5000/labels/addlabel', {
        clientName,
        labels,
        position
      });
      console.log(response);
      alert('Form submitted successfully!');
      setPosition('');
      setClientName('');
      setLabels([]);
    } catch (error) {
      console.log(error);
      alert('Failed to save data. Please try again.');
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit} className=' m-3 label-form' >
        <Row className="justify-content-md-center m-5" >
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formClientName">
              <Form.Label>Client Name</Form.Label>
              <Form.Control
                type="text"
                name="clientName"
                value={clientName}
                onChange={handleClientNameChange}
                placeholder="Enter client Name"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formPosition">
              <Form.Label>Position</Form.Label>
              <Form.Control
                type="text"
                name="position"
                value={position}
                onChange={handlePositionChange}
                placeholder="Enter Position Name"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3" controlId="formLabelName">
              <Form.Label>Label Name</Form.Label>
              <Form.Control
                type="text"
                name="labelName"
                value={labelName}
                onChange={handleLabelChange}
                placeholder="Enter label name"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-md-center m-5">
        <Col md={4} className="d-flex justify-content-center">
            {labels.length > 0 && (
              <Button variant="success" type="submit" className="ml-3">
                Submit
              </Button>
            )}
          </Col>
          <Col md={4} className="d-flex justify-content-center">
            <Button variant="primary" onClick={handleAddLabel} type="button">
              Add Label
            </Button>
          </Col>
         
        </Row>
      </Form>
      <div className='second-section'>
      <div className="second-left">
        {labels.length > 0 && <h4 className='text-center mb-4 text-primary'>Added Labels</h4>}
        <Row  className=" mb-2 gap-3">
        {labels.map((label, index) => (
         
            <Col className='d-flex justify-content-between gap-2 mb-3 border-bottom p-1' key={index} md={3} >
              <p className="mb-0">{label}</p>
          
              <Button variant="outline-danger" size="sm" onClick={() => handleRemoveLabel(index)}>
                X
              </Button>
            </Col>
         
        ))} </Row>
      </div>
      <Labels/>
      </div>
      <hr />
      <div className='form-preview'>
        {labels.length > 0 && (
          <h4 className='text-center text-success'>Form Preview</h4>
        )}
        <Form className='d-flex flex-wrap gap-0'>
          {labels.map((label, index) => (
            <Col md={2} key={index}>
              <Form.Group className="mb-4 p-3">
                <Form.Label>{label.replace(/\b\w/g, l => l.toUpperCase())}</Form.Label>
                <Form.Control 
                  type="text"
                  placeholder={`Enter ${label}`}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
              </Form.Group>
            </Col>
          ))}
        </Form>
      </div>
    </div>
  );
}

export default DynamicForm;
