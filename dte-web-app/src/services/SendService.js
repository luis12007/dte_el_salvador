//const BASE_URL = "https://cleaning-system-app-production.up.railway.app";
const BASE_URL = "https://apitest.dtes.mh.gob.sv/fesv/recepciondte";

/* TODO: */
/* with token and all is transaccion */
const SendAPI = {

    /* Sing the bill or CF */

    sendBill: async (plantilla, token) => {
        const res = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: {
                Authorization: `${token}`,
                'Content-Type': 'application/json',
                'User-Agent':'MysoftDTE'
            },
            body: JSON.stringify(plantilla)
        });
        const data = await res.json();
        return data;
    },



    /* Send Bill or CF */

    get: async (id, token) => {
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
}

export default SendAPI;