import { useEffect, useState } from 'react';
import Header from '../components/Header';
import PackageList from '../components/PackageList';
import _const from '../const';
import { useSelector } from "react-redux";
import { RootState } from '../redux/store';

const Home = () => {

    let [packageList, setPackageList] = useState<IPackage[]>([]);
    let [searchValue, setSearchValue] = useState<string>("");
    
    const packages = useSelector((state: RootState) => state.packages.value);

    useEffect(() => {
        setPackageList(packages);
    }, []);

    const filterPackageList = searchValue && packageList.length > 0 ? 
    packageList.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()) || item.author.toLowerCase().includes(searchValue.toLowerCase())) : packageList;

    return (
        <div>
            <Header />
            <div className="body px-6 py-4">
                <div className="search flex justify-end mb-6">
                    <input className='text-[14px] rounded border px-3 py-2 lg:w-[30%] sm:w-[100%] w-[100%]' type="text" placeholder='Search info package (name, author,...)' onChange={(e) => setSearchValue(e.target.value)}/>
                </div>
                <PackageList packages={filterPackageList}/>
            </div>
        </div>
    )
}

export default Home;