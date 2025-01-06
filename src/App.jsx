import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { decodeToken } from './utils/decodeToken';
import AddCandidate from './Pages/AddCandidate';
import PreSchedule from './Pages/PreSchedule';
import PostSchedule from './Pages/PostSchedule';
import AdminNavbar from './components/AdminNavbar';
import NavBar from './components/NavBar';
import ManageCandidates from './Pages/ManageCandidates';
import ManageRecruiters from './Pages/ManageRecruiters';
import MainPage from './Pages/MainPage';
import RecruiterDashBoard from './Pages/RecruiterDashBoard';
import AdminDashBoard from './Pages/AdminDashBoard';
import DynamicForm from './components/DynamicForm';
import FindCandidates from './components/FindCandidates';
import DataExportSheet from './components/DataExportSheet';
import SuperAdminDashBoard from './Pages/SuperAdminDashBoard';
import SuperNavBar from './components/SuperNavBar';
import Billing from './Pages/Billing';
import CandidateProgressCards from './components/CandidateProgressCards';
import ClientWiseTracker from './components/ClientWiseTracker';
import ClientMaster from './components/ClientMaster';


// import PyramidChart from './components/PyramidChart';

function App() {
  const [adminLoggedIn, setAdminLoggedIn] = useState(localStorage.getItem('adminAuth') === 'true');
  const [recruiterLoggedIn, setRecruiterLoggedIn] = useState(localStorage.getItem('recruiterAuth') === 'true');
  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [superAdminLoggedIn, setSuperAdminLoggedIn] = useState(localStorage.getItem('superadminAuth') === 'true');

  return (
    <Router>
      <AppContent 
        adminLoggedIn={adminLoggedIn}
        superAdminLoggedIn={superAdminLoggedIn}
        setSuperAdminLoggedIn={setSuperAdminLoggedIn}
        setAdminLoggedIn={setAdminLoggedIn}
        recruiterLoggedIn={recruiterLoggedIn}
        setRecruiterLoggedIn={setRecruiterLoggedIn}
        authToken={authToken}
        setAuthToken={setAuthToken}
      />
    </Router>
  );
}

function AppContent({ adminLoggedIn, setAdminLoggedIn, recruiterLoggedIn, setRecruiterLoggedIn, authToken, setAuthToken ,superAdminLoggedIn, setSuperAdminLoggedIn}) {
  const navigate = useNavigate();
  const location = useLocation(); // To track the current path

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken) {
        if (decodedToken.role === 'admin') {
          setAdminLoggedIn(true);
        } else if (decodedToken.role === 'recruiter') {
          setRecruiterLoggedIn(true);
        } else if (decodedToken.role === 'superadmin') {
          setSuperAdminLoggedIn(true);
        }
      }
    }
  }, [authToken, setAdminLoggedIn, setRecruiterLoggedIn]);

  // Avoid automatic redirects when the user is already on a valid page
  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/recruiterdashboard' || location.pathname === '/admindashboard' || location.pathname === '/superadmindashboard') {
      if (recruiterLoggedIn) {
        navigate('/recruiterdashboard');
      } else if (adminLoggedIn) {
        navigate('/admindashboard');
      }else if(superAdminLoggedIn){
        navigate('/superadmindashboard');
      } else {
        navigate('/');
      }
    }
  }, [recruiterLoggedIn, adminLoggedIn,superAdminLoggedIn, location.pathname, navigate]);

  return (
    <>
      {adminLoggedIn && <AdminNavbar setAdminLoggedIn={setAdminLoggedIn} />}
      {recruiterLoggedIn && <NavBar setRecruiterLoggedIn={setRecruiterLoggedIn} />}
      {superAdminLoggedIn && <SuperNavBar setSuperAdminLoggedIn={setSuperAdminLoggedIn}/>}
      <Routes>
        <Route path='/' element={<MainPage setAuthToken={setAuthToken} />} />
        <Route
          path='/recruiterdashboard'
          element={recruiterLoggedIn ? <RecruiterDashBoard /> : <Navigate to='/' />}
        />
        <Route
          path='/admindashboard'
          element={adminLoggedIn ? <AdminDashBoard /> : <Navigate to='/' />}
        />
        <Route 
            path='/superadmindashboard'
            element ={superAdminLoggedIn ? <SuperAdminDashBoard/> : <Navigate to='/' />}
        />
        <Route
          path='/addcandidate'
          element={recruiterLoggedIn ? <AddCandidate /> : <Navigate to='/' />}
        />
        <Route
          path='/preschedule'
          element={authToken ? <PreSchedule /> : <Navigate to='/' />}
        />
        <Route
          path='/postschedule'
          element={authToken ? <PostSchedule /> : <Navigate to='/' />}
        />
        <Route
          path='/managecandidate'
          element={adminLoggedIn ? <ManageCandidates /> : <Navigate to='/' />}
        />
        <Route
          path='/managerecruiters'
          element={adminLoggedIn ? <ManageRecruiters /> : <Navigate to='/' />}
        />
        <Route
           path='/settracker'  
           element={adminLoggedIn ? <DynamicForm/> : <Navigate to='/' />}
        />
        <Route  path='/exportdata'
                element = {adminLoggedIn || recruiterLoggedIn ?<DataExportSheet/>: <Navigate to='/' />}
                />
        <Route  path='/trackcandidate'    
                element={adminLoggedIn ?<CandidateProgressCards/> : <Navigate to='/' />}   />
        <Route path='/billing'
                 element={superAdminLoggedIn?<Billing/> : <Navigate to='/' />}  />
        <Route path='/findcandidates'
               element={adminLoggedIn || recruiterLoggedIn ?<FindCandidates/> : <Navigate to='/' />}   />      
         <Route path='/clientwisedata'
                   element ={adminLoggedIn || superAdminLoggedIn ?<ClientWiseTracker/> : <Navigate to='/' />} />
          
         <Route path='/clientmaster'  element = {adminLoggedIn ?<ClientMaster/> : <Navigate to='/' />} />

      </Routes>
      
    </>
  );
}

export default App;
