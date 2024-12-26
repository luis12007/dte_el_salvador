//const BASE_URL = "https://intuitive-bravery-production.up.railway.app";
const BASE_URL = "http://localhost:3000";

function downloadPDF(id_emisor, codigo_de_generacion, token) {
    fetch(`${BASE_URL}/mail/bill/${id_emisor}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ codigo_de_generacion })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            // Create a link element
            const link = document.createElement('a');
            // Create a URL for the blob
            const url = URL.createObjectURL(blob);
            // Set the link's href to the blob URL
            link.href = url;
            // Set the download attribute with a filename
            link.download = 'factura.pdf';
            // Append the link to the body
            document.body.appendChild(link);
            // Programmatically click the link to trigger the download
            link.click();
            // Remove the link from the document
            link.remove();
            // Revoke the blob URL to free up resources
            URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error downloading the PDF:', error);
        });
}


export default downloadPDF;