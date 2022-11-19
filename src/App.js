import React from 'react';
//Import react routes and its other modules
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
//All components
import OrdersHome from './Pages/Orders/OrdersHome';
import PageNotFound from './Pages/System/404-PageNotFound';
import LoginContainer from './Pages/Login/Login';
//bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props)
      this.state = {
        login: null
      }
  }

  componentDidMount(){
    this.setState({login: localStorage.getItem("login")});
  }

  render() {
    return (
      <Router>
      <div className='maincontainer'>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid justify-content-between">
            <ul className="navbar-nav flex-row d-none d-md-flex">
              <li className="nav-item me-3 me-lg-1">
                <a className="nav-link" href="/orders">
                  <span><i className="fa fa-truck fa-lg"></i>&nbsp;Ordem de Serviço</span>
                </a>
              </li>
            </ul>
            <div className="d-flex">
              <span className="navbar-brand mb-0 h1">FMBA</span>
            </div>
            <ul className="navbar-nav flex-row">
              <li className="nav-item me-3 me-lg-1">
                <a className="nav-link d-sm-flex align-items-sm-center">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/new/avatars/1.webp"
                    className="rounded-circle"
                    height="22"
                  />
                  <strong className="d-none d-sm-block ms-1">{this.state.login}</strong>
                </a>
              </li>
              <li className="nav-item me-3 me-lg-1">
                <a className="nav-link d-sm-flex align-items-sm-center" href="/login">
                <i className="fa fa-power-off fa-lg"></i>
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <Routes>
          <Route path="login" element={<LoginContainer />} />
          <Route path='' element={<OrdersHome />} />
          <Route path='orders' element={<OrdersHome />} />
          <Route path='*' element={<PageNotFound />}/>
        </Routes>
      </div>
      </Router>
    )
  };
}

export default App;