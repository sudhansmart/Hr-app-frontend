import React,{useState,useEffect} from 'react'
import { Navbar, Nav, Container, NavDropdown ,Button,Modal} from 'react-bootstrap'
import logo from '../assets/images/logo-main.png'
import { Link } from 'react-router-dom';
import '../styles/superNavbar.css'
import { useNavigate } from 'react-router-dom';
import { decodeToken } from '../utils/decodeToken';

function SuperNavBar({setSuperAdminLoggedIn}) {

  const navigate = useNavigate();
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [username, setUsername] = useState('');


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUserLoggedIn(true);
      const decodedToken = decodeToken(token);
          if (decodedToken && decodedToken.name) {
              setUsername(decodedToken.name);
          }
    }
  }, [])
   
  const handleLogout = () => {
    localStorage.clear();
    setUserLoggedIn(false);
    setSuperAdminLoggedIn(false);
    navigate('/');
  }
  return (
    <Navbar collapseOnSelect expand="lg" className="super-navbar">
    <Container className='super-nav'>
      <Navbar.Brand href="#home">
             <img src={logo} alt="Skylark-logo" className="skylark-logo" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end" >
            
        <Nav > 
          <Nav.Link as={Link} to="/superadmindashboard">Home</Nav.Link>
          <Nav.Link  as={Link} to="/billing">Billing</Nav.Link>
          <Nav.Link  as={Link} to="/clientwisedata">Client-wise Profiles</Nav.Link>
          
          {userLoggedIn &&
          <NavDropdown title={username}id="collasible-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
          </NavDropdown> 
            
           }

        </Nav>
      </Navbar.Collapse>
    </Container>
  
   
  </Navbar>
  )
}

export default SuperNavBar