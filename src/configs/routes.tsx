import { Routes, Route } from 'react-router';
import Home from '../pages/Home.tsx';
import MyPackage from '../pages/MyPackage.tsx';
import DetailPackage from '../pages/DetailPackage.tsx';
import AddPackage from '../pages/AddPackage.tsx';


const RoutesApp = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mypackage" element={<MyPackage />} />
            <Route path="/package/:id" element={<DetailPackage />} />
            <Route path='/addpackage' element={<AddPackage />}/>
        </Routes>
    )
}

export default RoutesApp;