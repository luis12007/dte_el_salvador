const BASE_URL = "https://intuitive-bravery-production.up.railway.app";
//const BASE_URL = "http://localhost:3000";

/* with token */
const ItemsAPI = {
    /* create, get/id, put/id, delete/id */
    create: async(item, token) => {
        const res = await fetch(`${BASE_URL}/items/create`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });
        const data = await res.json();
        return data;
    },

    /* /get/:id */

    get: async(id, token) => {
        try {

            const res = await fetch(`${BASE_URL}/items/get/${id}`, {
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

    put: async(item, id, token) => {
        const res = await fetch(`${BASE_URL}/items/put/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        });
        const data = await res.json();
        return data;
    },

    delete: async(id, token) => {
        const res = await fetch(`${BASE_URL}/items/delete/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();
        return data;
    },

    /* /getall */

    getAll: async(token) => {
        try {
            const res = await fetch(`${BASE_URL}/items/getall`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    }


}

export default ItemsAPI;