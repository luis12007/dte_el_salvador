// URLs del proxy CORS en tu servidor (via nginx)
const BASE_URL_Proxy = "https://www.myspaceai.cloud/api";

// URLs originales (solo referencia, no se usan con proxy)
const BASE_URL_test = "https://apitest.dtes.mh.gob.sv/fesv";
const BASE_URL_Prod = "https://api.dtes.mh.gob.sv/fesv";
/* TODO: */
/* with token and all is transaccion */
const SendAPI = {

    /* Sing the bill or CF */

    sendBill: async(plantilla, token) => {
        const res = await fetch(`${BASE_URL_Proxy}/recepciondtest`, {
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
        const res = await fetch(`${BASE_URL_Proxy}/anulardtest`, {
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
        console.log('[sendBillprod] Usando proxy:', `${BASE_URL_Proxy}/recepciondte`);
        console.log('[sendBillprod] payload:', plantilla);
        const res = await fetch(`${BASE_URL_Proxy}/recepciondte`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'MysoftDTE'
            },
            body: JSON.stringify(plantilla)
        });
        console.log('[sendBillprod] HTTP status:', res.status, 'ok:', res.ok);
        const data = await res.json();
        console.log('[sendBillprod] response data:', data);
        return data;
    },

    invalidatebillprod: async(plantilla, token) => {
        console.log('[invalidatebillprod] Usando proxy:', `${BASE_URL_Proxy}/anulardte`);
        const res = await fetch(`${BASE_URL_Proxy}/anulardte`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'MysoftDTE'
            },
            body: JSON.stringify(plantilla)
        });
        const data = await res.json();
        console.log('[invalidatebillprod] response:', data);
        return data;
    },


    /* Send Bill or CF */

    get: async(id, token) => {
        try {

            const res = await fetch(`${BASE_URL_Proxy}/items/get/${id}`, {
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