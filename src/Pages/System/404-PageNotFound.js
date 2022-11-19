import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './404-PageNotFound.css';
import error from '../../img/404-PageNotFound.png';
import { Navigate } from 'react-router-dom';

const PageNotFound = () => {

    if (!localStorage.getItem("authenticated"))
      return <Navigate replace to="/login" />;

    return (
        <div id="wrapper" className='text-center'>
            <img src={error} className='img-responsive' />
        </div >
    )
}

export default PageNotFound;