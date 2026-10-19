const BASE_URL = "https://intuitive-bravery-production.up.railway.app";
//const BASE_URL = "http://localhost:3000";

const checkConnection = () => {
    if (!navigator.onLine) {
        const error = new Error('Sin conexión a internet');
        error.code = 'NO_CONNECTION';
        throw error;
    }
};

const LoginAPI = {
    login: async(user) => {
        try {
            checkConnection();
            const res = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            const data = await res.json();
            return data;
        } catch (error) {
            if (error.code === 'NO_CONNECTION') {
                throw error;
            }
            if (!navigator.onLine) {
                const connError = new Error('Se perdió la conexión a internet');
                connError.code = 'CONNECTION_LOST';
                throw connError;
            }
            console.error('Error during login:', error);
            throw error;
        }
    },

    loginMinis: async(user, pass, type) => {
        try {
            checkConnection();
            // Construct the URL-encoded data
            const body = new URLSearchParams({
                user: user,
                pwd: pass,
            });

            // Send the POST request
            const res = await fetch(`https://apitest.dtes.mh.gob.sv/seguridad/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'MysoftDTE'
                },
                body: body.toString() // Convert the URLSearchParams to a string
            });

            if (!res.ok) {
                throw new Error(`Request failed with status ${res.status}`);
            }

            const data = await res.json(); // Parse the JSON response
            return data; // Return the parsed response
        } catch (error) {
            if (error.code === 'NO_CONNECTION') {
                throw error;
            }
            if (!navigator.onLine) {
                const connError = new Error('Se perdió la conexión a internet');
                connError.code = 'CONNECTION_LOST';
                throw connError;
            }
            console.error('Error during login:', error);
            throw error; // Rethrow for further error handling by the caller
        }
    },
    loginMinis_prod: async(user, pass, type) => {
        try {
            checkConnection();
            // Construct the URL-encoded data
            const body = new URLSearchParams({
                user: user,
                pwd: pass,
            });

            // Send the POST request
            const res = await fetch(`https://api.dtes.mh.gob.sv/seguridad/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': 'MysoftDTE'
                },
                body: body.toString() // Convert the URLSearchParams to a string
            });

            if (!res.ok) {
                throw new Error(`Request failed with status ${res.status}`);
            }

            const data = await res.json(); // Parse the JSON response
            return data; // Return the parsed response
        } catch (error) {
            if (error.code === 'NO_CONNECTION') {
                throw error;
            }
            if (!navigator.onLine) {
                const connError = new Error('Se perdió la conexión a internet');
                connError.code = 'CONNECTION_LOST';
                throw connError;
            }
            console.error('Error during login:', error);
            throw error; // Rethrow for further error handling by the caller
        }
    }

}


export default LoginAPI;