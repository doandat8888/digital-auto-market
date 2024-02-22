import { useCallback, useEffect, useState } from 'react';
import PackageList from './PackageList';
import packageService from '../services/packageService';
import { Link } from 'react-router-dom';
import LoadingDialog from './LoadingDialog';

interface IProps {
    userRole: string | undefined,
    type: string | undefined,
    label: string | undefined
}

const limit = 4;

const PackageTypeList = ({ type, userRole, label }: IProps) => {

    const [packageList, setPackageList] = useState<IGetPackage[]>();

    const getPackageByCategory = useCallback(async () => {
        await packageService.getPackageByCategoryNotPaginate(limit, type ? type : '').then(({ data }) => {
            if (data && data.data && data.data.length > 0) {
                setPackageList(data.data);
            }else {
                setPackageList([]);
            }
        })
    }, []);

    useEffect(() => {
        getPackageByCategory();
    }, [getPackageByCategory])

    return (
        <div>
            <div className='py-4 xl:px-40 lg:px-20 sm:px-10 px-5'>
                <div className="flex px-4 justify-between">
                    <p className='text-black font-bold text-xl'>{packageList && packageList?.length > 0 ? label : ''}</p>
                    <Link className={`text-[#165fd2] font-bold ${packageList ? packageList.length < limit ? 'hidden' : '' : 'hidden'}`} to={`/packagetype/${type}`}>See more</Link>
                </div>
                <div className="body">
                    
                    {packageList ? 
                        <PackageList userRole={userRole} showMode={false} packages={packageList} />
                        :  <LoadingDialog open={packageList && packageList.length > 0 ? false : true}/>
                    }
                    
                </div>
            </div>
        </div>

    )
}

export default PackageTypeList