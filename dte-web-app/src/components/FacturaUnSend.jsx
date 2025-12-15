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
import cross from "../assets/imgs/cross.png";
import direct from "../assets/imgs/direct.png";
import signature from "../assets/imgs/signature.png";
import UserService from "../services/UserServices";
import EmisorService from "../services/emisor";


const FrameComponent1 = ({ key, content, user, canDelete = false }) => {
  const [tipo, setTipo] = useState("");
  const token = localStorage.getItem("token");
  const id_emisor = localStorage.getItem("user_id");
  const tokenminis = localStorage.getItem("tokenminis");
  const [Listitems, setItems] = useState([]);
  const navigate = useNavigate();
  const [usuario, setUser] = useState([]);
  const [mailchecker, setMailChecker] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formattedTotal, setFormattedTotal] = useState("");


  useEffect(() => {
    if (content.tipo === "01") {
      setTipo("Factura");
    } else if (content.tipo === "03") {
      setTipo("Crédito Fiscal");
    } else if (content.tipo === "14") {
      setTipo("Sujeto Excluido");
    } else if (content.tipo === "05") {
      setTipo("Nota de Crédito");
    } else if (content.tipo === "06") {
      setTipo("Nota de Debito");
    }else if (content.tipo === "08") {
      setTipo("Comprobante de Liquidación");
    }

    if (content.re_correo_electronico === ""
      || content.re_correo_electronico === null) {
      console.log("no email");
      setMailChecker(false);
    }

    /* Find service per factura */
    const itemsdata = async () => {
      const data = await BillsxItemsAPI.getlist(token, content.codigo_de_generacion);
      console.log("data");
      console.log(data);
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

        if (!data[0]?.tributos || data[0]?.tributos === null) {
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
        } else {
          const newItems = data.map((item) => {
            const arr = []
            arr.push(String(item.tributos))
            const newItem = {
              codTributo: item.codtributo,
              descripcion: item.descripcion,
              uniMedida: item.unimedida,
              codigo: item.codigo,
              cantidad: item.cantidad,
              numItem: item.numitem,
              tributos: arr,
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


      } else if (content.tipo === "14") {


        const newItems = data.map((item) => {
          const newItem = {
            numItem: item.numitem,
            codigo: item.codigo,
            uniMedida: item.unimedida,
            precioUni: item.preciouni,
            montoDescu: item.montodescu,
            compra: item.ventaexenta,
            descripcion: item.descripcion,
            cantidad: item.cantidad,
            tipoItem: item.tipoitem,
          };
          return newItem;
        });


        console.log(newItems);
        setItems(newItems);
      } else if (content.tipo === "05") {


        const newItems = data.map((item) => {
          const newItem = {
            codTributo: item.codtributo,
            descripcion: item.descripcion,
            uniMedida: item.unimedida,
            codigo: item.codigo,
            cantidad: item.cantidad,
            numItem: item.numitem,
            tributos: [item.tributos.toString()],
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
      } else if (content.tipo === "06") {


        const newItems = data.map((item) => {
          const newItem = {
            codTributo: item.codtributo,
            descripcion: item.descripcion,
            uniMedida: item.unimedida,
            codigo: item.codigo,
            cantidad: item.cantidad,
            numItem: item.numitem,
            tributos: [item.tributos.toString()],
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
      }else if (content.tipo === "08") {


        const newItems = data.map((item) => {
            /* here start form 1 and sum 1 each iteration to put numitem */
            let numItem = 1;
          const tributosNorm = (t) => (t?.[2] ? t : (t ? [String(t)] : null));
          const newItem = {
            numItem: numItem++,
            tipoDte: item.tipodte,
            tipoGeneracion: item.tipogeneracion,
            numeroDocumento: item.numerodocumento,
            fechaGeneracion: item.fechageneracion,
            ventaNoSuj: item.ventanosuj,
            ventaExenta: item.ventaexenta,
            ventaGravada: item.ventagravada,
            exportaciones: 0,
            tributos: tributosNorm(item.tributos),/* REVIEW */
              ivaItem: item.ivaitem/* item.ivaitem */,/* REVIEW */
            obsItem: item.obsitem

            /* codTributo: item.codtributo,
            descripcion: item.descripcion,
            uniMedida: item.unimedida,
            codigo: item.codigo,
            cantidad: item.cantidad,

            montoDescu: item.montodescu,
            precioUni: item.preciouni,
            tipoItem: item.tipoitem, */
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

    setFormattedTotal(content.total_a_pagar.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")); // 1,000

  }, []);



  const EditBillHandler = () => {
    if (content.tipo === "01") {
      console.log("EditBillHandler");
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
          direccion: content.re_direccion,
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

      console.log("---------------resultado--------------");
      console.log(data);
      console.log("---------------resultado--------------");

      navigate(`/editar/factura/${content.codigo_de_generacion}`);

    } else if (content.tipo === "03") {
      navigate(`/editar/CreditoFiscal/${content.codigo_de_generacion}`);
    } else if (content.tipo === "14") {
      navigate(`/editar/SujEx/${content.codigo_de_generacion}`);
    } else if (content.tipo === "05") {
      navigate(`/editar/NC/${content.codigo_de_generacion}`);
    } else if (content.tipo === "06") {
      navigate(`/editar/ND/${content.codigo_de_generacion}`);
    } else if (content.tipo === "08") {
      navigate(`/editar/CL/${content.codigo_de_generacion}`);
    }

  };

  const DownloadBillHandler = async () => {
    console.log("DownloadBillHandler");
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
        direccion: content.re_direccion,
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

    console.log("---------------resultado--------------");
    console.log(data);
    console.log("---------------resultado--------------");

    const Firm = {
      nit: user.nit,
      activo: true,
      passwordPri: user.passwordpri,
      dteJson: data,
    };
    downloadPDF(data, id_emisor, data.identificacion.codigoGeneracion, token);
    toast.success("Descargando factura");
    /* Calling the API to send the email */


  };



  const ValidateBillHandler = async () => { /* Firm DTE */
    /* -----------------CONST DATA--------------------------- */
    try {
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
              municipio: content.municipio,
              departamento: content.departamento,
              complemento: content.complemento
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

      if (content.tipo == "14") {
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

            /* TODO: Just in case establecimiento  */
            codEstableMH: content.codestablemh,
            codEstable: content.codestable,
            codPuntoVentaMH: content.codpuntoventamh,
            codPuntoVenta: content.codpuntoventa
          },
          sujetoExcluido: {
            tipoDocumento: content.re_tipodocumento,
            numDocumento: content.re_numdocumento,
            nombre: content.re_name,
            codActividad: content.re_codactividad,
            descActividad: content.re_actividad_economica,
            direccion: {
              municipio: address[1],
              departamento: address[0],
              complemento: address[2]
            },
            correo: content.re_correo_electronico,
            telefono: content.re_numero_telefono,
          },
          cuerpoDocumento: Listitems,
          resumen: {

            totalCompra: content.montototaloperacion,
            descu: content.descuexenta,
            totalDescu: parseFloat(content.monto_global_de_descuento),
            subTotal: parseFloat(content.subtotal),
            ivaRete1: parseFloat(content.iva_retenido),
            reteRenta: parseFloat(content.retencion_de_renta),
            totalPagar: parseFloat(content.total_a_pagar),
            totalLetras: content.cantidad_en_letras,
            condicionOperacion: Number(content.codigo),
            pagos: [
              {/* TODO: ADD MORE PAYMENTS */
                periodo: content.periodo,
                plazo: content.plazo,
                montoPago: content.montopago,
                codigo: content.codigo,
                referencia: content.referencia
              }
            ],
            observaciones: content.observaciones,

          },
          apendice: content.apendice,
        };
      }

      if (content.tipo == "05") {
        const tipodedocumento = content.documentorelacionado.split("|");
        const tipoDocumento = tipodedocumento[0];
        const tipoGeneracion = tipodedocumento[1];
        const numeroDocumento = tipodedocumento[2];
        const fechaEmision = tipodedocumento[3];

        const address = content.re_direccion.split("|");
        const tributocf = content.tributocf.split("|");
        console.log(tipodedocumento)
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
          documentoRelacionado: [{
            tipoDocumento: tipoDocumento,
            tipoGeneracion: Number(tipoGeneracion),
            numeroDocumento: numeroDocumento,
            fechaEmision: fechaEmision
          }],
          emisor: {

            nit: user.nit,
            nrc: user.nrc,
            nombre: user.name,
            codActividad: user.codactividad,
            descActividad: user.descactividad,
            nombreComercial: user.nombre_comercial,
            tipoEstablecimiento: user.tipoestablecimiento,
            direccion: {
              municipio: user.municipio,
              departamento: user.departamento,
              complemento: user.direccion
            },
            telefono: user.numero_de_telefono,
            correo: user.correo_electronico,
          },
          receptor: {
            nit: content.re_nit,
            nrc: content.re_nrc,
            nombre: content.re_name,
            codActividad: content.re_codactividad,
            descActividad: content.re_actividad_economica,
            nombreComercial: content.re_numdocumento,
            direccion: {
              municipio: address[1],
              departamento: address[0],
              complemento: address[2]
            },
            correo: content.re_correo_electronico,
            telefono: content.re_numero_telefono,
          },
          ventaTercero: content.ventatercero,
          cuerpoDocumento: Listitems,
          resumen: {
            totalNoSuj: content.totalnosuj,
            totalExenta: content.totalexenta,
            totalGravada: parseFloat(content.total_agravada),
            subTotalVentas: content.subtotalventas,
            descuNoSuj: content.descunosuj,
            descuExenta: content.descuexenta,
            totalDescu: parseFloat(content.monto_global_de_descuento),
            tributos: [{
              codigo: tributocf[0],
              descripcion: tributocf[1],
              valor: parseFloat(tributocf[2])
            }],
            subTotal: parseFloat(content.subtotal),
            ivaPerci1: parseFloat(content.iva_percibido),
            ivaRete1: parseFloat(content.iva_retenido),
            reteRenta: parseFloat(content.retencion_de_renta),
            montoTotalOperacion: content.montototaloperacion,
            totalLetras: content.cantidad_en_letras,
            condicionOperacion: content.condicionoperacion,
            descuGravada: content.descugravada,

            /* saldoFavor: content.saldofavor,
            numPagoElectronico: content.numpagoelectronico,
            pagos: [
              {TODO: ADD MORE PAYMENTS
                periodo: content.periodo,
                plazo: content.plazo,
                montoPago: content.montopago,
                codigo: content.codigo,
                referencia: content.referencia
              }
            ],

            descuGravada: content.descugravada,
            porcentajeDescuento: content.porcentajedescuento,
            totalNoGravado: content.totalnogravado,
            totalPagar: parseFloat(content.total_a_pagar), */
          },
          extension: {
            docuEntrega: content.documento_e,
            nombRecibe: content.documento_r,
            observaciones: content.observaciones,
            nombEntrega: content.responsable_emisor,
            docuRecibe: content.documento_receptor,
          },
          apendice: content.apendice,
        };
      }

      if (content.tipo == "06") {
        const tipodedocumento = content.documentorelacionado.split("|");
        const tipoDocumento = tipodedocumento[0];
        const tipoGeneracion = tipodedocumento[1];
        const numeroDocumento = tipodedocumento[2];
        const fechaEmision = tipodedocumento[3];

        const address = content.re_direccion.split("|");
        const tributocf = content.tributocf.split("|");
        console.log(tipodedocumento)
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
          documentoRelacionado: [{
            tipoDocumento: tipoDocumento,
            tipoGeneracion: Number(tipoGeneracion),
            numeroDocumento: numeroDocumento,
            fechaEmision: fechaEmision
          }],
          emisor: {

            nit: user.nit,
            nrc: user.nrc,
            nombre: user.name,
            codActividad: user.codactividad,
            descActividad: user.descactividad,
            nombreComercial: user.nombre_comercial,
            tipoEstablecimiento: user.tipoestablecimiento,
            direccion: {
              municipio: user.municipio,
              departamento: user.departamento,
              complemento: user.direccion
            },
            telefono: user.numero_de_telefono,
            correo: user.correo_electronico,
          },
          receptor: {
            nit: content.re_nit,
            nrc: content.re_nrc,
            nombre: content.re_name,
            codActividad: content.re_codactividad,
            descActividad: content.re_actividad_economica,
            nombreComercial: content.re_numdocumento,
            direccion: {
              municipio: address[1],
              departamento: address[0],
              complemento: address[2]
            },
            correo: content.re_correo_electronico,
            telefono: content.re_numero_telefono,
          },
          ventaTercero: content.ventatercero,
          cuerpoDocumento: Listitems,
          resumen: {
            totalNoSuj: content.totalnosuj,
            totalExenta: content.totalexenta,
            totalGravada: parseFloat(content.total_agravada),
            subTotalVentas: content.subtotalventas,
            descuNoSuj: content.descunosuj,
            descuExenta: content.descuexenta,
            totalDescu: parseFloat(content.monto_global_de_descuento),
            tributos: [{
              codigo: tributocf[0],
              descripcion: tributocf[1],
              valor: parseFloat(tributocf[2])
            }],
            subTotal: parseFloat(content.subtotal),
            ivaPerci1: parseFloat(content.iva_percibido),
            ivaRete1: parseFloat(content.iva_retenido),
            reteRenta: parseFloat(content.retencion_de_renta),
            montoTotalOperacion: content.montototaloperacion,
            totalLetras: content.cantidad_en_letras,
            condicionOperacion: content.condicionoperacion,
            descuGravada: content.descugravada,
            numPagoElectronico: content.numpagoelectronico,
            /* saldoFavor: content.saldofavor,
            
            pagos: [
              {TODO: ADD MORE PAYMENTS
                periodo: content.periodo,
                plazo: content.plazo,
                montoPago: content.montopago,
                codigo: content.codigo,
                referencia: content.referencia
              }
            ],

            descuGravada: content.descugravada,
            porcentajeDescuento: content.porcentajedescuento,
            totalNoGravado: content.totalnogravado,
            totalPagar: parseFloat(content.total_a_pagar), */
          },
          extension: {
            docuEntrega: content.documento_e,
            nombRecibe: content.documento_r,
            observaciones: content.observaciones,
            nombEntrega: content.responsable_emisor,
            docuRecibe: content.documento_receptor,
          },
          apendice: content.apendice,
        };
      }

      if (content.tipo == "08") {
        /* const tipodedocumento = content.documentorelacionado.split("|");
        const tipoDocumento = tipodedocumento[0];
        const tipoGeneracion = tipodedocumento[1];
        const numeroDocumento = tipodedocumento[2];
        const fechaEmision = tipodedocumento[3]; */

        const address = content.re_direccion.split("|");
        const tributocf = content.tributocf.split("|");
        /* CREATING RECEPTOR ADDRESS */
        const r_direccion = {
          municipio: address[1],
          departamento: address[0],
          complemento: address[2]
        };

        /* if address[0] is just "2" i will change it to "02" dinamically*/
        console.log("---------------------------------------")
        console.log(address)
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
          },
          /* documentoRelacionado: [{
            tipoDocumento: tipoDocumento,
            tipoGeneracion: Number(tipoGeneracion),
            numeroDocumento: numeroDocumento,
            fechaEmision: fechaEmision
          }], */
          emisor: {

            nit: user.nit,
            nrc: user.nrc,
            nombre: user.name,
            codActividad: user.codactividad,
            descActividad: user.descactividad,
            nombreComercial: user.nombre_comercial,
            tipoEstablecimiento: user.tipoestablecimiento,
            direccion: {
              municipio: user.municipio,
              departamento: user.departamento,
              complemento: user.direccion
            },
            telefono: user.numero_de_telefono,
            correo: user.correo_electronico,

                        /* TODO: Just in case establecimiento  */
            codEstableMH: content.codestablemh,
            codEstable: content.codestable,
            codPuntoVentaMH: content.codpuntoventamh,
            codPuntoVenta: content.codpuntoventa
          },
          receptor: {
            nit: content.re_nit,
            nrc: content.re_nrc,
            nombre: content.re_name,
            codActividad: content.re_codactividad,
            descActividad: content.re_actividad_economica,
            nombreComercial: content.re_numdocumento,
            direccion: r_direccion,
            correo: content.re_correo_electronico,
            telefono: content.re_numero_telefono,
          },
          cuerpoDocumento: Listitems,
          resumen: {
            totalNoSuj: content.totalnosuj,
            totalExenta: content.totalexenta,
            totalGravada: parseFloat(content.total_agravada),
            subTotalVentas: content.subtotalventas,
            tributos: [{
              codigo: tributocf[0],
              descripcion: tributocf[1],
              valor: parseFloat(tributocf[2])
            }],
            montoTotalOperacion: content.montototaloperacion,
            totalLetras: content.cantidad_en_letras,
            condicionOperacion: content.condicionoperacion,
            total: parseFloat(content.total_a_pagar),
            ivaPerci: parseFloat(content.iva_percibido),
            totalExportacion: 0,
            /* saldoFavor: content.saldofavor,
            
            pagos: [
              {TODO: ADD MORE PAYMENTS
                periodo: content.periodo,
                plazo: content.plazo,
                montoPago: content.montopago,
                codigo: content.codigo,
                referencia: content.referencia
              }
            ],

            descuGravada: content.descugravada,
            porcentajeDescuento: content.porcentajedescuento,
            totalNoGravado: content.totalnogravado,
            totalPagar: parseFloat(content.total_a_pagar), */
          },
          extension: {
            docuEntrega: content.documento_e,
            nombRecibe: content.documento_r,
            observaciones: content.observaciones,
            nombEntrega: content.responsable_emisor,
            docuRecibe: content.documento_receptor,
          },
          apendice: content.apendice,
        };
      }

        console.log("--------------------C DE LIQUIDACION-------------------")
        console.log(data)

      console.log("---------------resultado--------------");
      console.log(data);
      console.log("---------------resultado--------------");
      /* deleting firma and sellado from data setting to null */

      /* -------------------------------------------- */
      const Firm = {
        nit: user.nit,
        activo: true,
        passwordPri: user.passwordpri,
        dteJson: data,
      };
      console.log("---------------Firm--------------");
      console.log(Firm);
      console.log("---------------Firm--------------");
      const responseFirm = null;
      if (id_emisor == 1 || id_emisor == 2) {
        const responseFirm = await Firmservice.create(Firm);
        console.log("firm response")
        console.log(responseFirm);

        if (responseFirm === undefined) {
          toast.error("No se encontró firmador activo");
          return
        }
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;


        console.log("---------------resultado of firm server--------------");
        console.log(responseFirm);
      }
      if (id_emisor == 3) {
        const responseFirm = await Firmservice.create_prod(Firm);
        console.log("firm response")
        console.log(responseFirm);

        if (responseFirm === undefined) {
          toast.error("No se encontró firmador activo");
          return
        }
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;


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
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }

        console.log("---------------resultado of firm server--------------");
        console.log(responseFirm);
      }
      if (id_emisor == 9) {
        const responseFirm = await Firmservice.HM_Clinic_prod(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }

        console.log("---------------resultado of firm server--------------");
        console.log(responseFirm);
      }
      if (id_emisor == 5) {
        const responseFirm = await Firmservice.DR_julio_HM(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }

        console.log("---------------resultado of firm server--------------");
        console.log(responseFirm);
      }

      if (id_emisor == 8) {
        const responseFirm = await Firmservice.DR_julio_HM_prod(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }

        console.log("---------------resultado of firm server--------------");
        console.log(responseFirm);
      }

      if (id_emisor == 6) {
        const responseFirm = await Firmservice.DR_VIDES(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 10) {
        const responseFirm = await Firmservice.DR_VIDES_prod(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }


      if (id_emisor == 11) {
        const responseFirm = await Firmservice.SANDR_prod(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 7) {
        const responseFirm = await Firmservice.OSEGUEDA(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        console.log(content.re_direccion)

        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 12) {
        const responseFirm = await Firmservice.OSEGUEDA_prod(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 14) {
        const responseFirm = await Firmservice.ICP(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 13) {
        const responseFirm = await Firmservice.ICP_PROD(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 15) {
        const responseFirm = await Firmservice.RINO_test(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 16) {
        const responseFirm = await Firmservice.GINE_test(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 17) {
        const responseFirm = await Firmservice.GINE_prod(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 18) {
        const responseFirm = await Firmservice.RINO_prod(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 19) {
        const responseFirm = await Firmservice.Jorge_test(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 20) {
        const responseFirm = await Firmservice.Jorge_prod(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 21) {
        console.log("Firmando en Koala test")
        console.log(Firm)
        const responseFirm = await Firmservice.Koala_test(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else if (content.tipo == "08") {
          const address = content.re_direccion.split("|");
                    if (address[0].length == 1) {
            address[0] = "0" + address[0];
          }
          data.receptor.direccion = {
            municipio: address[1],
            departamento: address[0],
            complemento: address[2]
          };
        }else {
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 22) {
                console.log("Firmando en Koala test")
        console.log(Firm)
        const responseFirm = await Firmservice.Koala_prod(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else if (content.tipo == "08") {
          const address = content.re_direccion.split("|");

          /*  */
          if (address[0].length == 1) {
            address[0] = "0" + address[0];
          }
          data.receptor.direccion = {
            municipio: address[1],
            departamento: address[0],
            complemento: address[2]
          };
        }else {
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 23) {
        const responseFirm = await Firmservice.default_test(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 24) {
        const responseFirm = await Firmservice.default_prod(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 25) {
        const responseFirm = await Firmservice.default_test(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 26) {
        const responseFirm = await Firmservice.default_prod(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 27) {
        const responseFirm = await Firmservice.default_test(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 28) {
        const responseFirm = await Firmservice.default_prod(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 29) {
        const responseFirm = await Firmservice.default_test(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 30) {
        const responseFirm = await Firmservice.default_prod(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 31) {
        const responseFirm = await Firmservice.default_test(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 32) {
        const responseFirm = await Firmservice.default_prod(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 33) {
        const responseFirm = await Firmservice.default_test(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 34) {
        const responseFirm = await Firmservice.default_prod(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 35) {
        const responseFirm = await Firmservice.default_test(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }

      if (id_emisor == 36) {
        const responseFirm = await Firmservice.default_prod(Firm);
        console.log("firm response")
        console.log(responseFirm);
        data.firma = responseFirm.body;
        data.sellado = content.sellado;
        data.sello = content.sello;
        if (content.tipo == "14") {
          const address = content.re_direccion.split("|");
          data.sujetoExcluido.direccion = address[2];
        }else{
          data.receptor.direccion = content.re_direccion;
        }
      }




      if (id_emisor > 36) {
        const responseFirm = null;
        toast.error("No se encontró firmador registrado");
        return
      }



      // update the bill without the items 
      if (responseFirm) {
        data.receptor.direccion = content.re_direccion;
      }


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


  const testmail = async () => {

    if (content.re_correo_electronico === null || content.re_correo_electronico === "") {
      toast.error("el receptor no tiene correo electronico");
      return

    }
    console.log("testmail");
    console.log("SendBillHandler");
    console.log("---------------content--------------");
    console.log(content);
    console.log(content.ambiente);
    console.log(content.tipo);
    const count = await PlantillaAPI.count(id_emisor, content.tipo, token);

    /* Sending the email */
    if (content.re_correo_electronico === null) {
      toast.error("el receptor no tiene correo electronico");

      return
    }

    if(id_emisor == 7 || id_emisor == 12){
      console.log("---------------enviando--------------");
    console.log(content);
    console.log(token);
    console.log(id_emisor);
    const sendEmailFactura = await SendEmail.sendBillOsegueda(id_emisor, content, token);

    console.log("---------------resultado de mail--------------");
    console.log(sendEmailFactura);

    if (sendEmailFactura.message === "Email sent") {
      toast.success("Email enviado");
    } else {
      toast.error("No enviado problema");
    }
    } else {
      console.log("---------------enviando--------------");
    console.log(content);
    console.log(token);
    console.log(id_emisor);
    const sendEmailFactura = await SendEmail.sendBill(id_emisor, content, token);

    console.log("---------------resultado de mail--------------");
    console.log(sendEmailFactura);

    if (sendEmailFactura.message === "Email sent") {
      toast.success("Email enviado");
    } else {
      toast.error("No enviado problema");
    }
    }




    /* 
        const parseintversion = parseInt(content.version);
        const dataSend = { 
          tipoDte: content.tipo,
          ambiente: content.ambiente,
          idEnvio: parseInt(count[0].count +1),
          version: parseintversion,
          codigoGeneracion: content.codigo_de_generacion,
          documento: content.firm,
        }; */


    /* try {
      console.log(dataSend);
      const senddata = await SendAPI.sendBill(dataSend, tokenminis);
      console.log(senddata);

      
    if (senddata.estado === "PROCESADO") {
      const response = await PlantillaAPI.updatesend(id_emisor,true,senddata.selloRecibido,token,content.codigo_de_generacion);
      console.log("edited");
      console.log(response);
      window.location.reload(); 
    if (senddata.estado === "RECHAZADO")
      alert("Error al enviar la factura", senddata.descripcionMsg);
    }


    } catch (error) {
      console.log(error)
    } */

    /* Call the services */



  }

  const SendBillHandler = async () => {
    setIsLoading(true);
    /*  */
    console.log("SendBillHandler");
    console.log(content);
    console.log("---------------resultado--------------");
    console.log(content.ambiente);
    console.log(content.tipo);
    const count = await PlantillaAPI.count(id_emisor, content.tipo, token);

    const parseintversion = parseInt(content.version);

    if (content.tipo === "01") {
      const dataSend = { /* TODO: SEND */
        tipoDte: content.tipo,
        ambiente: content.ambiente,
        idEnvio: content.id_envio,
        version: parseintversion,
        codigoGeneracion: content.codigo_de_generacion,
        documento: content.firm,
      };

      try {
        console.log(content);
        console.log("---------------dataSend to minis--------------");
        console.log(dataSend);

        /* ADD token minis */
        var resultAuthminis = null;
        if(user.ambiente == "00"){
        resultAuthminis = await LoginAPI.loginMinis(
          user.nit,
          user.codigo_hacienda,
          "MysoftwareSv"
        );
      } else {
        resultAuthminis = await LoginAPI.loginMinis_prod(
          user.nit,
          user.codigo_hacienda,
          "MysoftwareSv"
        );
      }
        console.log(resultAuthminis);
        if (resultAuthminis.status != "OK") {
          toast.error("Error en la autenticación, vuelve a intentar");
          return
        }

        var senddata = null;
        if (user.ambiente == "00") {
        senddata = await SendAPI.sendBill(dataSend, resultAuthminis.body.token.slice(7));
        console.log(senddata);
        } else {
          senddata = await SendAPI.sendBillprod(dataSend, resultAuthminis.body.token.slice(7));
          console.log(senddata);
        }




        if (senddata.estado === "PROCESADO") {
          const response = await PlantillaAPI.updatesend(id_emisor, true, senddata.selloRecibido, token, content.codigo_de_generacion);
          console.log("edited");
          console.log(response);
          setIsLoading(false);


          toast.success("Factura enviada al ministerio");

          /* send email */

          /* Sending the email */


          if (content.re_correo_electronico === null) {
            toast.error("el receptor no tiene correo electronico");

            setTimeout(() => {
              window.location.reload();

            }, 9000);
            return
          }
          if (id_emisor == 7 || id_emisor == 12) {
          console.log("---------------enviando email--------------");
          console.log(content);
          console.log(token);
          console.log(id_emisor);
          const sendEmailFactura = await SendEmail.sendBillOsegueda(id_emisor, content, token);

          console.log("---------------resultado de mail--------------");
          console.log(sendEmailFactura);

          if (sendEmailFactura.message === "Email sent") {
            toast.success("Email enviado");
          } else {
            toast.error("No enviado, problema");
          }
          /* wait for 5 seconds */
          setTimeout(() => {
            window.location.reload();

          }, 9000);
        } else {
          console.log("---------------enviando email--------------");
          console.log(content);
          console.log(token);
          console.log(id_emisor);
          const sendEmailFactura = await SendEmail.sendBill(id_emisor, content, token);

          console.log("---------------resultado de mail--------------");
          console.log(sendEmailFactura);

          if (sendEmailFactura.message === "Email sent") {
            toast.success("Email enviado");
          } else {
            toast.error("No enviado problema");
          }
          /* wait for 5 seconds */
          setTimeout(() => {
            window.location.reload();

          }, 9000);
        }

        }
        setIsLoading(false);


        if (senddata.descripcionMsg == "[identificacion.codigoGeneracion] YA EXISTE UN REGISTRO CON ESE VALOR") {
          toast.warning(`La factura ya fue enviada`);
        } else if (senddata.observaciones[0] == "Faltan datos en peticion para procesar informacion") {
          toast.info(`No se encontró firma`);
        } else {
          if (senddata.estado === "RECHAZADO")
            toast.error(`RECHAZADO ${senddata.descripcionMsg}`);
          console.log(senddata.observaciones);
          for (let i = 0; i < senddata.observaciones.length; i++) {
            toast.warning(`Observación ${i + 1} ${senddata.observaciones[i]}`);
          }
        }
        console.log("---------------resultado--------------");
        console.log(senddata.estado);



      } catch (error) {
        console.log(error)
        toast.error("Error al enviar la factura no autorizado");
      }


    } else if (content.tipo === "03") {
      const dataSend = { /* TODO: SEND */
        tipoDte: content.tipo,
        ambiente: content.ambiente,
        idEnvio: content.id_envio,
        version: parseintversion,
        codigoGeneracion: content.codigo_de_generacion,
        documento: content.firm,
      };

      try {
        console.log(content);
        console.log("---------------dataSend to minis--------------");
        console.log(dataSend);

        /* ADD token minis */
        var resultAuthminis = null;
        if(user.ambiente == "00"){
        resultAuthminis = await LoginAPI.loginMinis(
          user.nit,
          user.codigo_hacienda,
          "MysoftwareSv"
        );
      } else {
        resultAuthminis = await LoginAPI.loginMinis_prod(
          user.nit,
          user.codigo_hacienda,
          "MysoftwareSv"
        );
      }
        console.log(resultAuthminis);
        if (resultAuthminis.status != "OK") {
          toast.success("Error en la autenticación, vuelve a intentar");
          return
        }

        var senddata = null;
        if (user.ambiente == "00") {
        senddata = await SendAPI.sendBill(dataSend, resultAuthminis.body.token.slice(7));
        console.log(senddata);
        } else {
          senddata = await SendAPI.sendBillprod(dataSend, resultAuthminis.body.token.slice(7));
          console.log(senddata);
        }



        if (senddata.estado === "PROCESADO") {
          const response = await PlantillaAPI.updatesend(id_emisor, true, senddata.selloRecibido, token, content.codigo_de_generacion);
          console.log("edited");
          console.log(response);
          setIsLoading(false);

          const responseincrement = await UserService.id_enviopus1(id_emisor, token);
          console.log("incremented");
          console.log(responseincrement);

          toast.success("Factura enviada al ministerio");

          /* send email */

          if (content.re_correo_electronico === null) {
            toast.error("el receptor no tiene correo electronico");

            setTimeout(() => {
              window.location.reload();

            }, 9000);
            return
          }

          if (id_emisor == 7 || id_emisor == 12) {
          console.log("---------------enviando email--------------");
          console.log(content);
          console.log(token);
          console.log(id_emisor);
          const sendEmailFactura = await SendEmail.sendBillOsegueda(id_emisor, content, token);

          console.log("---------------resultado de mail--------------");
          console.log(sendEmailFactura);

          if (sendEmailFactura.message === "Email sent") {
            toast.success("Email enviado");
          } else {
            toast.error("No enviado, problema");
          }
          /* wait for 5 seconds */
          setTimeout(() => {
            window.location.reload();

          }, 9000);
        } else {
          console.log("---------------enviando email--------------");
          console.log(content);
          console.log(token);
          console.log(id_emisor);
          const sendEmailFactura = await SendEmail.sendBill(id_emisor, content, token);

          console.log("---------------resultado de mail--------------");
          console.log(sendEmailFactura);

          if (sendEmailFactura.message === "Email sent") {
            toast.success("Email enviado");
          } else {
            toast.error("No enviado problema");
          }
          /* wait for 5 seconds */
          setTimeout(() => {
            window.location.reload();

          }, 9000);
        }
        }
        setIsLoading(false);

        if (senddata.descripcionMsg == "[identificacion.codigoGeneracion] YA EXISTE UN REGISTRO CON ESE VALOR") {
          toast.warning(`La factura ya fue enviada`);
        } else if (senddata.observaciones[0] == "Faltan datos en peticion para procesar informacion") {
          toast.info(`No se encontró firma`);
        } else {
          if (senddata.estado === "RECHAZADO")
            toast.error(`RECHAZADO ${senddata.descripcionMsg}`);
          console.log(senddata.observaciones);
          for (let i = 0; i < senddata.observaciones.length; i++) {
            toast.warning(`motivo ${i + 1} ${senddata.observaciones[i]}`);
          }
        }

        console.log("---------------resultado--------------");
        console.log(senddata.estado);



      } catch (error) {
        console.log(error)
        toast.error("Error al enviar la factura no autorizado");
      }
    } else if (content.tipo === "14") {
      const dataSend = { /* TODO: SEND */
        tipoDte: content.tipo,
        ambiente: content.ambiente,
        idEnvio: content.id_envio,
        version: parseintversion,
        codigoGeneracion: content.codigo_de_generacion,
        documento: content.firm,
      };

      try {
        console.log(content);
        console.log("---------------dataSend to minis--------------");
        console.log(dataSend);

        /* ADD token minis */
        var resultAuthminis = null;
        if(user.ambiente == "00"){
        resultAuthminis = await LoginAPI.loginMinis(
          user.nit,
          user.codigo_hacienda,
          "MysoftwareSv"
        );
      } else {
        resultAuthminis = await LoginAPI.loginMinis_prod(
          user.nit,
          user.codigo_hacienda,
          "MysoftwareSv"
        );
      }
        console.log(resultAuthminis);
        if (resultAuthminis.status != "OK") {
          toast.success("Error en la autenticación, vuelve a intentar");
          return
        }

        var senddata = null;
        if (user.ambiente == "00") {
        senddata = await SendAPI.sendBill(dataSend, resultAuthminis.body.token.slice(7));
        console.log(senddata);
        } else {
          senddata = await SendAPI.sendBillprod(dataSend, resultAuthminis.body.token.slice(7));
          console.log(senddata);
        }


        if (senddata.estado === "PROCESADO") {
          const response = await PlantillaAPI.updatesend(id_emisor, true, senddata.selloRecibido, token, content.codigo_de_generacion);
          console.log("edited");
          console.log(response);
          setIsLoading(false);

          const responseincrement = await UserService.id_enviopus1(id_emisor, token);
          console.log("incremented");
          console.log(responseincrement);

          toast.success("Factura enviada al ministerio");

          /* send email */

          if (content.re_correo_electronico === null) {
            toast.error("el receptor no tiene correo electronico");

            setTimeout(() => {
              window.location.reload();

            }, 9000);
            return
          }

          if(id_emisor == 7 || id_emisor == 12){
            console.log("---------------enviando email--------------");
          console.log(content);
          console.log(token);
          console.log(id_emisor);
          const sendEmailFactura = await SendEmail.sendBillOsegueda(id_emisor, content, token);

          console.log("---------------resultado de mail--------------");
          console.log(sendEmailFactura);

          /*  window.location.reload(); */
          setTimeout(() => {
            window.location.reload();

          }, 9000);
          } else {
          console.log("---------------enviando email--------------");
          console.log(content);
          console.log(token);
          console.log(id_emisor);
          const sendEmailFactura = await SendEmail.sendBill(id_emisor, content, token);

          console.log("---------------resultado de mail--------------");
          console.log(sendEmailFactura);

          /*  window.location.reload(); */
          setTimeout(() => {
            window.location.reload();

          }, 9000);
          }
        }
        setIsLoading(false);

        if (senddata.descripcionMsg == "[identificacion.codigoGeneracion] YA EXISTE UN REGISTRO CON ESE VALOR") {
          toast.warning(`La factura ya fue enviada`);
        } else if (senddata.observaciones[0] == "Faltan datos en peticion para procesar informacion") {
          toast.info(`No se encontró firma`);
        } else {
          if (senddata.estado === "RECHAZADO")
            toast.error(`RECHAZADO ${senddata.descripcionMsg}`);
          console.log(senddata.observaciones);
          for (let i = 0; i < senddata.observaciones.length; i++) {
            toast.warning(`motivo ${i + 1} ${senddata.observaciones[i]}`);
          }
        }

        console.log("---------------resultado--------------");
        console.log(senddata.estado);



      } catch (error) {
        console.log(error)
        toast.error("Error al enviar la factura no autorizado");
      }
    } else if (content.tipo === "05") {
      const dataSend = { /* TODO: SEND */
        tipoDte: content.tipo,
        ambiente: content.ambiente,
        idEnvio: content.id_envio,
        version: parseintversion,
        codigoGeneracion: content.codigo_de_generacion,
        documento: content.firm,
      };

      try {
        console.log(content);
        console.log("---------------dataSend to minis--------------");
        console.log(dataSend);

        /* ADD token minis */
        /* ADD token minis */
        var resultAuthminis = null;
        if(user.ambiente == "00"){
        resultAuthminis = await LoginAPI.loginMinis(
          user.nit,
          user.codigo_hacienda,
          "MysoftwareSv"
        );
      } else {
        resultAuthminis = await LoginAPI.loginMinis_prod(
          user.nit,
          user.codigo_hacienda,
          "MysoftwareSv"
        );
      }
        console.log(resultAuthminis);
        if (resultAuthminis.status != "OK") {
          toast.success("Error en la autenticación, vuelve a intentar");
          return
        }

        var senddata = null;
        if (user.ambiente == "00") {
        senddata = await SendAPI.sendBill(dataSend, resultAuthminis.body.token.slice(7));
        console.log(senddata);
        } else {
          senddata = await SendAPI.sendBillprod(dataSend, resultAuthminis.body.token.slice(7));
          console.log(senddata);
        }


        if (senddata.estado === "PROCESADO") {
          const response = await PlantillaAPI.updatesend(id_emisor, true, senddata.selloRecibido, token, content.codigo_de_generacion);
          console.log("edited");
          console.log(response);
          setIsLoading(false);

          const responseincrement = await UserService.id_enviopus1(id_emisor, token);
          console.log("incremented");
          console.log(responseincrement);

          toast.success("Factura enviada al ministerio");

          /* send email */

          if (content.re_correo_electronico === null) {
            toast.error("el receptor no tiene correo electronico");

            setTimeout(() => {
              window.location.reload();

            }, 9000);
            return
          }

          if (id_emisor == 7 || id_emisor == 12) {
          console.log("---------------enviando email--------------");
          console.log(content);
          console.log(token);
          console.log(id_emisor);
          const sendEmailFactura = await SendEmail.sendBillOsegueda(id_emisor, content, token);

          console.log("---------------resultado de mail--------------");
          console.log(sendEmailFactura);

          if (sendEmailFactura.message === "Email sent") {
            toast.success("Email enviado");
          } else {
            toast.error("No enviado, problema");
          }
          /* wait for 5 seconds */
          setTimeout(() => {
            window.location.reload();

          }, 9000);
        } else {
          console.log("---------------enviando email--------------");
          console.log(content);
          console.log(token);
          console.log(id_emisor);
          const sendEmailFactura = await SendEmail.sendBill(id_emisor, content, token);

          console.log("---------------resultado de mail--------------");
          console.log(sendEmailFactura);

          if (sendEmailFactura.message === "Email sent") {
            toast.success("Email enviado");
          } else {
            toast.error("No enviado problema");
          }
          /* wait for 5 seconds */
          setTimeout(() => {
            window.location.reload();

          }, 9000);
        }
        }

        setIsLoading(false);
        if (senddata.descripcionMsg == "[identificacion.codigoGeneracion] YA EXISTE UN REGISTRO CON ESE VALOR") {
          toast.error(`La factura ya fue enviada`);
        } else if (senddata.observaciones[0] == "Faltan datos en peticion para procesar informacion") {
          toast.info(`No se encontró firma`);
        } else {
          if (senddata.estado === "RECHAZADO")

            toast.error(`RECHAZADO ${senddata.descripcionMsg}`);
          console.log(senddata.observaciones);
          for (let i = 0; i < senddata.observaciones.length; i++) {
            toast.warning(`motivo ${i + 1} ${senddata.observaciones[i]}`);
          }
        }

        console.log("---------------resultado--------------");
        console.log(senddata.estado);



      } catch (error) {
        console.log(error)
        toast.error("Error al enviar la factura no autorizado");
      }
    } else if (content.tipo === "06") {
      const dataSend = { /* TODO: SEND */
        tipoDte: content.tipo,
        ambiente: content.ambiente,
        idEnvio: content.id_envio,
        version: parseintversion,
        codigoGeneracion: content.codigo_de_generacion,
        documento: content.firm,
      };

      try {
        console.log(content);
        console.log("---------------dataSend to minis--------------");
        console.log(dataSend);

        /* ADD token minis */
        var resultAuthminis = null;
        if(user.ambiente == "00"){
        resultAuthminis = await LoginAPI.loginMinis(
          user.nit,
          user.codigo_hacienda,
          "MysoftwareSv"
        );
      } else {
        resultAuthminis = await LoginAPI.loginMinis_prod(
          user.nit,
          user.codigo_hacienda,
          "MysoftwareSv"
        );
      }
        console.log(resultAuthminis);
        if (resultAuthminis.status != "OK") {
          toast.success("Error en la autenticación, vuelve a intentar");
          return
        }

        var senddata = null;
        if (user.ambiente == "00") {
        senddata = await SendAPI.sendBill(dataSend, resultAuthminis.body.token.slice(7));
        console.log(senddata);
        } else {
          senddata = await SendAPI.sendBillprod(dataSend, resultAuthminis.body.token.slice(7));
          console.log(senddata);
        }



        if (senddata.estado === "PROCESADO") {
          const response = await PlantillaAPI.updatesend(id_emisor, true, senddata.selloRecibido, token, content.codigo_de_generacion);
          console.log("edited");
          console.log(response);
          setIsLoading(false);

          const responseincrement = await UserService.id_enviopus1(id_emisor, token);
          console.log("incremented");
          console.log(responseincrement);

          toast.success("Factura enviada al ministerio");

          /* send email */

          if (content.re_correo_electronico === null) {
            toast.error("el receptor no tiene correo electronico");

            setTimeout(() => {
              window.location.reload();

            }, 9000);
            return
          }

          if (id_emisor == 7 || id_emisor == 12) {
          console.log("---------------enviando email--------------");
          console.log(content);
          console.log(token);
          console.log(id_emisor);
          const sendEmailFactura = await SendEmail.sendBillOsegueda(id_emisor, content, token);

          console.log("---------------resultado de mail--------------");
          console.log(sendEmailFactura);

          if (sendEmailFactura.message === "Email sent") {
            toast.success("Email enviado");
          } else {
            toast.error("No enviado, problema");
          }
          /* wait for 5 seconds */
          setTimeout(() => {
            window.location.reload();

          }, 9000);
        } else {
          console.log("---------------enviando email--------------");
          console.log(content);
          console.log(token);
          console.log(id_emisor);
          const sendEmailFactura = await SendEmail.sendBill(id_emisor, content, token);

          console.log("---------------resultado de mail--------------");
          console.log(sendEmailFactura);

          if (sendEmailFactura.message === "Email sent") {
            toast.success("Email enviado");
          } else {
            toast.error("No enviado problema");
          }
          /* wait for 5 seconds */
          setTimeout(() => {
            window.location.reload();

          }, 9000);
        }
        }

        setIsLoading(false);
        if (senddata.descripcionMsg == "[identificacion.codigoGeneracion] YA EXISTE UN REGISTRO CON ESE VALOR") {
          toast.error(`La factura ya fue enviada`);
        } else if (senddata.observaciones[0] == "Faltan datos en peticion para procesar informacion") {
          toast.info(`No se encontró firma`);
        } else {
          if (senddata.estado === "RECHAZADO")
            toast.error(`RECHAZADO ${senddata.descripcionMsg}`);
          console.log(senddata.observaciones);
          for (let i = 0; i < senddata.observaciones.length; i++) {
            toast.warning(`motivo ${i + 1} ${senddata.observaciones[i]}`);
          }
        }

        console.log("---------------resultado--------------");
        console.log(senddata.estado);



      } catch (error) {
        console.log(error)
        toast.error("Error al enviar la factura no autorizado");
      }
    }else if (content.tipo === "08") {
      const dataSend = { /* TODO: SEND */
        tipoDte: content.tipo,
        ambiente: content.ambiente,
        idEnvio: content.id_envio,
        version: parseintversion,
        codigoGeneracion: content.codigo_de_generacion,
        documento: content.firm,
      };

      try {
        console.log(content);
        console.log("---------------dataSend to minis--------------");
        console.log(dataSend);

        /* ADD token minis */
        var resultAuthminis = null;
        if(user.ambiente == "00"){
        resultAuthminis = await LoginAPI.loginMinis(
          user.nit,
          user.codigo_hacienda,
          "MysoftwareSv"
        );
      } else {
        resultAuthminis = await LoginAPI.loginMinis_prod(
          user.nit,
          user.codigo_hacienda,
          "MysoftwareSv"
        );
      }
        console.log(resultAuthminis);
        if (resultAuthminis.status != "OK") {
          toast.success("Error en la autenticación, vuelve a intentar");
          return
        }

        var senddata = null;
        if (user.ambiente == "00") {
        senddata = await SendAPI.sendBill(dataSend, resultAuthminis.body.token.slice(7));
        console.log(senddata);
        } else {
          senddata = await SendAPI.sendBillprod(dataSend, resultAuthminis.body.token.slice(7));
          console.log(senddata);
        }



        if (senddata.estado === "PROCESADO") {
          const response = await PlantillaAPI.updatesend(id_emisor, true, senddata.selloRecibido, token, content.codigo_de_generacion);
          console.log("edited");
          console.log(response);
          setIsLoading(false);

          const responseincrement = await UserService.id_enviopus1(id_emisor, token);
          console.log("incremented");
          console.log(responseincrement);

          toast.success("Factura enviada al ministerio");

          /* send email */

          if (content.re_correo_electronico === null) {
            toast.error("el receptor no tiene correo electronico");

            setTimeout(() => {
              window.location.reload();

            }, 9000);
            return
          }

          if (id_emisor == 7 || id_emisor == 12) {
          console.log("---------------enviando email--------------");
          console.log(content);
          console.log(token);
          console.log(id_emisor);
          const sendEmailFactura = await SendEmail.sendBillOsegueda(id_emisor, content, token);

          console.log("---------------resultado de mail--------------");
          console.log(sendEmailFactura);

          if (sendEmailFactura.message === "Email sent") {
            toast.success("Email enviado");
          } else {
            toast.error("No enviado, problema");
          }
          /* wait for 5 seconds */
          setTimeout(() => {
            window.location.reload();

          }, 9000);
        } else {
          console.log("---------------enviando email--------------");
          console.log(content);
          console.log(token);
          console.log(id_emisor);
          const sendEmailFactura = await SendEmail.sendBill(id_emisor, content, token);

          console.log("---------------resultado de mail--------------");
          console.log(sendEmailFactura);

          if (sendEmailFactura.message === "Email sent") {
            toast.success("Email enviado");
          } else {
            toast.error("No enviado problema");
          }
          /* wait for 5 seconds */
          setTimeout(() => {
            window.location.reload();

          }, 9000);
        }
        }

        setIsLoading(false);
        if (senddata.descripcionMsg == "[identificacion.codigoGeneracion] YA EXISTE UN REGISTRO CON ESE VALOR") {
          toast.error(`La factura ya fue enviada`);
        } else if (senddata.observaciones[0] == "Faltan datos en peticion para procesar informacion") {
          toast.info(`No se encontró firma`);
        } else {
          if (senddata.estado === "RECHAZADO")
            toast.error(`RECHAZADO ${senddata.descripcionMsg}`);
          console.log(senddata.observaciones);
          for (let i = 0; i < senddata.observaciones.length; i++) {
            toast.warning(`motivo ${i + 1} ${senddata.observaciones[i]}`);
          }
        }

        console.log("---------------resultado--------------");
        console.log(senddata.estado);



      } catch (error) {
        console.log(error)
        toast.error("Error al enviar la factura no autorizado");
      }
    }

  };

  // Determine the button color and additional content based on `content.firm`
  const buttonStyle = content.firm ? "bg-stone-200" : " bg-lightgreen";

  const firmbutton = content.firm ? (
    <div className="flex w-full flex-row">
      <button
        onClick={ValidateBillHandler}
        className={`relative w-full h-12 md:h-12 cursor-pointer [border:none] px-3 ${buttonStyle} rounded-lg flex items-center justify-center z-[2] hover:bg-lightgray-100`}
      >
        <img src={checkimg} alt="Tick" className="w-7 h-7" />
        <img src={signature} className="h-7 w-7 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none" alt="" />

      </button>
    </div>
  ) : (
    <div className="flex w-full flex-row">
      <button
        onClick={ValidateBillHandler}
        className={`w-full h-12 md:h-12 cursor-pointer [border:none] px-3 ${buttonStyle} rounded-lg flex items-center justify-center z-[2] hover:bg-lightgray-100`}
      >
        <div className="relative z-[3]">
          <img src={signature} className="h-7 w-7" alt="Firmar" />
        </div>
      </button>
    </div>
  );

  const sendedebutton = content.sellado ? (
    <div className="self-center flex w-full flex-row">
      <button
        onClick={SendBillHandler}
        className={`relative w-full h-12 md:h-12 cursor-pointer [border:none] px-6 ${buttonStyle} rounded-lg flex items-center justify-center z-[2] hover:bg-lightgray-100`}
      >

        <img src={checkimg} alt="Tick" className="w-[30px] h-[30px]" />
        <img src={direct} className="h-7 w-7 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none" alt="" />



      </button>
    </div>
  ) : (
    <div className="self-center flex w-full flex-row">
      <button
        onClick={SendBillHandler}
        className={`relative w-full h-12 md:h-12 cursor-pointer [border:none] px-6 ${buttonStyle} rounded-lg flex items-center justify-center z-[2] hover:bg-lightgray-100`}
      >
        <img src={direct} className="h-7 w-7" alt="Enviar" />
      </button>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="loader"></div>
        </div>
      )}


    </div>
  );

  const testbutton = content.sellado ? (
    <div className="flex w-full flex-row">
      <button
        onClick={testmail}
        className={`relative w-full h-12 md:h-12 cursor-pointer [border:none] px-3 ${buttonStyle} rounded-lg flex items-center justify-center z-[2] hover:bg-lightgray-100`}
      >
        <img src={mailchecker ? checkimg : cross} alt={mailchecker ? "Tick" : "Cross"} className="w-[30px] h-[30px]" />
        <img src={mailimg} className="h-7 w-7 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none" alt="Mail" />

      </button>
    </div>
  ) : (
    <div className="flex w-full flex-row">
      <button
        onClick={testmail}
        className={`w-full h-12 md:h-12 cursor-pointer [border:none] px-3 ${buttonStyle} rounded-lg flex items-center justify-center z-[2] hover:bg-lightgray-100`}
      >
        <div className="relative z-[3]">
          <img src={mailimg} className="h-8 w-8" alt="Mail" />
        </div>
      </button>
    </div>
  );

  // Botón eliminar: siempre visible; sólo activo si canDelete (última no sellada)
  /* Delete bill handler using the services */

  const DeleteBillHandler = async () => {
    console.log("DeleteBillHandler");
    try {
      const response = await PlantillaAPI.deletePlantillabyCodeGeneration(content.codigo_de_generacion, token);
      console.log("deleted");
      console.log(response);
      if (response.message === "plantilla eliminado") {
        // Disminuir correlativo según tipo de DTE
        try {
          if (content.tipo === "03") {
            await EmisorService.decrease_fiscal(id_emisor, token);
          } else {
            await EmisorService.decrease_factura(id_emisor, token);
          }
          await EmisorService.decrease_envio(id_emisor, token);
        } catch (e) {
          console.error("Error al decrementar contadores:", e);
        }
        toast.success("Plantilla eliminada");
/*         setTimeout(() => {
          window.location.reload();
        }, 2000); */
      } else {
        toast.error("Error al eliminar la plantilla recarga pagina");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error inesperado al eliminar");
    }
  };

  const [isActivedownload, setIsActivedownload] = useState(false);
  const [isActivecross, setIsActivecross] = useState(false);
  const [isActiveedit, setIsActiveedit] = useState(false);
  const [isActivefirm, setIsActivefirm] = useState(false);
  const [isActivesend, setIsActivesend] = useState(false);
  const [isActivemail, setIsActivemail] = useState(false);

  const handleClickdownload = () => {
    setIsActivedownload(true);
    DownloadBillHandler();
    setTimeout(() => {
      setIsActivedownload(false);
    }, 1000);
  };

  const handelrisActivecross = () => {
    setIsActivecross(true);
    DeleteBillHandler();
    setTimeout(() => {
      setIsActivecross(false);
    }, 1000);
  }

  return (
  <div className="w-full max-w-full mx-0 bg-white rounded-xl shadow-sm ring-1 ring-black/5 px-3 sm:px-5 py-4 sm:py-5 my-6 text-black font-inria-sans overflow-hidden break-words box-border">
    <header className="flex items-center justify-between min-w-0 w-full">
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-gainsboro-200 text-black border border-gray-300">
            {tipo || 'Documento'}
          </span>
        </div>
  <div className="flex items-center gap-2 flex-shrink-0">
          {/* <img
            className="w-[33px] h-[33px] relative object-cover z-[3]"
            loading="lazy"
            onClick={ViewBillHandler}
            alt=""
            src="/ver@2x.png"
          /> */}
          <button
            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gainsboro-200 transition"
            onClick={EditBillHandler}
            title="Editar"
          >
            <img
              className="h-6 w-6"
              loading="lazy"
              alt="Editar"
              src="/editar@2x.png"
            />
          </button>
          <button
            className={`h-8 w-8 flex items-center justify-center rounded-md ${isActivedownload ? 'bg-gainsboro-200' : 'hover:bg-gainsboro-200'} transition`}
            onClick={handleClickdownload}
            title="Descargar"
          >
            <img
              className="h-6 w-6"
              loading="lazy"
              alt="Descargar"
              src="/descargar@2x.png"
            />
          </button>
          <button
            className={`h-8 w-8 flex items-center justify-center rounded-md ${!canDelete ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gainsboro-200'} transition`}
            onClick={canDelete ? handelrisActivecross : (e) => e.preventDefault()}
            disabled={!canDelete}
            title={canDelete ? 'Eliminar factura' : 'Sólo la última factura no sellada se puede eliminar'}
          >
            <img
              className="h-5 w-5"
              loading="lazy"
              alt="Eliminar"
              src={imgx}
            />
          </button>


        </div>

      </header>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="space-y-1 min-w-0">
          <div className="text-lg font-bold break-words whitespace-normal">{content.re_name}</div>
          <div className="text-base text-black break-all whitespace-normal">Documento: {content.re_nit ? content.re_nit : content.re_numdocumento}</div>
          <div className="text-base text-black break-words whitespace-normal">Correo: {content.re_correo_electronico || '—'}</div>
          <div className="text-base text-black break-words whitespace-normal">Teléfono: {content.re_numero_telefono || '—'}</div>
          {
            <div className="text-sm text-black space-y-0.5">
              <div>Código de generación: {content.codigo_de_generacion}</div>
              <div>Número de control: {content.numero_de_control}</div>
            </div>
          }
        </div>
        <div className="flex md:items-end md:justify-end min-w-0">
          <div className="inline-flex items-center gap-2 bg-gainsboro-200 px-3 py-2 rounded-lg border border-gray-300">
            <span className="text-sm font-medium text-black">TOTAL</span>
            <span className="text-lg font-bold tracking-wide">${formattedTotal}</span>
          </div>
        </div>
      </div>

      {/* Footer actions: stack on mobile; on larger screens, center button is wider */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-5 items-center gap-3">
        <div className="sm:col-span-1 flex w-full justify-start">{firmbutton}</div>
        <div className="sm:col-span-3 flex w-full justify-center">{sendedebutton}</div>
        <div className="sm:col-span-1 flex w-full justify-end">{testbutton}</div>
      </div>
    </div>
  );
};
export default FrameComponent1;
