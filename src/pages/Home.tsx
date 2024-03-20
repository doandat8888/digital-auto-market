import PackageTypeList from '../components/PackageTypeList'
import _const from '../const'
import Banner from '../components/Banner'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { IUser } from '../interfaces/IUser'

const Home = () => {
    // //User info
    const user = useSelector<RootState>((state) => state.user.user) as IUser | undefined

    return (
        <div>
            <div className={`pt-[46px]`}>
                <Banner title='Welcome to marketplace' contentBtn='Get started' />
                {_const.categoryFake.map((category, index) => (
                    <PackageTypeList key={index} type={category.name} label={category.textShow} userRole={user?.role} />
                ))}
            </div>
        </div>
    )
}

export default Home
