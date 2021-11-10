import 'react-toastify/dist/ReactToastify.css' // Importando o CSS do Toastify
import { BrowserRouter } from 'react-router-dom' // Importando o BrowserRouter do react router dom
import AuthProvider from './contexts/auth' // Importando o context
import Routes from './routes'
import { ToastContainer } from 'react-toastify' // Importando o container do React Toastify

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer autoClose={4000} />
        <Routes/>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
