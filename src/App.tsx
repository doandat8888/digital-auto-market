import { BrowserRouter} from 'react-router-dom';
import RoutesApp from './configs/routes';
import './App.css';
import { Provider } from 'react-redux';
import store from './redux/store';
import Header from './components/Header';

function App() {

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
