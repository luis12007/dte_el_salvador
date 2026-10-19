const BASE_URL = "https://intuitive-bravery-production.up.railway.app";
//const BASE_URL = "http://localhost:3000";

/* with token */
const ReceptorService = {
    /* router.post('/update/count_factura/:id', authenticateToken, count_factura);
router.post('/update/count_fiscal/:id', authenticateToken, count_fiscal); */
    Add: async(id, token, client) => {
        try {
            const res = await fetch(`${BASE_URL}/cliente/create/${id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(client)
            });
            const data = await res.json();
            return data;
        } catch (error) {
            return error;
        }

    },
    Get_by_userid: async(id, token) => {
        const res = await fetch(`${BASE_URL}/cliente/get/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        return data;
    },

    Delete_by_id: async(id, token) => {
        const res = await fetch(`${BASE_URL}/cliente/delete/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        return data;
    },

    Edit_by_id: async(id, token, client) => {
        try {
            const res = await fetch(`${BASE_URL}/cliente/put/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(client)
            });
            const data = await res.json();
            console.log(data);
            return data;
        } catch (error) {
            return error;
        }

    }
}


export default ReceptorService;