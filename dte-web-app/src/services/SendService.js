//const BASE_URL = "https://cleaning-system-app-production.up.railway.app";
const BASE_URL = "http://localhost:3000";

/* TODO: */
/* with token and all is transaccion */
const SendAPI = {

    /* Sing the bill or CF */

    sendBill: async (bill, token) => {
        const res = await fetch(`${BASE_URL}/send/bill`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bill)
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