import React from 'react'
import { Routes, Route } from 'react-router';
import Home from '../pages/Home.tsx';
import MyPackage from '../pages/MyPackage.tsx';


const RoutesApp = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mypackage" element={<MyPackage />} />
        </Routes>
    )
}

export default RoutesApp;