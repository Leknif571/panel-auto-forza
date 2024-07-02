import React, { useState } from 'react'
import { useAutha } from '../Connexion/context/authContext/context'
import { doSignOut } from '../../services/auth'



const Navbar = () => {
  const {userLoggedIn} = useAutha()
  return (
    <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light ml-4">
            <h1 className="navbar-brand ml-4">Forza</h1>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
               
                
                <a className="nav-item nav-link" href="/">Voiture</a>
                <a className="nav-item nav-link" href="/marque">Marque</a>
                {userLoggedIn ? <button className='btn btn-dark' onClick={doSignOut}>Déconnexion</button> : ''}
                
              
                </div>
            </div>
            </nav>
    </div>
  )
}

export default Navbar