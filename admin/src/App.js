import logo from './logo.svg';
import './App.css';
import {Link, Route, Routes} from "react-router-dom";
import Login from "./Vues/Login";
import Encart from "./Vues/Encart";
import history from "./utils/history";
import Users from "./Vues/Users";
import Document from "./Vues/Document";

function App() {

  const connection = (evt) => {
    history.push('/login');
  }

  const document = (evt) => {
    history.push('/documents')
  }

  return (
      <>
        <div className="app">
          <nav className="navbar navbar-light bg-light">
            <ul className="nav">
              <li className="nav-item">
                <a onClick={connection}>Connexion</a>
              </li>
              <li className="nav-item">
                <a onClick={document}>Documents</a>
              </li>
            </ul>
            <Encart></Encart>
          </nav>
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login></Login>}></Route>
              <Route path="/users" element={<Users></Users>}></Route>
              <Route path="/documents" element={<Document></Document>}></Route>
            </Routes>
          </div>
        </div>
      </>
  );
}

export default App;
