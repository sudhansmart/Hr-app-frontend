import React,{useState} from 'react'
import "../styles/loginForm.css"
import { FloatingLabel, Form } from 'react-bootstrap'
import { TfiArrowCircleRight } from "react-icons/tfi";
import { decodeToken } from '../utils/decodeToken';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function LoginForm({setAuthToken}) {
  const navigate = useNavigate();
    const [data, setData] = useState({
        userId: "",
        password: ""
    })

    const [error, setError] = useState("")

    const handleChange = (e) => {
      setError("")
        const { name, value } = e.target    
        setData({
            ...data,
            [name]: value
        })
    }

    const handleLogin = async (e) => {
        e.preventDefault()
       try {
         
         const response =  await axios.post("http://localhost:5000/login/userin", data)
         if(response.status === 200){
           setError(response.data.message);
           localStorage.setItem("token", response.data.token);
         
           setAuthToken(response.data.token);
           setData({
            userId: "",
            password: ""
        })  

           setTimeout(() => {
              const decodedToken = decodeToken(response.data.token);
             if (decodedToken && decodedToken.role === "admin") {
              localStorage.setItem("adminAuth", true);
              navigate('/admindashboard')
             }else if(decodedToken && decodedToken.role === "recruiter"){
              localStorage.setItem("recruiterAuth", true);
              navigate('/recruiterdashboard')
             }
            }, 500)
           
         }
         console.log("login response", response)
        
       } catch (error) {
          console.log("error at login", error.message)
          setError(error.response.data.message)
       }
    }
  return (
    <div className='loginform-main container'>
     <Form onSubmit={handleLogin}>
      <FloatingLabel 
        controlId="floatingInput"
        label="User ID"
        className="mb-4 custom-floating-label"
      >
        <Form.Control  type="text"
         className='custom-floating-input'
           name='userId' 
           onChange={handleChange} 
           value={data.userId} 
           placeholder="name@example.com" />
      </FloatingLabel>
      <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3 custom-floating-label">
        <Form.Control type="password"
          className='custom-floating-input'
           name='password'
           onChange={handleChange} 
           value={data.password}
           autoComplete="on"
            placeholder="Password" />
      </FloatingLabel>
          {error && <p className='mt-3'>{error}</p>}
        <button type='submit' className='loginbtn  w-100 '><TfiArrowCircleRight  /></button>
      </Form>
    </div>
  )
}

export default LoginForm