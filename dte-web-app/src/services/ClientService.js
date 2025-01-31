const BASE_URL = "https://intuitive-bravery-production.up.railway.app";
// const BASE_URL = "http://localhost:3000";


const ClientAPI = {
    create: async(client, token) => {
        const res = await fetch(`${BASE_URL}/client/create`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(client)
        });
        const data = await res.json();
        return data;
    },

    /* /get/:id */
    get: async(id, token) => {
        try {

            const res = await fetch(`${BASE_URL}/client/get/${id}`, {
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

    put: async(client, id, token) => {
        const res = await fetch(`${BASE_URL}/client/put/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(client)
        });
        const data = await res.json();
        return data;
    },

    delete: async(id, token) => {
        const res = await fetch(`${BASE_URL}/client/delete/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();
        return data;
    },
}

export default ClientAPI;