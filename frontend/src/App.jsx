import { BrowserRouter as Router, Route, Routes } from 'react-router-dom' ;
import MainLayout from "./pages/ar/MainLayout";

import PrivateRouter from './components/PrivateRouter';
import Login from './pages/eng/Login';
import Signup from './pages/eng/Signup';

import Home from './pages/eng/Home';
import ARHome from './pages/ar/Home';
import ARUnits from './pages/ar/Units';

import ARDashboard from './pages/ar/Dashboard'



function App() {
  return (
    <Router>
      <Routes>

      {/* Public pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path= '/' element= {<Home />}/>
            <Route path= '/ar-home' element= {<ARHome />}/>


        

      {/* Main Layout */}
            <Route element={<MainLayout />}>

                <Route
                    path="/ar-dashboard"
                    element={<ARDashboard />}
                />

                <Route
                    path="/ar-units"
                    element={<ARUnits />}
                />

            </Route>

        
      </Routes>
     
    </Router>
  );
}

export default App ;



        // {/* Protected Routes with Layout */}
        // {/* <Route path="/" element={

        //   <ProtectedRoutes isAuth={isAuth}>
        //     <MainLayout />
        //   </ProtectedRoutes>
        // }>
        // </Route> */}
        {/* <Route path= '/' element= {<ProtectedRoutes><Home /></ProtectedRoutes>}/> */}

// import {useState, useEffect} from 'react' ;

// function App() {
//   const [message, setMessage] = useState('');
//   useEffect(() => {
//     fetch('http://127.0.0.1:8000/api')
//     .then(response => response.json())
//     .then(data => setMessage(data.message))
//     .catch(error => console.error('Error featching message:', error));
//   }, []);
  
//   return (
//     <div>
//        <h1 className='underline text-green-500'>Message from server</h1>
//        <p>{message || 'loading...'}</p>
//     </div>
//   );

// }
// export default App;