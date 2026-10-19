const BASE_URL = "https://intuitive-bravery-production.up.railway.app";
//const BASE_URL = "http://localhost:3000";

/* with token */
const EmisorService = {
    /* router.post('/update/count_factura/:id', authenticateToken, count_factura);
router.post('/update/count_fiscal/:id', authenticateToken, count_fiscal); */
    count_factura: async(id, token) => {
        const res = await fetch(`${BASE_URL}/emisor/update/count_factura/${id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        return data;
    },
    count_fiscal: async(id, token) => {
        const res = await fetch(`${BASE_URL}/emisor/update/count_fiscal/${id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        return data;
    },
    count_cl: async(id, token) => {
        const res = await fetch(`${BASE_URL}/emisor/update/count_cl/${id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        return data;
    },
    count_nd: async(id, token) => {
        const res = await fetch(`${BASE_URL}/emisor/update/count_nd/${id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        return data;
    },
    count_nc: async(id, token) => {
        const res = await fetch(`${BASE_URL}/emisor/update/count_nc/${id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        return data;
    },
    decrease_factura: async(id, token) => {
        const res = await fetch(`${BASE_URL}/emisor/update/decrease_factura/${id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        return data;
    },
    decrease_fiscal: async(id, token) => {
        const res = await fetch(`${BASE_URL}/emisor/update/decrease_fiscal/${id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        return data;
    },
    decrease_envio: async(id, token) => {
        const res = await fetch(`${BASE_URL}/emisor/update/decrease_envio/${id}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        return data;
    },
}


export default EmisorService;