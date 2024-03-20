import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet } from 'react-router'
import userService from '../services/userService'
import { setUser } from '../redux/token/userSlice'

const MainLayout = () => {
    const dispatch = useDispatch()

    const getCurrentUser = useCallback(async () => {
        try {
            const response = await userService.getCurrentUser()
            dispatch(setUser(response.data))
        } catch (error) {
            console.log('Get current user error:', error)
        }
    }, [])

    useEffect(() => {
        console.log('hello')
        getCurrentUser()
    }, [getCurrentUser])

    return <Outlet />
}

export default MainLayout
