import { useEffect, useState } from 'react';
import PackageList from '../components/PackageList';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from '../redux/store';
import { removeAllPakage } from '../redux/package/packageSlice';
import LoadingDialog from '../components/LoadingDialog';

const Home = () => {

    const [packageList, setPackageList] = useState<IPackage[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");
    const dispatch = useDispatch();
    
    const packages = useSelector((state: RootState) => state.packages.value);

    const [isLoading, setIsLoading] = useState(true);
    

    //User info

    useEffect(() => {
        setPackageList(packages);
        if(packages) {
            setIsLoading(false);
        }
        
    }, []);

    const onRemoveAllPackage = () => {
        dispatch(removeAllPakage());
    }

    const onCloseModal= () => {
        setIsLoading(false);
    }

    const filterPackageList = searchValue && packageList.length > 0 ? 
    packageList.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()) || item.author?.toLowerCase().includes(searchValue.toLowerCase())) : packageList;

    return (
        <div className={`${isLoading === true ? 'hidden' : ''}`}>
            <button onClick={onRemoveAllPackage}>Remove all package</button>
            <LoadingDialog open={isLoading} closeModal={onCloseModal}/>
            <div className="body px-6 py-4">
                <div className="search flex justify-end mb-6">
                    <input className='text-[14px] rounded border px-3 py-2 lg:w-[30%] sm:w-[100%] w-[100%]' type="text" placeholder='Search info package (name, author,...)' onChange={(e) => setSearchValue(e.target.value)}/>
                </div>
                <button hidden onClick={onRemoveAllPackage}>Remove all package</button>
                <PackageList packages={filterPackageList}/>
            </div>
        </div>
    )
}

export default Home;