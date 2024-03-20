import { Routes, Route, useLocation } from 'react-router'
import Home from '../pages/Home.tsx'
import MyPackage from '../pages/MyPackage.tsx'
import DetailPackage from '../pages/DetailPackage.tsx'
import AddPackage from '../pages/AddPackage.tsx'
import Login from '../pages/Login.tsx'
import Register from '../pages/Register.tsx'
import ManageVersion from '../pages/ManageVersion.tsx'
import UpdatePackage from '../pages/UpdatePackage.tsx'
import PackageType from '../pages/PackageType.tsx'
import { useEffect } from 'react'
import ForgotPassword from '../components/ForgotPassword.tsx'
import UserProfile from '../components/UserProfile.tsx'
import ManageAddPackage from '../pages/ManageAddPackage.tsx'
import PackageAdmin from '../pages/PackageAdmin.tsx'
import ManageAddVersion from '../pages/ManageAddVersion.tsx'
import ChangePassword from '../components/ChangePassword.tsx'
import HackathonGenAI from '../pages/HackathonGenAI.tsx'
import MainLayout from '../layouts/MainLayout.tsx'
import PrivateLayout from '../layouts/PrivateLayout.tsx'
import HackathonSubmit from '../pages/HackathonSubmit.tsx'

const RoutesApp = () => {
    const location = useLocation()
    useEffect(() => {
        localStorage.removeItem('name')
    }, [location.pathname])

    return (
        <Routes>
            <Route
                path='/'
                element={<MainLayout />}
                children={
                    <>
                        <Route path='/' element={<Home />} />
                        <Route path='/package/:id' element={<DetailPackage />} />
                        <Route path='/package/:id/:version' element={<DetailPackage />} />
                        <Route path='/packagetype/:type' element={<PackageType />} />

                        <Route path='/hackathon' element={<HackathonGenAI />} />
                        <Route path='/hackathon/submit' element={<HackathonSubmit />} />

                        <Route
                            path='/'
                            element={<PrivateLayout />}
                            children={
                                <>
                                    <Route path='/packageadmin' element={<PackageAdmin />} />
                                    <Route path='/manageversion/:packageId' element={<ManageVersion />} />
                                    <Route path='/updatepackage/:packageId' element={<UpdatePackage />} />
                                    <Route path='/user-profile' element={<UserProfile />} />
                                    <Route path='/addpackage' element={<AddPackage />} />
                                    <Route path='/mypackage' element={<MyPackage />} />
                                    <Route path='/managepackage' element={<ManageAddPackage />} />
                                    <Route path='/manageversion' element={<ManageAddVersion />} />
                                    <Route path='/change-password' element={<ChangePassword />} />
                                </>
                            }
                        />
                    </>
                }
            />
            <Route path='/forgot-password' element={<ForgotPassword />}></Route>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
        </Routes>
    )
}

export default RoutesApp
