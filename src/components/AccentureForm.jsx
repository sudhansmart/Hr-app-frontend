import React, { useState, useRef,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { decodeToken } from '../utils/decodeToken';

function AccentureForm() {
  const fileInputRef = useRef(null);
  const [recruiterName, setRecruiterName] = useState('');

  const [recruiterId, setRecruiterId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
     
      const decodedToken = decodeToken(token);
          if (decodedToken && decodedToken.name) {
            setRecruiterName(decodedToken.name);
            setRecruiterId(decodedToken.userId)
          }
    }
  }, [])

  const schema = yup.object().shape({



  cl: yup.string().required('CL is required'),
  cid: yup.string().required('CID is required'),
  name: yup.string().required('Name is required'),
  gender: yup.string().required('Gender is required'),
  email: yup.string().required('Email is required'),
  phoneNumber: yup
    .string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .required('Mobile No is required'),
  role: yup.string().required('Role is required'),
  currentCompany: yup.string().required('Current Company is required'),
  location: yup.string().required('Current Location is required'),
  overAllExp: yup
      .string()
      .matches(/^\d+$/, 'Overall experience must be a number')
      .required('Overall Experience is required'),
    relevantExp: yup
      .string()
      .matches(/^\d+$/, 'Relevant experience must be a number')
      .required('Relevant Experience is required'),
  currentCtc: yup.string().required('Current CTC is required'),
  expectedCtc: yup.string().required('Expected CTC is required'),
  noticePeriod: yup.string().required('Notice Period is required'), 
  primarySkill: yup.string().required('primarySkill  is required'),
  fatherName: yup.string().required('Father Name is required'),
  address: yup.string().required('Address  is required'),
  city: yup.string().required('City is required'),
  pincode: yup.string().required('Pincode is  required'),  
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();

      // Define the data object with common fields and Infosys-specific fields
      const candidateData = {
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        location:   values.location,
        qualification: values.qualification,
        clientName: 'Accenture',
        currentCompany:   values.currentCompany,
        overAllExp:   values.overAllExp,
        relevantExp:   values.relevantExp,
        currentCtc:   values.currentCtc,
        expectedCtc:    values.expectedCtc,
        noticePeriod:   values.noticePeriod, 
        recruiterName: recruiterName,
        recruiterId: recruiterId,
        file: fileInputRef.current.files[0],
        accenture: {
          cl: values.cl,
          cid: values.cid,
          gender: values.gender,
          role:   values.role,
          primarySkill:   values.primarySkill,
          fatherName:   values.fatherName,
          city:   values.city,
          address:   values.address,
          pincode:   values.pincode,
          sourceNameVendor:'SKYLARK HR SOLUTIONS',
         }

        }
      
      
      // Append common data fields
      Object.entries(candidateData).forEach(([key, value]) => {
        if (typeof value === 'object' && key === 'accenture') {
          // If the value is an object (like infosys), map through it
          Object.entries(value).forEach(([subKey, subValue]) => {
            formData.append(`accenture[${subKey}]`, subValue);
          });
        } else {
          formData.append(key, value);
        }
      });
      
      formData.append('formType', 'accenture');
     
     
      console.log('Form Data:', Object.fromEntries(formData));
      const response = await axios.post('http://localhost:5000/candidate/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if(response.status === 200){
        alert('Your data has been saved successfully!');
         resetForm();
         fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('App.Form API Error:', error);
    }
  };

  return (
    <Formik
      validationSchema={schema}
      onSubmit={(values, { resetForm }) => handleSubmit(values, { resetForm })}
      initialValues={{
        cl: '',
        cid: '',
        name: '',
        gender:'',
        phoneNumber: '',
        email: '',
        role: '',
        currentCompany: '',
        location: '',
        overAllExp: '',
        relevantExp: '',
        currentCtc: '',
        expectedCtc: '',
        noticePeriod: '',
        primarySkill: '',
        fatherName: '',
        address : '',
        city: '',
        pincode: '',
        file: null,
      }}
    >
      {({ handleSubmit, handleChange, values, touched, errors, setFieldValue, resetForm   }) => (
        <Form noValidate onSubmit={handleSubmit} className="applicant-form">
            <Row className="mb-3">
            <Form.Group as={Col} md="3" controlId="validationFormik01">
              <Form.Label>CL</Form.Label>
              <Form.Control
                type="text"
                name="cl"
                value={values.cl}
                onChange={handleChange}
                isValid={touched.cl && !errors.cl}
                isInvalid={touched.cl && !!errors.cl}
              />
              <Form.Control.Feedback type="invalid">
                {errors.cl}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationFormik01">
              <Form.Label>CID</Form.Label>
              <Form.Control
                type="number"
                name="cid"
                value={values.cid}
                onChange={handleChange}
                isValid={touched.cid && !errors.cid}
                isInvalid={touched.cid && !!errors.cid}
              />
              <Form.Control.Feedback type="invalid">
                {errors.cid}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationFormik02">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                isValid={touched.name && !errors.name}
                isInvalid={touched.name && !!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="2" controlId="validationFormik14">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  value={values.gender || 'Please Select'} // Use the 'value' prop for default value
                  name='gender'
                  onChange={handleChange}
                  isValid={touched.gender && !errors.gender}
                  isInvalid={touched.gender && !!errors.gender}
                  aria-label="select Here"
                >
                  <option value="" >Please Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.gender}
                </Form.Control.Feedback>
              </Form.Group>
           
            </Row>
             <Row className="mb-3">
             <Form.Group as={Col} md="3" controlId="validationFormik03">
              <Form.Label>Mobile No</Form.Label>
              <Form.Control
                type="number"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange}
                isValid={touched.phoneNumber && !errors.phoneNumber}
                isInvalid={touched.phoneNumber && !!errors.phoneNumber}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phoneNumber}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationFormik04">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                isValid={touched.email && !errors.email}
                isInvalid={touched.email && !!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
             <Form.Group as={Col} md="3" controlId="validationFormik05">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                name="role"
                value={values.role}
                onChange={handleChange}
                isValid={touched.role && !errors.role}
                isInvalid={touched.role && !!errors.role}
              />
              <Form.Control.Feedback type="invalid">
                {errors.role}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationFormik06">
              <Form.Label>Current Company</Form.Label>
              <Form.Control
                type="text"
                name="currentCompany"
                value={values.currentCompany}
                onChange={handleChange}
                isValid={touched.currentCompany && !errors.currentCompany}
                isInvalid={touched.currentCompany && !!errors.currentCompany}
              />
              <Form.Control.Feedback type="invalid">
                {errors.currentCompany}
              </Form.Control.Feedback>
            </Form.Group>
           
             </Row>
          <Row className="mb-3">
          <Form.Group as={Col} md="2" controlId="validationFormik07">
             <Form.Label>Current Location</Form.Label>
             <Form.Control
               type="text"
               placeholder=""
               name="location"
               value={values.location}
               onChange={handleChange}
               onBlur={(e) => {
                const { name, value } = e.target;
                handleChange({ target: { name, value: value.toUpperCase() } });
              }}
               isValid={touched.location && !errors.location}
               isInvalid={touched.location && !!errors.location}
             /> 
             <Form.Control.Feedback type="invalid">
               {errors.location}
             </Form.Control.Feedback>
           </Form.Group>
           <Form.Group as={Col} md="2" controlId="validationFormik08">
             <Form.Label>Total Experience</Form.Label>
             <Form.Control
               type="text"
               placeholder=""
               name="overAllExp"
               value={values.overAllExp}
               onChange={handleChange}
               onBlur={(e) => {
                const { name, value } = e.target;
                handleChange({ target: { name, value: value.toUpperCase() } });
              }}
               isValid={touched.overAllExp && !errors.overAllExp}
               isInvalid={touched.overAllExp && !!errors.overAllExp}
             />
             <Form.Control.Feedback type="invalid">
               {errors.overAllExp}
             </Form.Control.Feedback>
           </Form.Group>
           <Form.Group as={Col} md="2" controlId="validationFormik08">
             <Form.Label>Relevant Experience</Form.Label>
             <Form.Control
               type="text"
               placeholder=""
               name="relevantExp"
               value={values.relevantExp}
               onChange={handleChange}
               onBlur={(e) => {
                const { name, value } = e.target;
                handleChange({ target: { name, value: value.toUpperCase() } });
              }}
               isValid={touched.relevantExp && !errors.relevantExp}
               isInvalid={touched.relevantExp && !!errors.relevantExp}
             />
             <Form.Control.Feedback type="invalid">
               {errors.relevantExp}
             </Form.Control.Feedback>
           </Form.Group>
           <Form.Group as={Col} md="2" controlId="validationFormik09">
             <Form.Label>Current CTC</Form.Label>
             <Form.Control
               type="text"
               placeholder=""
               name="currentCtc"
               value={values.currentCtc}
              onChange={handleChange}
               isValid={touched.currentCtc && !errors.currentCtc}
               isInvalid={touched.currentCtc && !!errors.currentCtc}
             />
             <Form.Control.Feedback type="invalid">
               {errors.currentCtc}
             </Form.Control.Feedback>
           </Form.Group>
           <Form.Group as={Col} md="2" controlId="validationFormik09">
             <Form.Label>Expected CTC</Form.Label>
             <Form.Control
               type="text"
               placeholder=""
               name="expectedCtc"
               value={values.expectedCtc}
              onChange={handleChange}
               isValid={touched.expectedCtc && !errors.expectedCtc}
               isInvalid={touched.expectedCtc && !!errors.expectedCtc}
             />
             <Form.Control.Feedback type="invalid">
               {errors.expectedCtc}
             </Form.Control.Feedback>
           </Form.Group>
           <Form.Group as={Col} md="2" controlId="validationFormik09">
             <Form.Label>Notice Period</Form.Label>
             <Form.Control
               type="text"
               placeholder=""
               name="noticePeriod"
               value={values.noticePeriod}
              onChange={handleChange}
               isValid={touched.noticePeriod && !errors.noticePeriod}
               isInvalid={touched.noticePeriod && !!errors.noticePeriod}
             />
             <Form.Control.Feedback type="invalid">
               {errors.noticePeriod}
             </Form.Control.Feedback>
           </Form.Group>
         
          
          </Row>
         
            <Row className="mb-3">
            <Form.Group as={Col} md="3" controlId="validationFormik10">
              <Form.Label>PrimarySkill</Form.Label>
              <Form.Control
                type="text"
                placeholder="One Primary Skill"
                name="primarySkill"
                value={values.primarySkill}
                onChange={handleChange}
                isValid={touched.primarySkill  && !errors.primarySkill }
                isInvalid={touched.primarySkill  && !!errors.primarySkill  }
              />
              <Form.Control.Feedback type="invalid">
                {errors.primarySkill  }
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationFormik12">
              <Form.Label>Father Name</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                name="fatherName"
                value={values.fatherName}
                onChange={handleChange}
                isValid={touched.fatherName && !errors.fatherName}
                isInvalid={touched.fatherName && !!errors.fatherName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fatherName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="2" controlId="validationFormik13">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                name="city"
                value={values.city}
                onChange={handleChange}
                isValid={touched.city && !errors.city}
                isInvalid={touched.city && !!errors.city}
              />
              <Form.Control.Feedback type="invalid">
                {errors.city}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="validationFormik15">
             <Form.Label>Address</Form.Label>
             <Form.Control
               type="text"
               placeholder=""
               name="address"
               value={values.address}
               onChange={handleChange}
               onBlur={(e) => {
                const { name, value } = e.target;
                handleChange({ target: { name, value: value.toUpperCase() } });
              }}
               isValid={touched.address && !errors.address}
               isInvalid={touched.address && !!errors.address}
             />
             <Form.Control.Feedback type="invalid">
               {errors.address}
             </Form.Control.Feedback>
           </Form.Group>
            </Row>
            <Row className="mb-3">
          <Form.Group as={Col} md="2" controlId="validationFormik16">
             <Form.Label>Pincode</Form.Label>
             <Form.Control
               type="number"
               placeholder=""
               name="pincode"
               value={values.pincode}
               onChange={handleChange}
               onBlur={(e) => {
                const { name, value } = e.target;
                handleChange({ target: { name, value: value.toUpperCase() } });
              }}
               isValid={touched.pincode && !errors.pincode}
               isInvalid={touched.pincode && !!errors.pincode}
             />
             <Form.Control.Feedback type="invalid">
               {errors.pincode}
             </Form.Control.Feedback>
           </Form.Group>
          
           
          <Form.Group as={Col} md="3" controlId="validationFormik18">
              <Form.Label>Source Name / Vendor	</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                name="vendorName"
                value="SKYLARK HR SOLUTIONS"
                disabled
              />
            </Form.Group>
            <Form.Group controlId="formFile" as={Col} md="3" className="mb-3">
            <Form.Label>Upload CV</Form.Label>
              <Form.Control type="file" 
              onChange={(e) => setFieldValue('file', e.target.files[0])}
              accept=".pdf, .doc, .docx" 
              ref={fileInputRef}/>
      </Form.Group>
          </Row>
         
        
         
          <Row>
                 {/* <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Remarks</Form.Label>
        <Form.Control as="textarea"
         name="remarks"
         value={values.remarks}
         onChange={handleChange} rows={2} />
      </Form.Group> */}
          </Row>
          <Row>
            <div className="d-flex" style={{ justifyContent: 'space-evenly' }}>
              <Button variant="secondary" onClick={() => {
                                   resetForm();
                               fileInputRef.current.value = '';}} >Reset All</Button>
              <Button type="submit">Submit</Button>
            </div>
          </Row>
        </Form>
      )}
    </Formik>
  );
}

export default AccentureForm;


