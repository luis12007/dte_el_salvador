const BASE_URL = "https://intuitive-bravery-production.up.railway.app";
//const BASE_URL = "http://localhost:3000";

/* with token */
const ProveedorService = {
    Add: async(id, token, proveedor) => {
        try {
            const res = await fetch(`${BASE_URL}/proveedor/create/${id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(proveedor)
            });
            const data = await res.json();
            return data;
        } catch (error) {
            return error;
        }
    },

    Get_by_userid: async(id, token) => {
        const res = await fetch(`${BASE_URL}/proveedor/get/${id}`, {
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
        const res = await fetch(`${BASE_URL}/proveedor/delete/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        return data;
    },

    Edit_by_id: async(id, token, proveedor) => {
        try {
            const res = await fetch(`${BASE_URL}/proveedor/put/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(proveedor)
            });
            const data = await res.json();
            console.log(data);
            return data;
        } catch (error) {
            return error;
        }
    }
}

export default ProveedorService;
