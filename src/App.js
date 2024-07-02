import { Route, Routes } from 'react-router-dom';
import './App.css';
import VoiturePanel from './component/VoiturePanel';
import Marque from './component/Marque/Marque';
import Navbar from './component/Navbar/Navbar';
import ModalUpdateVoitures from './component/modal/VoitureUpdate';
import ModalMarqueUpdate from './component/modal/ModalMarqueUpdate';
import Connexion from './component/Connexion/Connexion';
import { useAutha } from './component/Connexion/context/authContext/context';





function App() {
  
  let {userLoggedIn} = useAutha()

  return (
    <div className="App">
        <Navbar/>
        <Routes>
          {
            userLoggedIn ?
            <>
              <Route path='/' element={<VoiturePanel/>}/>
              <Route path='marque' element={<Marque/>}/>
              <Route path='marqueupdate/:id' element={<ModalMarqueUpdate/>}/>
              <Route path='voiture-update/:id' element={<ModalUpdateVoitures/>}/>
            </>
            :
            <>
              <Route path='*' element={<Connexion/>}/>
              <Route path='/' element={<Connexion/>}/> 
            </>
          }

        

        </Routes>
    </div>
  );
}

export default App;
