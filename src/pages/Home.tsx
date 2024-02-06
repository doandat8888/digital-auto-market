import { useEffect, useState } from 'react';
import userService from '../services/userService';
import PackageTypeList from '../components/PackageTypeList';
import _const from '../const';
import Banner from '../components/Banner';

const Home = () => {
    // //User info
    const [userRole, setUserRole] = useState<string>();

    useEffect(() => {
        getCurrentUser();
    }, [])

    const getCurrentUser = async () => {
        await userService.getCurrentUser().then(({ status, data }) => {
            if (status === 200) {
                setUserRole(data.role);
            }
        })
    }

    return (
        <div>
            <div className={`pt-[46px]`}>
                <Banner title='Welcome to marketplace' contentBtn='Get started'/>
                {_const.categoryFake.map((category, index) => (
                    <PackageTypeList key={index} type={category.name} label={category.textShow} userRole={userRole}/>
                ))}
            </div>
        </div>
    )
}

export default Home;