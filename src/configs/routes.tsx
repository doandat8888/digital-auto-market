import { Routes, Route, useLocation } from 'react-router';
import Home from '../pages/Home.tsx';
import MyPackage from '../pages/MyPackage.tsx';
import DetailPackage from '../pages/DetailPackage.tsx';
import AddPackage from '../pages/AddPackage.tsx';
import Login from '../pages/Login.tsx';
import Register from '../pages/Register.tsx';
import ManageVersion from '../pages/ManageVersion.tsx';
import UpdatePackage from '../pages/UpdatePackage.tsx';
import PackageType from '../pages/PackageType.tsx';
import { useEffect } from 'react';
import ForgotPassword from '../components/ForgotPassword.tsx';
import UserProfile from '../components/UserProfile.tsx';
import ManageAddPackage from '../pages/ManageAddPackage.tsx';
import PackageAdmin from '../pages/PackageAdmin.tsx';
import ManageAddVersion from '../pages/ManageAddVersion.tsx';
import ChangePassword from '../components/ChangePassword.tsx';


const RoutesApp = () => {

    const location = useLocation();
    useEffect(() => {
        localStorage.removeItem('name');
    }, [location.pathname]);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mypackage" element={<MyPackage />} />
            <Route path="/package/:id" element={<DetailPackage />} />
            <Route path="/package/:id/:version" element={<DetailPackage />} />
            <Route path='/addpackage' element={<AddPackage />}/>
            <Route path='/login' element={<Login />} />
            <Route path='/user-profile' element={<UserProfile />} />
            <Route path='/forgot-password' element={<ForgotPassword />}></Route>
            <Route path='/register' element={<Register />} />
            <Route path='/manageversion/:packageId' element={<ManageVersion />}/>
            <Route path='/updatepackage/:packageId' element={<UpdatePackage />}/>
            <Route path='/packagetype/:type' element={<PackageType />} />
            <Route path='/managepackage' element={<ManageAddPackage />}/>
            <Route path='/packageadmin' element={<PackageAdmin />}/>
            <Route path='/manageversion' element={<ManageAddVersion />}/>
            <Route path='/change-password' element={<ChangePassword />}/>
        </Routes>
    )
}

export default RoutesApp;