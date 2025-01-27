//const BASE_URL = "https://intuitive-bravery-production.up.railway.app";
const BASE_URL = "http://localhost:3000";

const PlantillaAPI = {
    /* create and get */
    create: async(plantilla, token, id_emisor) => {
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
    getbytypeandid: async(id, token, types, startdate, enddata) => {
        const res = await fetch(`${BASE_URL}/plantillas/get/typeandid/${id}/${startdate}/${enddata}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                'types': `${types}`,
            },
        });
        const data = await res.json();
        return data;
    },


    /* create     const data = PlantillaAPI.getcompras(user_id, token, ["02", "04"], startDate, endDate);
     */
    getcompras: async(id, token, startdate, enddata) => {
        const res = await fetch(`${BASE_URL}/compras/getcompras/${id}/${startdate}/${enddata}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        return data;
    },

    /* Create compras */
    createcompras: async(compra, token, id_emisor) => {
        const res = await fetch(`${BASE_URL}/compras/create`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'id_emisor': `${id_emisor}`,
            },
            body: JSON.stringify(compra)
        });
        const data = await res.json();
        return data;
    },

    /* /get/:id */
    getByUserId: async(id, token) => {
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

    /* get by id and filter by contains name */
    getByUserIdAndName: async(id, token, name) => {
        try {
            const res = await fetch(`${BASE_URL}/plantillas/get/name/${id}/${name}`, {
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

    /* get by range of dates */
    getByUserIdAndRange: async(id, token, start, end) => {
        try {
            const res = await fetch(`${BASE_URL}/plantillas/get/range/${id}/${start}/${end}`, {
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

    /* Get by type wheader is type 0 or 1 */
    getByUserIdAndType: async(id, token, type) => {
        try {
            const res = await fetch(`${BASE_URL}/plantillas/get/type/${id}/${type}`, {
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


    /* get plantilla by id */

    getcodegeneration: async(id, token) => {
        try {
            const res = await fetch(`${BASE_URL}/plantillas/getplantilla/${id}`, {
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

    /* updatebillNoitems */
    updateNoItems: async(id_emisor, plantilla, token, codigo_de_generacion) => {
        const res = await fetch(`${BASE_URL}/plantillas/updateNoItems/${codigo_de_generacion}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'id_emisor': `${id_emisor}`,
            },
            /* add items and plantilla in body */
            body: JSON.stringify({
                plantilla: plantilla
            })
        });
        const data = await res.json();
        return data;
    },


    /* update field with the codigo_de_generacion */
    update: async(id_emisor, plantilla, items, token, codigo_de_generacion) => {
        console.log("plantilla");
        console.log(plantilla);
        console.log("items");
        console.log(items);
        const res = await fetch(`${BASE_URL}/plantillas/update/${codigo_de_generacion}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'id_emisor': `${id_emisor}`,
            },
            /* add items and plantilla in body */
            body: JSON.stringify({
                plantilla: plantilla,
                items: items
            })
        });
        const data = await res.json();
        return data;
    },

    updatesend: async(id_emisor, selladotoggle, selloRecibido, token, codigo_de_generacion) => {
        const res = await fetch(`${BASE_URL}/plantillas/update/send/${codigo_de_generacion}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'id_emisor': `${id_emisor}`,
            },
            body: JSON.stringify({
                selladotoggle: selladotoggle,
                selloRecibido: selloRecibido
            })
        });
        const data = await res.json();
        return data;
    },

    /* count how many plantillas by userid and by tipo */
    count: async(id, tipo, token) => {
        const res = await fetch(`${BASE_URL}/plantillas/get/count/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                /* token */
                Authorization: `Bearer ${token}`,
                'tipo': `${tipo}`,
            },

        });
        const data = await res.json();
        return data;
    },


    deletePlantillabyCodeGeneration: async(codigo_de_generacion, token) => {
        const res = await fetch(`${BASE_URL}/plantillas/delete/${codigo_de_generacion}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                /* token */
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        return data;




    }
}

export default PlantillaAPI;