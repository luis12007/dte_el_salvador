const BASE_URL_test = "https://apitest.dtes.mh.gob.sv/fesv";
const BASE_URL_Prod = "https://api.dtes.mh.gob.sv/fesv";
/* TODO: */
/* with token and all is transaccion */
const SendAPI = {

    /* Sing the bill or CF */

    sendBill: async(plantilla, token) => {
        const res = await fetch(`${BASE_URL_test}/recepciondte`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'MysoftDTE'
            },
            body: JSON.stringify(plantilla)
        });
        const data = await res.json();
        return data;
    },

    invalidatebill: async(plantilla, token) => {
        const res = await fetch(`${BASE_URL_test}/anulardte`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'MysoftDTE'
            },
            body: JSON.stringify(plantilla)
        });
        const data = await res.json();
        return data;
    },

    sendBillprod: async(plantilla, token) => {
        const res = await fetch(`${BASE_URL_Prod}/recepciondte`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'MysoftDTE'
            },
            body: JSON.stringify(plantilla)
        });
        const data = await res.json();
        return data;
    },

    invalidatebillprod: async(plantilla, token) => {
        const res = await fetch(`${BASE_URL_Prod}/anulardte`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'MysoftDTE'
            },
            body: JSON.stringify(plantilla)
        });
        const data = await res.json();
        return data;
    },


    /* Send Bill or CF */

    get: async(id, token) => {
        try {

            const res = await fetch(`${BASE_URL_test}/items/get/${id}`, {
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

export default SendAPI;