import { useEffect, useState } from 'react';
import { validateToken, clearSessionAndRedirect } from '../utils/tokenValidator';

/**
 * Hook que valida el token al montar el componente
 * Redirige a login si el token es inválido
 */
const useTokenValidation = () => {
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validate = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('user_id');

      // Si no hay token, redirigir
      if (!token || !userId) {
        clearSessionAndRedirect('Debes iniciar sesión para acceder a esta página.');
        setIsValid(false);
        setIsValidating(false);
        return;
      }

      // Validar token
      const isTokenValid = await validateToken(token);

      if (!isTokenValid) {
        clearSessionAndRedirect('Tu sesión ha expirado. Credenciales inválidas. Por favor, inicia sesión nuevamente.');
        setIsValid(false);
      } else {
        setIsValid(true);
      }

      setIsValidating(false);
    };

    validate();
  }, []);

  return {
    isValidating,
    isValid,
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('user_id'),
  };
};

export default useTokenValidation;
