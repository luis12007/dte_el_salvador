import { toast } from 'react-toastify';
import { showNetworkError, isNetworkError } from './networkErrorHandler';

export const withConnectivityCheck = (asyncFunction, errorMessage = 'Error en la operación') => {
  return async (...args) => {
    if (!navigator.onLine) {
      toast.error('No tienes conexión a internet. Verifica tu conexión de red.');
      throw new Error('NO_CONNECTION');
    }

    try {
      return await asyncFunction(...args);
    } catch (error) {
      if (isNetworkError(error)) {
        showNetworkError(error);
      } else {
        throw error;
      }
    }
  };
};

export const checkInternetBeforeAction = async (action, actionName = 'operación') => {
  if (!navigator.onLine) {
    const message = `No tienes conexión a internet. Verifica tu conexión de red para ${actionName}.`;
    toast.error(message);
    return false;
  }

  try {
    await action();
    return true;
  } catch (error) {
    if (isNetworkError(error)) {
      showNetworkError(error, `Se perdió la conexión durante la ${actionName}`);
    } else {
      throw error;
    }
    return false;
  }
};
