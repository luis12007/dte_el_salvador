import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import BillnoCF from "../components/ClientBill";
import BillCF from "../components/ClientBillCF";
import TreeNode from "../components/TreeNode";
import TableOfContents from "../components/TableOfContentsWithDelete";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AdvanceItemsComponentOnComponent from "../components/AdvanceItemsOnComponentl";
import AdvanceItemsComponent from "../components/AdvanceNoItemsComponent";
import TableOfContentsNew from "../components/TableOfContentsNew";
import Firmservice from "../services/Firm";
import PlantillaService from "../services/PlantillaService";
const Clientes = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [CF, setCF] = useState(false);
  const [Items, setItems] = useState(false);
  const token = localStorage.getItem("token");
  const id_emisor =1;
  
  

  /* Cliente array */
  const [client, setClient] = useState({
    documentType: "asd",
    name: "",
    document: "",
    address: "",
    email: "",
    phone: "",
    municipality: "aa",
    department: "aa",
  }
  );


  /* Const Condiciones Operaciones array op op */

  const [contents, setContents] = useState([

  ]);

  const handleRemove = (index) => {
    setContents((prevContents) =>
      prevContents.filter((_, i) => i !== index)
    );
  };

  const handleAdd = (newContents) => {
    setContents((prevContents) => [
      ...prevContents,
      { type: newContents.type, pay: newContents.pay, mount: newContents.mount, Doc: newContents.Doc },
    ]);
  };


  /* Services Add */
  const [items, setitems] = useState([

  ]);

  const [itemsAdvance, setitemsAdvance] = useState([

  ]);

  const itemshandleRemove = (index) => {
    setitems((prevContents) =>
      prevContents.filter((_, i) => i !== index)
    );
  };

  const itemshandleAdd = (newContents) => {
    console.log("itemshandleAdd");
    console.log(newContents);
    setitems((prevContents) => [
      ...prevContents,
      { type: newContents.type, cuantity: newContents.cuantity, description: newContents.description, price: newContents.price },
    ]);
    console.log(items);
  };

  const itemsAdvancehandleRemove = (index) => {
    setitemsAdvance((prevContents) =>
      prevContents.filter((_, i) => i !== index)
    );
  };

  const itemsAdvancehandleAdd = (newContents) => {
    setitemsAdvance((prevContents) => [
      ...prevContents,
      { type: newContents.type, quantity: newContents.quantity, code: newContents.code, units: newContents.units, description: newContents.description, saleType: newContents.saleType, price: newContents.price, taxes: newContents.taxes },
    ]);
  };


  /* navigate and fu */

  const navigate = useNavigate();


  /* ---------------------------------------------------------- */
  const addBillHandler = async () => {

    const myUuid = uuidv4().toUpperCase().toString();
    const data = {
      identificacion: { 
        version: 1, /* TODO: SEARCH IN DOCUMENTATION try with 1 2 3 and 4*/
        ambiente: "00", /* 0 dev mode 1 to production */
        tipoDte: "01", /* 01 factura  and  03 CF*/
        numeroControl: "DTE-01-00160000-000000000051667", /* Pending dinamic LOCAL */
        codigoGeneracion: myUuid, /* DONE */
        tipoModelo: 1, /* 1 Modelo Facturación previo and 2 modelo diferido ???        */
        tipoOperacion: 1, /* 1 Transmisión normal  2 to contingencia       */
        fecEmi: "2024-03-06", /* DINAMIC LOCAL */
        horEmi: "09:52:47", /* DINAMIC LOCAL */
        tipoMoneda: "USD", /* STOCK */
        tipoContingencia: null, /* review the types (Stock) */
        motivoContin: null /* STOCK */
      },
      documentoRelacionado: null, /* STOCK */
      emisor: { 
        direccion: {
          municipio: "01", /* 01 Ahuachapán  02 Santa Ana  03 Sonsonate  04 Chalatenango  05 La Libertad  06 San Salvador  07 Cuscatlán  08 La Paz  09 Cabañas  10 San Vicente  11 Usulután  12 San Miguel  13 Morazán  14 La Unión */
          departamento: "05",/* 00 Otro País 00    01 AHUACHAPÁN 01    02 APANECA 01    03 ATIQUIZAYA 01    04 CONCEPCIÓN DE ATACO 01    05 EL REFUGIO 01    06 GUAYMANGO 01    07 JUJUTLA 01    08 SAN FRANCISCO MENÉNDEZ 01    09 SAN LORENZO 01    10 SAN PEDRO PUXTLA 01    11 TACUBA 01    12 TURÍN 01    01 CANDELARIA DE LA FRONTERA 02    02 COATEPEQUE 02    03 CHALCHUAPA 02    04 EL CONGO 02    05 EL PORVENIR 02    06 MASAHUAT 02    07 METAPÁN 02    08 SAN ANTONIO PAJONAL 02    09 SAN SEBASTIÁN SALITRILLO 02    10 SANTA ANA 02    11 STA ROSA GUACHI 02    12 STGO D LA FRONT 02    13 TEXISTEPEQUE 02    01 ACAJUTLA 03    02 ARMENIA 03    03 CALUCO 03    04 CUISNAHUAT 03    05 STA I ISHUATAN 03    06 IZALCO 03    07 JUAYÚA 03    08 NAHUIZALCO 03    09 NAHULINGO 03    10 SALCOATITÁN 03    11 SAN ANTONIO DEL MONTE 03    12 SAN JULIÁN 03    13 STA C MASAHUAT 03  14 SANTO DOMINGO GUZMÁN 03    15 SONSONATE 03    16 SONZACATE 03    01 AGUA CALIENTE 04    02 ARCATAO 04    03 AZACUALPA 04    04 CITALÁ 04    05 COMALAPA 04    06 CONCEPCIÓN QUEZALTEPEQUE 04    07 CHALATENANGO 04    08 DULCE NOM MARÍA 04    09 EL CARRIZAL 04    10 EL PARAÍSO 04    11 LA LAGUNA 04    12 LA PALMA 04    13 LA REINA 04    14 LAS VUELTAS 04    15 NOMBRE DE JESUS 04    16 NVA CONCEPCIÓN 04    17 NUEVA TRINIDAD 04    18 OJOS DE AGUA 04    19 POTONICO 04    20 SAN ANT LA CRUZ 04    21 SAN ANT RANCHOS 04    22 SAN FERNANDO 04    23 SAN FRANCISCO LEMPA 04    24 SAN FRANCISCO MORAZÁN 04    25 SAN IGNACIO 04    26 SAN I LABRADOR 04    27 SAN J CANCASQUE 04    28 SAN JOSE FLORES 04    29 SAN LUIS CARMEN 04    30 SN MIG MERCEDES 04    31 SAN RAFAEL 04    32 SANTA RITA 04    33 TEJUTLA 04    01 ANTGO CUSCATLÁN 05    02 CIUDAD ARCE 05    03 COLON 05 04 COMASAGUA 05
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

          */
          complemento: "Bulevar Los Pr\u00f3ceres" /* DINAMIC LOCAL */
        },
        nit: "06141509650017", /* DINAMIC LOCAL */
        nrc: "282731", /* DINAMIC LOCAL */
        nombre: "Universidad Centroamericana Jos\u00e9 Sime\u00f3n Ca\u00f1as", /* DINAMIC LOCAL */
        codActividad: "85499", /* CAT-019 Código de Actividad Económica 86203 Servicios médicos */
        descActividad: "Ense\u00f1anza formal", /* DINAMIC LOCAL */
        telefono: "22106600", /* DINAMIC LOCAL */
        correo: "tesoreria@uca.edu.sv", /* DINAMIC LOCAL */
        nombreComercial: "'UCA'", /* DINAMIC LOCAL */
        tipoEstablecimiento: "01", /* 01 Sucursal / Agencia   02 Casa matriz   04 Bodega   07 Predio y/o patio   20 Otro  */
        codEstableMH: "1234",  /* Pending dinamic LOCAL */
        codEstable: "1234",  /* Pending dinamic LOCAL */
        codPuntoVentaMH: "0016",  /* Pending dinamic LOCAL */
        codPuntoVenta: "0016"  /* Pending dinamic LOCAL */
      },
      receptor: { 
        codActividad: "10003", /* 99000 Actividades de organizaciones y órganos extraterritoriales
        EMPLEADOS Y OTRAS PERSONAS NATURALES
        10001 Empleados
        10002 Jubilado
        10003 Estudiante
        10004 Desempleado
        10005 Otros */
        direccion: null, /* DINAMIC LOCAL */
        nrc: null, /* DINAMIC LOCAL */
        descActividad: "Estudiante", /* DINAMIC LOCAL */
        correo: "00129020@uca.edu.sv", /* DINAMIC LOCAL */
        tipoDocumento: "13", /* 36 NIT   13 DUI   37 Otro   03 Pasaporte   02 Carnet de Residente  */
        nombre: "LUIS ALEXANDER HERNANDEZ MARTINEZ", /* DINAMIC LOCAL */
        telefono: "6431-9239", /* DINAMIC LOCAL */
        numDocumento: "06384275-4" /* DINAMIC LOCAL */
      },
      otrosDocumentos: null, /* STOCK */
      ventaTercero: null, /* STOCK */
      cuerpoDocumento: [ /* TODO SEARCH IN DOCUMENTATION */
        {
          codTributo: null, /* STOCK */
          descripcion: "TALONARIO PARQUEO: 50 TICKETS", /* DINAMIC LOCAL */
          uniMedida: 99, /* CAT-014 Unidad de Medida 99 otra PENDING */
          codigo: "EST003", /* DINAMIC LOCAL */
          cantidad: 1, /* DINAMIC LOCAL */
          numItem: 1, /* DINAMIC LOCAL */
          tributos: null, /* STOCK */
          ivaItem: 3.4513, /* STOCK */
          noGravado: 0, /* DINAMIC LOCAL */
          psv: 0, /* DINAMIC LOCAL */
          montoDescu: 0, /* DINAMIC LOCAL */
          numeroDocumento: null, /* STOCK */
          precioUni: 29.9999, /* DINAMIC LOCAL */
          ventaGravada: 29.9999, /* DINAMIC LOCAL */
          ventaExenta: 0, /* STOCK */
          ventaNoSuj: 0, /* STOCK */
          tipoItem: 2 /* 1 bienes 2 servicio 3 ambos 4 otros */
        }
      ],
      resumen: {
        condicionOperacion: 1, /* 1 Contado 2 A crédito  3 Otro    */
        totalIva: 3.45,   /* DINAMIC LOCAL */
        saldoFavor: 0,  /* STOCK */
        numPagoElectronico: null, /* STOCK */
        pagos: [
          {
            periodo: null, /* STOCK */
            plazo: null, /* STOCK */
            montoPago: 30,  /* DINAMIC LOCAL */
            codigo: "01", /* 01 Billetes y monedas
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
             */
            referencia: "20240306090346" /* DINAMIC LOCAL */
          }
        ],
        totalNoSuj: 0, /* STOCK */
        tributos: null, /* STOCK */
        totalLetras: "TREINTA CON 0\/100 D\u00d3LARES", /* DINAMIC LOCAL */
        totalExenta: 0, /* STOCK */
        subTotalVentas: 30, /* DINAMIC LOCAL */
        totalGravada: 30, /* DINAMIC LOCAL */
        montoTotalOperacion: 30, /* DINAMIC LOCAL */
        descuNoSuj: 0,/* STOCK */
        descuExenta: 0,/* STOCK */
        descuGravada: 0,/* STOCK */
        porcentajeDescuento: 0,/* STOCK */
        totalDescu: 0, /* DINAMIC LOCAL */
        subTotal: 30, /* DINAMIC LOCAL */
        ivaRete1: 0,/* STOCK */
        reteRenta: 0,/* STOCK */
        totalNoGravado: 0,/* STOCK */
        totalPagar: 30 /* DINAMIC LOCAL */
      },
      extension: {
        docuEntrega: null,/* STOCK */
        nombRecibe: null,/* STOCK */
        observaciones: null,/* STOCK */
        placaVehiculo: null,/* STOCK */
        nombEntrega: null, /* STOCK */
        docuRecibe: null /* STOCK */
      },
      apendice: null, /* STOCK */
      firma: null, /* Firm the document to the API */
    };

    console.log(data);
    const Firm = {
      nit: "02101601741065", /* QUEMADO */
      activo: true,
      passwordPri: "Halogenados2024",  /* QUEMADO */
      dteJson: data
    }

    const responseFirm = await Firmservice.create(Firm);
    console.log(responseFirm);

    const responsePlantilla = await PlantillaService.create(data,token, id_emisor);

    console.log("PlantillaService - Create");
    console.log(responsePlantilla);





  };

  /* ---------------------------------------------------------- */





  const goBackHandler = () => {
    navigate("/Principal");
  };
  /* Logic of select to go to bill or CF */
  const ChangeHandler = (selectedValue) => {
    if (selectedValue === "Factura") {
      console.log("Factura");
    } else if (selectedValue === "CF") {
      navigate("/crear/creditofiscal");
    }
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    ChangeHandler(event.target.value);
  };

  /* Logic of renderize CF or NotCF */
  const handleSelectChangeCFClient = () => {
    setCF(!CF);
    console.log(client);
  };

  /* Logic of items */
  const handleSelectChangeItemsClient = () => {
    setItems(!Items);
  };


  return (
    <form className="m-0 w-[430px] bg-steelblue-300 overflow-hidden flex flex-col items-start justify-start pt-[17px] pb-3 pr-[15px] pl-5 box-border gap-[22px_0px] tracking-[normal]">
      <header className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start pt-4 pb-[15px] pr-3.5 pl-[17px] box-border top-[0] z-[99] sticky max-w-full">
        <div className="h-[66px] w-[390px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden max-w-full" />
        <div className="flex-1 rounded-mini bg-gainsboro-300 box-border flex flex-row items-start justify-between pt-[9px] pb-2.5 pr-[7px] pl-[15px] max-w-full gap-[20px] z-[1] border-[1px] border-solid border-white">
          <select
            onChange={handleSelectChange}
            className="h-[35px] w-[359px] relative  border-gainsboro-300 bg-gainsboro-300 border-2 max-w-full"
          >
            <option value="Factura">Factura</option>
            <option value="CF">Comprobante Credito Fiscal</option>
          </select>
          {/* Your other elements */}
        </div>
      </header>
      <section className="self-stretch rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-6 box-border gap-[5px] max-w-full">
        <div className="self-stretch h-[163px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
        <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-between pt-[11px] pb-[9px] pr-5 pl-[17px] box-border max-w-full gap-[20px] z-[1]">
          <div className="h-[37px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full" />
          <b className="relative text-xs font-inria-sans text-black text-left z-[2]">
            General
          </b>
          <div className="flex flex-col items-start justify-start pt-px px-0 pb-0">
            <img
              className="w-[18px] h-4 relative object-contain z-[2]"
              alt=""
              src="/atras-1@2x.png"
            />
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start pt-0 px-3.5 pb-2.5 box-border max-w-full">
          
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-black text-left z-[1]">
              <div className="flex flex-row items-start justify-start py-0 px-[3px]">
                Fecha
              </div>
            </div>
            <div className="self-stretch rounded-6xs box-border flex flex-row items-start justify-start pt-[3px] px-[7px] pb-1.5 max-w-full z-[1] border-[0.3px] border-solid border-gray-100">
              <div className="h-[23px] w-[356px] relative rounded-6xs box-border hidden max-w-full border-[0.3px] border-solid border-gray-100" />
              <input
                className="w-full  [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="date"
              />
            </div>
          </div>
        </div>
      </section>
      {CF ? (
        <BillCF handleSelectChangeCFClient={handleSelectChangeCFClient} setClient={setClient} />
      ) : (
        <BillnoCF handleSelectChangeCFClient={handleSelectChangeCFClient} setClient={setClient} />
      )}

      {Items ? (
        <AdvanceItemsComponentOnComponent
          handleSelectChangeItemsClient={handleSelectChangeItemsClient}
          itemsAdvancehandleRemove={itemsAdvancehandleRemove}
          itemsAdvancehandleAdd={itemsAdvancehandleAdd}
          itemsAdvance={itemsAdvance}

        />
      ) : (
        <AdvanceItemsComponent
          handleSelectChangeItemsClient={handleSelectChangeItemsClient}
          itemshandleRemove={itemshandleRemove}
          itemshandleAdd={itemshandleAdd}
          items={items}

        />
      )}

      <TreeNode subtotal="Subtotal" />
      <TreeNode subtotal="Total Tributos" />
      <TreeNode subtotal="Total a Pagar" />
      <section className="self-stretch flex flex-row items-start justify-start pt-0 pb-1.5 pr-0.5 pl-[3px] box-border max-w-full">
        <form className="m-0 flex-1 rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0 px-0 pb-[25px] box-border gap-[10px] max-w-full">
          <div className="self-stretch h-[581px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
          <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-start pt-3 px-[9px] pb-[11px] box-border relative whitespace-nowrap max-w-full z-[1]">
            <div className="h-[37px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full z-[0]" />
            <img
              className="h-4 w-[18px] absolute !m-[0] top-[10px] right-[17px] object-contain z-[2]"
              alt=""
              src="/atras-1@2x.png"
            />
            <b className="relative text-xs font-inria-sans text-black text-left z-[2]">
              Condiciones de la Operación
            </b>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[23.5px_0px] max-w-full">
              <div className="self-stretch flex flex-col items-start justify-start gap-[13px_0px] max-w-full">
                <div className="self-stretch flex flex-col items-start justify-start gap-[10px_0px] max-w-full">
                  <div className="self-stretch flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                    <div className="relative text-xs font-inria-sans text-black text-left z-[1]"></div>
                    <div className="h-[23px] w-[362px] relative rounded-6xs box-border hidden max-w-full z-[0] border-[0.3px] border-solid border-gray-100" />
                    <div>
                      <span className="text-black">Tipo</span>
                      <span className="text-tomato">*</span>
                    </div>
                    <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
                      <select
                        className="w-full h-full relative  border-white bg-white border-2 max-w-full"
                        type="text"
                      >
                        <option value="CF">Contado</option>
                        <option value="CF">Crédito</option>
                        <option value="CF">Otro</option>
                      </select>
                    </div>
                  </div>
                  <div className="self-stretch h-px relative box-border z-[1] border-t-[1px] border-solid border-black" />
                </div>
                <div className="self-stretch flex flex-col items-end justify-start gap-[28px] max-w-full z-[1]">
                  {contents.map((content, index) => (
                    <TableOfContents
                      key={index}
                      content={content}
                      onRemove={() => handleRemove(index)}
                    />
                  ))}
                </div>
              </div>
              <div className="self-stretch flex flex-col items-start justify-start gap-[13px_0px]">
                <TableOfContentsNew handleAdd={handleAdd} /> {/* TODO: Add the credit metod */}
              </div>
            </div>
          </div>
        </form>
      </section>
      <section className="self-stretch flex flex-row items-start justify-start pt-0 pb-1.5 pr-0 pl-[5px] box-border max-w-full">
        <textarea
          className="[border:none] bg-white h-[163px] w-auto [outline:none] flex-1 rounded-mini shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-end justify-start pt-[11px] px-[17px] pb-2 box-border font-inria-sans font-bold text-mini text-black max-w-full"
          placeholder="Observaciones"
          rows={8}
          cols={20}
        />
      </section>
      <footer className="self-stretch flex flex-row items-start justify-center py-0 pr-5 pl-[27px]">
        <div className="flex flex-col items-start justify-start gap-[13px_0px]">
          <button
            onClick={addBillHandler}
            className="cursor-pointer [border:none] pt-[13px] pb-3 pr-[23px] pl-[29px] bg-steelblue-200 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start whitespace-nowrap hover:bg-steelblue-100"
          >
            <div className="h-12 w-[158px] relative rounded-3xs bg-steelblue-200 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
            <b className="h-[23px] relative text-mini inline-block font-inria-sans text-white text-left z-[1]">
              Añadir Factura
            </b>
          </button>
          <button
            onClick={goBackHandler}
            className="cursor-pointer [border:none] pt-3 pb-[13px] pr-11 pl-[49px] bg-indianred-500 rounded-3xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-row items-start justify-start hover:bg-indianred-100"
          >
            <div className="h-12 w-[158px] relative rounded-3xs bg-indianred-500 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
            <b className="relative text-mini font-inria-sans text-white text-left z-[1]">
              Regresar
            </b>
          </button>
        </div>
      </footer>
    </form>
  );
};

export default Clientes;
