import { Navigate } from 'react-router-dom';
// imports de react y content
const Private = ({children}) => {/* pedimos los props que nos vienen desde app.js */
    const token = localStorage.getItem('token');/* obtenemos el token del localstorage */
    if (!token) return <Navigate replace to="/login" />;
    return children;
}

export default Private;/* exportamos */