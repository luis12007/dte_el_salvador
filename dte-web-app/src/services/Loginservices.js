//const BASE_URL = "https://cleaning-system-app-production.up.railway.app";
const BASE_URL = "http://localhost:3000";


const LoginAPI = {
    login: async (user) => {

        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        const data = await res.json();
        return data;
    }
}

export default LoginAPI;