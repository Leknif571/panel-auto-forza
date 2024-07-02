import React, { useContext, useEffect, useState, createContext } from "react";
import { auth } from "../../../../services/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function useAutha() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // État d'erreur
  const navigate = useNavigate(); // Redirection

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user, error) => {
      if (error) {
        console.error("Error in onAuthStateChanged:", error);
        setError(error.message); // Définit l'état d'erreur
      } else if (user) {
        setCurrentUser({ ...user });
        setUserLoggedIn(true);
      } else {
        setCurrentUser(null);
        setUserLoggedIn(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userLoggedIn,
    loading,
    error, // Ajout de l'état d'erreur
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      {error && <p>Error: {error}</p>} 
    </AuthContext.Provider>
  )
}
