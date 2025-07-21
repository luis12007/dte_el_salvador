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


const FrameComponent1 = ({ key, content, user }) => {
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

        if (data[0].tributos === null) {
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
      const responseFirm = null;
      if (id_emisor == 1 || id_emisor == 2 || id_emisor == 3) {
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

      if (id_emisor > 16) {
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
    }

  };

  // Determine the button color and additional content based on `content.firm`
  const buttonStyle = content.firm ? "bg-stone-200" : " bg-lightgreen";

  const firmbutton = content.firm ? (
    <div className="flex w-1/5  self-start flex-row">
      <button
        onClick={ValidateBillHandler}
        className={`cursor-pointer h-12 [border:none] pt-[11px] pb-3 w-full justify-center pr-3  ${buttonStyle} rounded-lg flex flex-row items-start justify-start z-[2] hover:bg-lightgray-100`}
      >
        <img src={checkimg} alt="Tick" className="w-7 ml-1 h-7" />
        <img src={signature} className="h-7 absolute opacity-30" alt="" />

      </button>
    </div>
  ) : (
    <div className="flex w-1/5 flex-row">
      <button
        onClick={ValidateBillHandler}
        className={`cursor-pointer h-12  [border:none] pt-[10.5px] w-full justify-center pr-1 ${buttonStyle} rounded-lg flex flex-row items-start justify-start z-[2] hover:bg-lightgray-100`}
      >
        <div className="relative text-xs font-light font-inter text-black text-left z-[3]">
          <img src={signature} className="h-7" alt="" />
        </div>
      </button>
    </div>
  );

  const sendedebutton = content.sellado ? (
    <div className="self-center flex w-full flex-row">
      <button
        onClick={SendBillHandler}
        className={`cursor-pointer h-12 [border:none] w-full pt-[11px] pb-3 pr-[23px] pl-[22px] ${buttonStyle} rounded-lg flex flex-row items-center justify-center z-[2] hover:bg-lightgray-100`}
      >

        <img src={checkimg} alt="Tick" className="w-[30px] h-[30px]" />
        <img src={direct} className="h-7 absolute opacity-30" alt="" />



      </button>
    </div>
  ) : (
    <div className="self-center flex  w-full flex-row">
      <button
        onClick={SendBillHandler}
        className={`cursor-pointer h-12 w-full [border:none] justify-center items-center ${buttonStyle} rounded-lg flex flex-row items-start justify-start z-[2] hover:bg-lightgray-100`}
      >
        <img src={direct} className="h-7" alt="" />
      </button>

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="loader"></div>
        </div>
      )}


    </div>
  );

  const testbutton = content.sellado ? (
    <div className="flex  w-1/5 flex-row">
      <button
        onClick={testmail}
        className={`cursor-pointer h-12 [border:none] pt-[10px] w-full justify-center pr-2  ${buttonStyle} rounded-lg flex flex-row z-[2] hover:bg-lightgray-100`}
      >
        <img src={mailchecker ? checkimg : cross} alt={mailchecker ? "Tick" : "Cross"} className="w-[30px] h-[30px]" />
        <img src={mailimg} className="h-7 absolute opacity-30" alt="" />

      </button>
    </div>
  ) : (
    <div className="flex w-1/5   flex-row">
      <button
        onClick={testmail}
        className={`cursor-pointer h-12  [border:none] pt-[8px] w-full justify-center pr-2.2  ${buttonStyle} rounded-lg flex flex-row z-[2] hover:bg-lightgray-100`}
      >
        <div className="relative text-xs font-light font-inter text-black text-left z-[3]">
          <img src={mailimg} className="h-8 w-8" alt="" />
        </div>
      </button>
    </div>
  );


  /* Delete bill handler using the services */

  const DeleteBillHandler = async () => {
    console.log("DeleteBillHandler");
    const response = await PlantillaAPI.deletePlantillabyCodeGeneration(content.codigo_de_generacion, token);
    console.log("deleted");
    console.log(response);
    if (response.message === "plantilla eliminado") {
      toast.success("Plantilla eliminada");
      /* wait 5 seconds */
      setTimeout(() => {
        window.location.reload();

      }, 5000);
    } else {
      toast.error("Error al eliminar la plantilla recarga pagina");
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
    <div className="flex w-full self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex-col items-center ml-2 pb-3 box-border my-6  text-black font-inria-sans ">
      <header className="self-stretch  rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-between pt-1 pb-0 pr-[10px] pl-[15px] box-border text-xl text-black font-inria-sans ">
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
          <img
            className="w-[26px]  h-[26px] rounded-lg px-2 py-1 my-1 focus:pointer-events-auto hover:bg-white  relative object-cover z-[3]"
            loading="lazy"
            onClick={EditBillHandler}
            alt=""
            src="/editar@2x.png"
          />
          <button
            className={`h-[33px] w-[30px] mt-0.5 flex items-center justify-center rounded-lg focus:pointer-events-auto focus:outline-none  ${isActivedownload ? 'bg-white focus:ring-gray-200' : 'bg-gainsboro-200'}`}
            onClick={handleClickdownload}
          >
            <img
              className="h-[30px] w-[30px]"
              loading="lazy"
              alt=""
              src="/descargar@2x.png"
            />
          </button>
          {content.sellado ? false : (
            <button
              className={`h-[33px] w-[30px] mt-0.5 flex items-center justify-center rounded-lg focus:pointer-events-auto focus:outline-none  ${isActivecross ? 'bg-white focus:ring-gray-200' : 'bg-gainsboro-200'}`}
              onClick={handelrisActivecross}
            >
              <img
                className="h-[20px]  pt-1 w-[20px] relative object-cover z-[3] rounded-lg px-2 py-1 my-1 focus:pointer-events-auto hover:bg-white"
                loading="lazy"
                alt=""
                src={imgx}
              />
            </button>
          )}


        </div>

      </header>

      <div className="">
        <div className=""></div>
      </div>
      <div className="self-stretch flex flex-row items-center justify-center  py-0 px-[10px] box-border">
        <div className="flex flex-col justify-center self-center w-full">
          <div className="flex-1 flex px-4 flex-col items-center justify-center  pt-[7px]  pb-0">
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
          <div className="flex-1 flex w-full  pt-4 flex-col items-center justify-center gap-[8px_0px]">
            <button
              className="cursor-pointer [border:none] px-3 py-1 bg-gay-100 rounded-mini shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap z-[1] hover:bg-gainsboro-100">
              <b className="relative text-11xl font-inria-sans text-black text-left whitespace-nowrap z-[2]">
                TOTAL: ${formattedTotal}
              </b>
            </button>
            <div className="w-full  flex pt-4 gap-[0px_12px]">
              {firmbutton}
              <div className="flex-grow flex justify-center">
                {sendedebutton}
              </div>
              {testbutton}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
export default FrameComponent1;
