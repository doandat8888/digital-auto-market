import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { IUser } from '../interfaces/IUser'
import { Outlet } from 'react-router'

const PrivateLayout = () => {
    const user = useSelector<RootState>((state) => state.user.user) as IUser | undefined
    if (!user) {
        return null
    }
    return <Outlet />
}

export default PrivateLayout
