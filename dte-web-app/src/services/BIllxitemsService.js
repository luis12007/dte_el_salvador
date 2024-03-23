//const BASE_URL = "https://cleaning-system-app-production.up.railway.app";
const BASE_URL = "http://localhost:3000";


const BillsxItemsAPI = {
    create: async (billxitem, token) => {
        const res = await fetch(`${BASE_URL}/facturaxitems/create`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(billxitem)
        });
        const data = await res.json();
        return data;
    },
}


export default BillsxItemsAPI;