import { useCallback, useEffect, useState } from 'react'
import userService from '../services/userService'
import PackageTypeList from '../components/PackageTypeList'
import _const from '../const'
import Banner from '../components/Banner'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/token/userSlice'

const Home = () => {
    // //User info
    const [userRole, setUserRole] = useState<string>()
    const dispatch = useDispatch()

    const getCurrentUser = useCallback(async () => {
        try {
            const response = await userService.getCurrentUser()
            setUserRole(response.data.role)
            dispatch(setUser(response.data))
        } catch (error) {
            console.log('Get current user error:', error)
        }
    }, [])

    useEffect(() => {
        console.log('hello')
        getCurrentUser()
    }, [getCurrentUser])

    return (
        <div>
            <div className={`pt-[46px]`}>
                <Banner title='Welcome to marketplace' contentBtn='Get started' />
                {_const.categoryFake.map((category, index) => (
                    <PackageTypeList key={index} type={category.name} label={category.textShow} userRole={userRole} />
                ))}
            </div>
        </div>
    )
}

export default Home
