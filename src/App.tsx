import { BrowserRouter} from 'react-router-dom';
import RoutesApp from './configs/routes';
import './App.css';
import { Provider } from 'react-redux';
import store from './redux/store'; 
import Header from './components/Header';
import { useEffect } from 'react';

function App() {

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleBeforeUnload = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('namePackage');
    localStorage.removeItem('nameVersion');
  };

  return (
    <Provider store={store}>
        <BrowserRouter>
          <Header />
          <RoutesApp />
        </BrowserRouter>
    </Provider>
  )
}

export default App;
