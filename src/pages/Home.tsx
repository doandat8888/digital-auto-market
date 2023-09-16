import { useEffect, useState } from 'react';
import Header from '../components/Header';
import PackageList from '../components/PackageList';
import _const from '../const';
import { useSelector } from "react-redux";
import { RootState } from '../redux/store';

const Home = () => {

    let [packageList, setPackageList] = useState<IPackage[]>([]);
    
    const packages = useSelector((state: RootState) => state.packages.value);
    console.log(packages);

    useEffect(() => {
        setPackageList(_const.packageListFake);
    })

    return (
        <div>
            <Header />
            <div className="body px-6 py-4">
                <div className="search flex justify-end mb-6">
                    <input className='text-[14px] rounded border px-3 py-2 lg:w-[30%] sm:w-[100%] w-[100%]' type="text" placeholder='Search info package (name, author,...)'/>
                </div>
                <PackageList packages={packageList}/>
            </div>
        </div>
    )
}

export default Home;