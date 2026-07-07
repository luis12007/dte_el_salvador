import userEvent from "@testing-library/user-event";
import FrameComponent3 from "./SwitchON";
import { useEffect } from "react";
import { useState } from "react";
import { economicActivities } from "../data/economicActivities";
const BillCF = ({handleSelectChangeCFClient, setClient , client}) => {
  // Modal de selección de actividad económica (opcional, solo para el PDF).
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activitySearch, setActivitySearch] = useState("");

  const filteredActivities = economicActivities.filter((act) =>
    act.label.toLowerCase().includes(activitySearch.toLowerCase())
  );

  useEffect(() => {
    setClient({
      documentType: null,
      name: client.name,
      document: client.document,
      address: null,
      email: client.email,
      phone: null,
      codActividad: null,
      nrc: null,
      descActividad: null,
      // Campos opcionales SOLO para el PDF (no se envían al Ministerio de Hacienda).
      pdfNrc: client.pdfNrc ?? null,
      pdfCodActividad: client.pdfCodActividad ?? null,
      pdfDescActividad: client.pdfDescActividad ?? null,
    });

    // Validar y sanitizar al montar: aceptar solo DUI/NIT/Pasaporte/Otro
    try {
      const allowed = ["13", "36", "03", "37"];
      const currentType = client.documentType || "13";
      if (!allowed.includes(currentType)) {
        setClient((prev) => ({ ...prev, documentType: "13" }));
      }

      const d = client.document;
      if (d || d === 0) {
        const digits = d.toString().replace(/\D/g, "");
        if (currentType === "13") {
          if (/^\d{9}$/.test(digits)) {
            const formatted = digits.slice(0, -1) + "-" + digits.slice(-1);
            setClient((prev) => ({ ...prev, document: formatted }));
          } else {
            setClient((prev) => ({ ...prev, document: digits.slice(0, 9) }));
          }
        } else if (currentType === "36") {
          setClient((prev) => ({ ...prev, document: digits }));
        } else {
          setClient((prev) => ({ ...prev, document: digits.slice(0, 60) }));
        }
      }
    } catch (e) {
      console.warn("BillCF sanitize error:", e);
    }
  }, []);

  // Setter para campos que solo viven en el PDF. El NRC se sanitiza a dígitos.
  const setPdfField = (field, rawValue) => {
    const value =
      field === "pdfNrc" ? (rawValue || "").toString().replace(/\D/g, "") : rawValue;
    setClient((prevClient) => ({
      ...prevClient,
      [field]: value,
    }));
  };

  const changeHandler = (field,e) => {

    if (field === "document") {
      setClient((prevClient) => ({
        ...prevClient, // Copiar el estado anterior
        ["documentType"]: "13", // Actualizar el campo específico
      }));
      
    }

    console.log(field)
    console.log(e.target.value)
    setClient((prevClient) => ({
      ...prevClient, // Copiar el estado anterior
      [field]: e.target.value, // Actualizar el campo específico
    }));
  };

  return (
    <section className="self-stretch flex flex-row items-start justify-start py-0 px-2.5 box-border max-w-full text-left text-xs text-black font-inria-sans">
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
      <div className="flex-1 rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] flex flex-col items-start justify-start pt-0.5 px-0 pb-[29px] box-border gap-[14px] max-w-full">
        <div className="self-stretch h-[532px] relative rounded-mini bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] hidden" />
        <FrameComponent3 handleSelectChangeCFClient={handleSelectChangeCFClient} />
        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">

          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="self-stretch flex flex-row items-start justify-start py-1 box-border max-w-full">
              <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
                <div className="relative text-xs font-inria-sans text-left z-[1]">
                  <span className="text-black">{`DUI`}</span>
                  <span className="text-tomato">*</span>
                </div>
                <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
                  <input
                    className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                    placeholder="CF"
                    type="text"
                    value={client.document}
                    onChange={(e) => changeHandler("document", e)}
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
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="Luis Alexander"
                type="text"
                value={client.name}
                onChange={(e) => changeHandler("name", e)}

              />
            </div>
          </div>
        </div>

        <div className="self-stretch flex flex-row items-start justify-start py-0 px-3.5 box-border max-w-full">
          <div className="flex-1 flex flex-col items-start justify-start gap-[4px_0px] max-w-full">
            <div className="relative text-xs font-inria-sans text-left z-[1]">
              <span className="text-black">{`Correo Eléctronico `}</span>
              <span className="text-tomato">*</span>
            </div>
            <div className="self-stretch px-2 h-[23px] relative rounded-6xs box-border z-[1] border-[0.3px] border-solid border-gray-100" >
              <input
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
                placeholder="Email"
                type="text"
                value={client.email}
                onChange={(e) => changeHandler("email", e)}
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
                className="w-full [border:none] [outline:none] font-inria-sans text-xs bg-[transparent] h-3.5 relative text-darkslategray text-left inline-block p-0 z-[2]"
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

      </div>
    </section >
  );
};

export default BillCF;
