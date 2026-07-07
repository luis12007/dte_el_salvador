import FrameComponent3 from "./SwitchOFF";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { economicActivities } from "../data/economicActivities";
const DocumentTypeFrame = ({
  handleSelectClient,
  setClient,
  client,
  isVisibleClient,
  onSelectClient,
}) => {
  // Modal de actividad económica (opcional, solo para el PDF).
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activitySearch, setActivitySearch] = useState("");

  const filteredActivities = economicActivities.filter((act) =>
    act.label.toLowerCase().includes(activitySearch.toLowerCase())
  );

  // Setter para campos que solo viven en el PDF (no se envían al Ministerio de Hacienda).
  // El NRC se sanitiza a dígitos.
  const setPdfField = (field, rawValue) => {
    const value =
      field === "pdfNrc" ? (rawValue || "").toString().replace(/\D/g, "") : rawValue;
    setClient((prevClient) => ({
      ...prevClient,
      [field]: value,
    }));
  };

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
    }

    if (field == "codActividad") {
      setClient((prevClient) => ({
        ...prevClient,
        [field]: value,
        descActividad: descActividaddata2,
      }));
      return;
    }

    // Sanitizar documento al escribir para evitar valores inesperados (autofill raro)
    if (field == "document") {
      let sanitized = value ? value.toString().trim() : "";
      if (client.documentType === "13") {
        // DUI: solo dígitos, longitud máxima 9
        sanitized = sanitized.replace(/\D/g, "").slice(0, 9);
      } else if (client.documentType === "36") {
        // NIT: solo dígitos, longitud máxima 20
        sanitized = sanitized.replace(/\D/g, "").slice(0, 20);
      } else {
        // Otros: limitar longitud
        sanitized = sanitized.slice(0, 60);
      }

      setClient((prevClient) => ({
        ...prevClient,
        document: sanitized,
      }));
      return;
    }

    // Update the client state with the new value
    setClient((prevClient) => ({
      ...prevClient,
      [field]: value,
    }));
  };
  return (
    <section className="self-stretch flex flex-row items-start justify-start py-0 px-2.5 box-border max-w-full text-left text-xs text-black font-inria-sans ch:w-1/3 ch:self-center">
      {/* Modal de actividad económica (opcional, solo para el PDF) */}
      {showActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-2 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold">Seleccionar actividad económica</h2>
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
                <div className="p-2 text-gray-500">No se encontraron resultados</div>
              )}
              {client.pdfCodActividad && (
                <button
                  className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 border-b"
                  onClick={() => {
                    setPdfField("pdfCodActividad", null);
                    setPdfField("pdfDescActividad", null);
                    setShowActivityModal(false);
                    setActivitySearch("");
                  }}
                >
                  Quitar actividad económica
                </button>
              )}
              {filteredActivities.map((activity) => (
                <button
                  key={activity.value}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                    client.pdfCodActividad === activity.value ? "bg-green-100" : ""
                  }`}
                  onClick={() => {
                    setPdfField("pdfCodActividad", activity.value);
                    setPdfField("pdfDescActividad", activity.label);
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
      <div className="flex-1 rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start px-0 pb-[29px] box-border gap-[14px] max-w-full">
        <div className="self-stretch h-[532px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
        <FrameComponent3
          handleSelectClient={handleSelectClient}
          isVisibleClient={isVisibleClient}
          onSelectClient={onSelectClient}
        />
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`Tipo de documento de identificación `}</span>
              {/* <span className="text-tomato">*</span> */}
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
              <select
                value={client.documentType}
                onChange={(e) => handleChange("documentType", e.target.value)}
                className="w-full relative  bg-white border-2 max-w-full"
              >
                <option value="13">DUI</option>
                <option value="36">NIT </option>
                <option value="03">Pasaporte</option>
                <option value="37">Otro</option>
                {/* <option value="02">Carnet de residencia</option>
                 */}
              </select>
              <div className="h-[23px] w-[359px] relative rounded-6xs box-border hidden max-w-full border-[0.3px] border-solid border-gray-100" />
            </div>

            <div className="self-stretch flex flex-row items-start justify-start py-1 box-border max-w-full">
              <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                <div className="relative text-xs font-inria-sans text-left z-[1]">
                  <span className="text-black">{`Documento de identificación `}</span>
                  {/* <span className="text-tomato">*</span> */}
                </div>
                <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
                  <input
                    name="client_document"
                    autoComplete="off"
                    inputMode={client.documentType === "13" ? "numeric" : "text"}
                    className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2] no-spinner"
                    placeholder="Documento sin guiones ni espacios"
                    type="text"
                    value={client.document}
                    onChange={(e) => handleChange("document", e.target.value)}
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
              {/* <span className="text-tomato">*</span> */}
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
              <input
                name="client_name"
                autoComplete="off"
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
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
              <span className="text-black">{`Teléfono `}</span>
              {/* <span className="text-tomato">*</span> */}
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
              <input
                name="client_phone"
                autoComplete="off"
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
                value={client.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`Correo Eléctronico `}</span>
              <span className="text-lime-700">*</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
              <input
                name="client_email"
                autoComplete="off"
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
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
              {/* <span className="text-tomato">*</span> */}
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
              <input
                name="client_address"
                autoComplete="off"
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="datos personales datos personales"
                type="text"
                value={client.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* NRC (opcional, solo para el PDF) */}
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`NRC`}</span>
              <span className="text-gray-400 pl-1">(opcional)</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100">
              <input
                name="client_nrc_pdf"
                autoComplete="off"
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2] no-spinner"
                placeholder="######"
                type="text"
                inputMode="numeric"
                value={client.pdfNrc ?? ""}
                onChange={(e) => setPdfField("pdfNrc", e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* Actividad económica (opcional, solo para el PDF) */}
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">Actividad económica</span>
              <span className="text-gray-400 pl-1">(opcional)</span>
            </div>
            <button
              type="button"
              className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100 bg-white text-left text-darkslategray"
              onClick={() => setShowActivityModal(true)}
            >
              {(() => {
                const label =
                  economicActivities.find((a) => a.value === client.pdfCodActividad)
                    ?.label || "Seleccionar actividad";
                return label.length > 45 ? label.slice(0, 45) + "..." : label;
              })()}
            </button>
          </div>
        </div>
        {/* <div className="self-stretch px-3">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`Tipo de documento de identificación `}</span>
              <span className="text-tomato">*</span> 
            </div>
            <div className="self-stretch h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100 px-3">
              <select
              value={client.codActividad}
                onChange={(e) => handleChange("codActividad", e.target.value)}
                className="w-full relative  bg-white border-2 max-w-full"
              >
                <option value="10005">Otros</option>
                <option value="10001">Empleados</option>
                <option value="10003">Estudiante</option>
                <option value="97000">empleadores de personal doméstico</option>
                <option value="99000">Actividades de organizaciones y órganos extraterritoriales </option>
                <option value="10004">Desempleado</option>
              </select>
              <div className="h-[23px] w-[359px] relative rounded-6xs box-border hidden max-w-full border-[0.3px] border-solid border-gray-100" />
            </div>
            </div>  */}
      </div>
    </section>
  );
};

// Asegurar que `documentType` esté entre las opciones válidas y sanitizar `document`.
// Esto evita que autofill/otros textos no deseados aparezcan.
export const validateClientFields = (client, setClient) => {
  const allowed = ["13", "36", "03", "37"];

  try {
    if (!client) return;
    if (!allowed.includes(client.documentType)) {
      setClient((prev) => ({ ...prev, documentType: "13" }));
      return;
    }

    const d = client.document;
    if (!d && d !== 0) return;
    const digits = d.toString().replace(/\D/g, "");

    if (client.documentType === "13") {
      if (/^\d{9}$/.test(digits)) {
        const formatted = digits.slice(0, -1) + "-" + digits.slice(-1);
        if (client.document !== formatted) setClient((prev) => ({ ...prev, document: formatted }));
      } else {
        const truncated = digits.slice(0, 9);
        if (client.document !== truncated) setClient((prev) => ({ ...prev, document: truncated }));
      }
    } else if (client.documentType === "36") {
      if (client.document !== digits) setClient((prev) => ({ ...prev, document: digits }));
    } else {
      const out = digits.slice(0, 60);
      if (client.document !== out) setClient((prev) => ({ ...prev, document: out }));
    }
  } catch (e) {
    console.warn("validateClientFields error:", e);
  }
};

export default DocumentTypeFrame;
