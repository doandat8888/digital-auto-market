import { useCallback, useEffect, useState } from 'react';
import PackageList from '../components/PackageList';
import LoadingDialog from '../components/LoadingDialog';
import packageService from '../services/packageService';
import NoPackage from '../components/NoPackage';

const Home = () => {

    const [packageList, setPackageList] = useState<IGetPackage[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    //User info
    const [user, setUser] = useState<IUser | null>();

    const getAllPackage = useCallback(async() => {
        let response = await packageService.getAllPackage();
        if(response && response.data && response.data.data.length > 0) {
            setPackageList(response.data.data);
        }
    }, []);

    useEffect(() => {
        getAllPackage();
    }, []);

    useEffect(() => {
        if(packageList.length > 0) {
            setIsLoading(false);
        }
    }, [packageList])

    const onCloseModal= () => {
        setIsLoading(false);
    }

    const filterPackageList = searchValue && packageList.length > 0 ? 
    packageList.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()) || item.authors[0]?.toLowerCase().includes(searchValue.toLowerCase())) : packageList;

    return (
        <div>
            {packageList && packageList.length > 0 ? <div className={`${isLoading === true ? 'hidden' : ''}`}>
            <LoadingDialog open={isLoading} closeModal={onCloseModal}/>
            <div className="body px-6 py-4">
                <div className="search flex justify-end mb-6">
                    <input className='text-[14px] rounded border px-3 py-2 lg:w-[30%] sm:w-[100%] w-[100%]' type="text" placeholder='Search info package (name, author,...)' onChange={(e) => setSearchValue(e.target.value)}/>
                </div>
                <PackageList packages={filterPackageList}/>
            </div>
        </div> : <NoPackage content="There is no packages in the system" />}
        </div>
        
    )
}

export default Home;