import { BrowserRouter} from 'react-router-dom';
import RoutesApp from './configs/routes';
import './App.css';
import { Provider } from 'react-redux';
import store from './redux/store';

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <RoutesApp />
      </BrowserRouter>
    </Provider>
  )
}

export default App;
