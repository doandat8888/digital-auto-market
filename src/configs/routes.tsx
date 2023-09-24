import { Routes, Route } from 'react-router';
import Home from '../pages/Home.tsx';
import MyPackage from '../pages/MyPackage.tsx';
import DetailPackage from '../pages/DetailPackage.tsx';
import AddPackage from '../pages/AddPackage.tsx';
import Login from '../pages/Login.tsx';
import Register from '../pages/Register.tsx';
import ManageVersion from '../pages/ManageVersion.tsx';


const RoutesApp = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mypackage" element={<MyPackage />} />
            <Route path="/package/:id" element={<DetailPackage />} />
            <Route path='/addpackage' element={<AddPackage />}/>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/manageversion' element={<ManageVersion />}/>
            <Route path='/updatepackage/:packageId' element={<AddPackage />}/>
        </Routes>
    )
}

export default RoutesApp;