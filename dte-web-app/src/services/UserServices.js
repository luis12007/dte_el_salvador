const BASE_URL = "https://intuitive-bravery-production.up.railway.app";
//const BASE_URL = "http://localhost:3000";

/* with token */
const UserService = {
    /* /info/id(getuserinfo with id), update/id(update user info with id) */

    getUserInfo: async(id, token) => {
        try {
            const res = await fetch(`${BASE_URL}/emisor/info/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    },

    createUser: async(user, token) => {
        const res = await fetch(`${BASE_URL}/emisor/create`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        const data = await res.json();
        return data;
    },

    updateUser: async(user, token) => {
        const res = await fetch(`${BASE_URL}/emisor/update/${user.id_usuario}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        const data = await res.json();
        return data;
    },

    updatePassword: async(id, user, token) => {
        const res = await fetch(`${BASE_URL}/emisor/update/password/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        const data = await res.json();
        return data;
    },

    deleteUser: async(id, token) => {
        const res = await fetch(`${BASE_URL}/emisor/delete/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();
        return data;
    },

    id_enviopus1: async(id, token) => {
        const res = await fetch(`${BASE_URL}/emisor/update/enviopus1/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();
        return data;
    },
}


export default UserService;