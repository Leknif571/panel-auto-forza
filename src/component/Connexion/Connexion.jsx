import React, { useState } from 'react'
import { doSignInWithEmailPass } from '../../services/auth'
import { useAutha } from './context/authContext/context'
import { Navigate } from 'react-router-dom'


const Connexion = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigninIn] = useState(false)
    let [error, setError] = useState('')
  
    const {userLoggedIn} = useAutha()
    
    const onSubmit = async (e) => {
        e.preventDefault()
        if(!isSigningIn){
            setIsSigninIn(true)
            try {
                await doSignInWithEmailPass(email, password);
                setIsSigninIn(true)
                
            }catch (e) {
                setIsSigninIn(false)
                setError(e)
              }
            
            
        }
    }
  
    return (
        
    <div className='container'>
        {userLoggedIn ? <Navigate to={'/'}/>: '' }
        <div className='container-sm'>
            <h1>Connexion</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Mot de passe</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)}/>
                </div>
                { error ?
                    <p className='text-danger'>
                        {error.code}
                    </p>
                    : ""
                }
                <button type="button" className="btn btn-success mt-4" onClick={onSubmit}>Se connecter</button>
   
            </form>

        </div>
        

    </div>
  )
}

export default Connexion