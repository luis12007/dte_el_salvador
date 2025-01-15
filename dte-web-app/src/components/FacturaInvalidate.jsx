import React, { useEffect, useState } from "react";
import checkimg from "../assets/imgs/marca-de-verificacion.png";
import Firmservice from "../services/Firm";
import PlantillaAPI from "../services/PlantillaService";
import SendAPI from "../services/SendService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BillsxItemsAPI from "../services/BIllxitemsService";
import SendEmail from "../services/SendMailService";
import downloadPDF from "../services/DownloadPDF";
import { useNavigate } from "react-router-dom";
import imgx from "../assets/imgs/x.png";
import LoginAPI from "../services/Loginservices";
import mailimg from "../assets/imgs/correo.png";
import Invalidate from "../pages/Invalidate";


const FacturaInvalidate = ({ key, content, user }) => {
    const [tipo, setTipo] = useState("");
    const token = localStorage.getItem("token");
    const id_emisor = localStorage.getItem("user_id");
    const tokenminis = localStorage.getItem("tokenminis");
    const [Listitems, setItems] = useState([]);
    const navigate = useNavigate();
    const [usuario, setUser] = useState([]);
    useEffect(() => {
        if (content.tipo === "01") {
            setTipo("Factura");
        } else if (content.tipo === "03") {
            setTipo("Credito Fiscal");
        }

        /* Find service per factura */
        const itemsdata = async () => {
            const data = await BillsxItemsAPI.getlist(token, content.codigo_de_generacion);
            console.log("data");
            data.map((item) => {
                delete item.id;
                delete item.id_items;
                delete item.id_facturas;
            });

            if (content.tipo === "03") {
                const newItems = data.map((item) => {
                    const newItem = {
                        codTributo: item.codtributo,
                        descripcion: item.descripcion,
                        uniMedida: item.unimedida,
                        codigo: item.codigo,
                        cantidad: item.cantidad,
                        numItem: item.numitem,
                        tributos: [item.tributos.toString()],
                        noGravado: item.nogravado,
                        psv: item.psv,
                        montoDescu: item.montodescu,
                        numeroDocumento: item.numerodocumento,
                        precioUni: item.preciouni,
                        ventaGravada: item.ventagravada,
                        ventaExenta: item.ventaexenta,
                        ventaNoSuj: item.ventanosuj,
                        tipoItem: item.tipoitem,
                    };
                    return newItem;
                });
                console.log(newItems);
                setItems(newItems);

            } else if (content.tipo === "01") {


                const newItems = data.map((item) => {
                    const newItem = {
                        codTributo: item.codtributo,
                        descripcion: item.descripcion,
                        uniMedida: item.unimedida,
                        codigo: item.codigo,
                        cantidad: item.cantidad,
                        numItem: item.numitem,
                        tributos: item.tributos,
                        ivaItem: item.ivaitem,
                        noGravado: item.nogravado,
                        psv: item.psv,
                        montoDescu: item.montodescu,
                        numeroDocumento: item.numerodocumento,
                        precioUni: item.preciouni,
                        ventaGravada: item.ventagravada,
                        ventaExenta: item.ventaexenta,
                        ventaNoSuj: item.ventanosuj,
                        tipoItem: item.tipoitem,
                    };
                    return newItem;
                });


                console.log(newItems);
                setItems(newItems);
            }

        };
        itemsdata();
        console.log("user");
        console.log(user);
        setUser(user)

        console.log("content");
        console.log(content);







    }, []);








    const ValidateBillHandler = async () => { /* Firm DTE */
        /* -----------------CONST DATA--------------------------- */
        try {
            if (content.tipo === "01") {
                var data = {
                    identificacion: {
                        version: parseInt(content.version),
                        ambiente: content.ambiente,
                        tipoDte: content.tipo,
                        numeroControl: content.numero_de_control,
                        codigoGeneracion: content.codigo_de_generacion,
                        tipoModelo: parseInt(content.modelo_de_factura),
                        tipoOperacion: parseInt(content.tipo_de_transmision),
                        fecEmi: content.fecha_y_hora_de_generacion,
                        horEmi: content.horemi,
                        tipoMoneda: content.tipomoneda,
                        tipoContingencia: content.tipocontingencia,
                        motivoContin: content.motivocontin,
                    },
                    documentoRelacionado: content.documentorelacionado,
                    emisor: {
                        direccion: {
                            municipio: user.municipio,
                            departamento: user.departamento,
                            complemento: user.direccion
                        },
                        nit: user.nit,
                        nrc: user.nrc,
                        nombre: user.name,
                        codActividad: user.codactividad,
                        descActividad: user.descactividad,
                        telefono: user.numero_de_telefono,
                        correo: user.correo_electronico,
                        nombreComercial: user.nombre_comercial,
                        tipoEstablecimiento: user.tipoestablecimiento,

                        /* TODO: Just in case establecimiento  */
                        codEstableMH: content.codestablemh,
                        codEstable: content.codestable,
                        codPuntoVentaMH: content.codpuntoventamh,
                        codPuntoVenta: content.codpuntoventa
                    },
                    receptor: {
                        codActividad: content.re_codactividad,
                        direccion: null,
                        nrc: content.re_nrc,
                        descActividad: content.re_actividad_economica,
                        correo: content.re_correo_electronico,
                        tipoDocumento: content.re_tipodocumento,
                        nombre: content.re_name,
                        telefono: content.re_numero_telefono,
                        numDocumento: content.re_numdocumento
                    },
                    otrosDocumentos: content.otrosdocumentos,
                    ventaTercero: content.ventatercero,
                    cuerpoDocumento: Listitems,
                    resumen: {
                        condicionOperacion: content.condicionoperacion,
                        totalIva: parseFloat(content.iva_percibido),/* pending */
                        saldoFavor: content.saldofavor,
                        numPagoElectronico: content.numpagoelectronico,
                        pagos: [
                            {/* TODO: ADD MORE PAYMENTS */
                                periodo: content.periodo,
                                plazo: content.plazo,
                                montoPago: content.montopago,
                                codigo: content.codigo,
                                referencia: content.referencia
                            }
                        ],
                        totalNoSuj: content.totalnosuj,
                        tributos: content.tributos,
                        totalLetras: content.cantidad_en_letras,
                        totalExenta: content.totalexenta,
                        subTotalVentas: content.subtotalventas,
                        totalGravada: parseFloat(content.total_agravada),
                        montoTotalOperacion: content.montototaloperacion,
                        descuNoSuj: content.descunosuj,
                        descuExenta: content.descuexenta,
                        descuGravada: content.descugravada,
                        porcentajeDescuento: content.porcentajedescuento,
                        totalDescu: parseFloat(content.monto_global_de_descuento),
                        subTotal: parseFloat(content.subtotal),
                        ivaRete1: parseFloat(content.iva_retenido),
                        reteRenta: parseFloat(content.retencion_de_renta),
                        totalNoGravado: content.totalnogravado,
                        totalPagar: parseFloat(content.total_a_pagar)
                    },
                    extension: {
                        docuEntrega: content.documento_e,
                        nombRecibe: content.documento_r,
                        observaciones: content.observaciones,
                        placaVehiculo: content.placavehiculo,
                        nombEntrega: content.responsable_emisor,
                        docuRecibe: content.documento_receptor,
                    },
                    apendice: content.apendice,
                };

                data.receptor.direccion = null;
            } else if (content.tipo === "03") {
                /* Split in this structure direccion: {
                      municipio: userinfo.municipio, 
                      departamento: userinfo.departamento, 
                      complemento: userinfo.direccion 
                    }, the string "08|08|direccion" */

                const address = content.re_direccion.split("|");
                const tributocf = content.tributocf.split("|");
                var data = {
                    identificacion: {
                        version: parseInt(content.version),
                        ambiente: content.ambiente,
                        tipoDte: content.tipo,
                        numeroControl: content.numero_de_control,
                        codigoGeneracion: content.codigo_de_generacion,
                        tipoModelo: parseInt(content.modelo_de_factura),
                        tipoOperacion: parseInt(content.tipo_de_transmision),
                        fecEmi: content.fecha_y_hora_de_generacion,
                        horEmi: content.horemi,
                        tipoMoneda: content.tipomoneda,
                        tipoContingencia: content.tipocontingencia,
                        motivoContin: content.motivocontin,
                    },
                    documentoRelacionado: content.documentorelacionado,
                    emisor: {
                        direccion: {
                            municipio: user.municipio,
                            departamento: user.departamento,
                            complemento: user.direccion
                        },
                        nit: user.nit,
                        nrc: user.nrc,
                        nombre: user.name,
                        codActividad: user.codactividad,
                        descActividad: user.descactividad,
                        telefono: user.numero_de_telefono,
                        correo: user.correo_electronico,
                        nombreComercial: user.nombre_comercial,
                        tipoEstablecimiento: user.tipoestablecimiento,

                        /* TODO: Just in case establecimiento  */
                        codEstableMH: content.codestablemh,
                        codEstable: content.codestable,
                        codPuntoVentaMH: content.codpuntoventamh,
                        codPuntoVenta: content.codpuntoventa
                    },
                    receptor: {
                        codActividad: content.re_codactividad,
                        direccion: {
                            municipio: address[1],
                            departamento: address[0],
                            complemento: address[2]
                        },
                        nrc: content.re_nrc,
                        descActividad: content.re_actividad_economica,
                        correo: content.re_correo_electronico,
                        nombre: content.re_name,
                        telefono: content.re_numero_telefono,
                        nombreComercial: content.re_numdocumento,
                        nit: content.re_nit
                    },
                    otrosDocumentos: content.otrosdocumentos,
                    ventaTercero: content.ventatercero,
                    cuerpoDocumento: Listitems,
                    resumen: {
                        condicionOperacion: content.condicionoperacion,
                        saldoFavor: content.saldofavor,
                        numPagoElectronico: content.numpagoelectronico,
                        pagos: [
                            {/* TODO: ADD MORE PAYMENTS */
                                periodo: content.periodo,
                                plazo: content.plazo,
                                montoPago: content.montopago,
                                codigo: content.codigo,
                                referencia: content.referencia
                            }
                        ],
                        totalNoSuj: content.totalnosuj,
                        tributos: [{
                            codigo: tributocf[0],
                            descripcion: tributocf[1],
                            valor: parseFloat(tributocf[2])
                        }],
                        totalLetras: content.cantidad_en_letras,
                        totalExenta: content.totalexenta,
                        subTotalVentas: content.subtotalventas,
                        totalGravada: parseFloat(content.total_agravada),
                        montoTotalOperacion: content.montototaloperacion,
                        descuNoSuj: content.descunosuj,
                        descuExenta: content.descuexenta,
                        descuGravada: content.descugravada,
                        porcentajeDescuento: content.porcentajedescuento,
                        totalDescu: parseFloat(content.monto_global_de_descuento),
                        subTotal: parseFloat(content.subtotal),
                        ivaRete1: parseFloat(content.iva_retenido),
                        reteRenta: parseFloat(content.retencion_de_renta),
                        totalNoGravado: content.totalnogravado,
                        totalPagar: parseFloat(content.total_a_pagar),
                        ivaPerci1: parseFloat(content.iva_percibido),
                    },
                    extension: {
                        docuEntrega: content.documento_e,
                        nombRecibe: content.documento_r,
                        observaciones: content.observaciones,
                        placaVehiculo: content.placavehiculo,
                        nombEntrega: content.responsable_emisor,
                        docuRecibe: content.documento_receptor,
                    },
                    apendice: content.apendice,
                };
            }


            console.log("---------------resultado--------------");
            console.log(data);
            console.log("---------------resultado--------------");

            /* -------------------------------------------- */
            const Firm = {
                nit: user.nit,
                activo: true,
                passwordPri: user.passwordpri,
                dteJson: data,
            };

            if (id_emisor == 1 || id_emisor == 2 || id_emisor == 3) {
                const responseFirm = await Firmservice.create(Firm);
                console.log("firm response")
                console.log(responseFirm);
                data.firma = responseFirm.body;
                data.sellado = content.sellado;
                data.sello = content.sello;
                data.receptor.direccion = content.re_direccion;

                console.log("---------------resultado of firm server--------------");
                console.log(responseFirm);
            }
            if (id_emisor == 4) {
                const responseFirm = await Firmservice.HM_Clinic(Firm);
                console.log("firm response")
                console.log(responseFirm);
                data.firma = responseFirm.body;
                data.sellado = content.sellado;
                data.sello = content.sello;
                data.receptor.direccion = content.re_direccion;

                console.log("---------------resultado of firm server--------------");
                console.log(responseFirm);
            }
            if (id_emisor > 4) {
                const responseFirm = null;
                toast.error("No se encontró firmador");
                return
            }



            // update the bill without the items 
            const response = await PlantillaAPI.updateNoItems(
                id_emisor,
                data,
                token,
                data.identificacion.codigoGeneracion
            );
            console.log("edited");
            console.log(response);

            if (response.message === "plantilla actualizado") {
                toast.success("Factura firmada");

                /* wait 5 seconds */
                setTimeout(() => {
                    window.location.reload();

                }, 3000);




            } else {
                console.log("error");
                toast.error("Error al actualizar factura");
            }
            /*  window.location.reload();  */
        } catch (error) {
            console.log(error)
            toast.error("Dispositivo no autorizado para firmar")
        }

    };



    // Determine the button color and additional content based on `content.firm`
    const buttonStyle = content.firm ? "bg-lightgreen" : "bg-whitesmoke";
    const firmbutton = content.firm ? (
        <div className=" flex flex-row">
            <button
                onClick={ValidateBillHandler}
                className={`cursor-pointer h-12 [border:none]  pt-[11px] pb-3 pr-[23px] pl-[22px] ${buttonStyle} rounded-11xl flex flex-row items-start justify-start z-[2] hover:bg-lightgray-100 `}
            >
                <div className="relative text-xs pt-1.5 font-light font-inter text-black text-left z-[3]">
                    Firmar
                </div>
                <img src={checkimg} alt="Tick" className="w-[30px] ml-1 h-[30px]" />
            </button>
        </div>
    ) : (
        <div className=" flex flex-row">
            <button
                onClick={ValidateBillHandler}
                className={`cursor-pointer h-12 [border:none] pt-[11px] pb-3 pr-[23px] pl-[22px] ${buttonStyle} rounded-11xl flex flex-row items-start justify-start z-[2] hover:bg-lightgray-100 `}
            >
                <div className="relative text-xs font-light font-inter text-black text-left z-[3]">
                    Firmar
                </div>
            </button>
        </div>
    );




    /* Delete bill handler using the services */


    const InvalidateBillHandler = async () => {
        console.log("InvalidateBillHandler");
        console.log(content);
        console.log("---------------resultado--------------");
        console.log(content.ambiente);
        console.log(content.tipo);

        const parseintversion = parseInt(content.version);

        if (content.tipo === "01") {

            if (content.tipo == "01") {
                var data = {
                    identificacion: {
                        version: parseInt(content.version),
                        ambiente: content.ambiente,
                        tipoDte: content.tipo,
                        numeroControl: content.numero_de_control,
                        codigoGeneracion: content.codigo_de_generacion,
                        tipoModelo: parseInt(content.modelo_de_factura),
                        tipoOperacion: parseInt(content.tipo_de_transmision),
                        fecEmi: content.fecha_y_hora_de_generacion,
                        horEmi: content.horemi,
                        tipoMoneda: content.tipomoneda,
                        tipoContingencia: content.tipocontingencia,
                        motivoContin: content.motivocontin,
                    },
                    documentoRelacionado: content.documentorelacionado,
                    emisor: {
                        direccion: {
                            municipio: user.municipio,
                            departamento: user.departamento,
                            complemento: user.direccion
                        },
                        nit: user.nit,
                        nrc: user.nrc,
                        nombre: user.name,
                        codActividad: user.codactividad,
                        descActividad: user.descactividad,
                        telefono: user.numero_de_telefono,
                        correo: user.correo_electronico,
                        nombreComercial: user.nombre_comercial,
                        tipoEstablecimiento: user.tipoestablecimiento,

                        /* TODO: Just in case establecimiento  */
                        codEstableMH: content.codestablemh,
                        codEstable: content.codestable,
                        codPuntoVentaMH: content.codpuntoventamh,
                        codPuntoVenta: content.codpuntoventa
                    },
                    receptor: {
                        codActividad: content.re_codactividad,
                        direccion: null,
                        nrc: content.re_nrc,
                        descActividad: content.re_actividad_economica,
                        correo: content.re_correo_electronico,
                        tipoDocumento: content.re_tipodocumento,
                        nombre: content.re_name,
                        telefono: content.re_numero_telefono,
                        numDocumento: content.re_numdocumento
                    },
                    otrosDocumentos: content.otrosdocumentos,
                    ventaTercero: content.ventatercero,
                    cuerpoDocumento: Listitems,
                    resumen: {
                        condicionOperacion: content.condicionoperacion,
                        totalIva: parseFloat(content.iva_percibido),/* pending */
                        saldoFavor: content.saldofavor,
                        numPagoElectronico: content.numpagoelectronico,
                        pagos: [
                            {/* TODO: ADD MORE PAYMENTS */
                                periodo: content.periodo,
                                plazo: content.plazo,
                                montoPago: content.montopago,
                                codigo: content.codigo,
                                referencia: content.referencia
                            }
                        ],
                        totalNoSuj: content.totalnosuj,
                        tributos: content.tributos,
                        totalLetras: content.cantidad_en_letras,
                        totalExenta: content.totalexenta,
                        subTotalVentas: content.subtotalventas,
                        totalGravada: parseFloat(content.total_agravada),
                        montoTotalOperacion: content.montototaloperacion,
                        descuNoSuj: content.descunosuj,
                        descuExenta: content.descuexenta,
                        descuGravada: content.descugravada,
                        porcentajeDescuento: content.porcentajedescuento,
                        totalDescu: parseFloat(content.monto_global_de_descuento),
                        subTotal: parseFloat(content.subtotal),
                        ivaRete1: parseFloat(content.iva_retenido),
                        reteRenta: parseFloat(content.retencion_de_renta),
                        totalNoGravado: content.totalnogravado,
                        totalPagar: parseFloat(content.total_a_pagar)
                    },
                    extension: {
                        docuEntrega: content.documento_e,
                        nombRecibe: content.documento_r,
                        observaciones: content.observaciones,
                        placaVehiculo: content.placavehiculo,
                        nombEntrega: content.responsable_emisor,
                        docuRecibe: content.documento_receptor,
                    },
                    apendice: content.apendice,
                };

            }
            if (content.tipo == "03") {
                /* Split in this structure direccion: {
                      municipio: userinfo.municipio, 
                      departamento: userinfo.departamento, 
                      complemento: userinfo.direccion 
                    }, the string "08|08|direccion" */

                const address = content.re_direccion.split("|");
                const tributocf = content.tributocf.split("|");
                var data = {
                    identificacion: {
                        version: parseInt(content.version),
                        ambiente: content.ambiente,
                        tipoDte: content.tipo,
                        numeroControl: content.numero_de_control,
                        codigoGeneracion: content.codigo_de_generacion,
                        tipoModelo: parseInt(content.modelo_de_factura),
                        tipoOperacion: parseInt(content.tipo_de_transmision),
                        fecEmi: content.fecha_y_hora_de_generacion,
                        horEmi: content.horemi,
                        tipoMoneda: content.tipomoneda,
                        tipoContingencia: content.tipocontingencia,
                        motivoContin: content.motivocontin,
                    },
                    documentoRelacionado: content.documentorelacionado,
                    emisor: {
                        direccion: {
                            municipio: user.municipio,
                            departamento: user.departamento,
                            complemento: user.direccion
                        },
                        nit: user.nit,
                        nrc: user.nrc,
                        nombre: user.name,
                        codActividad: user.codactividad,
                        descActividad: user.descactividad,
                        telefono: user.numero_de_telefono,
                        correo: user.correo_electronico,
                        nombreComercial: user.nombre_comercial,
                        tipoEstablecimiento: user.tipoestablecimiento,

                        /* TODO: Just in case establecimiento  */
                        codEstableMH: content.codestablemh,
                        codEstable: content.codestable,
                        codPuntoVentaMH: content.codpuntoventamh,
                        codPuntoVenta: content.codpuntoventa
                    },
                    receptor: {
                        codActividad: content.re_codactividad,
                        direccion: {
                            municipio: address[1],
                            departamento: address[0],
                            complemento: address[2]
                        },
                        nrc: content.re_nrc,
                        descActividad: content.re_actividad_economica,
                        correo: content.re_correo_electronico,
                        nombre: content.re_name,
                        telefono: content.re_numero_telefono,
                        nombreComercial: content.re_numdocumento,
                        nit: content.re_nit
                    },
                    otrosDocumentos: content.otrosdocumentos,
                    ventaTercero: content.ventatercero,
                    cuerpoDocumento: Listitems,
                    resumen: {
                        condicionOperacion: content.condicionoperacion,
                        saldoFavor: content.saldofavor,
                        numPagoElectronico: content.numpagoelectronico,
                        pagos: [
                            {/* TODO: ADD MORE PAYMENTS */
                                periodo: content.periodo,
                                plazo: content.plazo,
                                montoPago: content.montopago,
                                codigo: content.codigo,
                                referencia: content.referencia
                            }
                        ],
                        totalNoSuj: content.totalnosuj,
                        tributos: [{
                            codigo: tributocf[0],
                            descripcion: tributocf[1],
                            valor: parseFloat(tributocf[2])
                        }],
                        totalLetras: content.cantidad_en_letras,
                        totalExenta: content.totalexenta,
                        subTotalVentas: content.subtotalventas,
                        totalGravada: parseFloat(content.total_agravada),
                        montoTotalOperacion: content.montototaloperacion,
                        descuNoSuj: content.descunosuj,
                        descuExenta: content.descuexenta,
                        descuGravada: content.descugravada,
                        porcentajeDescuento: content.porcentajedescuento,
                        totalDescu: parseFloat(content.monto_global_de_descuento),
                        subTotal: parseFloat(content.subtotal),
                        ivaRete1: parseFloat(content.iva_retenido),
                        reteRenta: parseFloat(content.retencion_de_renta),
                        totalNoGravado: content.totalnogravado,
                        totalPagar: parseFloat(content.total_a_pagar),
                        ivaPerci1: parseFloat(content.iva_percibido),
                    },
                    extension: {
                        docuEntrega: content.documento_e,
                        nombRecibe: content.documento_r,
                        observaciones: content.observaciones,
                        placaVehiculo: content.placavehiculo,
                        nombEntrega: content.responsable_emisor,
                        docuRecibe: content.documento_receptor,
                    },
                    apendice: content.apendice,
                };
            }


            const dataSend = {
                ambiente: content.ambiente,
                idEnvio: content.id,
                version: parseintversion,
                documento: content.firm,
            };

            try {
                console.log(content);
                console.log("---------------dataSend to minis--------------");
                console.log(dataSend);

                /* ADD token minis */
                const resultAuthminis = await LoginAPI.loginMinis(
                    user.nit,
                    user.codigo_hacienda,
                    "MysoftwareSv"
                );
                console.log(resultAuthminis);
                if (resultAuthminis.status != "OK") {
                    toast.success("Error eb ek nubusterui vuelve a intentar");
                    return
                }
                const senddatainvalidate = await SendAPI.invalidatebill(dataSend, resultAuthminis.body.token.slice(7));
                console.log(senddatainvalidate);




                if (senddatainvalidate.estado === "PROCESADO") {
                    console.log("DeleteBillHandler");
                    const response = await PlantillaAPI.deletePlantillabyCodeGeneration(content.codigo_de_generacion, token);
                    console.log("deleted");
                    console.log(response);
                    if (response.message === "plantilla eliminado") {
                        toast.success("Plantilla eliminada del ministerio y del sistema");
                        /* wait for 5 seconds */
                        setTimeout(() => {
                            window.location.reload();

                        }, 5000);
                    }


                    /* send email */

                    /* Sending the email */



                }

                if (senddatainvalidate.estado === "RECHAZADO")
                    toast.error(`RECHAZADO ${senddatainvalidate.descripcionMsg}`);
                console.log(senddatainvalidate.observaciones);
                for (let i = 0; i < senddatainvalidate.observaciones.length; i++) {
                    toast.error(`motivo ${i + 1} ${senddatainvalidate.observaciones[i]}`);
                }


                console.log("---------------resultado--------------");
                console.log(senddatainvalidate.estado);



            } catch (error) {
                console.log(error)
                toast.error("Error al enviar la factura no autorizado");
            }


        } else {
            const dataSend = {
                ambiente: content.ambiente,
                idEnvio: content.id,
                version: parseintversion,
                documento: content.firm,
            };


            try {
                console.log(content);
                console.log("---------------dataSend to minis--------------");
                console.log(dataSend);

                /* ADD token minis */
                const resultAuthminis = await LoginAPI.loginMinis(
                    user.nit,
                    user.codigo_hacienda,
                    "MysoftwareSv"
                );
                console.log(resultAuthminis);
                const senddatainvalidate = await SendAPI.invalidatebill(dataSend, resultAuthminis.body.token.slice(7));
                console.log(senddatainvalidate);


                if (senddatainvalidate.estado === "PROCESADO") {
                    console.log("DeleteBillHandler");
                    const response = await PlantillaAPI.deletePlantillabyCodeGeneration(content.codigo_de_generacion, token);
                    console.log("deleted");
                    console.log(response);
                    if (response.message === "plantilla eliminado") {
                        toast.success("Plantilla eliminada del ministerio y del sistema");
                        /* wait for 5 seconds */
                        setTimeout(() => {
                            window.location.reload();

                        }, 5000);
                    }
                }

                if (senddatainvalidate.estado === "RECHAZADO")
                    toast.error(`RECHAZADO ${senddatainvalidate.descripcionMsg}`);


                console.log("---------------resultado--------------");
                console.log(senddatainvalidate.estado);



            } catch (error) {
                console.log(error)
                toast.error("Error al eliminar la factura, no autorizado");
            }
        }

    }


    return (
        <div className="flex w-full self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex-col items-center  px-0 pb-3 box-border my-6  text-black font-inria-sans ">
            <header className="self-stretch pb-2 rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-between pt-1  pr-[10px] pl-[15px] box-border text-xl text-black font-inria-sans">
                <div className="flex flex-col  items-start justify-start pt-1 px-0 pb-0">

                    <h1 className="m-0 relative text-inherit font-bold z-[3]">{tipo}</h1>
                </div>
                <div className="flex flex-row  items-start justify-start gap-[0px_8px]">
                    {/* <img
            className="w-[33px] h-[33px] relative object-cover z-[3]"
            loading="lazy"
            onClick={ViewBillHandler}
            alt=""
            src="/ver@2x.png"
          /> */}



                </div>

            </header>

            <div className="">
                <div className=""></div>
            </div>
            <div className="self-stretch flex flex-row items-center justify-center  py-0 px-[10px] box-border">
                <div className="flex flex-col justify-center self-center">
                    <div className="flex-1 flex flex-col items-center justify-center  pt-[7px] px-0 pb-0">
                        <div className="self-stretch  flex flex-col items-start justify-start gap-[7px_0px]">
                            <div className="relative  whitespace-nowrap z-[1]">
                                {content.re_name}
                            </div>
                            <div className="self-stretch  h-px relative box-border z-[1] border-t-[1px] border-solid border-black" />
                            <div className="relative whitespace-nowrap z-[1]">
                                {/* re_nit if it is null re_numdocumento */}
                                Documento: {content.re_nit ? content.re_nit : content.re_numdocumento}
                            </div>
                            <div className="relative whitespace-nowrap z-[1]">
                                Correo: {content.re_correo_electronico}
                            </div>
                            <div className="relative whitespace-nowrap z-[1]">
                                Teléfono: {content.re_numero_telefono}
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex w-full pt-4 flex-col items-center justify-center gap-[8px_0px]">
                        <button className="cursor-pointer [border:none] px-2 pb-1 bg-gay-100 rounded-mini shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap z-[1] hover:bg-gainsboro-100">
                            <b className="relative text-11xl font-inria-sans text-black text-left whitespace-nowrap z-[2]">
                                TOTAL: ${content.total_a_pagar}
                            </b>
                        </button>
                        <div className="self-center justify-center flex py-2 p-6 gap-[0px_8px]">
                            <div className=" flex flex-row">
                                <button
                                    onClick={InvalidateBillHandler}
                                    className={`cursor-pointer bg-red-400 h-12 [border:none] pt-[11px] pb-3 pr-[23px] pl-[22px] ${buttonStyle} rounded-11xl flex flex-row items-start justify-start z-[2] hover:bg-lightgray-100 `}
                                >
                                    <div className="relative text-xs font-light font-inter text-black text-left z-[3]">
                                        Invalidar
                                    </div>
                                </button>



                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};
export default FacturaInvalidate;