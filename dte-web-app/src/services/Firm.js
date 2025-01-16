const BASE_URL_Firm = "https://174.138.54.64:444";


const Firm = {
    /* call a post request with headers contenttype application/json
    and with this json in the body {
    "nit": "02101601741065",
    "activo": true,
    "passwordPri": "Halogenados2024",
    "dteJson":{"identificacion":{"version":1,"ambiente":"00","tipoDte":"01","numeroControl":"DTE-01-00010000-000000000000002","codigoGeneracion":"2CFF1097-24F2-4220-9257-581E1CB3AFE8","tipoModelo":1,"tipoOperacion":1,"fecEmi":"2024-04-25","horEmi":"17:47:06","tipoMoneda":"USD","tipoContingencia":null,"motivoContin":null},"documentoRelacionado":null,"emisor":{"direccion":{"municipio":"08","departamento":"06","complemento":"Bulevar Los Pr\u00f3ceres"},"nit":"02101601741065","nrc":"1837811","nombre":"LUIS ALONSO HERNANDEZ MAGANIA","codActividad":"86203","descActividad":"Ense\u00f1anza formal","telefono":"22106600","correo":"luishdezmtz12@gmail.com","nombreComercial":"'UCA'","tipoEstablecimiento":"01","codEstableMH":"1234","codEstable":"1234","codPuntoVentaMH":"0001","codPuntoVenta":"0001"},"receptor":{"codActividad":"10003","direccion":null,"nrc":null,"descActividad":"Estudiante","correo":"00129020@uca.edu.sv","tipoDocumento":"13","nombre":"LUIS ALEXANDER HERNANDEZ MARTINEZ","telefono":"6431-9239","numDocumento":"06384275-4"},"otrosDocumentos":null,"ventaTercero":null,"cuerpoDocumento":[{"descripcion":"CUOTA 02 DEL CICLO 01\/2024CARNET00129020","uniMedida":99,"codigo":"S00084","cantidad":1,"numItem":1,"tributos":null,"ivaItem":0,"noGravado":0,"psv":0,"montoDescu":0,"numeroDocumento":null,"codTributo":null,"precioUni":175,"ventaGravada":0,"ventaExenta":175,"ventaNoSuj":0,"tipoItem":2}],"resumen":{"condicionOperacion":1,"totalIva":0,"saldoFavor":0,"numPagoElectronico":null,"pagos":[{"periodo":null,"plazo":null,"montoPago":175,"codigo":"02","referencia":"TR0000306582"}],"totalNoSuj":0,"tributos":null,"totalLetras":"CIENTO SETENTA Y CINCO CON 0\/100 D\u00d3LARES","totalExenta":175,"subTotalVentas":175,"totalGravada":0,"montoTotalOperacion":175,"descuNoSuj":0,"descuExenta":0,"descuGravada":0,"porcentajeDescuento":0,"totalDescu":0,"subTotal":175,"ivaRete1":0,"reteRenta":0,"totalNoGravado":0,"totalPagar":175},"extension":null,"apendice":null}}
     */

    create: async(firm) => {
        try {

            const res = await fetch(`${BASE_URL_Firm}/firmardocumento/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(firm)
            });
            const data = await res.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    },

    // calling other endpoints for other clients

    HM_Clinic: async(firm) => {
        const res = await fetch(`https://174.138.54.64:8446/firmardocumento/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(firm)
        });
        const data = await res.json();
        return data;
    },

    DR_julio_HM: async(firm) => {
        const res = await fetch(`https://174.138.54.64:8448/firmardocumento/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(firm)
        });
        const data = await res.json();
        return data;
    },

    DR_VIDES: async(firm) => {
        const res = await fetch(`https://174.138.54.64:8451/firmardocumento/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(firm)
        });
        const data = await res.json();
        return data;
    },
}

export default Firm;