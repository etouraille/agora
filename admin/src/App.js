import logo from './logo.svg';
import './App.css';
import {Link, Route, Routes} from "react-router-dom";
import Login from "./Vues/Login";
import Encart from "./Vues/Encart";
import history from "./utils/history";
import Users from "./Vues/Users";

function App() {

  const connection = (evt) => {
    history.push('/login');
  }

  return (
      <>
        <div className="app">
          <nav className="navbar navbar-light bg-light">
            <ul className="nav">
              <li className="nav-item">
                <a onClick={connection}>Connexion</a>
              </li>
            </ul>
            <Encart></Encart>
          </nav>
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login></Login>}></Route>
              <Route path="/users" element={<Users></Users>}></Route>
            </Routes>
          </div>
        </div>
      </>
  );
}

export default App;
