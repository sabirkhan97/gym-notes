import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
     import Login from './apps/Pages/Login/Login';
     import Signup from './components/Signup';
     import GymNotes from './components/GymNotes';
import All from './apps/All/All';

     function App() {
       return (
        //  <Router>
        //    <Routes>
        //      <Route path="/login" element={<Login />} />
        //      <Route path="/signup" element={<Signup />} />
        //      <Route path="/gym-notes" element={<GymNotes />} />
        //      <Route path="/" element={<Login />} />
        //    </Routes>
        //  </Router>
        
        <>
        <All/>
        </>
       );
     }

     export default App;