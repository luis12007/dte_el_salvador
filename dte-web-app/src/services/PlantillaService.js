//const BASE_URL = "https://cleaning-system-app-production.up.railway.app";
const BASE_URL = "http://localhost:3000";


const PlantillaAPI = {
 /* create and get */
    create: async (plantilla, token, id_emisor) => {
        const res = await fetch(`${BASE_URL}/plantillas/create`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'id_emisor': `${id_emisor}`,
            },
            body: JSON.stringify(plantilla)
        });
        const data = await res.json();
        return data;
    },

    /* /get/:id */
    getByUserId: async (id ,token) => {
        try {
            const res = await fetch(`${BASE_URL}/plantillas/get/${id}`, {
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

}

export default PlantillaAPI;