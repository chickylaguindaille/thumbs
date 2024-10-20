import axios from 'axios';

export const checkTokenValidity = (token) => async (dispatch) => {
  try {

    console.log("verification du token")
    const response = await axios.get('/api/auth/validate-token', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.status === 200) {
      return true; // Le token est valide
    }
  } catch (error) {
    console.error('Token validation failed', error);
    dispatch(logout()); // Déconnectez l'utilisateur si la validation échoue
    return false; // Le token est invalide
  }
};

// Vous pouvez également ajouter l'action logout pour réinitialiser l'état d'authentification
export const logout = () => {
  return {
    type: 'LOGOUT',
  };
};
