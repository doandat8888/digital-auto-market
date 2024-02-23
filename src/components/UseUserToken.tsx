// Custom hook
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

function useUserToken() {
    const token = useSelector((state: RootState) => state.packages.value);
    return token;
}

export default useUserToken;