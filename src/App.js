import Records from './components/records';
import login from './components/login';
import { Route, Routes } from 'react-router-dom';
import User from './components/user';
import notFound from './components/notFound';

function App() {
  return (
    <>
      <Routes>
        <Route path='/login' Component={login} />
        <Route path='/user/:id' Component={User} />
        <Route path='/user' Component={User} />
        <Route path='/' Component={Records} />
        <Route path='/*' Component={notFound} />
      </Routes>      
    </>    
  );
}

export default App;