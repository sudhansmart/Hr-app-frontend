import React, { useState, useRef ,useEffect} from 'react';
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
function InfosysForm({ handleClose }) {
  
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
    candidateId: yup.string().required('Candidate ID is required'),
    name: yup.string().required('Name is required'),
    email: yup.string().required('Email is required'),
    phoneNumber: yup
      .string()
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
      .required('Mobile No is required'),
    role: yup.string().required('Role is required'),
    jobLevel: yup.string().required('Job Level is required'),
    location: yup.string().required('Current Location is required'),
    preferredlocation: yup.string().required('Preferred Location is required'),
    qualification: yup.string().required('Highest Education is required'),
    communicationRating: yup.string().required('Communication Rating is required'),
    currentCompany: yup.string().required('Current Company is required'),
    university: yup.string().required('University is required'),
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
    shift: yup.string().required('Please Select'),
    percentage: yup.string().required('Percentage is required'),
    dob: yup.date().required('DOB is required').nullable(),
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
        clientName: 'Infosys',
        role:   values.role,
        currentCompany:   values.currentCompany,
        overAllExp:   values.overAllExp,
        relevantExp:   values.relevantExp,
        currentCtc:   values.currentCtc,
        expectedCtc:    values.expectedCtc,
        noticePeriod:   values.noticePeriod, 
        remarks:       values.remarks,
        recruiterName: recruiterName,
        recruiterId:   recruiterId,
        file: fileInputRef.current.files[0],
        infosys: {
          candidateID: values.candidateId,
          jobLevel:     values.jobLevel,
          preferredLocation: values.preferredlocation,
          communicationRating : values.communicationRating,
          university:   values.university,
          shift24x7:        values.shift,
          percentage:   values.percentage,
          dob:          values.dob,
         

        }
      };
      
      // Append common data fields
      Object.entries(candidateData).forEach(([key, value]) => {
        if (typeof value === 'object' && key === 'infosys') {
          // If the value is an object (like infosys), map through it
          Object.entries(value).forEach(([subKey, subValue]) => {
            formData.append(`infosys[${subKey}]`, subValue);
          });
        } else {
          formData.append(key, value);
        }
      });
      
      formData.append('formType', 'infosys');
      formData.append('vendorName', 'SKYLARK HR SOLUTIONS');
     
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
      alert('Failed to save data. Please try again.');
    }
  };

  return (
    <Formik
      validationSchema={schema}
      onSubmit={(values, { resetForm }) => handleSubmit(values, { resetForm })}
      initialValues={{
        candidateId: '',
        name: '',
        email: '',
        phoneNumber: '',
        role: '',
        jobLevel: '',
        location: '',
        preferredlocation: '',
        qualification: '',
        communicationRating: '',
        currentCompany: '',
        university: '',
        overAllExp: '',
        relevantExp: '',
        currentCtc: '',
        expectedCtc: '',
        noticePeriod: '',
        shift: '',
        percentage: '',
        dob:'',
        remarks: '',
        file: null,
      }}
    >
      {({ handleSubmit, handleChange, values, touched, errors, setFieldValue, resetForm   }) => (
        <Form noValidate onSubmit={handleSubmit} className="applicant-form">
            <Row className="mb-3">
            <Form.Group as={Col} md="3" controlId="validationFormik01">
              <Form.Label>Candidate ID</Form.Label>
              <Form.Control
                type="number"
                name="candidateId"
                value={values.candidateId}
                onChange={handleChange}
                isValid={touched.candidateId && !errors.candidateId}
                isInvalid={touched.candidateId && !!errors.candidateId}
              />
              <Form.Control.Feedback type="invalid">
                {errors.candidateId}
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
            </Row>
             <Row className="mb-3">
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
              <Form.Label>Job Level</Form.Label>
              <Form.Control
                type="text"
                name="jobLevel"
                value={values.jobLevel}
                onChange={handleChange}
                isValid={touched.jobLevel && !errors.jobLevel}
                isInvalid={touched.jobLevel && !!errors.jobLevel}
              />
              <Form.Control.Feedback type="invalid">
                {errors.jobLevel}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="2" controlId="validationFormik07">
             <Form.Label>Years of Experience</Form.Label>
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
              <Form.Label>Current Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="City"
                name="location"
                value={values.location}
                onChange={handleChange}
                isValid={touched.location && !errors.location}
                isInvalid={touched.location && !!errors.location}
              />
              <Form.Control.Feedback type="invalid">
                {errors.location}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationFormik11">
              <Form.Label>Preferred Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="City"
                name="preferredlocation"
                value={values.preferredlocation}
                onChange={handleChange}
                isValid={touched.preferredlocation && !errors.preferredlocation}
                isInvalid={touched.preferredlocation && !!errors.preferredlocation}
              />
              <Form.Control.Feedback type="invalid">
                {errors.preferredlocation}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationFormik12">
              <Form.Label>Current Company</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
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
            <Form.Group as={Col} md="3" controlId="validationFormik13">
              <Form.Label>Communication Rating (1-5)</Form.Label>
              <Form.Control
                type="number"
                placeholder=""
                name="communicationRating"
                value={values.communicationRating}
                onChange={handleChange}
                isValid={touched.communicationRating && !errors.communicationRating}
                isInvalid={touched.communicationRating && !!errors.communicationRating}
              />
              <Form.Control.Feedback type="invalid">
                {errors.communicationRating}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
          <Form.Group as={Col} md="2" controlId="validationFormik14">
                   <Form.Label>24*7 Shift (Yes/ No)</Form.Label>
                   <Form.Select
                     value={values.shift || 'Please Select'} // Use the 'value' prop for default value
                     name='shift'
                     onChange={handleChange}
                     isValid={touched.shift && !errors.shift}
                     isInvalid={touched.shift && !!errors.shift}
                     aria-label="select Here"
                   >
                     <option value="" >Please Select</option>
                     <option value="Yes">Yes</option>
                     <option value="No">No</option>
                   </Form.Select>
                   <Form.Control.Feedback type="invalid">
                     {errors.shift}
                   </Form.Control.Feedback>
                 </Form.Group>
                 <Form.Group as={Col} md="2" controlId="validationFormik15">
             <Form.Label>Current CTC</Form.Label>
             <Form.Control
               type="text"
               placeholder=""
               name="currentCtc"
               value={values.currentCtc}
               onChange={handleChange}
               onBlur={(e) => {
                const { name, value } = e.target;
                handleChange({ target: { name, value: value.toUpperCase() } });
              }}
               isValid={touched.currentCtc && !errors.currentCtc}
               isInvalid={touched.currentCtc && !!errors.currentCtc}
             />
             <Form.Control.Feedback type="invalid">
               {errors.currentCtc}
             </Form.Control.Feedback>
           </Form.Group>
           <Form.Group as={Col} md="2" controlId="validationFormik16">
             <Form.Label>Expected CTC</Form.Label>
             <Form.Control
               type="text"
               placeholder=""
               name="expectedCtc"
               value={values.expectedCtc}
               onChange={handleChange}
               onBlur={(e) => {
                const { name, value } = e.target;
                handleChange({ target: { name, value: value.toUpperCase() } });
              }}
               isValid={touched.expectedCtc && !errors.expectedCtc}
               isInvalid={touched.expectedCtc && !!errors.expectedCtc}
             />
             <Form.Control.Feedback type="invalid">
               {errors.expectedCtc}
             </Form.Control.Feedback>
           </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationFormik17">
              <Form.Label>Highest Education	</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                name="qualification"
                value={values.qualification}
                onChange={handleChange}
                isValid={touched.qualification && !errors.qualification}
                isInvalid={touched.qualification && !!errors.qualification}
              />
              <Form.Control.Feedback type="invalid">
                {errors.qualification}
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
          </Row>
          <Row className="mb-3">
          <Form.Group controlId="validationFormik19" as={Col} md="2">
                     <Form.Label>DOB: DD-MM-YYYY</Form.Label><br/>
                        <Form.Control
                          as={DatePicker}
                          className="form-control"
                          selected={values.dob}
                          name="dob"
                          onChange={(date) =>
                            handleChange({
                              target: { name: 'dob', value: date },
                            })
                          }
                           dateFormat="dd-MM-yyyy"
                          isValid={touched.dob && !errors.dob}
                          isInvalid={touched.dob && !!errors.dob}
                          placeholder='DD-MM-YYYY'
                          required
                          autoComplete="off"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.dob}
                        </Form.Control.Feedback>
                      </Form.Group>

              <Form.Group as={Col} md="3" controlId="validationFormik20">
              <Form.Label>University</Form.Label>
              <Form.Control
                type="text"
                name="university"
                value={values.university}
                onChange={handleChange}
                isValid={touched.university && !errors.university}
                isInvalid={touched.university && !!errors.university}
              />
              <Form.Control.Feedback type="invalid">
                {errors.university}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="2" controlId="validationFormik21">
              <Form.Label>Percentage (%)</Form.Label>
              <Form.Control
                type="number"
                name="percentage"
                value={values.percentage}
                onChange={handleChange}
                isValid={touched.percentage && !errors.percentage}
                isInvalid={touched.percentage && !!errors.percentage}
              />
              <Form.Control.Feedback type="invalid">
                {errors.percentage}
              </Form.Control.Feedback>
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
                 <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Remarks</Form.Label>
        <Form.Control as="textarea"
         name="remarks"
         value={values.remarks}
         onChange={handleChange} rows={2} />
      </Form.Group>
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

export default InfosysForm;


