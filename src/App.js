import {Routes, Route} from 'react-router-dom'
import Login from "./PAGES/Login/Login";
import Signin from './PAGES/Signin/Signin';
import Dashboard from './PAGES/Dashboard/dashboard';
import DashAdmin from './PAGES/Dashboard_Admin/Dash_Admin';
import Form from './COMPONENTS/input';
import Error from './COMPONENTS/error';
import Google from './PAGES/Login/Google';

function App() {
  return (
    <div className="App">

      
      
        <Routes>
          <Route path='/' element={<Google/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/signin' element={<Signin />}/>
          <Route path='/dashboard/:username/:userid' element={<Dashboard />}/>
          <Route path='/dashboard/:username/:userid' element={<Dashboard />}/>
          <Route path='/dashboard/BookVehicle/:username/:userid' element={<Form />}/>
          <Route path='/dashboard/admin/:username' element={<DashAdmin />} />
          <Route path='*' element={<Error />} />
        </Routes>
      
   
  
    </div>
  );
}

export default App;
