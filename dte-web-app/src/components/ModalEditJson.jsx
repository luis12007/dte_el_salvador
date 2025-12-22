import React, { useMemo, useRef, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";

const cloneDeep = (value) => {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value ?? {}));
};

const numOrNull = (v) => {
  const s = String(v ?? "").trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

const numOrZero = (v) => {
  const s = String(v ?? "").trim();
  if (s === "") return 0;
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};

const numStrOrZero = (v) => {
  const s = String(v ?? "").trim();
  return s === "" ? "0" : s;
};

const safeStr = (v) => (v == null ? "" : String(v));

const maybeNumber = (v) => {
  const s = String(v ?? "").trim();
  if (s === "") return v;
  const n = Number(s);
  return Number.isFinite(n) ? n : v;
};

const buildExtrasFromForm = (form) => {
  return {
    claseDocumento: safeStr(form.claseDocumento),
    comprasInternasExentas: numOrZero(form.comprasInternasExentas),
    internacionesExentasNoSujetas: numOrZero(form.internacionesExentasNoSujetas),
    importacionesExentasNoSujetas: numOrZero(form.importacionesExentasNoSujetas),
    comprasInternasGravadas: numOrZero(form.comprasInternasGravadas),
    internacionesGravadasBienes: numOrZero(form.internacionesGravadasBienes),
    importacionesGravadasBienes: numOrZero(form.importacionesGravadasBienes),
    importacionesGravadasServicios: numOrZero(form.importacionesGravadasServicios),
    creditoFiscal: numOrZero(form.creditoFiscal),
    totalCompras: numOrZero(form.totalCompras),
    duiProveedor: safeStr(form.duiProveedor),
    rentaTipoOperacion: safeStr(form.rentaTipoOperacion),
    rentaClasificacion: safeStr(form.rentaClasificacion),
    rentaSector: safeStr(form.rentaSector),
    rentaTipoCostoGasto: safeStr(form.rentaTipoCostoGasto),
    rentaNumeroAnexo: "3",
  };
};

const insertExtrasAfterApendice = (baseJson, extras) => {
  const preferredOrder = [
    "identificacion",
    "documentoRelacionado",
    "emisor",
    "receptor",
    "otrosDocumentos",
    "ventaTercero",
    "cuerpoDocumento",
    "resumen",
    "extension",
    "apendice",
  ];

  const extrasKeys = new Set(Object.keys(extras));

  const ordered = {};
  const copied = new Set();
  for (const k of preferredOrder) {
    if (baseJson && Object.prototype.hasOwnProperty.call(baseJson, k) && !extrasKeys.has(k)) {
      ordered[k] = baseJson[k];
      copied.add(k);
    }
  }

  if (!Object.prototype.hasOwnProperty.call(ordered, "apendice")) {
    ordered.apendice = baseJson?.apendice ?? null;
    copied.add("apendice");
  }

  for (const k of Object.keys(baseJson ?? {})) {
    if (copied.has(k)) continue;
    if (extrasKeys.has(k)) continue;
    ordered[k] = baseJson[k];
    copied.add(k);
  }

  const finalJson = {};
  for (const [k, v] of Object.entries(ordered)) {
    finalJson[k] = v;
    if (k === "apendice") {
      for (const [ek, ev] of Object.entries(extras)) {
        finalJson[ek] = ev;
      }
    }
  }

  return finalJson;
};

const ModalEditJson = ({
  isOpen,
  onRequestClose,
  jsonData,
  onSave,
  primaryLabel,
  onSaveBill,
}) => {
  const tipoOperacionOptions = useMemo(
    () => [
      { value: "1", label: "1 - Gravada" },
      { value: "2", label: "2 - No gravada o exenta" },
      {
        value: "3",
        label:
          "3 - Excluido o no contribuyente (Renta)",
      },
      {
        value: "4",
        label:
          "4 - Mixta (régimen especial con incentivos)",
      },
      { value: "8", label: "8 - Informadas en más de 1 anexo" },
      {
        value: "9",
        label:
          "9 - Excepciones (instituciones públicas / no deducibles)",
      },
    ],
    []
  );

  const clasificacionOptions = useMemo(
    () => [
      { value: "1", label: "1 - Costos" },
      { value: "2", label: "2 - Gastos" },
      { value: "8", label: "8 - Informadas en más de 1 anexo" },
      {
        value: "9",
        label: "9 - Excepciones (instituciones públicas / no IVA)",
      },
    ],
    []
  );

  const sectorOptions = useMemo(
    () => [
      { value: "1", label: "1 - Industria" },
      { value: "2", label: "2 - Comercio" },
      { value: "3", label: "3 - Agropecuaria" },
      { value: "4", label: "4 - Servicios profesionales / artes / oficios" },
      { value: "8", label: "8 - Informadas en más de 1 anexo" },
      { value: "9", label: "9 - Excepciones" },
    ],
    []
  );

  const tipoCostoGastoOptions = useMemo(
    () => [
      { value: "1", label: "1 - Gasto de venta sin donación" },
      { value: "2", label: "2 - Gasto de administración sin donación" },
      { value: "3", label: "3 - Gastos financieros sin donación" },
      {
        value: "4",
        label:
          "4 - Costo artículos producidos/comprados (import./intern.)",
      },
      {
        value: "5",
        label: "5 - Costo artículos producidos/comprados interno",
      },
      { value: "6", label: "6 - Costos indirectos de fabricación" },
      { value: "7", label: "7 - Mano de obra" },
      { value: "8", label: "8 - Informadas en más de 1 anexo" },
      { value: "9", label: "9 - Excepciones" },
    ],
    []
  );

  const [form, setForm] = useState(() => {
    const ident = jsonData?.identificacion ?? {};
    const emisor = jsonData?.emisor ?? {};
    const resumen = jsonData?.resumen ?? {};

    const tipoDte = safeStr(ident.tipoDte);
    const totalCompras = numStrOrZero(
      jsonData?.totalCompras ?? resumen.totalPagar ?? resumen.montoTotalOperacion ?? ""
    );
    let creditoFiscal = safeStr(jsonData?.creditoFiscal ?? resumen.totalIva ?? "");
    if (String(creditoFiscal ?? "").trim() === "") {
      creditoFiscal = tipoDte === "03" ? totalCompras : "0";
    }

    const items = Array.isArray(jsonData?.cuerpoDocumento)
      ? jsonData.cuerpoDocumento
      : [];

    return {
      fecha: safeStr(ident.fecEmi),
      claseDocumento: safeStr(jsonData?.claseDocumento ?? "4"),
      tipoDte: safeStr(ident.tipoDte),
      codigoGeneracion: safeStr(ident.codigoGeneracion),

      nitProveedor: safeStr(emisor.nit),
      nrcProveedor: safeStr(emisor.nrc),
      nombreProveedor: safeStr(emisor.nombre),

      comprasInternasExentas: numStrOrZero(jsonData?.comprasInternasExentas ?? ""),
      internacionesExentasNoSujetas: numStrOrZero(jsonData?.internacionesExentasNoSujetas ?? ""),
      importacionesExentasNoSujetas: numStrOrZero(jsonData?.importacionesExentasNoSujetas ?? ""),
      comprasInternasGravadas: numStrOrZero(
        jsonData?.comprasInternasGravadas ?? jsonData?.ventasInternasGravadas ?? resumen.totalGravada ?? ""
      ),
      internacionesGravadasBienes: numStrOrZero(jsonData?.internacionesGravadasBienes ?? ""),
      importacionesGravadasBienes: numStrOrZero(jsonData?.importacionesGravadasBienes ?? ""),
      importacionesGravadasServicios: numStrOrZero(jsonData?.importacionesGravadasServicios ?? ""),
      creditoFiscal: numStrOrZero(creditoFiscal),
      totalCompras,

      subTotal: numStrOrZero(resumen.subTotal ?? resumen.subTotalVentas ?? ""),
      iva: numStrOrZero(resumen.totalIva ?? ""),
      total: numStrOrZero(resumen.totalPagar ?? resumen.montoTotalOperacion ?? ""),

      duiProveedor: safeStr(jsonData?.duiProveedor ?? ""),

      rentaTipoOperacion: safeStr(jsonData?.rentaTipoOperacion ?? ""),
      rentaClasificacion: safeStr(jsonData?.rentaClasificacion ?? ""),
      rentaSector: safeStr(jsonData?.rentaSector ?? ""),
      rentaTipoCostoGasto: safeStr(jsonData?.rentaTipoCostoGasto ?? ""),
      rentaNumeroAnexo: "3",

      items: items.map((it, idx) => ({
        ...it,
        numItem: it?.numItem ?? idx + 1,
        codigo: safeStr(it?.codigo ?? ""),
        descripcion: safeStr(it?.descripcion ?? ""),
        cantidad: safeStr(it?.cantidad ?? ""),
        precioUni: safeStr(it?.precioUni ?? ""),
      })),
    };
  });

  React.useEffect(() => {
    const ident = jsonData?.identificacion ?? {};
    const emisor = jsonData?.emisor ?? {};
    const resumen = jsonData?.resumen ?? {};

    const tipoDte = safeStr(ident.tipoDte);
    const totalCompras = numStrOrZero(
      jsonData?.totalCompras ?? resumen.totalPagar ?? resumen.montoTotalOperacion ?? ""
    );
    let creditoFiscal = safeStr(jsonData?.creditoFiscal ?? resumen.totalIva ?? "");
    if (String(creditoFiscal ?? "").trim() === "") {
      creditoFiscal = tipoDte === "03" ? totalCompras : "0";
    }

    const items = Array.isArray(jsonData?.cuerpoDocumento)
      ? jsonData.cuerpoDocumento
      : [];
    setForm({
      fecha: safeStr(ident.fecEmi),
      claseDocumento: safeStr(jsonData?.claseDocumento ?? "4"),
      tipoDte: safeStr(ident.tipoDte),
      codigoGeneracion: safeStr(ident.codigoGeneracion),

      nitProveedor: safeStr(emisor.nit),
      nrcProveedor: safeStr(emisor.nrc),
      nombreProveedor: safeStr(emisor.nombre),

      comprasInternasExentas: numStrOrZero(jsonData?.comprasInternasExentas ?? ""),
      internacionesExentasNoSujetas: numStrOrZero(jsonData?.internacionesExentasNoSujetas ?? ""),
      importacionesExentasNoSujetas: numStrOrZero(jsonData?.importacionesExentasNoSujetas ?? ""),
      comprasInternasGravadas: numStrOrZero(
        jsonData?.comprasInternasGravadas ?? jsonData?.ventasInternasGravadas ?? resumen.totalGravada ?? ""
      ),
      internacionesGravadasBienes: numStrOrZero(jsonData?.internacionesGravadasBienes ?? ""),
      importacionesGravadasBienes: numStrOrZero(jsonData?.importacionesGravadasBienes ?? ""),
      importacionesGravadasServicios: numStrOrZero(jsonData?.importacionesGravadasServicios ?? ""),
      creditoFiscal: numStrOrZero(creditoFiscal),
      totalCompras,

      subTotal: numStrOrZero(resumen.subTotal ?? resumen.subTotalVentas ?? ""),
      iva: numStrOrZero(resumen.totalIva ?? ""),
      total: numStrOrZero(resumen.totalPagar ?? resumen.montoTotalOperacion ?? ""),

      duiProveedor: safeStr(jsonData?.duiProveedor ?? ""),

      rentaTipoOperacion: safeStr(jsonData?.rentaTipoOperacion ?? ""),
      rentaClasificacion: safeStr(jsonData?.rentaClasificacion ?? ""),
      rentaSector: safeStr(jsonData?.rentaSector ?? ""),
      rentaTipoCostoGasto: safeStr(jsonData?.rentaTipoCostoGasto ?? ""),
      rentaNumeroAnexo: "3",

      items: items.map((it, idx) => ({
        ...it,
        numItem: it?.numItem ?? idx + 1,
        codigo: safeStr(it?.codigo ?? ""),
        descripcion: safeStr(it?.descripcion ?? ""),
        cantidad: safeStr(it?.cantidad ?? ""),
        precioUni: safeStr(it?.precioUni ?? ""),
      })),
    });
  }, [jsonData]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setItemField = (index, key, value) => {
    setForm((prev) => {
      const next = Array.isArray(prev.items) ? [...prev.items] : [];
      const current = next[index] ?? {};
      next[index] = { ...current, [key]: value };
      return { ...prev, items: next };
    });
  };

  const addItem = () => {
    setForm((prev) => {
      const currentItems = Array.isArray(prev.items) ? prev.items : [];
      const nextNum = currentItems.length + 1;
      const base = currentItems.length
        ? { ...currentItems[currentItems.length - 1] }
        : {
            numItem: nextNum,
            tipoItem: 1,
            cantidad: "1",
            codigo: "",
            descripcion: "",
            precioUni: "0",
          };

      const newItem = {
        ...base,
        numItem: nextNum,
        codigo: "",
        descripcion: "",
        cantidad: "1",
        precioUni: "0",
      };
      return { ...prev, items: [...currentItems, newItem] };
    });
  };

  const removeItem = (index) => {
    setForm((prev) => {
      const currentItems = Array.isArray(prev.items) ? prev.items : [];
      const next = currentItems.filter((_, i) => i !== index);
      // Re-numerar numItem
      const renumbered = next.map((it, i) => ({ ...it, numItem: i + 1 }));
      return { ...prev, items: renumbered };
    });
  };

  const inputBase =
    "w-full min-w-0 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm";
  const inputBaseCompact =
    "w-full min-w-0 px-3 py-1.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-[13px]";
  const labelBase = "block text-[11px] font-semibold mb-1 leading-snug whitespace-normal";
  const sectionTitle = "text-sm font-bold text-gray-800";

  const fieldRefs = useRef({});
  const highlightTimerRef = useRef(null);
  const [highlighted, setHighlighted] = useState({});

  const isBlank = (v) => String(v ?? "").trim() === "";

  const markHighlighted = (keys) => {
    const next = {};
    keys.forEach((k) => {
      next[k] = true;
    });
    setHighlighted(next);

    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
    }
    highlightTimerRef.current = setTimeout(() => {
      setHighlighted({});
      highlightTimerRef.current = null;
    }, 3000);
  };

  const scrollToField = (key) => {
    const el = fieldRefs.current?.[key];
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const validateRequired = () => {
    const missing = [];

    if (isBlank(form.fecha)) missing.push("fecha");
    if (isBlank(form.claseDocumento)) missing.push("claseDocumento");
    if (isBlank(form.tipoDte)) missing.push("tipoDte");
    if (isBlank(form.codigoGeneracion)) missing.push("codigoGeneracion");

    // NIT o NRC (al menos uno)
    if (isBlank(form.nitProveedor) && isBlank(form.nrcProveedor)) {
      missing.push("nitProveedor", "nrcProveedor");
    }

    if (isBlank(form.nombreProveedor)) missing.push("nombreProveedor");

    if (isBlank(form.comprasInternasExentas)) missing.push("comprasInternasExentas");
    if (isBlank(form.internacionesExentasNoSujetas)) missing.push("internacionesExentasNoSujetas");
    if (isBlank(form.importacionesExentasNoSujetas)) missing.push("importacionesExentasNoSujetas");
    if (isBlank(form.comprasInternasGravadas)) missing.push("comprasInternasGravadas");
    if (isBlank(form.internacionesGravadasBienes)) missing.push("internacionesGravadasBienes");
    if (isBlank(form.importacionesGravadasBienes)) missing.push("importacionesGravadasBienes");
    if (isBlank(form.importacionesGravadasServicios)) missing.push("importacionesGravadasServicios");
    if (isBlank(form.creditoFiscal)) missing.push("creditoFiscal");
    if (isBlank(form.totalCompras)) missing.push("totalCompras");

    if (isBlank(form.duiProveedor)) missing.push("duiProveedor");

    if (isBlank(form.rentaTipoOperacion)) missing.push("rentaTipoOperacion");
    if (isBlank(form.rentaClasificacion)) missing.push("rentaClasificacion");
    if (isBlank(form.rentaSector)) missing.push("rentaSector");
    if (isBlank(form.rentaTipoCostoGasto)) missing.push("rentaTipoCostoGasto");

    if (missing.length > 0) {
      const unique = Array.from(new Set(missing));
      markHighlighted(unique);
      toast.error("Hacen falta campos obligatorios. Revisa los marcados en rojo.");
      scrollToField(unique[0]);
      return false;
    }
    return true;
  };

  const labelClassFor = (key) =>
    `${labelBase} ${highlighted?.[key] ? "text-red-600" : "text-gray-700"}`;
  const inputClassFor = (base, key) =>
    `${base} ${highlighted?.[key] ? "border-red-500 ring-2 ring-red-300" : ""}`;

  const buildFinalJson = () => {
    const updated = cloneDeep(jsonData ?? {});
    if (!updated.identificacion) updated.identificacion = {};
    if (!updated.emisor) updated.emisor = {};
    if (!updated.resumen) updated.resumen = {};

    updated.identificacion.fecEmi = safeStr(form.fecha);
    updated.identificacion.tipoDte = safeStr(form.tipoDte);
    updated.identificacion.codigoGeneracion = safeStr(form.codigoGeneracion);

    updated.emisor.nit = safeStr(form.nitProveedor);
    updated.emisor.nrc = safeStr(form.nrcProveedor);
    updated.emisor.nombre = safeStr(form.nombreProveedor);

    // Totales (estructura establecida: resumen)
    if (form.subTotal !== "") updated.resumen.subTotal = maybeNumber(form.subTotal);
    if (form.iva !== "") updated.resumen.totalIva = maybeNumber(form.iva);
    if (form.total !== "") {
      updated.resumen.totalPagar = maybeNumber(form.total);
      updated.resumen.montoTotalOperacion = maybeNumber(form.total);
    }

    // Ítems (estructura establecida: cuerpoDocumento)
    if (Array.isArray(form.items)) {
      updated.cuerpoDocumento = form.items.map((it, i) => {
        const next = { ...it };
        next.numItem = i + 1;
        next.codigo = safeStr(it?.codigo);
        next.descripcion = safeStr(it?.descripcion);
        next.cantidad = maybeNumber(it?.cantidad);
        next.precioUni = maybeNumber(it?.precioUni);
        return next;
      });
    }

    const extras = buildExtrasFromForm(form);
    const finalJson = insertExtrasAfterApendice(updated, extras);
    return finalJson;
  };

  const handlePrimaryAction = async () => {
    if (!validateRequired()) return;
    const finalJson = buildFinalJson();
    if (!finalJson) return;

    if (typeof onSave === "function") {
      onSave(finalJson);
    }

    if (typeof onSaveBill === "function") {
      await onSaveBill(finalJson);
      if (typeof onRequestClose === "function") {
        onRequestClose();
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Editar información"
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-60"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-[96vw] max-w-6xl mx-2 sm:mx-4 animate-zoomIn overflow-hidden">
        <div className="bg-blue-500 text-white px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold leading-tight">
                Editar información del documento
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">
                Solo se muestran los campos requeridos para anexos y renta.
              </p>
            </div>
            <button
              onClick={onRequestClose}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-1.5 rounded-lg text-sm transition-all duration-200"
            >
              Cerrar
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto overflow-x-visible">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
            <div className="bg-gray-50 rounded-xl p-5 sm:p-6 border border-gray-200 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <span className={sectionTitle}>Documento</span>
                <span className="text-[11px] text-gray-500">
                  Identificación
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                <div className="min-w-0" ref={(el) => (fieldRefs.current.fecha = el)}>
                  <label className={labelClassFor("fecha")}>
                    Fecha <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    className={inputClassFor(inputBaseCompact, "fecha")}
                    value={form.fecha}
                    onChange={(e) => setField("fecha", e.target.value)}
                  />
                </div>
                <div className="min-w-0" ref={(el) => (fieldRefs.current.claseDocumento = el)}>
                  <label className={labelClassFor("claseDocumento")}>
                    Clase de documento <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputClassFor(inputBaseCompact, "claseDocumento")}
                    placeholder="4"
                    value={form.claseDocumento}
                    onChange={(e) => setField("claseDocumento", e.target.value)}
                  />
                </div>
                <div className="min-w-0" ref={(el) => (fieldRefs.current.tipoDte = el)}>
                  <label className={labelClassFor("tipoDte")}>
                    Tipo de documento <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputClassFor(inputBaseCompact, "tipoDte")}
                    placeholder="01, 03, 14..."
                    value={form.tipoDte}
                    onChange={(e) => setField("tipoDte", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2 min-w-0" ref={(el) => (fieldRefs.current.codigoGeneracion = el)}>
                  <label className={labelClassFor("codigoGeneracion")}>
                    Número de documento <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputClassFor(inputBaseCompact, "codigoGeneracion")}
                    value={form.codigoGeneracion}
                    onChange={(e) => setField("codigoGeneracion", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 sm:p-6 border border-gray-200 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <span className={sectionTitle}>Proveedor</span>
                <span className="text-[11px] text-gray-500">Emisor</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                <div className="min-w-0" ref={(el) => (fieldRefs.current.nitProveedor = el)}>
                  <label className={labelClassFor("nitProveedor")}>
                    NIT proveedor <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputClassFor(inputBaseCompact, "nitProveedor")}
                    value={form.nitProveedor}
                    onChange={(e) => setField("nitProveedor", e.target.value)}
                  />
                </div>
                <div className="min-w-0" ref={(el) => (fieldRefs.current.nrcProveedor = el)}>
                  <label className={labelClassFor("nrcProveedor")}>
                    NRC proveedor <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputClassFor(inputBaseCompact, "nrcProveedor")}
                    value={form.nrcProveedor}
                    onChange={(e) => setField("nrcProveedor", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2 min-w-0" ref={(el) => (fieldRefs.current.nombreProveedor = el)}>
                  <label className={labelClassFor("nombreProveedor")}>
                    Nombre proveedor <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputClassFor(inputBaseCompact, "nombreProveedor")}
                    value={form.nombreProveedor}
                    onChange={(e) => setField("nombreProveedor", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-2 min-w-0" ref={(el) => (fieldRefs.current.duiProveedor = el)}>
                  <label className={labelClassFor("duiProveedor")}>
                    DUI del proveedor <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    className={inputClassFor(inputBaseCompact, "duiProveedor")}
                    value={form.duiProveedor}
                    onChange={(e) => setField("duiProveedor", e.target.value)}
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    Este campo se guarda como llave adicional después de <b>apendice</b>.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 sm:p-6 border border-gray-200 xl:col-span-2 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <span className={sectionTitle}>Montos</span>
                <span className="text-[11px] text-gray-500">Clasificación</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-5">
                <div className="min-w-0" ref={(el) => (fieldRefs.current.comprasInternasExentas = el)}>
                  <label className={labelClassFor("comprasInternasExentas")}>
                    Compras internas exentas <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={inputClassFor(inputBase, "comprasInternasExentas")}
                    value={form.comprasInternasExentas}
                    onChange={(e) => setField("comprasInternasExentas", e.target.value)}
                  />
                </div>
                <div className="min-w-0" ref={(el) => (fieldRefs.current.internacionesExentasNoSujetas = el)}>
                  <label className={labelClassFor("internacionesExentasNoSujetas")}>
                    Internaciones exentas y/o no sujetas <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={inputClassFor(inputBase, "internacionesExentasNoSujetas")}
                    value={form.internacionesExentasNoSujetas}
                    onChange={(e) =>
                      setField("internacionesExentasNoSujetas", e.target.value)
                    }
                  />
                </div>
                <div className="min-w-0" ref={(el) => (fieldRefs.current.importacionesExentasNoSujetas = el)}>
                  <label className={labelClassFor("importacionesExentasNoSujetas")}>
                    Importaciones exentas y/o no sujetas <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={inputClassFor(inputBase, "importacionesExentasNoSujetas")}
                    value={form.importacionesExentasNoSujetas}
                    onChange={(e) => setField("importacionesExentasNoSujetas", e.target.value)}
                  />
                </div>
                <div className="min-w-0" ref={(el) => (fieldRefs.current.comprasInternasGravadas = el)}>
                  <label className={labelClassFor("comprasInternasGravadas")}>
                    Compras internas gravadas <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={inputClassFor(inputBase, "comprasInternasGravadas")}
                    value={form.comprasInternasGravadas}
                    onChange={(e) => setField("comprasInternasGravadas", e.target.value)}
                  />
                </div>
                <div className="min-w-0" ref={(el) => (fieldRefs.current.internacionesGravadasBienes = el)}>
                  <label className={labelClassFor("internacionesGravadasBienes")}>
                    Internaciones gravadas de bienes <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={inputClassFor(inputBase, "internacionesGravadasBienes")}
                    value={form.internacionesGravadasBienes}
                    onChange={(e) =>
                      setField("internacionesGravadasBienes", e.target.value)
                    }
                  />
                </div>
                <div className="min-w-0" ref={(el) => (fieldRefs.current.importacionesGravadasBienes = el)}>
                  <label className={labelClassFor("importacionesGravadasBienes")}>
                    Importaciones gravadas de bienes <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={inputClassFor(inputBase, "importacionesGravadasBienes")}
                    value={form.importacionesGravadasBienes}
                    onChange={(e) =>
                      setField("importacionesGravadasBienes", e.target.value)
                    }
                  />
                </div>
                <div className="min-w-0" ref={(el) => (fieldRefs.current.importacionesGravadasServicios = el)}>
                  <label className={labelClassFor("importacionesGravadasServicios")}>
                    Importaciones gravadas de servicios <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={inputClassFor(inputBase, "importacionesGravadasServicios")}
                    value={form.importacionesGravadasServicios}
                    onChange={(e) =>
                      setField("importacionesGravadasServicios", e.target.value)
                    }
                  />
                </div>
                <div className="min-w-0" ref={(el) => (fieldRefs.current.creditoFiscal = el)}>
                  <label className={labelClassFor("creditoFiscal")}>
                    Crédito fiscal <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={inputClassFor(inputBase, "creditoFiscal")}
                    value={form.creditoFiscal}
                    onChange={(e) => setField("creditoFiscal", e.target.value)}
                  />
                </div>
                <div className="min-w-0" ref={(el) => (fieldRefs.current.totalCompras = el)}>
                  <label className={labelClassFor("totalCompras")}>
                    Total de compras <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className={inputClassFor(inputBase, "totalCompras")}
                    value={form.totalCompras}
                    onChange={(e) => setField("totalCompras", e.target.value)}
                  />
                </div>
              </div>
              <p className="text-[11px] text-gray-500 mt-3">
                Estos montos se guardan como llaves adicionales después de <b>apendice</b> (no modifican <b>resumen</b>).
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 sm:p-6 border border-gray-200 xl:col-span-2 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <span className={sectionTitle}>Totales (Resumen)</span>
                <span className="text-[11px] text-gray-500">Editable</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
                <div className="min-w-0">
                  <label className={labelBase}>Sub total</label>
                  <input
                    type="number"
                    step="0.01"
                    className={inputBase}
                    value={form.subTotal}
                    onChange={(e) => setField("subTotal", e.target.value)}
                  />
                </div>
                <div className="min-w-0">
                  <label className={labelBase}>IVA</label>
                  <input
                    type="number"
                    step="0.01"
                    className={inputBase}
                    value={form.iva}
                    onChange={(e) => setField("iva", e.target.value)}
                  />
                </div>
                <div className="min-w-0">
                  <label className={labelBase}>Total</label>
                  <input
                    type="number"
                    step="0.01"
                    className={inputBase}
                    value={form.total}
                    onChange={(e) => setField("total", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 sm:p-6 border border-gray-200 xl:col-span-2 min-w-0">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <span className={sectionTitle}>Ítems</span>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Edita, agrega o elimina ítems de <b>cuerpoDocumento</b>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap"
                >
                  + Agregar ítem
                </button>
              </div>

              <div className="space-y-3">
                {(Array.isArray(form.items) ? form.items : []).length === 0 && (
                  <div className="text-sm text-gray-600 bg-white border border-gray-200 rounded-lg p-3">
                    No hay ítems en el documento.
                  </div>
                )}

                {(Array.isArray(form.items) ? form.items : []).map((it, idx) => {
                  const qty = Number(it?.cantidad) || 0;
                  const pu = Number(it?.precioUni) || 0;
                  const subtotal = (qty * pu).toFixed(2);
                  return (
                    <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-800 truncate">
                            Ítem #{idx + 1}
                          </div>
                          <div className="text-[11px] text-gray-500 truncate">
                            Subtotal: ${subtotal}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap"
                        >
                          Eliminar
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-5">
                        <div className="min-w-0">
                          <label className={labelBase}>Código</label>
                          <input
                            type="text"
                            className={inputBase}
                            value={safeStr(it?.codigo)}
                            onChange={(e) => setItemField(idx, "codigo", e.target.value)}
                          />
                        </div>
                        <div className="min-w-0 lg:col-span-2">
                          <label className={labelBase}>Descripción</label>
                          <input
                            type="text"
                            className={inputBase}
                            value={safeStr(it?.descripcion)}
                            onChange={(e) =>
                              setItemField(idx, "descripcion", e.target.value)
                            }
                          />
                        </div>
                        <div className="min-w-0">
                          <label className={labelBase}>Cantidad</label>
                          <input
                            type="number"
                            step="0.01"
                            className={inputBase}
                            value={safeStr(it?.cantidad)}
                            onChange={(e) => setItemField(idx, "cantidad", e.target.value)}
                          />
                        </div>
                        <div className="min-w-0">
                          <label className={labelBase}>Precio unitario</label>
                          <input
                            type="number"
                            step="0.01"
                            className={inputBase}
                            value={safeStr(it?.precioUni)}
                            onChange={(e) => setItemField(idx, "precioUni", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-5 sm:p-6 border border-gray-200 xl:col-span-2 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <span className={sectionTitle}>Renta</span>
                <span className="text-[11px] text-gray-500">Clasificación</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-5">
                <div className="min-w-0" ref={(el) => (fieldRefs.current.rentaTipoOperacion = el)}>
                  <label className={labelClassFor("rentaTipoOperacion")}>
                    Tipo de operación (Renta) <span className="text-red-600">*</span>
                  </label>
                  <select
                    className={inputClassFor(inputBase, "rentaTipoOperacion")}
                    value={form.rentaTipoOperacion}
                    onChange={(e) => setField("rentaTipoOperacion", e.target.value)}
                  >
                    <option value="">Seleccionar...</option>
                    {tipoOperacionOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-0" ref={(el) => (fieldRefs.current.rentaClasificacion = el)}>
                  <label className={labelClassFor("rentaClasificacion")}>
                    Clasificación (Renta) <span className="text-red-600">*</span>
                  </label>
                  <select
                    className={inputClassFor(inputBase, "rentaClasificacion")}
                    value={form.rentaClasificacion}
                    onChange={(e) => setField("rentaClasificacion", e.target.value)}
                  >
                    <option value="">Seleccionar...</option>
                    {clasificacionOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-0" ref={(el) => (fieldRefs.current.rentaSector = el)}>
                  <label className={labelClassFor("rentaSector")}>
                    Sector (Renta) <span className="text-red-600">*</span>
                  </label>
                  <select
                    className={inputClassFor(inputBase, "rentaSector")}
                    value={form.rentaSector}
                    onChange={(e) => setField("rentaSector", e.target.value)}
                  >
                    <option value="">Seleccionar...</option>
                    {sectorOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 min-w-0" ref={(el) => (fieldRefs.current.rentaTipoCostoGasto = el)}>
                  <label className={labelClassFor("rentaTipoCostoGasto")}>
                    Tipo de costo/gasto (Renta) <span className="text-red-600">*</span>
                  </label>
                  <select
                    className={inputClassFor(inputBase, "rentaTipoCostoGasto")}
                    value={form.rentaTipoCostoGasto}
                    onChange={(e) => setField("rentaTipoCostoGasto", e.target.value)}
                  >
                    <option value="">Seleccionar...</option>
                    {tipoCostoGastoOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-0">
                  <label className={labelBase}>Número de anexo</label>
                  <input
                    type="text"
                    className={inputBase}
                    placeholder="Ej: 3"
                    value={form.rentaNumeroAnexo}
                    disabled
                  />
                </div>
              </div>
              <p className="text-[11px] text-gray-500 mt-3">
                Los campos de renta se guardan como llaves adicionales después de <b>apendice</b>.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onRequestClose}
            className="px-5 py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={handlePrimaryAction}
            className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all duration-200"
          >
            {primaryLabel || "Guardar cambios"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalEditJson;
