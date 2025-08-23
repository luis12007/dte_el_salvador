import React, { useState } from "react";
import personas from "../assets/imgs/personas.png";
import ListReceptores from "../components/ListReceptores";

const ClietnBillCredit = ({
  setClient,
  client,
  departmentsAndMunicipalities,
  handleDepartmentChange,
  handleMunicipalityChange,
  selectedMunicipality,
  getMunicipalityNumber,
  selectedDepartment,
  visible,
  handleSelectClient,
  isVisibleClient,
  onSelectClient,
}) => {
  // Extended list of departments and their corresponding municipalities

  const handleChange = (field, value) => {
    var descActividaddata2 = "Otros";
    if (value == "10005") {
      descActividaddata2 = "Otros";
    } else if (value == "10001") {
      descActividaddata2 = "Empleados";
    } else if (value == "10003") {
      descActividaddata2 = "Estudiante";
    } else if (value == "97000") {
      descActividaddata2 = "empleadores de personal doméstico";
    } else if (value == "99000") {
      descActividaddata2 =
        "Actividades de organizaciones y órganos extraterritoriales";
    } else if (value == "10004") {
      descActividaddata2 = "Desempleado";
    } else if (value == "86203") {
      descActividaddata2 = "Servicios de medicos";
    }

    if (field == "descActividad")
    {
      setClient((prevClient) => ({
        ...prevClient,
        [field]: value,
      }));
      return;
    }

    if (field == "codActividad") {
      setClient((prevClient) => ({
        ...prevClient,
        [field]: value,
        descActividad: descActividaddata2,
      }));
      return;
    }

    // Update the client state with the new value
    setClient((prevClient) => ({
      ...prevClient,
      [field]: value,
    }));
  };
  const allActivities = [
    // AGRICULTURA, GANADERÍA, SILVICULTURA Y PESCA
    {
      value: "01111",
      label: "Cultivo de cereales excepto arroz y para forrajes",
    },
    { value: "01112", label: "Cultivo de legumbres" },
    { value: "01113", label: "Cultivo de semillas oleaginosas" },
    {
      value: "01114",
      label: "Cultivo de plantas para la preparación de semillas",
    },
    {
      value: "01119",
      label: "Cultivo de otros cereales excepto arroz y forrajeros n.c.p.",
    },
    { value: "01120", label: "Cultivo de arroz" },
    { value: "01131", label: "Cultivo de raíces y tubérculos" },
    {
      value: "01132",
      label:
        "Cultivo de brotes, bulbos, vegetales tubérculos y cultivos similares",
    },
    { value: "01133", label: "Cultivo hortícola de fruto" },
    {
      value: "01134",
      label: "Cultivo de hortalizas de hoja y otras hortalizas ncp",
    },
    { value: "01140", label: "Cultivo de caña de azúcar" },
    { value: "01150", label: "Cultivo de tabaco" },
    { value: "01161", label: "Cultivo de algodón" },
    { value: "01162", label: "Cultivo de fibras vegetales excepto algodón" },
    {
      value: "01191",
      label:
        "Cultivo de plantas no perennes para la producción de semillas y flores",
    },
    {
      value: "01192",
      label: "Cultivo de cereales y pastos para la alimentación animal",
    },
    { value: "01199", label: "Producción de cultivos no estacionales ncp" },
    { value: "01220", label: "Cultivo de frutas tropicales" },
    { value: "01230", label: "Cultivo de cítricos" },
    { value: "01240", label: "Cultivo de frutas de pepita y hueso" },
    { value: "01251", label: "Cultivo de frutas ncp" },
    {
      value: "01252",
      label: "Cultivo de otros frutos y nueces de árboles y arbustos",
    },
    { value: "01260", label: "Cultivo de frutos oleaginosos" },
    { value: "01271", label: "Cultivo de café" },
    {
      value: "01272",
      label: "Cultivo de plantas para la elaboración de bebidas excepto café",
    },
    { value: "01281", label: "Cultivo de especias y aromáticas" },
    {
      value: "01282",
      label:
        "Cultivo de plantas para la obtención de productos medicinales y farmacéuticos",
    },
    {
      value: "01291",
      label: "Cultivo de árboles de hule (caucho) para la obtención de látex",
    },
    {
      value: "01292",
      label:
        "Cultivo de plantas para la obtención de productos químicos y colorantes",
    },
    { value: "01299", label: "Producción de cultivos perennes ncp" },
    { value: "01300", label: "Propagación de plantas" },
    { value: "01301", label: "Cultivo de plantas y flores ornamentales" },
    { value: "01410", label: "Cría y engorde de ganado bovino" },
    { value: "01420", label: "Cría de caballos y otros equinos" },
    { value: "01440", label: "Cría de ovejas y cabras" },
    { value: "01450", label: "Cría de cerdos" },
    { value: "01460", label: "Cría de aves de corral y producción de huevos" },
    {
      value: "01491",
      label:
        "Cría de abejas apicultura para la obtención de miel y otros productos apícolas",
    },
    { value: "01492", label: "Cría de conejos" },
    { value: "01493", label: "Cría de iguanas y garrobos" },
    { value: "01494", label: "Cría de mariposas y otros insectos" },
    { value: "01499", label: "Cría y obtención de productos animales n.c.p." },
    {
      value: "01500",
      label:
        "Cultivo de productos agrícolas en combinación con la cría de animales",
    },
    { value: "01611", label: "Servicios de maquinaria agrícola" },
    { value: "01612", label: "Control de plagas" },
    { value: "01613", label: "Servicios de riego" },
    {
      value: "01614",
      label: "Servicios de contratación de mano de obra para la agricultura",
    },
    { value: "01619", label: "Servicios agrícolas ncp" },
    {
      value: "01621",
      label:
        "Actividades para mejorar la reproducción, el crecimiento y el rendimiento de los animales y sus productos",
    },
    { value: "01622", label: "Servicios de mano de obra pecuaria" },
    { value: "01629", label: "Servicios pecuarios ncp" },
    {
      value: "01631",
      label:
        "Labores post cosecha de preparación de los productos agrícolas para su comercialización o para la industria",
    },
    { value: "01632", label: "Servicio de beneficio de café" },
    { value: "01633", label: "Servicio de beneficiado de plantas textiles" },
    { value: "01640", label: "Tratamiento de semillas para la propagación" },
    {
      value: "01700",
      label:
        "Caza ordinaria y mediante trampas, repoblación de animales de caza y servicios conexos",
    },

    // SILVICULTURA Y EXTRACCIÓN DE MADERA
    { value: "02100", label: "Silvicultura y otras actividades forestales" },
    { value: "02200", label: "Extracción de madera" },
    {
      value: "02300",
      label: "Recolección de productos diferentes a la madera",
    },
    { value: "02400", label: "Servicios de apoyo a la silvicultura" },

    // PESCA Y ACUICULTURA
    { value: "03110", label: "Pesca marítima de altura y costera" },
    { value: "03120", label: "Pesca de agua dulce" },
    { value: "03210", label: "Acuicultura marítima" },
    { value: "03220", label: "Acuicultura de agua dulce" },
    { value: "03300", label: "Servicios de apoyo a la pesca y acuicultura" },

    // EXPLOTACIÓN DE MINAS Y CANTERAS
    { value: "05100", label: "Extracción de hulla" },
    { value: "05200", label: "Extracción y aglomeración de lignito" },
    { value: "06100", label: "Extracción de petróleo crudo" },
    { value: "06200", label: "Extracción de gas natural" },
    { value: "07100", label: "Extracción de minerales de hierro" },
    { value: "07210", label: "Extracción de minerales de uranio y torio" },
    {
      value: "07290",
      label: "Extracción de minerales metalíferos no ferrosos",
    },
    { value: "08100", label: "Extracción de piedra, arena y arcilla" },
    {
      value: "08910",
      label:
        "Extracción de minerales para la fabricación de abonos y productos químicos",
    },
    { value: "08920", label: "Extracción y aglomeración de turba" },
    { value: "08930", label: "Extracción de sal" },
    { value: "08990", label: "Explotación de otras minas y canteras ncp" },
    {
      value: "09100",
      label: "Actividades de apoyo a la extracción de petróleo y gas natural",
    },
    {
      value: "09900",
      label: "Actividades de apoyo a la explotación de minas y canteras",
    },

    // INDUSTRIAS MANUFACTURERAS
    {
      value: "10101",
      label: "Servicio de rastros y mataderos de bovinos y porcinos",
    },
    { value: "10102", label: "Matanza y procesamiento de bovinos y porcinos" },
    { value: "10103", label: "Matanza y procesamientos de aves de corral" },
    {
      value: "10104",
      label: "Elaboración y conservación de embutidos y tripas naturales",
    },
    { value: "10105", label: "Servicios de conservación y empaque de carnes" },
    {
      value: "10106",
      label: "Elaboración y conservación de grasas y aceites animales",
    },
    { value: "10107", label: "Servicios de molienda de carne" },
    { value: "10108", label: "Elaboración de productos de carne ncp" },
    {
      value: "10201",
      label: "Procesamiento y conservación de pescado, crustáceos y moluscos",
    },
    { value: "10209", label: "Fabricación de productos de pescado ncp" },
    { value: "10301", label: "Elaboración de jugos de frutas y hortalizas" },
    {
      value: "10302",
      label:
        "Elaboración y envase de jaleas, mermeladas y frutas deshidratadas",
    },
    {
      value: "10309",
      label: "Elaboración de productos de frutas y hortalizas n.c.p.",
    },
    {
      value: "10401",
      label: "Fabricación de aceites y grasas vegetales y animales comestibles",
    },
    {
      value: "10402",
      label:
        "Fabricación de aceites y grasas vegetales y animales no comestibles",
    },
    { value: "10409", label: "Servicio de maquilado de aceites" },
    {
      value: "10501",
      label:
        "Fabricación de productos lácteos excepto sorbetes y quesos sustitutos",
    },
    { value: "10502", label: "Fabricación de sorbetes y helados" },
    { value: "10503", label: "Fabricación de quesos" },
    { value: "10611", label: "Molienda de cereales" },
    {
      value: "10612",
      label: "Elaboración de cereales para el desayuno y similares",
    },
    {
      value: "10613",
      label: "Servicios de beneficiado de productos agrícolas ncp",
    },
    { value: "10621", label: "Fabricación de almidón" },
    {
      value: "10628",
      label: "Servicio de molienda de maíz húmedo molino para nixtamal",
    },
    { value: "10711", label: "Elaboración de tortillas" },
    { value: "10712", label: "Fabricación de pan, galletas y barquillos" },
    { value: "10713", label: "Fabricación de repostería" },
    { value: "10721", label: "Ingenios azucareros" },
    {
      value: "10722",
      label: "Molienda de caña de azúcar para la elaboración de dulces",
    },
    {
      value: "10723",
      label: "Elaboración de jarabes de azúcar y otros similares",
    },
    { value: "10724", label: "Maquilado de azúcar de caña" },
    {
      value: "10730",
      label: "Fabricación de cacao, chocolates y productos de confitería",
    },
    {
      value: "10740",
      label:
        "Elaboración de macarrones, fideos, y productos farináceos similares",
    },
    {
      value: "10750",
      label: "Elaboración de comidas y platos preparados para la reventa",
    },
    { value: "10791", label: "Elaboración de productos de café" },
    {
      value: "10792",
      label: "Elaboración de especies, sazonadores y condimentos",
    },
    { value: "10793", label: "Elaboración de sopas, cremas y consomé" },
    { value: "10794", label: "Fabricación de bocadillos tostados y/o fritos" },
    { value: "10799", label: "Elaboración de productos alimenticios ncp" },
    {
      value: "10800",
      label: "Elaboración de alimentos preparados para animales",
    },

    // ELABORACIÓN DE BEBIDAS
    { value: "11012", label: "Fabricación de aguardiente y licores" },
    { value: "11020", label: "Elaboración de vinos" },
    { value: "11030", label: "Fabricación de cerveza" },
    { value: "11041", label: "Fabricación de aguas gaseosas" },
    { value: "11042", label: "Fabricación y envasado de agua" },
    { value: "11043", label: "Elaboración de refrescos" },
    { value: "11048", label: "Maquilado de aguas gaseosas" },
    { value: "11049", label: "Elaboración de bebidas no alcohólicas" },

    // ELABORACIÓN DE PRODUCTOS DE TABACO
    { value: "12000", label: "Elaboración de productos de tabaco" },

    // FABRICACIÓN DE PRODUCTOS TEXTILES
    { value: "13111", label: "Preparación de fibras textiles" },
    { value: "13112", label: "Fabricación de hilados" },
    { value: "13120", label: "Fabricación de telas" },
    { value: "13130", label: "Acabado de productos textiles" },
    { value: "13910", label: "Fabricación de tejidos de punto y ganchillo" },
    {
      value: "13921",
      label: "Fabricación de productos textiles para el hogar",
    },
    { value: "13922", label: "Sacos, bolsas y otros artículos textiles" },
    {
      value: "13929",
      label:
        "Fabricación de artículos confeccionados con materiales textiles, excepto prendas de vestir ncp",
    },
    { value: "13930", label: "Fabricación de tapices y alfombras" },
    {
      value: "13941",
      label: "Fabricación de cuerdas de henequén y otras fibras naturales",
    },
    { value: "13942", label: "Fabricación de redes de diversos materiales" },
    {
      value: "13948",
      label: "Maquilado de productos trenzables de cualquier material",
    },
    {
      value: "13991",
      label:
        "Fabricación de adornos, etiquetas y otros artículos para prendas de vestir",
    },
    {
      value: "13992",
      label: "Servicio de bordados en artículos y prendas de tela",
    },
    { value: "13999", label: "Fabricación de productos textiles ncp" },

    // FABRICACIÓN DE PRENDAS DE VESTIR
    {
      value: "14101",
      label: "Fabricación de ropa interior, para dormir y similares",
    },
    { value: "14102", label: "Fabricación de ropa para niños" },
    {
      value: "14103",
      label: "Fabricación de prendas de vestir para ambos sexos",
    },
    { value: "14104", label: "Confección de prendas a medida" },
    { value: "14105", label: "Fabricación de prendas de vestir para deportes" },
    {
      value: "14106",
      label:
        "Elaboración de artesanías de uso personal confeccionadas de materiales textiles",
    },
    {
      value: "14108",
      label: "Maquilado de prendas de vestir, accesorios y otros",
    },
    {
      value: "14109",
      label: "Fabricación de prendas y accesorios de vestir n.c.p.",
    },
    { value: "14200", label: "Fabricación de artículos de piel" },
    {
      value: "14301",
      label: "Fabricación de calcetines, calcetas, medias y otros similares",
    },
    {
      value: "14302",
      label: "Fabricación de ropa interior de tejido de punto",
    },
    {
      value: "14309",
      label: "Fabricación de prendas de vestir de tejido de punto ncp",
    },

    // FABRICACIÓN DE CUEROS Y PRODUCTOS CONEXOS
    {
      value: "15110",
      label: "Curtido y adobo de cueros; adobo y teñido de pieles",
    },
    {
      value: "15121",
      label:
        "Fabricación de maletas, bolsos de mano y otros artículos de marroquinería",
    },
    {
      value: "15122",
      label: "Fabricación de monturas, accesorios y vainas talabartería",
    },
    {
      value: "15123",
      label:
        "Fabricación de artesanías principalmente de cuero natural y sintético",
    },
    {
      value: "15128",
      label:
        "Maquilado de artículos de cuero natural, sintético y de otros materiales",
    },
    { value: "15201", label: "Fabricación de calzado" },
    { value: "15202", label: "Fabricación de partes y accesorios de calzado" },
    { value: "15208", label: "Maquilado de partes y accesorios de calzado" },

    // PRODUCCIÓN DE MADERA Y FABRICACIÓN DE PRODUCTOS
    { value: "16100", label: "Aserradero y acepilladura de madera" },
    {
      value: "16210",
      label:
        "Fabricación de madera laminada, terciada, enchapada y contrachapada",
    },
    {
      value: "16220",
      label:
        "Fabricación de partes y piezas de carpintería para edificios y construcciones",
    },
    { value: "16230", label: "Fabricación de envases y recipientes de madera" },
    {
      value: "16292",
      label:
        "Fabricación de artesanías de madera, semillas, materiales trenzables",
    },
    {
      value: "16299",
      label:
        "Fabricación de productos de madera, corcho, paja y materiales trenzables ncp",
    },

    // FABRICACIÓN DE PAPEL Y DE PRODUCTOS DE PAPEL
    { value: "17010", label: "Fabricación de pasta de madera, papel y cartón" },
    {
      value: "17020",
      label:
        "Fabricación de papel y cartón ondulado y envases de papel y cartón",
    },
    {
      value: "17091",
      label:
        "Fabricación de artículos de papel y cartón de uso personal y doméstico",
    },
    { value: "17092", label: "Fabricación de productos de papel ncp" },

    // IMPRESIÓN Y REPRODUCCIÓN DE GRABACIONES
    { value: "18110", label: "Impresión" },
    { value: "18120", label: "Servicios relacionados con la impresión" },
    { value: "18200", label: "Reproducción de grabaciones" },

    // FABRICACIÓN DE COQUE Y PRODUCTOS DE REFINACIÓN
    { value: "19100", label: "Fabricación de productos de hornos de coque" },
    { value: "19201", label: "Fabricación de combustible" },
    { value: "19202", label: "Fabricación de aceites y lubricantes" },

    // FABRICACIÓN DE SUSTANCIAS Y PRODUCTOS QUÍMICOS
    {
      value: "20111",
      label: "Fabricación de materias primas para la fabricación de colorantes",
    },
    { value: "20112", label: "Fabricación de materiales curtientes" },
    { value: "20113", label: "Fabricación de gases industriales" },
    { value: "20114", label: "Fabricación de alcohol etílico" },
    { value: "20119", label: "Fabricación de sustancias químicas básicas" },
    { value: "20120", label: "Fabricación de abonos y fertilizantes" },
    {
      value: "20130",
      label: "Fabricación de plástico y caucho en formas primarias",
    },
    {
      value: "20210",
      label:
        "Fabricación de plaguicidas y otros productos químicos de uso agropecuario",
    },
    {
      value: "20220",
      label:
        "Fabricación de pinturas, barnices y productos de revestimiento similares",
    },

    // FABRICACIÓN DE PRODUCTOS QUÍMICOS
    {
      value: "20231",
      label: "Fabricación de jabones, detergentes y similares para limpieza",
    },
    {
      value: "20232",
      label:
        "Fabricación de perfumes, cosméticos y productos de higiene y cuidado personal",
    },
    {
      value: "20291",
      label: "Fabricación de tintas y colores para escribir y pintar",
    },
    {
      value: "20292",
      label: "Fabricación de productos pirotécnicos, explosivos y municiones",
    },
    { value: "20299", label: "Fabricación de productos químicos n.c.p." },
    { value: "20300", label: "Fabricación de fibras artificiales" },

    // PRODUCTOS FARMACÉUTICOS
    {
      value: "21001",
      label: "Manufactura de productos farmacéuticos y productos botánicos",
    },
    { value: "21008", label: "Maquilado de medicamentos" },

    // PRODUCTOS DE CAUCHO Y PLÁSTICO
    {
      value: "22110",
      label:
        "Fabricación de cubiertas y cámaras; renovación y recauchutado de cubiertas",
    },
    { value: "22190", label: "Fabricación de otros productos de caucho" },
    { value: "22201", label: "Fabricación de envases plásticos" },
    {
      value: "22202",
      label: "Fabricación de productos plásticos para uso personal o doméstico",
    },
    { value: "22208", label: "Maquila de plásticos" },
    { value: "22209", label: "Fabricación de productos plásticos n.c.p." },

    // PRODUCTOS MINERALES NO METÁLICOS
    { value: "23101", label: "Fabricación de vidrio" },
    { value: "23102", label: "Fabricación de recipientes y envases de vidrio" },
    { value: "23108", label: "Servicio de maquilado" },
    { value: "23109", label: "Fabricación de productos de vidrio ncp" },
    { value: "23910", label: "Fabricación de productos refractarios" },
    {
      value: "23920",
      label: "Fabricación de productos de arcilla para la construcción",
    },
    {
      value: "23931",
      label: "Fabricación de productos de cerámica y porcelana no refractaria",
    },
    {
      value: "23932",
      label: "Fabricación de productos de cerámica y porcelana ncp",
    },
    { value: "23940", label: "Fabricación de cemento, cal y yeso" },
    {
      value: "23950",
      label: "Fabricación de artículos de hormigón, cemento y yeso",
    },
    { value: "23960", label: "Corte, tallado y acabado de la piedra" },
    {
      value: "23990",
      label: "Fabricación de productos minerales no metálicos ncp",
    },

    // FABRICACIÓN DE METALES COMUNES
    { value: "24100", label: "Industrias básicas de hierro y acero" },
    {
      value: "24200",
      label:
        "Fabricación de productos primarios de metales preciosos y metales no ferrosos",
    },
    { value: "24310", label: "Fundición de hierro y acero" },
    { value: "24320", label: "Fundición de metales no ferrosos" },

    // PRODUCTOS DERIVADOS DE METAL
    {
      value: "25111",
      label: "Fabricación de productos metálicos para uso estructural",
    },
    {
      value: "25118",
      label: "Servicio de maquila para la fabricación de estructuras metálicas",
    },
    {
      value: "25120",
      label: "Fabricación de tanques, depósitos y recipientes de metal",
    },
    { value: "25130", label: "Fabricación de generadores de vapor" },
    { value: "25200", label: "Fabricación de armas y municiones" },
    {
      value: "25910",
      label:
        "Forjado, prensado, estampado y laminado de metales; pulvimetalurgia",
    },
    { value: "25920", label: "Tratamiento y revestimiento de metales" },
    {
      value: "25930",
      label:
        "Fabricación de artículos de cuchillería, herramientas de mano y ferretería",
    },
    {
      value: "25991",
      label: "Fabricación de envases y artículos conexos de metal",
    },
    {
      value: "25992",
      label: "Fabricación de artículos metálicos de uso personal y/o doméstico",
    },
    {
      value: "25999",
      label: "Fabricación de productos elaborados de metal ncp",
    },

    // PRODUCTOS DE INFORMÁTICA, ELECTRÓNICA Y ÓPTICA
    { value: "26100", label: "Fabricación de componentes electrónicos" },
    { value: "26200", label: "Fabricación de computadoras y equipo conexo" },
    { value: "26300", label: "Fabricación de equipo de comunicaciones" },
    {
      value: "26400",
      label: "Fabricación de aparatos electrónicos de consumo",
    },
    {
      value: "26510",
      label: "Fabricación de instrumentos y aparatos de medición y control",
    },
    { value: "26520", label: "Fabricación de relojes y piezas de relojes" },
    {
      value: "26600",
      label:
        "Fabricación de equipo médico de irradiación y electrónico de uso médico",
    },
    {
      value: "26700",
      label: "Fabricación de instrumentos de óptica y equipo fotográfico",
    },
    { value: "26800", label: "Fabricación de medios magnéticos y ópticos" },

    // FABRICACIÓN DE EQUIPO ELÉCTRICO
    {
      value: "27100",
      label: "Fabricación de motores, generadores y transformadores eléctricos",
    },
    { value: "27200", label: "Fabricación de pilas, baterías y acumuladores" },
    { value: "27310", label: "Fabricación de cables de fibra óptica" },
    { value: "27320", label: "Fabricación de otros hilos y cables eléctricos" },
    { value: "27330", label: "Fabricación de dispositivos de cableados" },
    { value: "27400", label: "Fabricación de equipo eléctrico de iluminación" },
    { value: "27500", label: "Fabricación de aparatos de uso doméstico" },
    { value: "27900", label: "Fabricación de otros tipos de equipo eléctrico" },

    // FABRICACIÓN DE MAQUINARIA Y EQUIPO
    {
      value: "28110",
      label: "Fabricación de motores y turbinas, excepto para vehículos",
    },
    { value: "28120", label: "Fabricación de equipo hidráulico" },
    {
      value: "28130",
      label: "Fabricación de otras bombas, compresores, grifos y válvulas",
    },
    {
      value: "28140",
      label: "Fabricación de cojinetes, engranajes y piezas de transmisión",
    },
    { value: "28150", label: "Fabricación de hornos y quemadores" },
    {
      value: "28160",
      label: "Fabricación de equipo de elevación y manipulación",
    },
    { value: "28170", label: "Fabricación de maquinaria y equipo de oficina" },
    { value: "28180", label: "Fabricación de herramientas manuales" },
    {
      value: "28190",
      label: "Fabricación de otros tipos de maquinaria de uso general",
    },
    {
      value: "28210",
      label: "Fabricación de maquinaria agropecuaria y forestal",
    },
    {
      value: "28220",
      label:
        "Fabricación de máquinas para conformar metales y maquinaria herramienta",
    },
    { value: "28230", label: "Fabricación de maquinaria metalúrgica" },
    {
      value: "28240",
      label: "Fabricación de maquinaria para minería y construcción",
    },
    {
      value: "28250",
      label: "Fabricación de maquinaria para alimentos, bebidas y tabaco",
    },
    {
      value: "28260",
      label:
        "Fabricación de maquinaria para textiles, prendas de vestir y cueros",
    },
    { value: "28291", label: "Fabricación de máquinas para imprenta" },
    { value: "28299", label: "Fabricación de maquinaria de uso especial ncp" },

    // FABRICACIÓN DE VEHÍCULOS
    { value: "29100", label: "Fabricación vehículos automotores" },
    {
      value: "29200",
      label: "Fabricación de carrocerías, remolques y semirremolques",
    },
    {
      value: "29300",
      label: "Fabricación de partes para vehículos automotores",
    },

    // FABRICACIÓN DE OTROS EQUIPOS DE TRANSPORTE
    { value: "30110", label: "Fabricación de buques" },
    {
      value: "30120",
      label: "Construcción y reparación de embarcaciones de recreo",
    },
    { value: "30200", label: "Fabricación de locomotoras y material rodante" },
    { value: "30300", label: "Fabricación de aeronaves y naves espaciales" },
    { value: "30400", label: "Fabricación de vehículos militares de combate" },
    { value: "30910", label: "Fabricación de motocicletas" },
    {
      value: "30920",
      label: "Fabricación de bicicletas y sillones de ruedas para inválidos",
    },
    { value: "30990", label: "Fabricación de equipo de transporte ncp" },

    // FABRICACIÓN DE MUEBLES
    { value: "31001", label: "Fabricación de colchones y somier" },
    {
      value: "31002",
      label: "Fabricación de muebles y otros productos de madera a medida",
    },
    { value: "31008", label: "Servicios de maquilado de muebles" },
    { value: "31009", label: "Fabricación de muebles ncp" },

    // OTRAS INDUSTRIAS MANUFACTURERAS
    { value: "32110", label: "Fabricación de joyas platerías y joyerías" },
    {
      value: "32120",
      label: "Fabricación de joyas de imitación y artículos conexos",
    },
    { value: "32200", label: "Fabricación de instrumentos musicales" },
    { value: "32301", label: "Fabricación de artículos de deporte" },
    { value: "32308", label: "Servicio de maquila de productos deportivos" },
    { value: "32401", label: "Fabricación de juegos de mesa y de salón" },
    { value: "32402", label: "Servicio de maquilado de juguetes y juegos" },
    { value: "32409", label: "Fabricación de juegos y juguetes n.c.p." },
    {
      value: "32500",
      label: "Fabricación de instrumentos y materiales médicos y odontológicos",
    },
    {
      value: "32901",
      label: "Fabricación de lápices, bolígrafos y artículos de librería",
    },
    {
      value: "32902",
      label: "Fabricación de escobas, cepillos, pinceles y similares",
    },
    {
      value: "32903",
      label: "Fabricación de artesanías de materiales diversos",
    },
    {
      value: "32904",
      label: "Fabricación de artículos de uso personal y domésticos n.c.p.",
    },
    {
      value: "32905",
      label: "Fabricación de accesorios para confecciones y marroquinería",
    },
    { value: "32908", label: "Servicios de maquila ncp" },
    { value: "32909", label: "Fabricación de productos manufacturados n.c.p." },

    // REPARACIÓN E INSTALACIÓN DE MAQUINARIA
    {
      value: "33110",
      label: "Reparación y mantenimiento de productos elaborados de metal",
    },
    { value: "33120", label: "Reparación y mantenimiento de maquinaria" },
    {
      value: "33130",
      label: "Reparación y mantenimiento de equipo electrónico y óptico",
    },
    { value: "33140", label: "Reparación y mantenimiento de equipo eléctrico" },
    {
      value: "33150",
      label: "Reparación y mantenimiento de equipo de transporte",
    },
    { value: "33190", label: "Reparación y mantenimiento de equipos n.c.p." },
    { value: "33200", label: "Instalación de maquinaria y equipo industrial" },

    // SUMINISTROS DE ELECTRICIDAD Y GAS
    { value: "35101", label: "Generación de energía eléctrica" },
    { value: "35102", label: "Transmisión de energía eléctrica" },
    { value: "35103", label: "Distribución de energía eléctrica" },
    { value: "35200", label: "Fabricación y distribución de gas por tuberías" },
    { value: "35300", label: "Suministro de vapor y agua caliente" },

    // SUMINISTRO DE AGUA Y GESTIÓN DE DESECHOS
    { value: "36000", label: "Captación, tratamiento y suministro de agua" },
    {
      value: "37000",
      label: "Evacuación de aguas residuales (alcantarillado)",
    },
    { value: "38110", label: "Recolección y transporte de desechos sólidos" },
    { value: "38120", label: "Recolección de desechos peligrosos" },
    { value: "38210", label: "Tratamiento y eliminación de desechos inicuos" },
    {
      value: "38220",
      label: "Tratamiento y eliminación de desechos peligrosos",
    },
    { value: "38301", label: "Reciclaje de desperdicios y desechos textiles" },
    {
      value: "38302",
      label: "Reciclaje de desperdicios y desechos de plástico y caucho",
    },
    { value: "38303", label: "Reciclaje de desperdicios y desechos de vidrio" },
    {
      value: "38304",
      label: "Reciclaje de desperdicios y desechos de papel y cartón",
    },
    { value: "38305", label: "Reciclaje de desperdicios y desechos metálicos" },
    {
      value: "38309",
      label: "Reciclaje de desperdicios y desechos no metálicos n.c.p.",
    },
    {
      value: "39000",
      label: "Actividades de Saneamiento y Gestión de Desechos",
    },

    // CONSTRUCCIÓN
    { value: "41001", label: "Construcción de edificios residenciales" },
    { value: "41002", label: "Construcción de edificios no residenciales" },
    { value: "42100", label: "Construcción de carreteras, calles y caminos" },
    { value: "42200", label: "Construcción de proyectos de servicio público" },
    {
      value: "42900",
      label: "Construcción de obras de ingeniería civil n.c.p.",
    },
    { value: "43110", label: "Demolición" },
    { value: "43120", label: "Preparación de terreno" },
    { value: "43210", label: "Instalaciones eléctricas" },
    {
      value: "43220",
      label: "Instalación de fontanería, calefacción y aire acondicionado",
    },
    { value: "43290", label: "Otras instalaciones para obras de construcción" },
    { value: "43300", label: "Terminación y acabado de edificios" },
    {
      value: "43900",
      label: "Otras actividades especializadas de construcción",
    },
    { value: "43901", label: "Fabricación de techos y materiales diversos" },

    // COMERCIO Y REPARACIÓN DE VEHÍCULOS
    { value: "45100", label: "Venta de vehículos automotores" },
    { value: "45201", label: "Reparación mecánica de vehículos automotores" },
    {
      value: "45202",
      label: "Reparaciones eléctricas del automotor y recarga de baterías",
    },
    { value: "45203", label: "Enderezado y pintura de vehículos automotores" },
    {
      value: "45204",
      label: "Reparaciones de radiadores, escapes y silenciadores",
    },
    {
      value: "45205",
      label: "Reparación de artículos de fibra de vidrio para vehículos",
    },
    { value: "45206", label: "Reparación de llantas de vehículos automotores" },
    { value: "45207", label: "Polarizado de vehículos" },
    { value: "45208", label: "Lavado y pasteado de vehículos (carwash)" },
    { value: "45209", label: "Reparaciones de vehículos n.c.p." },
    { value: "45211", label: "Remolque de vehículos automotores" },
    {
      value: "45301",
      label: "Venta de partes nuevas para vehículos automotores",
    },
    {
      value: "45302",
      label: "Venta de partes usadas para vehículos automotores",
    },
    { value: "45401", label: "Venta de motocicletas" },
    { value: "45402", label: "Venta de repuestos de motocicletas" },
    { value: "45403", label: "Mantenimiento y reparación de motocicletas" },

    // COMERCIO AL POR MAYOR
    {
      value: "46100",
      label: "Venta al por mayor a cambio de retribución o por contrata",
    },
    {
      value: "46201",
      label: "Venta al por mayor de materias primas agrícolas",
    },
    {
      value: "46202",
      label: "Venta al por mayor de productos de la silvicultura",
    },
    {
      value: "46203",
      label: "Venta al por mayor de productos pecuarios y de granja",
    },
    { value: "46211", label: "Venta de productos para uso agropecuario" },
    { value: "46291", label: "Venta al por mayor de granos básicos" },
    {
      value: "46292",
      label: "Venta al por mayor de semillas mejoradas para cultivo",
    },
    { value: "46293", label: "Venta al por mayor de café oro y uva" },
    { value: "46294", label: "Venta al por mayor de caña de azúcar" },
    { value: "46295", label: "Venta al por mayor de flores y plantas" },
    { value: "46296", label: "Venta al por mayor de productos agrícolas" },
    { value: "46297", label: "Venta al por mayor de ganado bovino (vivo)" },
    { value: "46298", label: "Venta al por mayor de otros animales vivos" },
    { value: "46299", label: "Venta de otras especies vivas del reino animal" },
    { value: "46301", label: "Venta al por mayor de alimentos" },
    { value: "46302", label: "Venta al por mayor de bebidas" },
    { value: "46303", label: "Venta al por mayor de tabaco" },
    { value: "46371", label: "Venta al por mayor de frutas y hortalizas" },
    { value: "46372", label: "Venta al por mayor de aves" },
    { value: "46373", label: "Venta al por mayor de carne y embutidos" },
    { value: "46374", label: "Venta al por mayor de huevos" },
    { value: "46375", label: "Venta al por mayor de productos lácteos" },
    { value: "46376", label: "Venta al por mayor de productos de panadería" },
    {
      value: "46377",
      label: "Venta al por mayor de pastas y aceites comestibles",
    },
    { value: "46378", label: "Venta al por mayor de sal comestible" },
    { value: "46379", label: "Venta al por mayor de azúcar" },
    { value: "46391", label: "Venta al por mayor de abarrotes" },
    { value: "46392", label: "Venta al por mayor de aguas gaseosas" },
    { value: "46393", label: "Venta al por mayor de agua purificada" },
    {
      value: "46394",
      label: "Venta al por mayor de refrescos y otras bebidas",
    },
    { value: "46395", label: "Venta al por mayor de cerveza y licores" },
    { value: "46396", label: "Venta al por mayor de hielo" },
    {
      value: "46411",
      label: "Venta al por mayor de productos textiles y mercería",
    },
    {
      value: "46412",
      label: "Venta al por mayor de artículos textiles excepto confecciones",
    },
    {
      value: "46413",
      label: "Venta al por mayor de confecciones textiles para el hogar",
    },
    { value: "46414", label: "Venta al por mayor de prendas de vestir" },
    { value: "46415", label: "Venta al por mayor de ropa usada" },
    { value: "46416", label: "Venta al por mayor de calzado" },
    {
      value: "46417",
      label: "Venta al por mayor de artículos de marroquinería",
    },
    { value: "46418", label: "Venta al por mayor de artículos de peletería" },
    {
      value: "46419",
      label: "Venta al por mayor de otros artículos textiles n.c.p.",
    },
    { value: "46471", label: "Venta al por mayor de instrumentos musicales" },
    { value: "46472", label: "Venta al por mayor de colchones y similares" },
    { value: "46473", label: "Venta al por mayor de artículos de aluminio" },
    { value: "46474", label: "Venta al por mayor de artículos plásticos" },
    {
      value: "46475",
      label: "Venta al por mayor de cámaras fotográficas y accesorios",
    },
    { value: "46482", label: "Venta al por mayor de productos veterinarios" },
    { value: "46483", label: "Venta al por mayor de productos de belleza" },
    { value: "46484", label: "Venta de productos farmacéuticos y medicinales" },
    {
      value: "46491",
      label: "Venta al por mayor de productos medicinales y de limpieza",
    },
    { value: "46492", label: "Venta al por mayor de relojes y joyería" },
    { value: "46493", label: "Venta al por mayor de electrodomésticos" },
    { value: "46494", label: "Venta al por mayor de artículos de bazar" },
    { value: "46495", label: "Venta al por mayor de artículos de óptica" },
    {
      value: "46496",
      label: "Venta al por mayor de libros y artículos de papel",
    },
    { value: "46497", label: "Venta de artículos deportivos y juguetes" },
    {
      value: "46498",
      label: "Venta al por mayor de productos usados para el hogar",
    },
    {
      value: "46499",
      label: "Venta al por mayor de enseres domésticos n.c.p.",
    },
    { value: "46500", label: "Venta al por mayor de bicicletas y accesorios" },
    {
      value: "46510",
      label: "Venta al por mayor de computadoras y programas informáticos",
    },
    { value: "46520", label: "Venta al por mayor de equipos de comunicación" },
    {
      value: "46530",
      label: "Venta al por mayor de maquinaria y equipo agropecuario",
    },
    { value: "46590", label: "Venta de equipos e instrumentos profesionales" },
    {
      value: "46591",
      label: "Venta al por mayor de maquinaria para la industria de la madera",
    },
    {
      value: "46592",
      label: "Venta al por mayor de maquinaria para la industria gráfica",
    },
    {
      value: "46593",
      label: "Venta al por mayor de maquinaria para la industria química",
    },
    {
      value: "46594",
      label: "Venta al por mayor de maquinaria para la industria metálica",
    },
    { value: "46595", label: "Venta al por mayor de equipamiento médico" },
    {
      value: "46596",
      label: "Venta al por mayor de maquinaria para la industria alimentaria",
    },
    {
      value: "46597",
      label: "Venta al por mayor de maquinaria para la industria textil",
    },
    {
      value: "46598",
      label: "Venta al por mayor de maquinaria para construcción y minería",
    },
    { value: "46599", label: "Venta al por mayor de otro tipo de maquinaria" },
    { value: "46610", label: "Venta al por mayor de combustibles" },
    {
      value: "46612",
      label: "Venta al por mayor de combustibles para automotores",
    },
    { value: "46613", label: "Venta al por mayor de lubricantes" },
    { value: "46614", label: "Venta al por mayor de gas propano" },
    { value: "46615", label: "Venta al por mayor de leña y carbón" },
    {
      value: "46620",
      label: "Venta al por mayor de metales y minerales metalíferos",
    },
    { value: "46631", label: "Venta al por mayor de puertas y ventanas" },
    { value: "46632", label: "Venta al por mayor de artículos de ferretería" },
    { value: "46633", label: "Vidrierías" },
    { value: "46634", label: "Venta al por mayor de maderas" },
    {
      value: "46639",
      label: "Venta al por mayor de materiales para la construcción n.c.p.",
    },
    { value: "46691", label: "Venta al por mayor de sal industrial sin yodar" },
    {
      value: "46692",
      label: "Venta al por mayor de productos intermedios textiles",
    },
    {
      value: "46693",
      label: "Venta al por mayor de productos intermedios metálicos",
    },
    {
      value: "46694",
      label: "Venta al por mayor de productos intermedios de papel",
    },
    {
      value: "46695",
      label: "Venta al por mayor fertilizantes y agroquímicos",
    },
    {
      value: "46696",
      label: "Venta al por mayor de productos intermedios plásticos",
    },

    // COMERCIO AL POR MAYOR (Continuación)
    {
      value: "46697",
      label:
        "Venta al por mayor de tintas para imprenta y productos colorantes",
    },
    {
      value: "46698",
      label: "Venta de productos intermedios químicos y de caucho",
    },
    {
      value: "46699",
      label: "Venta al por mayor de productos intermedios y desechos ncp",
    },
    { value: "46701", label: "Venta de algodón en oro" },
    { value: "46900", label: "Venta al por mayor de otros productos" },
    { value: "46901", label: "Venta al por mayor de productos pirotécnicos" },
    {
      value: "46902",
      label: "Venta al por mayor de artículos diversos para consumo humano",
    },
    {
      value: "46903",
      label: "Venta al por mayor de armas de fuego y municiones",
    },
    {
      value: "46904",
      label: "Venta al por mayor de toldos y tiendas de campaña",
    },
    {
      value: "46905",
      label: "Venta al por mayor de exhibidores publicitarios y rótulos",
    },
    {
      value: "46906",
      label: "Venta al por mayor de artículos promocionales diversos",
    },

    // COMERCIO AL POR MENOR
    { value: "47111", label: "Venta en supermercados" },
    {
      value: "47112",
      label: "Venta en tiendas de artículos de primera necesidad",
    },
    { value: "47119", label: "Almacenes (venta de diversos artículos)" },
    {
      value: "47190",
      label: "Venta al por menor en comercios no especializados",
    },
    { value: "47199", label: "Venta en establecimientos no especializados" },
    { value: "47211", label: "Venta al por menor de frutas y hortalizas" },
    {
      value: "47212",
      label: "Venta al por menor de carnes, embutidos y productos de granja",
    },
    { value: "47213", label: "Venta al por menor de pescado y mariscos" },
    { value: "47214", label: "Venta al por menor de productos lácteos" },
    {
      value: "47215",
      label: "Venta al por menor de productos de panadería y repostería",
    },
    { value: "47216", label: "Venta al por menor de huevos" },
    {
      value: "47217",
      label: "Venta al por menor de carnes y productos cárnicos",
    },
    { value: "47218", label: "Venta al por menor de granos básicos y otros" },
    { value: "47219", label: "Venta al por menor de alimentos n.c.p." },
    { value: "47221", label: "Venta al por menor de hielo" },
    {
      value: "47223",
      label: "Venta de bebidas no alcohólicas para consumo fuera",
    },
    {
      value: "47224",
      label: "Venta de bebidas alcohólicas para consumo fuera",
    },
    {
      value: "47225",
      label: "Venta de bebidas alcohólicas para consumo dentro",
    },
    { value: "47230", label: "Venta al por menor de tabaco" },
    {
      value: "47300",
      label: "Venta de combustibles, lubricantes y otros (gasolineras)",
    },
    {
      value: "47411",
      label: "Venta al por menor de computadoras y equipo periférico",
    },
    {
      value: "47412",
      label: "Venta de equipo y accesorios de telecomunicación",
    },
    { value: "47420", label: "Venta al por menor de equipo de audio y video" },
    {
      value: "47510",
      label: "Venta al por menor de productos textiles y confecciones",
    },
    { value: "47521", label: "Venta al por menor de productos de madera" },
    { value: "47522", label: "Venta al por menor de artículos de ferretería" },
    { value: "47523", label: "Venta al por menor de productos de pinturerías" },
    { value: "47524", label: "Venta al por menor en vidrierías" },
    {
      value: "47529",
      label: "Venta al por menor de materiales de construcción",
    },
    { value: "47530", label: "Venta al por menor de tapices y revestimientos" },
    { value: "47591", label: "Venta al por menor de muebles" },
    { value: "47592", label: "Venta al por menor de artículos de bazar" },
    { value: "47593", label: "Venta al por menor de electrodomésticos" },
    { value: "47594", label: "Venta al por menor de artículos eléctricos" },
    { value: "47598", label: "Venta al por menor de instrumentos musicales" },
    {
      value: "47610",
      label: "Venta al por menor de libros y artículos de papelería",
    },
    {
      value: "47620",
      label: "Venta al por menor de discos y medios audiovisuales",
    },
    {
      value: "47630",
      label: "Venta al por menor de productos y equipos de deporte",
    },
    { value: "47631", label: "Venta al por menor de bicicletas y accesorios" },
    { value: "47640", label: "Venta al por menor de juegos y juguetes" },
    { value: "47711", label: "Venta al por menor de prendas de vestir" },
    { value: "47712", label: "Venta al por menor de calzado" },
    {
      value: "47713",
      label: "Venta al por menor de artículos de marroquinería",
    },
    {
      value: "47721",
      label: "Venta al por menor de medicamentos y artículos médicos",
    },
    { value: "47722", label: "Venta al por menor de productos cosméticos" },
    {
      value: "47731",
      label: "Venta al por menor de joyería, óptica y relojería",
    },
    {
      value: "47732",
      label: "Venta al por menor de plantas y artículos conexos",
    },
    { value: "47733", label: "Venta al por menor de combustibles domésticos" },
    { value: "47734", label: "Venta al por menor de artesanías y recuerdos" },
    { value: "47735", label: "Venta al por menor de artículos religiosos" },
    {
      value: "47736",
      label: "Venta al por menor de armas de fuego y accesorios",
    },
    { value: "47737", label: "Venta al por menor de artículos pirotécnicos" },
    { value: "47738", label: "Venta al por menor de artículos desechables" },
    { value: "47739", label: "Venta al por menor de otros productos n.c.p." },
    { value: "47741", label: "Venta al por menor de artículos usados" },
    { value: "47742", label: "Venta al por menor de textiles usados" },
    { value: "47743", label: "Venta al por menor de libros usados" },
    { value: "47749", label: "Venta al por menor de productos usados n.c.p." },
    {
      value: "47811",
      label: "Venta al por menor de frutas y verduras en puestos",
    },
    {
      value: "47814",
      label: "Venta al por menor de productos lácteos en puestos",
    },
    { value: "47815", label: "Venta al por menor de panadería en puestos" },
    { value: "47816", label: "Venta al por menor de bebidas en puestos" },
    { value: "47818", label: "Venta al por menor en tiendas de mercado" },
    { value: "47821", label: "Venta al por menor de textiles en puestos" },
    {
      value: "47822",
      label: "Venta al por menor de artículos textiles en puestos",
    },
    { value: "47823", label: "Venta al por menor de confecciones en puestos" },
    {
      value: "47824",
      label: "Venta al por menor de prendas de vestir en puestos",
    },
    { value: "47825", label: "Venta al por menor de ropa usada en puestos" },
    { value: "47826", label: "Venta al por menor de calzado en puestos" },
    { value: "47827", label: "Venta al por menor de marroquinería en puestos" },
    {
      value: "47829",
      label: "Venta al por menor de artículos textiles ncp en puestos",
    },
    { value: "47891", label: "Venta al por menor de animales en puestos" },
    {
      value: "47892",
      label: "Venta al por menor de productos cosméticos en puestos",
    },
    {
      value: "47893",
      label: "Venta al por menor de artículos de bazar en puestos",
    },
    {
      value: "47894",
      label: "Venta al por menor de artículos de papel en puestos",
    },
    {
      value: "47895",
      label: "Venta al por menor de materiales de construcción en puestos",
    },
    {
      value: "47896",
      label: "Venta al por menor de equipos para comunicaciones en puestos",
    },
    { value: "47899", label: "Venta al por menor en puestos n.c.p." },
    { value: "47910", label: "Venta al por menor por correo o Internet" },
    { value: "47990", label: "Otros tipos de venta al por menor" },

    // TRANSPORTE Y ALMACENAMIENTO
    {
      value: "49110",
      label: "Transporte interurbano de pasajeros por ferrocarril",
    },
    { value: "49120", label: "Transporte de carga por ferrocarril" },
    { value: "49211", label: "Transporte de pasajeros urbanos mediante buses" },
    {
      value: "49212",
      label: "Transporte de pasajeros interdepartamental mediante microbuses",
    },
    {
      value: "49213",
      label: "Transporte de pasajeros urbanos mediante microbuses",
    },
    {
      value: "49214",
      label: "Transporte de pasajeros interdepartamental mediante buses",
    },
    { value: "49221", label: "Transporte internacional de pasajeros" },
    { value: "49222", label: "Transporte de pasajeros mediante taxis" },
    { value: "49223", label: "Transporte escolar" },
    { value: "49225", label: "Transporte de pasajeros para excursiones" },
    { value: "49226", label: "Servicios de transporte de personal" },
    { value: "49229", label: "Transporte de pasajeros por vía terrestre ncp" },
    { value: "49231", label: "Transporte de carga urbano" },
    { value: "49232", label: "Transporte nacional de carga" },
    { value: "49233", label: "Transporte de carga internacional" },
    { value: "49234", label: "Servicios de mudanza" },
    { value: "49235", label: "Alquiler de vehículos de carga con conductor" },
    { value: "49300", label: "Transporte por oleoducto o gasoducto" },
    { value: "50110", label: "Transporte de pasajeros marítimo y de cabotaje" },
    { value: "50120", label: "Transporte de carga marítimo y de cabotaje" },
    {
      value: "50211",
      label: "Transporte de pasajeros por vías de navegación interiores",
    },
    {
      value: "50212",
      label: "Alquiler de equipo de transporte acuático con conductor",
    },
    {
      value: "50220",
      label: "Transporte de carga por vías de navegación interiores",
    },
    { value: "51100", label: "Transporte aéreo de pasajeros" },
    { value: "51201", label: "Transporte de carga por vía aérea" },
    {
      value: "51202",
      label: "Alquiler de equipo de aerotransporte con operadores",
    },
    { value: "52101", label: "Alquiler de instalaciones en zonas francas" },
    { value: "52102", label: "Alquiler de silos para conservación de granos" },
    { value: "52103", label: "Alquiler de instalaciones con refrigeración" },
    { value: "52109", label: "Alquiler de bodegas para almacenamiento n.c.p." },
    { value: "52211", label: "Servicio de garaje y estacionamiento" },
    {
      value: "52212",
      label: "Servicios de terminales para transporte terrestre",
    },
    { value: "52219", label: "Servicios para el transporte terrestre n.c.p." },
    { value: "52220", label: "Servicios para el transporte acuático" },
    { value: "52230", label: "Servicios para el transporte aéreo" },
    { value: "52240", label: "Manipulación de carga" },
    { value: "52290", label: "Servicios para el transporte ncp" },
    { value: "52291", label: "Agencias de tramitaciones aduanales" },
    { value: "53100", label: "Servicios de correo nacional" },
    { value: "53200", label: "Actividades de correo distintas a las postales" },

    // ALOJAMIENTO Y RESTAURACIÓN
    {
      value: "55101",
      label: "Actividades de alojamiento para estancias cortas",
    },
    { value: "55102", label: "Hoteles" },
    { value: "55200", label: "Actividades de campamentos y parques" },
    { value: "55900", label: "Alojamiento n.c.p." },
    { value: "56101", label: "Restaurantes" },
    { value: "56106", label: "Pupusería" },
    { value: "56107", label: "Actividades varias de restaurantes" },
    { value: "56108", label: "Comedores" },
    { value: "56109", label: "Merenderos ambulantes" },
    { value: "56210", label: "Preparación de comida para eventos especiales" },
    { value: "56291", label: "Servicios de provisión de comidas por contrato" },
    { value: "56292", label: "Servicios de concesión de cafetines" },
    { value: "56299", label: "Servicios de preparación de comidas ncp" },
    { value: "56301", label: "Servicio de expendio de bebidas en bares" },
    { value: "56302", label: "Servicio de expendio de bebidas en puestos" },

    // INFORMACIÓN Y COMUNICACIONES
    { value: "58110", label: "Edición de libros y otras publicaciones" },
    { value: "58120", label: "Edición de directorios y listas de correos" },
    {
      value: "58130",
      label: "Edición de periódicos y publicaciones periódicas",
    },
    { value: "58190", label: "Otras actividades de edición" },
    { value: "58200", label: "Edición de programas informáticos" },
    { value: "59110", label: "Actividades de producción cinematográfica" },
    { value: "59120", label: "Actividades de post producción audiovisual" },
    { value: "59130", label: "Actividades de distribución de películas" },
    { value: "59140", label: "Actividades de exhibición de películas" },
    { value: "59200", label: "Actividades de edición y grabación de música" },
    { value: "60100", label: "Servicios de difusiones de radio" },
    { value: "60201", label: "Actividades de televisión abierta" },
    { value: "60202", label: "Actividades de televisión por cable" },
    { value: "60299", label: "Servicios de televisión" },
    {
      value: "60900",
      label: "Programación y transmisión de radio y televisión",
    },
    { value: "61101", label: "Servicio de telefonía" },
    { value: "61102", label: "Servicio de Internet" },
    { value: "61103", label: "Servicio de telefonía fija" },
    { value: "61109", label: "Servicio de Internet n.c.p." },
    { value: "61201", label: "Servicios de telefonía celular" },
    { value: "61202", label: "Servicios de Internet inalámbrico" },
    {
      value: "61209",
      label: "Servicios de telecomunicaciones inalámbrico n.c.p.",
    },
    { value: "61301", label: "Telecomunicaciones satelitales" },
    { value: "61309", label: "Comunicación vía satélite n.c.p." },
    { value: "61900", label: "Actividades de telecomunicación n.c.p." },
    { value: "62010", label: "Programación informática" },
    {
      value: "62020",
      label: "Consultorías y gestión de servicios informáticos",
    },
    { value: "62090", label: "Otras actividades de tecnología de información" },
    {
      value: "63110",
      label: "Procesamiento de datos y actividades relacionadas",
    },
    { value: "63120", label: "Portales WEB" },
    { value: "63910", label: "Servicios de Agencias de Noticias" },
    { value: "63990", label: "Otros servicios de información n.c.p." },

    // ACTIVIDADES FINANCIERAS Y DE SEGUROS
    { value: "64110", label: "Servicios provistos por el Banco Central" },
    { value: "64190", label: "Bancos" },
    { value: "64192", label: "Entidades dedicadas al envío de remesas" },
    { value: "64199", label: "Otras entidades financieras" },
    { value: "64200", label: "Actividades de sociedades de cartera" },
    { value: "64300", label: "Fideicomisos y fondos" },
    { value: "64910", label: "Arrendamientos financieros" },
    { value: "64920", label: "Asociaciones cooperativas de ahorro y crédito" },
    { value: "64921", label: "Instituciones emisoras de tarjetas de crédito" },
    { value: "64922", label: "Tipos de crédito ncp" },
    { value: "64928", label: "Prestamistas y casas de empeño" },
    { value: "64990", label: "Actividades de servicios financieros n.c.p." },
    { value: "65110", label: "Planes de seguros de vida" },
    { value: "65120", label: "Planes de seguro excepto de vida" },
    { value: "65199", label: "Seguros generales de todo tipo" },
    { value: "65200", label: "Planes se seguro" },
    { value: "65300", label: "Planes de pensiones" },
    { value: "66110", label: "Administración de mercados financieros" },
    { value: "66120", label: "Actividades bursátiles" },
    {
      value: "66190",
      label: "Actividades auxiliares de intermediación financiera",
    },
    { value: "66210", label: "Evaluación de riesgos y daños" },
    { value: "66220", label: "Actividades de agentes y corredores de seguros" },
    {
      value: "66290",
      label: "Actividades auxiliares de seguros y fondos de pensiones",
    },
    { value: "66300", label: "Actividades de administración de fondos" },

    // ACTIVIDADES INMOBILIARIAS
    { value: "68101", label: "Servicio de alquiler de lotes en cementerios" },
    {
      value: "68109",
      label: "Actividades inmobiliarias con bienes propios n.c.p.",
    },
    {
      value: "68200",
      label: "Actividades Inmobiliarias por Retribución o Contrata",
    },

    // ACTIVIDADES PROFESIONALES
    { value: "69100", label: "Actividades jurídicas" },
    { value: "69200", label: "Actividades de contabilidad y auditoría" },
    { value: "70100", label: "Actividades de oficinas centrales" },
    {
      value: "70200",
      label: "Actividades de consultoría en gestión empresarial",
    },
    {
      value: "71101",
      label: "Servicios de arquitectura y planificación urbana",
    },
    { value: "71102", label: "Servicios de ingeniería" },
    { value: "71103", label: "Servicios de agrimensura y topografía" },
    { value: "71200", label: "Ensayos y análisis técnicos" },
    {
      value: "72100",
      label: "Investigaciones en ciencias naturales e ingeniería",
    },
    { value: "72199", label: "Investigaciones científicas" },
    {
      value: "72200",
      label: "Investigaciones en ciencias sociales y humanidades",
    },
    { value: "73100", label: "Publicidad" },

    // ESTUDIOS DE MERCADO
    {
      value: "73200",
      label: "Investigación de mercados y encuestas de opinión pública",
    },

    // OTRAS ACTIVIDADES PROFESIONALES
    { value: "74100", label: "Actividades de diseño especializado" },
    { value: "74200", label: "Actividades de fotografía" },
    { value: "74900", label: "Servicios profesionales y científicos ncp" },

    // ACTIVIDADES VETERINARIAS
    { value: "75000", label: "Actividades veterinarias" },

    // ALQUILER Y ARRENDAMIENTO
    { value: "77101", label: "Alquiler de equipo de transporte terrestre" },
    { value: "77102", label: "Alquiler de equipo de transporte acuático" },
    { value: "77103", label: "Alquiler de equipo de transporte por vía aérea" },
    {
      value: "77210",
      label: "Alquiler y arrendamiento de equipo de recreo y deportivo",
    },
    { value: "77220", label: "Alquiler de cintas de video y discos" },
    {
      value: "77290",
      label: "Alquiler de otros efectos personales y domésticos",
    },
    { value: "77300", label: "Alquiler de maquinaria y equipo" },
    { value: "77400", label: "Arrendamiento de propiedad intelectual" },

    // ACTIVIDADES DE EMPLEO
    { value: "78100", label: "Obtención y dotación de personal" },
    { value: "78200", label: "Actividades de agencias de trabajo temporal" },
    { value: "78300", label: "Dotación de recursos humanos y gestión" },

    // AGENCIAS DE VIAJES Y TURISMO
    { value: "79110", label: "Actividades de agencias de viajes" },
    { value: "79120", label: "Actividades de los operadores turísticos" },
    { value: "79900", label: "Otros servicios de reservas" },

    // INVESTIGACIÓN Y SEGURIDAD
    { value: "80100", label: "Servicios de seguridad privados" },
    {
      value: "80201",
      label: "Actividades de servicios de sistemas de seguridad",
    },
    { value: "80202", label: "Actividades para sistemas de seguridad" },
    { value: "80300", label: "Actividades de investigación" },

    // SERVICIOS A EDIFICIOS
    { value: "81100", label: "Actividades de mantenimiento de edificios" },
    { value: "81210", label: "Limpieza general de edificios" },
    {
      value: "81290",
      label: "Otras actividades de mantenimiento de edificios",
    },
    { value: "81300", label: "Servicio de jardinería" },

    // ACTIVIDADES ADMINISTRATIVAS
    { value: "82110", label: "Servicios administrativos de oficinas" },
    { value: "82190", label: "Servicio de fotocopiado y similares" },
    {
      value: "82200",
      label: "Actividades de centrales de llamadas (call center)",
    },
    { value: "82300", label: "Organización de convenciones y ferias" },
    { value: "82910", label: "Actividades de agencias de cobro" },
    { value: "82921", label: "Servicios de envase de productos alimenticios" },
    { value: "82922", label: "Servicios de envase de productos medicinales" },
    { value: "82929", label: "Servicio de envase y empaque ncp" },
    { value: "82990", label: "Actividades de apoyo empresariales ncp" },

    // ADMINISTRACIÓN PÚBLICA
    { value: "84110", label: "Actividades de la Administración Pública" },
    { value: "84111", label: "Alcaldías municipales" },
    { value: "84120", label: "Regulación de servicios sociales" },
    { value: "84130", label: "Regulación de la actividad económica" },
    { value: "84210", label: "Administración de Relaciones Exteriores" },
    { value: "84220", label: "Actividades de defensa" },
    { value: "84230", label: "Actividades de orden público y seguridad" },
    { value: "84300", label: "Planes de seguridad social obligatoria" },

    // ENSEÑANZA
    { value: "85101", label: "Guardería educativa" },
    { value: "85102", label: "Enseñanza preescolar o parvularia" },
    { value: "85103", label: "Enseñanza primaria" },
    { value: "85104", label: "Educación preescolar y primaria integrada" },
    { value: "85211", label: "Enseñanza secundaria tercer ciclo" },
    { value: "85212", label: "Enseñanza secundaria bachillerato" },
    { value: "85221", label: "Enseñanza secundaria técnica y profesional" },
    { value: "85222", label: "Enseñanza técnica integrada con primaria" },
    { value: "85301", label: "Enseñanza superior universitaria" },
    { value: "85302", label: "Enseñanza superior no universitaria" },
    { value: "85303", label: "Enseñanza superior integrada" },
    { value: "85410", label: "Educación deportiva y recreativa" },
    { value: "85420", label: "Educación cultural" },
    { value: "85490", label: "Otros tipos de enseñanza n.c.p." },
    { value: "85499", label: "Enseñanza formal" },
    { value: "85500", label: "Servicios de apoyo a la enseñanza" },

    // SALUD HUMANA
    { value: "86100", label: "Actividades de hospitales" },
    { value: "86201", label: "Clínicas médicas" },
    { value: "86202", label: "Servicios de Odontología" },
    { value: "86203", label: "Servicios médicos" },
    { value: "86901", label: "Servicios de análisis y diagnóstico" },
    { value: "86902", label: "Actividades de atención de la salud humana" },
    { value: "86909", label: "Otros servicios relacionados con la salud" },

    // ATENCIÓN DE ENFERMERÍA
    {
      value: "87100",
      label: "Residencias de ancianos con atención de enfermería",
    },
    { value: "87200", label: "Instituciones para tratamiento mental" },
    { value: "87300", label: "Instituciones para ancianos y discapacitados" },
    { value: "87900", label: "Actividades de asistencia a niños y jóvenes" },
    { value: "87901", label: "Otras actividades de atención en instituciones" },

    // ASISTENCIA SOCIAL
    {
      value: "88100",
      label: "Asistencia social para ancianos y discapacitados",
    },
    { value: "88900", label: "Servicios sociales sin alojamiento ncp" },

    // ACTIVIDADES ARTÍSTICAS
    {
      value: "90000",
      label: "Actividades creativas artísticas y de esparcimiento",
    },
    { value: "91010", label: "Actividades de bibliotecas y archivos" },
    { value: "91020", label: "Actividades de museos y preservación histórica" },
    { value: "91030", label: "Actividades de jardines botánicos y zoológicos" },
    { value: "92000", label: "Actividades de juegos y apuestas" },
    { value: "93110", label: "Gestión de instalaciones deportivas" },
    { value: "93120", label: "Actividades de clubes deportivos" },
    { value: "93190", label: "Otras actividades deportivas" },
    { value: "93210", label: "Actividades de parques de atracciones" },
    { value: "93291", label: "Discotecas y salas de baile" },
    { value: "93298", label: "Centros vacacionales" },
    { value: "93299", label: "Actividades de esparcimiento ncp" },

    // ASOCIACIONES
    { value: "94110", label: "Actividades de organizaciones empresariales" },
    { value: "94120", label: "Actividades de organizaciones profesionales" },
    { value: "94200", label: "Actividades de sindicatos" },
    { value: "94910", label: "Actividades de organizaciones religiosas" },
    { value: "94920", label: "Actividades de organizaciones políticas" },
    { value: "94990", label: "Actividades de asociaciones n.c.p." },

    // REPARACIÓN
    { value: "95110", label: "Reparación de computadoras y equipo periférico" },
    { value: "95120", label: "Reparación de equipo de comunicación" },
    { value: "95210", label: "Reparación de aparatos electrónicos de consumo" },
    { value: "95220", label: "Reparación de aparatos domésticos" },
    { value: "95230", label: "Reparación de calzado y artículos de cuero" },
    {
      value: "95240",
      label: "Reparación de muebles y accesorios para el hogar",
    },
    { value: "95291", label: "Reparación de Instrumentos musicales" },
    { value: "95292", label: "Servicios de cerrajería y copiado de llaves" },
    { value: "95293", label: "Reparación de joyas y relojes" },
    { value: "95294", label: "Reparación de bicicletas y rodados" },
    { value: "95299", label: "Reparaciones de enseres personales n.c.p." },

    // SERVICIOS PERSONALES
    { value: "96010", label: "Lavado y limpieza de prendas" },
    { value: "96020", label: "Peluquería y tratamientos de belleza" },
    { value: "96030", label: "Pompas fúnebres y actividades conexas" },
    { value: "96091", label: "Servicios de sauna y estética corporal" },
    { value: "96092", label: "Servicios n.c.p." },

    // HOGARES COMO EMPLEADORES
    { value: "97000", label: "Hogares como empleadores de personal doméstico" },
    {
      value: "98100",
      label: "Producción de bienes de hogares para uso propio",
    },
    {
      value: "98200",
      label: "Producción de servicios de hogares para uso propio",
    },

    // ORGANIZACIONES EXTRATERRITORIALES
    {
      value: "99000",
      label: "Actividades de organizaciones extraterritoriales",
    },

    // EMPLEADOS Y OTRAS PERSONAS
    { value: "10001", label: "Empleados" },
    { value: "10002", label: "Jubilado" },
    { value: "10003", label: "Estudiante" },
    { value: "10004", label: "Desempleado" },
    { value: "10005", label: "Otros" },
  ];
  // ...existing state and handlers...
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activitySearch, setActivitySearch] = useState("");

  const filteredActivities = allActivities.filter((act) =>
    act.label.toLowerCase().includes(activitySearch.toLowerCase())
  );

  return (
    <section className="self-stretch flex flex-row items-start justify-start py-0 px-2.5 box-border max-w-full text-left text-xs text-black font-inria-sans ch:w-1/3 ch:self-center">
      {/* Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-2 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">
                Seleccionar actividad económica
              </h2>
              <button
                onClick={() => setShowActivityModal(false)}
                className="text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <input
              type="text"
              placeholder="Buscar actividad..."
              className="mb-2 p-2 border rounded w-full self-center"
              value={activitySearch}
              onChange={(e) => setActivitySearch(e.target.value)}
              autoFocus
            />
            <div className="overflow-y-auto max-h-64 border rounded">
              {filteredActivities.length === 0 && (
                <div className="p-2 text-gray-500">
                  No se encontraron resultados
                </div>
              )}
              {filteredActivities.map((activity) => (
                <button
                  key={activity.value}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                    client.codActividad === activity.value ? "bg-green-100" : ""
                  }`}
                  onClick={() => {
                    handleChange("codActividad", activity.value);
                    /* setting description */
                    handleChange("descActividad", activity.label);
                    setShowActivityModal(false);
                    setActivitySearch("");
                  }}
                >
                  {activity.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start  px-0 pb-[29px] box-border gap-[14px] max-w-full">
        <div className="self-stretch h-[532px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
        <div className="self-stretch flex flex-col items-start justify-start gap-[9.5px_0px] max-w-full text-left text-xs text-black font-inria-sans">
          <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-between pt-[11px] pb-[9px] pr-5 pl-[17px] box-border max-w-full gap-[20px] z-[1]">
            <div className="h-[37px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full" />
            <b className="relative z-[2] text-lg w-2 pt-1">Receptor</b>
            <button
              className="bg-lightgray-200 rounded-lg flex flex-row items-center justify-center px-3 py-1 w-1/3 h-9 "
              onClick={handleSelectClient}
            >
              <div className="flex items-start justify-start pt-px px-0 pb-0">
                <h1 className="text-xs">Receptores</h1>
                <img
                  className="w-4 h-4  z-[2] place-self-center pl-2"
                  alt=""
                  src={personas}
                />
              </div>
            </button>
          </div>
          {isVisibleClient && (
            <div className="modal">
              <ListReceptores
                onSelectClient={onSelectClient}
                handleSelectClient={handleSelectClient}
              />
            </div>
          )}
          <div className="flex flex-row items-start justify-start py-0 px-3.5">
            <div className="flex flex-row items-start justify-start gap-[0px_4px]"></div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="self-stretch flex flex-row items-start justify-start py-1 box-border max-w-full">
              <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                <div className="relative text-xs font-inria-sans text-left z-[1]">
                  <span className="text-black">{`Nit`}</span>
                  <span className="text-tomato">*</span>
                </div>
                <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
                  <input
                    className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                    placeholder="######"
                    type="Number"
                    value={client.nit}
                    onChange={(e) => handleChange("nit", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="self-stretch flex flex-row items-start justify-start py-1 box-border max-w-full">
              <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                <div className="relative text-xs font-inria-sans text-left z-[1]">
                  <span className="text-black">{`NRC `}</span>
                  <span className="text-tomato">*</span>
                </div>
                <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
                  <input
                    className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                    placeholder="######"
                    type="Number"
                    value={client.nrc}
                    onChange={(e) => handleChange("nrc", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`Nombre `}</span>
              <span className="text-tomato">*</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="Nombre"
                type="text"
                value={client.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`Numero de telefono`}</span>
              {/* <span className="text-tomato">*</span> */}
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="######"
                type="Number"
                value={client.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="self-stretch flex flex-row items-start justify-start pl-4 py-1 pr-3 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`Nombre Comercial. `}</span>
              {/* <span className="text-tomato">*</span> */}
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="Nombre Comercial"
                type="text"
                value={client.nombreComercial}
                onChange={(e) =>
                  handleChange("nombreComercial", e.target.value)
                }
              />
            </div>
          </div>
        </div>
        {/* Actividad económica field */}
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">Actividad económica</span>
              <span className="text-tomato pl-1">*</span>
            </div>
            <button
              type="button"
              className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100 bg-white text-left"
              onClick={() => setShowActivityModal(true)}
            >
              {(() => {
                const label =
                  allActivities.find((a) => a.value === client.codActividad)
                    ?.label || "Seleccionar actividad";
                return label.length > 45 ? label.slice(0, 45) + "..." : label;
              })()}
            </button>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`Correo Eléctronico `}</span>
              <span className="text-green-700">*</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="Correo Eléctronico"
                type="text"
                value={client.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`Dirección `}</span>
              <span className="text-tomato">*</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="Dirección"
                type="text"
                value={client.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="self-stretch flex flex-col items-start justify-start pt-0 px-3.5 pb-[5px] box-border max-w-full">
            {/* Municipality */}
            {/* Department selection */}
            {visible && (
              <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                <div className="relative text-xs font-inria-sans text-left z-[1] mb-2">
                  <span className="text-black">Departamento</span>
                  <span className="text-tomato">*</span>
                </div>
                <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
                  <select
                    className="w-full h-full relative border-white bg-white border-2 max-w-full"
                    value={selectedDepartment}
                    onChange={handleDepartmentChange}
                  >
                    <option value="">Select a department</option>
                    {Object.keys(departmentsAndMunicipalities).map((key) => (
                      <option key={key} value={key}>
                        {departmentsAndMunicipalities[key].departmentName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {visible && (
              <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full mt-4">
                <div className="relative text-xs font-inria-sans text-left z-[1] mb-2">
                  <span className="text-black">Municipio</span>
                  <span className="text-tomato">*</span>
                </div>
                <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
                  <select
                    className="w-full h-full relative border-white bg-white border-2 max-w-full"
                    value={selectedMunicipality}
                    onChange={handleMunicipalityChange}
                    disabled={!selectedDepartment} // Disable if no department is selected
                  >
                    <option value="">Select a municipality</option>
                    {selectedDepartment &&
                      departmentsAndMunicipalities[
                        selectedDepartment
                      ].municipalities.map((municipality, index) => (
                        <option key={index} value={municipality.index}>
                          {municipality.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            )}

            {/* End Municipality */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClietnBillCredit;

/* import React, { useState } from "react";
import Select from 'react-select';
import personas from '../assets/imgs/personas.png';
import ListReceptores from '../components/ListReceptores';

const ClientBillCredit = ({
  setClient,
  client,
  departmentsAndMunicipalities,
  handleDepartmentChange,
  handleMunicipalityChange,
  selectedMunicipality,
  getMunicipalityNumber,
  selectedDepartment,
  visible,
  handleSelectClient,
  isVisibleClient,
  onSelectClient
}) => {
  const handleChange = (field, value) => {
    var descActividaddata2 = "Otros";
    if (value == "10005") {
      descActividaddata2 = "Otros";
    } else if (value == "10001") {
      descActividaddata2 = "Empleados";
    } else if (value == "10003") {
      descActividaddata2 = "Estudiante";
    } else if (value == "97000") {
      descActividaddata2 = "empleadores de personal doméstico";
    } else if (value == "99000") {
      descActividaddata2 =
        "Actividades de organizaciones y órganos extraterritoriales";
    } else if (value == "10004") {
      descActividaddata2 = "Desempleado";
    } else if (value == "86203") {
      descActividaddata2 = "Servicios de medicos";
    }

    if (field == "codActividad") {
      setClient((prevClient) => ({
        ...prevClient,
        [field]: value,
        descActividad: descActividaddata2,
      }));
      return;
    }

    // Update the client state with the new value
    setClient((prevClient) => ({
      ...prevClient,
      [field]: value,
    }));
  };

  const activityOptions = [
    { value: '86203', label: 'Servicios Médicos' },
    { value: '73100', label: 'Publicidad' },
    { value: '56101', label: 'Restaurantes' },
    { value: '52290', label: 'Servicios para el transporte ncp' }
  ];

  return (
    <section className="self-stretch flex flex-row items-start justify-start py-0 px-2.5 box-border max-w-full text-left text-xs text-black font-inria-sans ch:w-1/3 ch:self-center">
      <div className="flex-1 rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start  px-0 pb-[29px] box-border gap-[14px] max-w-full">
        <div className="self-stretch h-[532px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
        <div className="self-stretch flex flex-col items-start justify-start gap-[9.5px_0px] max-w-full text-left text-xs text-black font-inria-sans">
          <div className="self-stretch rounded-t-mini rounded-b-none bg-gainsboro-200 flex flex-row items-start justify-between pt-[11px] pb-[9px] pr-5 pl-[17px] box-border max-w-full gap-[20px] z-[1]">
            <div className="h-[37px] w-[390px] relative rounded-t-mini rounded-b-none bg-gainsboro-200 hidden max-w-full" />
            <b className="relative z-[2] text-lg w-2 pt-1">Receptor</b>
            <button className='bg-lightgray-200 rounded-lg flex flex-row items-center justify-center px-3 py-1 w-1/3 h-9 ' onClick={handleSelectClient}>
              <div className="flex items-start justify-start pt-px px-0 pb-0">
                <h1 className='text-xs'>Receptores</h1>
                <img
                  className="w-4 h-4  z-[2] place-self-center pl-2"
                  alt=""
                  src={personas}
                />
              </div>
            </button>
          </div>
          {isVisibleClient && (
            <div className="modal">
              <ListReceptores onSelectClient={onSelectClient} handleSelectClient={handleSelectClient} />
            </div>
          )}
          <div className="flex flex-row items-start justify-start py-0 px-3.5">
            <div className="flex flex-row items-start justify-start gap-[0px_4px]"></div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="self-stretch flex flex-row items-start justify-start py-1 box-border max-w-full">
              <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                <div className="relative text-xs font-inria-sans text-left z-[1]">
                  <span className="text-black">{`Nit`}</span>
                  <span className="text-tomato">*</span>
                </div>
                <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
                  <input
                    className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                    placeholder="######"
                    type="Number"
                    value={client.nit}
                    onChange={(e) => handleChange("nit", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="self-stretch flex flex-row items-start justify-start py-1 box-border max-w-full">
              <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                <div className="relative text-xs font-inria-sans text-left z-[1]">
                  <span className="text-black">{`NRC `}</span>
                  <span className="text-tomato">*</span>
                </div>
                <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
                  <input
                    className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                    placeholder="######"
                    type="Number"
                    value={client.nrc}
                    onChange={(e) => handleChange("nrc", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`Nombre `}</span>
              <span className="text-tomato">*</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="Nombre"
                type="text"
                value={client.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`Numero de telefono`}</span>
              </div>
              <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
                <input
                  className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                  placeholder="######"
                  type="Number"
                  value={client.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
              </div>
            </div>
          </div>
  
          <div className="self-stretch flex flex-row items-start justify-start pl-4 py-1 pr-3 box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <div className="relative text-xs font-inria-sans text-left z-[1]">
                <span className="text-black">{`Nombre Comercial. `}</span>
              </div>
              <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
                <input
                  className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                  placeholder="Nombre Comercial"
                  type="text"
                  value={client.nombreComercial}
                  onChange={(e) =>
                    handleChange("nombreComercial", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <div className="relative text-xs font-inria-sans text-left z-[1]">
                <span className="text-black">{`Actividad economica`}</span>
                <span className="text-tomato pl-1">*</span>
              </div>
              <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
                <Select
                  value={activityOptions.find(option => option.value === client.codActividad)}
                  options={activityOptions}
                  onChange={(selectedOption) => handleChange("codActividad", selectedOption.value)}
                  className="w-full h-full relative border-white bg-white border-2 max-w-full"
                  placeholder="Seleccionar actividad"
                />
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <div className="relative text-xs font-inria-sans text-left z-[1]">
                <span className="text-black">{`Correo Eléctronico `}</span>
                <span className="text-green-700">*</span>
              </div>
              <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
                <input
                  className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                  placeholder="Correo Eléctronico"
                  type="text"
                  value={client.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
            <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
              <div className="relative text-xs font-inria-sans text-left z-[1]">
                <span className="text-black">{`Dirección `}</span>
                <span className="text-tomato">*</span>
              </div>
              <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
                <input
                  className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                  placeholder="Dirección"
                  type="text"
                  value={client.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="self-stretch flex flex-col items-start justify-start pt-0 px-3.5 pb-[5px] box-border max-w-full">
              {visible && (
                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                  <div className="relative text-xs font-inria-sans text-left z-[1] mb-2">
                    <span className="text-black">Departamento</span>
                    <span className="text-tomato">*</span>
                  </div>
                  <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
                    <select
                      className="w-full h-full relative border-white bg-white border-2 max-w-full"
                      value={selectedDepartment}
                      onChange={handleDepartmentChange}
                    >
                      <option value="">Select a department</option>
                      {Object.keys(departmentsAndMunicipalities).map((key) => (
                        <option key={key} value={key}>
                          {departmentsAndMunicipalities[key].departmentName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
  
              {visible && (
                <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full mt-4">
                  <div className="relative text-xs font-inria-sans text-left z-[1] mb-2">
                    <span className="text-black">Municipio</span>
                    <span className="text-tomato">*</span>
                  </div>
                  <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
                    <select
                      className="w-full h-full relative border-white bg-white border-2 max-w-full"
                      value={selectedMunicipality}
                      onChange={handleMunicipalityChange}
                      disabled={!selectedDepartment} // Disable if no department is selected
                    >
                      <option value="">Select a municipality</option>
                      {selectedDepartment &&
                        departmentsAndMunicipalities[selectedDepartment].municipalities.map(
                          (municipality, index) => (
                            <option key={index} value={municipality.index}>
                              {municipality.name}
                            </option>
                          )
                        )}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default ClientBillCredit; */
