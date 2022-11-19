import React from 'react';
import Swal from "sweetalert2"; 
import { Navigate } from 'react-router-dom';
import UserService from '../../services/UserService';
import './Login.scss';

class FluidInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      value: ""
    };
  }

  focusField() {
    const { focused } = this.state;
    this.setState({
      focused: !focused
    });
  }

  handleChange(event) {
    const { target } = event;
    const { value } = target;
    this.setState({
      value: value
    });
  }

  render() {
      
    const { type, label, style, id } = this.props;
    const { focused, value } = this.state;
      
    let inputClass = "fluid-input";
    if (focused) {
      inputClass += " fluid-input--focus";
    } else if (value !== "") {
      inputClass += " fluid-input--open";
    }
      
    return (
      <div className={inputClass} style={style}>
        <div className="fluid-input-holder">
            
          <input 
            className="fluid-input-input"
            type={type}
            id={id}
            onFocus={this.focusField.bind(this)}
            onBlur={this.focusField.bind(this)}
            onChange={this.handleChange.bind(this)}
            autoComplete={"false"}
          />
          <label className="fluid-input-label" htmlFor={id}>{label}</label>
            
        </div>
      </div>
    );
  }
}
  
class Button extends React.Component {
  render() {
        
    return (
      <div className={`button ${this.props.buttonClass}`} onClick={this.props.onClick}>
        {this.props.buttonText}
      </div>
    );
  }
}
  
class LoginContainer extends React.Component {
  constructor(props) {
    super(props)
      this.state = {
        isAuth: false
      }
  }

  componentDidMount(){
      localStorage.removeItem("authenticated");
      localStorage.removeItem("login");
      localStorage.removeItem("token");
  }

  onfinish(){

    if( document.getElementById('name').value === "" ||
      document.getElementById('password').value === "" )
      
      Swal.fire({  
        icon: 'warning',  
        title: 'Aviso!',  
        text: 'Usuário ou Senha Incorreto! Tente Novamente.'
      });

    else
    {

      UserService.getUser({
        "usuario": document.getElementById('name').value,
        "senha": document.getElementById('password').value
      }).then( (res) => {

          if(res.status === 200)
          {
            localStorage.setItem("authenticated", true);
            localStorage.setItem("login", res.data.usuario);
            localStorage.setItem("token", res.data.token);
            this.setState({isAuth: true});
          }
 
      }).catch( (err) => {

        Swal.fire({  
          icon: 'warning',  
          title: 'Aviso!',  
          text: 'Usuário ou Senha Incorreto! Tente Novamente.'
        });        
      });

    }

  }

  render() {
      
    const style = {
      margin: "15px 0"
    };

    if(this.state.isAuth)
      return <Navigate replace to="/orders" />;

    return (
      <div className="login-container">
        <div className="title">
          Login
        </div>
        <FluidInput type="text" label="Usuário" id="name" style={style} />
        <FluidInput type="password" label="Senha" id="password" style={style} />
        <Button buttonText="Entrar" buttonClass="login-button" onClick={() => {this.onfinish()}} />
      </div>
    );
  }
}

export default LoginContainer;