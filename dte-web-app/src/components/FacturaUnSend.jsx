import React, { useEffect, useState } from "react";
import checkimg from "../assets/imgs/marca-de-verificacion.png";
import Firmservice from "../services/Firm";
import PlantillaAPI from "../services/PlantillaService";
import SendAPI from "../services/SendService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FrameComponent1 = ({key, content , user}) => {
  const [tipo, setTipo] = useState("");
  const token = localStorage.getItem("token");
  const id_emisor = localStorage.getItem("user_id");
  const tokenminis = localStorage.getItem("tokenminis");
  useEffect(() => {
    if (content.tipo === "01") {
      setTipo("Factura");
    } else if (content.tipo === "03") {
      setTipo("Credito Fiscal");
    }
  }, []);

  const ViewBillHandler = () => {
    console.log("ViewBillHandler");
  };

  const EditBillHandler = () => {
    console.log("EditBillHandler");
  };

  const DownloadBillHandler = () => {
    console.log("DownloadBillHandler");
  };

  const ValidateBillHandler = async () => {
    const data = {
      identificacion: {
        version: 1 /* TODO: SEARCH IN DOCUMENTATION try with 1 2 3 and 4*/,
        ambiente: "00" /* 0 dev mode 1 to production */,
        tipoDte: "01" /* 01 factura  and  03 CF*/,
        numeroControl:
          content.numero_de_control /* Pending dinamic LOCAL */,
        codigoGeneracion: content.codigo_de_generacion /* DONE */,
        tipoModelo: 1 /* 1 Modelo Facturación previo and 2 modelo diferido ???        */,
        tipoOperacion: 1 /* 1 Transmisión normal  2 to contingencia       */,
        fecEmi: "2024-03-06" /* DINAMIC LOCAL */,
        horEmi: "09:52:47" /* DINAMIC LOCAL */,
        tipoMoneda: "USD" /* STOCK */,
        tipoContingencia: null /* review the types (Stock) */,
        motivoContin: null /* STOCK */,
      },
      documentoRelacionado: null /* STOCK */,
      emisor: {
        direccion: {
          municipio:
            "01" /* 01 Ahuachapán  02 Santa Ana  03 Sonsonate  04 Chalatenango  05 La Libertad  06 San Salvador  07 Cuscatlán  08 La Paz  09 Cabañas  10 San Vicente  11 Usulután  12 San Miguel  13 Morazán  14 La Unión */,
          departamento:
            "05" /* 00 Otro País 00    01 AHUACHAPÁN 01    02 APANECA 01    03 ATIQUIZAYA 01    04 CONCEPCIÓN DE ATACO 01    05 EL REFUGIO 01    06 GUAYMANGO 01    07 JUJUTLA 01    08 SAN FRANCISCO MENÉNDEZ 01    09 SAN LORENZO 01    10 SAN PEDRO PUXTLA 01    11 TACUBA 01    12 TURÍN 01    01 CANDELARIA DE LA FRONTERA 02    02 COATEPEQUE 02    03 CHALCHUAPA 02    04 EL CONGO 02    05 EL PORVENIR 02    06 MASAHUAT 02    07 METAPÁN 02    08 SAN ANTONIO PAJONAL 02    09 SAN SEBASTIÁN SALITRILLO 02    10 SANTA ANA 02    11 STA ROSA GUACHI 02    12 STGO D LA FRONT 02    13 TEXISTEPEQUE 02    01 ACAJUTLA 03    02 ARMENIA 03    03 CALUCO 03    04 CUISNAHUAT 03    05 STA I ISHUATAN 03    06 IZALCO 03    07 JUAYÚA 03    08 NAHUIZALCO 03    09 NAHULINGO 03    10 SALCOATITÁN 03    11 SAN ANTONIO DEL MONTE 03    12 SAN JULIÁN 03    13 STA C MASAHUAT 03  14 SANTO DOMINGO GUZMÁN 03    15 SONSONATE 03    16 SONZACATE 03    01 AGUA CALIENTE 04    02 ARCATAO 04    03 AZACUALPA 04    04 CITALÁ 04    05 COMALAPA 04    06 CONCEPCIÓN QUEZALTEPEQUE 04    07 CHALATENANGO 04    08 DULCE NOM MARÍA 04    09 EL CARRIZAL 04    10 EL PARAÍSO 04    11 LA LAGUNA 04    12 LA PALMA 04    13 LA REINA 04    14 LAS VUELTAS 04    15 NOMBRE DE JESUS 04    16 NVA CONCEPCIÓN 04    17 NUEVA TRINIDAD 04    18 OJOS DE AGUA 04    19 POTONICO 04    20 SAN ANT LA CRUZ 04    21 SAN ANT RANCHOS 04    22 SAN FERNANDO 04    23 SAN FRANCISCO LEMPA 04    24 SAN FRANCISCO MORAZÁN 04    25 SAN IGNACIO 04    26 SAN I LABRADOR 04    27 SAN J CANCASQUE 04    28 SAN JOSE FLORES 04    29 SAN LUIS CARMEN 04    30 SN MIG MERCEDES 04    31 SAN RAFAEL 04    32 SANTA RITA 04    33 TEJUTLA 04    01 ANTGO CUSCATLÁN 05    02 CIUDAD ARCE 05    03 COLON 05 04 COMASAGUA 05
          05 CHILTIUPAN 05
          06 HUIZÚCAR 05
          07 JAYAQUE 05
          08 JICALAPA 05
          09 LA LIBERTAD 05
          10 NUEVO CUSCATLÁN 05
          11 SANTA TECLA 05
          12 QUEZALTEPEQUE 05
          13 SACACOYO 05
          14 SN J VILLANUEVA 05
          15 SAN JUAN OPICO 05
          16 SAN MATÍAS 05
          17 SAN P TACACHICO 05
          18 TAMANIQUE 05
          19 TALNIQUE 05
          20 TEOTEPEQUE 05
          21 TEPECOYO 05
          22 ZARAGOZA 05
          01 AGUILARES 06
          02 APOPA 06
          03 AYUTUXTEPEQUE 06
          04 CUSCATANCINGO 06
          05 EL PAISNAL 06
          06 GUAZAPA 06
          07 ILOPANGO 06
          08 MEJICANOS 06
          09 NEJAPA 06
          10 PANCHIMALCO 06
          11 ROSARIO DE MORA 06
          12 SAN MARCOS 06
          13 SAN MARTIN 06
          14 SAN SALVADOR 06
          15 STG TEXACUANGOS 06
          16 SANTO TOMAS 06
          17 SOYAPANGO 06
          18 TONACATEPEQUE 06
          19 CIUDAD DELGADO 06
          01 CANDELARIA 07 
          02 COJUTEPEQUE 07
          03 EL CARMEN 07
          04 EL ROSARIO 07
          05 MONTE SAN JUAN 07
          06 ORAT CONCEPCIÓN 07
          07 SAN B PERULAPIA 07
          08 SAN CRISTÓBAL 07
          09 SAN J GUAYABAL 07
          10 SAN P PERULAPÁN 07
          11 SAN RAF CEDROS 07
          12 SAN RAMON 07
          13 STA C ANALQUITO 07
          14 STA C MICHAPA 07
          15 SUCHITOTO 07
          16 TENANCINGO 07
          01 CUYULTITÁN 08
          02 EL ROSARIO 08
          03 JERUSALÉN 08
          04 MERCED LA CEIBA 08
          05 OLOCUILTA 08
          06 PARAÍSO OSORIO 08
          07 SN ANT MASAHUAT 08
          08 SAN EMIGDIO 08
          09 SN FCO CHINAMEC 08
          10 SAN J NONUALCO 08
          11 SAN JUAN TALPA 08
          12 SAN JUAN TEPEZONTES 08
          13 SAN LUIS TALPA 08
          14 SAN MIGUEL TEPEZONTES 08
          15 SAN PEDRO MASAHUAT 08
          16 SAN PEDRO NONUALCO 08
          17 SAN R OBRAJUELO 08
          18 STA MA OSTUMA 08
          19 STGO NONUALCO 08
          20 TAPALHUACA 08
          21 ZACATECOLUCA 08
          22 SN LUIS LA HERR 08
          01 CINQUERA 09
          02 GUACOTECTI 09 
          03 ILOBASCO 09
          04 JUTIAPA 09
          05 SAN ISIDRO 09
          06 SENSUNTEPEQUE 09
          07 TEJUTEPEQUE 09
          08 VICTORIA 09
          09 DOLORES 09
          01 APASTEPEQUE 10
          02 GUADALUPE 10
          03 SAN CAY ISTEPEQ 10
          04 SANTA CLARA 10
          05 SANTO DOMINGO 10
          06 SN EST CATARINA 10
          07 SAN ILDEFONSO 10
          08 SAN LORENZO 10
          09 SAN SEBASTIÁN 10
          10 SAN VICENTE 10
          11 TECOLUCA 10
          12 TEPETITÁN 10
          13 VERAPAZ 10
          01 ALEGRÍA 11
          02 BERLÍN 11
          03 CALIFORNIA 11
          04 CONCEP BATRES 11
          05 EL TRIUNFO 11
          06 EREGUAYQUÍN 11
          07 ESTANZUELAS 11
          08 JIQUILISCO 11
          09 JUCUAPA 11
          10 JUCUARÁN 11
          11 MERCEDES UMAÑA 11
          12 NUEVA GRANADA 11
          13 OZATLÁN 11
          14 PTO EL TRIUNFO 11
          15 SAN AGUSTÍN 11
          16 SN BUENAVENTURA 11
          17 SAN DIONISIO 11
          18 SANTA ELENA 11
          19 SAN FCO JAVIER 11 
          20 SANTA MARÍA 11
          21 STGO DE MARÍA 11
          22 TECAPÁN 11
          23 USULUTÁN 11
          01 CAROLINA 12
          02 CIUDAD BARRIOS 12
          03 COMACARÁN 12
          04 CHAPELTIQUE 12
          05 CHINAMECA 12
          06 CHIRILAGUA 12
          07 EL TRANSITO 12
          08 LOLOTIQUE 12
          09 MONCAGUA 12
          10 NUEVA GUADALUPE 12
          11 NVO EDÉN S JUAN 12
          12 QUELEPA 12
          13 SAN ANT D MOSCO 12
          14 SAN GERARDO 12
          15 SAN JORGE 12
          16 SAN LUIS REINA 12
          17 SAN MIGUEL 12
          18 SAN RAF ORIENTE 12
          19 SESORI 12
          20 ULUAZAPA 12
          01 ARAMBALA 13
          02 CACAOPERA 13
          03 CORINTO 13
          04 CHILANGA 13
          05 DELIC DE CONCEP 13
          06 EL DIVISADERO 13
          07 EL ROSARIO 13
          08 GUALOCOCTI 13
          09 GUATAJIAGUA 13
          10 JOATECA 13
          11 JOCOAITIQUE 13
          12 JOCORO 13
          13 LOLOTIQUILLO 13
          14 MEANGUERA 13
          15 OSICALA 13 
          16 PERQUÍN 13
          17 SAN CARLOS 13
          18 |SAN FERNANDO 13
          19 SAN FCO GOTERA 13
          20 SAN ISIDRO 13
          21 SAN SIMÓN 13
          22 SENSEMBRA 13
          23 SOCIEDAD 13
          24 TOROLA 13
          25 YAMABAL 13
          26 YOLOAIQUÍN 13
          01 ANAMOROS 14
          02 BOLÍVAR 14
          03 CONCEP DE OTE 14
          04 CONCHAGUA 14
          05 EL CARMEN 14
          06 EL SAUCE 14
          07 INTIPUCÁ 14
          08 LA UNIÓN 14
          09 LISLIQUE 14
          10 MEANG DEL GOLFO 14
          11 NUEVA ESPARTA 14
          12 PASAQUINA 14
          13 POLORÓS 14
          14 SAN ALEJO 14
          15 SAN JOSE 14
          16 SANTA ROSA LIMA 14
          17 YAYANTIQUE 14
          18 YUCUAIQUÍN 14 

          */,
          complemento: "Bulevar Los Pr\u00f3ceres" /* DINAMIC LOCAL */,
        },
        nit: "02101601741065" /* DINAMIC LOCAL */,
        nrc: "1837811" /* DINAMIC LOCAL */,
        nombre:
          "LUIS ALONSO HERNANDEZ MAGANIA" /* DINAMIC LOCAL */,
        codActividad:
          "86203" /* CAT-019 Código de Actividad Económica 86203 Servicios médicos */,
        descActividad: "Ense\u00f1anza formal" /* DINAMIC LOCAL */,
        telefono: "22106600" /* DINAMIC LOCAL */,
        correo: "tesoreria@uca.edu.sv" /* DINAMIC LOCAL */,
        nombreComercial: "'UCA'" /* DINAMIC LOCAL */,
        tipoEstablecimiento:
          "01" /* 01 Sucursal / Agencia   02 Casa matriz   04 Bodega   07 Predio y/o patio   20 Otro  */,
        codEstableMH: "1234" /* Pending dinamic LOCAL */,
        codEstable: "1234" /* Pending dinamic LOCAL */,
        codPuntoVentaMH: "0016" /* Pending dinamic LOCAL */,
        codPuntoVenta: "0016" /* Pending dinamic LOCAL */,
      },
      receptor: {
        codActividad:
          "10003" /* 99000 Actividades de organizaciones y órganos extraterritoriales
        EMPLEADOS Y OTRAS PERSONAS NATURALES
        10001 Empleados
        10002 Jubilado
        10003 Estudiante
        10004 Desempleado
        10005 Otros */,
        direccion: null /* DINAMIC LOCAL */,
        nrc: null /* DINAMIC LOCAL */,
        descActividad: "Estudiante" /* DINAMIC LOCAL */,
        correo: "00129020@uca.edu.sv" /* DINAMIC LOCAL */,
        tipoDocumento:
          "13" /* 36 NIT   13 DUI   37 Otro   03 Pasaporte   02 Carnet de Residente  */,
        nombre: "LUIS ALEXANDER HERNANDEZ MARTINEZ" /* DINAMIC LOCAL */,
        telefono: "6431-9239" /* DINAMIC LOCAL */,
        numDocumento: "06384275-4" /* DINAMIC LOCAL */,
      },
      otrosDocumentos: null /* STOCK */,
      ventaTercero: null /* STOCK */,
      cuerpoDocumento: [
        /* TODO SEARCH IN DOCUMENTATION */
        {
          codTributo: null /* STOCK */,
          descripcion: "TALONARIO PARQUEO: 50 TICKETS" /* DINAMIC LOCAL */,
          uniMedida: 99 /* CAT-014 Unidad de Medida 99 otra PENDING */,
          codigo: "EST003" /* DINAMIC LOCAL */,
          cantidad: 1 /* DINAMIC LOCAL */,
          numItem: 1 /* DINAMIC LOCAL */,
          tributos: null /* STOCK */,
          ivaItem: 3.4513 /* STOCK */,
          noGravado: 0 /* DINAMIC LOCAL */,
          psv: 0 /* DINAMIC LOCAL */,
          montoDescu: 0 /* DINAMIC LOCAL */,
          numeroDocumento: null /* STOCK */,
          precioUni: 29.9999 /* DINAMIC LOCAL */,
          ventaGravada: 29.9999 /* DINAMIC LOCAL */,
          ventaExenta: 0 /* STOCK */,
          ventaNoSuj: 0 /* STOCK */,
          tipoItem: 2 /* 1 bienes 2 servicio 3 ambos 4 otros */,
        },
      ],
      resumen: {
        condicionOperacion: 1 /* 1 Contado 2 A crédito  3 Otro    */,
        totalIva: 3.45 /* DINAMIC LOCAL */,
        saldoFavor: 0 /* STOCK */,
        numPagoElectronico: null /* STOCK */,
        pagos: [
          {
            periodo: null /* STOCK */,
            plazo: null /* STOCK */,
            montoPago: 30 /* DINAMIC LOCAL */,
            codigo: "01" /* 01 Billetes y monedas
            02 Tarjeta Débito
            03 Tarjeta Crédito
            04 Cheque
            05 Transferencia_ Depósito Bancario
            06 Vales o Cupones
            08 Dinero electrónico
            09 Monedero electrónico
            10 Certificado o tarjeta de regalo
            11 Bitcoin
            12 Otras Criptomonedas
            13 Cuentas por pagar del receptor
            14 Giro bancario
            99 Otros (se debe indicar el medio de pago) 
             */,
            referencia: "20240306090346" /* DINAMIC LOCAL */,
          },
        ],
        totalNoSuj: 0 /* STOCK */,
        tributos: null /* STOCK */,
        totalLetras: "TREINTA CON 0/100 D\u00d3LARES" /* DINAMIC LOCAL */,
        totalExenta: 0 /* STOCK */,
        subTotalVentas: 30 /* DINAMIC LOCAL */,
        totalGravada: 30 /* DINAMIC LOCAL */,
        montoTotalOperacion: 30 /* DINAMIC LOCAL */,
        descuNoSuj: 0 /* STOCK */,
        descuExenta: 0 /* STOCK */,
        descuGravada: 0 /* STOCK */,
        porcentajeDescuento: 0 /* STOCK */,
        totalDescu: 0 /* DINAMIC LOCAL */,
        subTotal: 30 /* DINAMIC LOCAL */,
        ivaRete1: 0 /* STOCK */,
        reteRenta: 0 /* STOCK */,
        totalNoGravado: 0 /* STOCK */,
        totalPagar: 30 /* DINAMIC LOCAL */,
      },
      extension: {
        docuEntrega: null /* STOCK */,
        nombRecibe: null /* STOCK */,
        observaciones: null /* STOCK */,
        placaVehiculo: null /* STOCK */,
        nombEntrega: null /* STOCK */,
        docuRecibe: null /* STOCK */,
      },
      apendice: null /* STOCK */,
    };

    console.log(data);
    const Firm = {
      nit: "02101601741065" /* QUEMADO */,
      activo: true,
      passwordPri: "Halogenados2024" /* QUEMADO */,
      dteJson: data,
    };
    const responseFirm = await Firmservice.create(Firm);
    console.log(responseFirm);

    data.firma = responseFirm.body;
    data.sellado = content.sellado;
    data.sello = content.sello;

    console.log(data);
    /* update the firm in the bill */
    console.log();
    const response = await PlantillaAPI.update(
      id_emisor,
      data,
      token,
      data.identificacion.codigoGeneracion
    );
    console.log("edited");
    console.log(response);
    window.location.reload();
  };

  const SendBillHandler = async () => {
    const count = await PlantillaAPI.count(id_emisor, "01", token);
    const dataSend = {
      tipoDte: content.tipo,
      ambiente: "00",
      idEnvio: count[0].count + 1,
      version: 1,
      codigoGeneracion: "2CFF1097-24F2-4220-9257-581E1CB3AFE8",
      documento: content.firm,
    };


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
  };

  // Determine the button color and additional content based on `content.firm`
  const buttonStyle = content.firm ? "bg-lightgreen" : "bg-whitesmoke";
  const firmbutton = content.firm ? (
    <div className=" flex flex-row">
      <button
        onClick={ValidateBillHandler}
        className={`cursor-pointer h-12 [border:none] pt-[11px] pb-3 pr-[23px] pl-[22px] ${buttonStyle} rounded-11xl flex flex-row items-start justify-start z-[2] hover:bg-lightgray-100 `}
      >
        <div className="relative text-xs font-light font-inter text-black text-left z-[3]">
          Firmar
        </div>
        <img src={checkimg} alt="Tick" className="w-[30px] h-[30px]" />
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

  const sendedebutton = content.sellado ? (
    <div className=" flex flex-row">
      <button
        onClick={SendBillHandler}
        className={`cursor-pointer h-12 [border:none] pt-[11px] pb-3 pr-[23px] pl-[22px] ${buttonStyle} rounded-11xl flex flex-row items-start justify-start z-[2] hover:bg-lightgray-100 `}
      >
        <div className="relative text-xs font-light font-inter text-black text-left z-[3]">
          Enviar
        </div>
        <img src={checkimg} alt="Tick" className="w-[30px] h-[30px]" />
      </button>
    </div>
  ) : (
    <div className=" flex flex-row">
      <button
        onClick={SendBillHandler}
        className={`cursor-pointer h-12 [border:none] pt-[11px] pb-3 pr-[23px] pl-[22px] ${buttonStyle} rounded-11xl flex flex-row items-start justify-start z-[2] hover:bg-lightgray-100 `}
      >
        <div className="relative text-xs font-light font-inter text-black text-left z-[3]">
          Enviar
        </div>
      </button>
    </div>
  );

  return (
    <div className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-2 box-border text-left text-3xs text-black font-inria-sans">
      <header className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-between pt-0.5 pb-0 pr-[52px] pl-[15px] box-border text-xl text-black font-inria-sans">
        <div className="flex flex-col items-start justify-start pt-1 px-0 pb-0">
          <h1 className="m-0 relative text-inherit font-bold z-[3]">{tipo}</h1>
        </div>
        <div className="flex flex-row items-start justify-start gap-[0px_8px]">
          <img
            className="w-[33px] h-[33px] relative object-cover z-[3]"
            loading="lazy"
            onClick={ViewBillHandler}
            alt=""
            src="/ver@2x.png"
          />
          <img
            className="w-[26px]  h-[26px] relative object-cover z-[3]"
            loading="lazy"
            onClick={EditBillHandler}
            alt=""
            src="/editar@2x.png"
          />
          <img
            className="h-[33px]  w-[30px] relative object-cover z-[3]"
            onClick={DownloadBillHandler}
            loading="lazy"
            alt=""
            src="/descargar@2x.png"
          />
        </div>
      </header>
      <div className="self-stretch flex flex-row items-start justify-start py-0 pr-[3px] pl-0">
        <div className="flex flex-row items-start justify-start gap-[0px_11px]"></div>
      </div>
      <div className="self-stretch flex flex-row items-start justify-start py-0 px-[7px] box-border">
        <div className="flex-1 flex flex-row items-start justify-start gap-[0px_21px]">
          <div className="flex-1 flex flex-col items-start justify-start pt-[7px] px-0 pb-0">
            <div className="self-stretch flex flex-col items-start justify-start gap-[7px_0px]">
              <div className="relative whitespace-nowrap z-[1]">
                {content.re_name}
              </div>
              <div className="self-stretch h-px relative box-border z-[1] border-t-[1px] border-solid border-black" />
              <div className="relative whitespace-nowrap z-[1]">
                NIT: {content.re_nit}
              </div>
              <div className="relative whitespace-nowrap z-[1]">
                Correo: {content.re_correo_electronico}
              </div>
              <div className="relative whitespace-nowrap z-[1]">
                Teléfono: {content.re_numero_telefono}
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col items-end justify-start gap-[8px_0px]">
            <button className="cursor-pointer [border:none] pt-[7px] px-2 pb-1 bg-white rounded-mini shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap z-[1] hover:bg-gainsboro-100">
              <b className="relative text-11xl font-inria-sans text-black text-left whitespace-nowrap z-[2]">
                TOTAL: ${content.total_a_pagar}
              </b>
            </button>
            <div className="self-stretch flex  gap-[0px_8px]">
              {firmbutton}
              {sendedebutton} {/* Additional content if `firm` is not null */}
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
export default FrameComponent1;
