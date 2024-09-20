import React,{useState,useRef,useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Formik} from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { decodeToken } from '../utils/decodeToken';



function WiproForm1() {
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
    name: yup.string().required('Name is required'),
    jobCode: yup.string().required('Job Code is required'),
    resumeId: yup.string().required('ResumeId is required'),
    skill: yup.string().required('skill is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: yup
      .string()
      .matches(/^\d{10}$/, 'Phone number must be 10 digits')
      .required('Mobile No is required'),
      overAllExp: yup
      .string()
      .matches(/^\d+$/, 'Overall experience must be a number')
      .required('Overall Experience is required'),
    relevantExp: yup
      .string()
      .matches(/^\d+$/, 'Relevant experience must be a number')
      .required('Relevant Experience is required'),
    location : yup.string().required('Location is required'),
    preferredLocation : yup.string().required('Preferred Location is required'),
    noticePeriod : yup.string().required('Notice Period is required'),
    currentCompany : yup.string().required('Current Company is required'),
    role : yup.string().required('Role is required'),
    qualification : yup.string().required('Highest Education is required'),
    currentCtc : yup.string().required('Current CTC is required'),
    expectedCtc : yup.string().required('Expected CTC is required'),
    remarks : yup.string().required('Remarks is required'),
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
        clientName: 'wipro1',
        role:   values.role,
        currentCompany:   values.currentCompany,
        currentCtc:   values.currentCtc,
        expectedCtc:    values.expectedCtc,
        noticePeriod:   values.noticePeriod, 
        remarks:       values.remarks,
        recruiterName: recruiterName,
        recruiterId: recruiterId,
        file: fileInputRef.current.files[0],
        wipro1: {
          jobCode: values.jobCode,
           resumeId: values.resumeId,
           skill:   values.skill,
           totalExp:  values.overAllExp,
           relevantExp:   values.relevantExp,
           preferredLocation:   values.preferredLocation,
           payrollOrg:   values.payrollOrg,


        }
      };
      
      // Append common data fields
      Object.entries(candidateData).forEach(([key, value]) => {
        if (typeof value === 'object' && key === 'wipro1') {
          // If the value is an object (like infosys), map through it
          Object.entries(value).forEach(([subKey, subValue]) => {
            formData.append(`wipro1[${subKey}]`, subValue);
          });
        } else {
          formData.append(key, value);
        }
      });
      
      formData.append('formType', 'wipro1');
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
    }
  };
  
 
 

  return (
    <>
   
    <Formik
      validationSchema={schema}
      onSubmit={(values, { resetForm }) => handleSubmit(values, { resetForm })}
      initialValues={{
        name: '',
        jobCode : '',
        resumeId: '',
        skill: '',
        email: '',
        phoneNumber: '',
        overAllExp : '',
        relevantExp:'',
        location: '',
        preferredLocation: '',
        noticePeriod:'',
        currentCompany:'',
        payrollOrg: '',
        role:'',
        qualification:'',
        currentCtc:'',
        expectedCtc:'',
        remarks:'',
        file: null,
      }}
    >
      {({ handleSubmit, handleChange, values, touched, errors,setFieldValue, resetForm  }) => (
        <Form noValidate onSubmit={handleSubmit} className="applicant-form p-4">
          <Row className="mb-3">
            <Form.Group as={Col} md="3" controlId="validationFormik01">
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
            <Form.Group as={Col} md="3" controlId="validationFormik02">
              <Form.Label>Job Code</Form.Label>
              <Form.Control
                type="text"
                name="jobCode"
                value={values.jobCode}
                onChange={handleChange}
                isValid={touched.jobCode && !errors.jobCode}
                isInvalid={touched.jobCode && !!errors.jobCode}
              />
              <Form.Control.Feedback type="invalid">
                {errors.jobCode}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationFormik03">
              <Form.Label>Resume Id</Form.Label>
              <Form.Control
                type="text"
                name="resumeId"
                value={values.resumeId}
                onChange={handleChange}
                isValid={touched.resumeId && !errors.resumeId}
                isInvalid={touched.resumeId && !!errors.resumeId}
              />
              <Form.Control.Feedback type="invalid">
                {errors.resumeId}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationFormik04">
              <Form.Label>Skill</Form.Label>
              <Form.Control
                type="text"
                placeholder="Add Skill"
                name="skill"
                value={values.skill}
                onChange={handleChange}
                isValid={touched.skill && !errors.skill}
                isInvalid={touched.skill && !!errors.skill}
              />
              <Form.Control.Feedback type="invalid">
                {errors.skill}
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
              <Form.Label>Total Exp</Form.Label>
              <Form.Control
                type="number"
                placeholder="years"
                name="overAllExp"
                value={values.overAllExp}
                onChange={handleChange}
                isValid={touched.overAllExp && !errors.overAllExp}
                isInvalid={touched.overAllExp && !!errors.overAllExp}
              />
              <Form.Control.Feedback type="invalid">
                {errors.overAllExp}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="validationFormik06">
              <Form.Label>Relevant Exp</Form.Label>
              <Form.Control
                type="number"
                placeholder=""
                name="relevantExp"
                value={values.relevantExp}
                onChange={handleChange}
                isValid={touched.relevantExp && !errors.relevantExp}
                isInvalid={touched.relevantExp && !!errors.relevantExp}
              />
              <Form.Control.Feedback type="invalid">
                {errors.relevantExp}
              </Form.Control.Feedback>
            </Form.Group>
        
          </Row>
          <Row className="mb-3">
          <Form.Group as={Col} md="3" controlId="validationFormik07">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
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
            <Form.Group as={Col} md="3" controlId="validationFormik08">
              <Form.Label>Preferred Location</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                name="preferredLocation"
                value={values.preferredLocation}
                onChange={handleChange}
                isValid={touched.preferredLocation && !errors.preferredLocation}
                isInvalid={touched.preferredLocation && !!errors.preferredLocation}
              />
              <Form.Control.Feedback type="invalid">
                {errors.preferredLocation}
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
               onBlur={(e) => {
                const { name, value } = e.target;
                handleChange({ target: { name, value: value.toUpperCase() } });
              }}
               isValid={touched.noticePeriod && !errors.noticePeriod}
               isInvalid={touched.noticePeriod && !!errors.noticePeriod}
             /> 
             <Form.Control.Feedback type="invalid">
               {errors.noticePeriod}
             </Form.Control.Feedback>
           </Form.Group>
           <Form.Group as={Col} md="2" controlId="validationFormik10">
             <Form.Label> Current Company</Form.Label>
             <Form.Control
               type="text"
               placeholder=""
               name="currentCompany"
               value={values.currentCompany}
               onChange={handleChange}
               onBlur={(e) => {
                const { name, value } = e.target;
                handleChange({ target: { name, value: value.toUpperCase() } });
              }}
               isValid={touched.currentCompany && !errors.currentCompany}
               isInvalid={touched.currentCompany && !!errors.currentCompany}
             />
             <Form.Control.Feedback type="invalid">
               {errors.currentCompany}
             </Form.Control.Feedback>
           </Form.Group>
           <Form.Group as={Col} md="2" controlId="validationFormik11">
             <Form.Label>PayrollOrg (if any)</Form.Label>
             <Form.Control
               type="text"
               placeholder=""
               name="payrollOrg"
               value={values.payrollOrg}
               onChange={handleChange}
               onBlur={(e) => {
                const { name, value } = e.target;
                handleChange({ target: { name, value: value.toUpperCase() } });
              }}
               isValid={touched.payrollOrg && !errors.payrollOrg}
               isInvalid={touched.payrollOrg && !!errors.payrollOrg}
             />
             <Form.Control.Feedback type="invalid">
               {errors.payrollOrg}
             </Form.Control.Feedback>
           </Form.Group>
           </Row>
           <Row className="mb-3">
           <Form.Group as={Col} md="2" controlId="validationFormik11">
             <Form.Label>Position/Role</Form.Label>
             <Form.Control
               type="text"
               placeholder=""
               name="role"
               value={values.role}
               onChange={handleChange}
               onBlur={(e) => {
                const { name, value } = e.target;
                handleChange({ target: { name, value: value.toUpperCase() } });
              }}
               isValid={touched.role && !errors.role}
               isInvalid={touched.role && !!errors.role}
             />
             <Form.Control.Feedback type="invalid">
               {errors.role}
             </Form.Control.Feedback>
           </Form.Group>
           <Form.Group as={Col} md="2" controlId="validationFormik11">
             <Form.Label>Qualification</Form.Label>
             <Form.Control
               type="text"
               placeholder=""
               name="qualification"
               value={values.qualification}
               onChange={handleChange}
               onBlur={(e) => {
                const { name, value } = e.target;
                handleChange({ target: { name, value: value.toUpperCase() } });
              }}
               isValid={touched.qualification && !errors.qualification}
               isInvalid={touched.qualification && !!errors.qualification}
             />
             <Form.Control.Feedback type="invalid">
               {errors.qualification}
             </Form.Control.Feedback>
           </Form.Group>
           <Form.Group as={Col} md="2" controlId="validationFormik12">
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
           <Form.Group as={Col} md="2" controlId="validationFormik12">
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
           <Form.Group controlId="formFile" as={Col} md="4" className="mb-3">
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
         <div className='d-flex' style={{justifyContent:'space-evenly'}}>
           <Button variant="secondary" onClick={() => {
                                   resetForm();
                               fileInputRef.current.value = '';}} 
                 >Reset All</Button>
           <Button type="submit">Submit</Button>
          </div>
        </Form>
      )}
     
    </Formik>
   
    </>
  );
}

export default WiproForm1;
