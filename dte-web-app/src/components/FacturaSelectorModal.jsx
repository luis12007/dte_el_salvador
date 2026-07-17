import React, { useState, useEffect } from 'react';
import PlantillaAPI from '../services/PlantillaService';

const FACTURA_TYPES = {
  '01': 'Factura',
  '02': 'Nota de Crédito',
  '03': 'Crédito Fiscal',
  '04': 'Comprobante de Retención',
  '05': 'Nota de Débito',
  '06': 'Sujeto Excluido',
  '07': 'Comprobante de Liquidación',
};

const FacturaSelectorModal = ({ isOpen, onClose, onSelectFactura, token, userId }) => {
  const [step, setStep] = useState(1); // 1: select type, 2: select factura
  const [selectedType, setSelectedType] = useState('');
  const [facturas, setFacturas] = useState([]);
  const [filteredFacturas, setFilteredFacturas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState('nombre'); // nombre, monto, correlativo, generacion

  useEffect(() => {
    if (step === 2 && selectedType) {
      loadFacturas();
    }
  }, [step, selectedType]);

  const loadFacturas = async () => {
    try {
      setLoading(true);
      const data = await PlantillaAPI.getByUserIdAndType(userId, token, selectedType);
      const sortedData = Array.isArray(data) ? data : [];
      sortedData.sort((a, b) => new Date(b.fecha_y_hora_de_generacion) - new Date(a.fecha_y_hora_de_generacion));
      setFacturas(sortedData);
      setFilteredFacturas(sortedData);
      setSearchTerm('');
    } catch (error) {
      console.error('Error al cargar facturas:', error);
      setFacturas([]);
      setFilteredFacturas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFacturas(facturas);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = facturas.filter((factura) => {
      switch (filterField) {
        case 'nombre':
          return (factura.re_name || '').toLowerCase().includes(term);
        case 'monto':
          return String(factura.total_a_pagar || '').includes(term);
        case 'correlativo':
          return (factura.numero_de_control || '').toLowerCase().includes(term);
        case 'generacion':
          return (factura.codigo_de_generacion || '').toLowerCase().includes(term);
        default:
          return true;
      }
    });

    setFilteredFacturas(filtered);
  }, [searchTerm, filterField, facturas]);

  const handleSelectFactura = (factura) => {
    onSelectFactura(factura);
    resetModal();
  };

  const resetModal = () => {
    setStep(1);
    setSelectedType('');
    setFacturas([]);
    setFilteredFacturas([]);
    setSearchTerm('');
    setFilterField('nombre');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 border-b border-gray-200 bg-steelblue-300 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {step === 1 ? 'Seleccionar Tipo de Documento' : `Seleccionar ${FACTURA_TYPES[selectedType]}`}
          </h2>
          <button
            onClick={resetModal}
            className="text-white hover:bg-white/20 rounded-lg p-1 transition"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            // Step 1: Type selection
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Object.entries(FACTURA_TYPES).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => {
                    setSelectedType(code);
                    setStep(2);
                  }}
                  className="rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-left transition hover:border-steelblue-300 hover:bg-blue-50"
                >
                  <div className="font-semibold text-slate-900">{name}</div>
                  <div className="text-xs text-slate-500">Código: {code}</div>
                </button>
              ))}
            </div>
          ) : (
            // Step 2: Factura selection
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={`Buscar por ${filterField}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-steelblue-300 focus:ring-2 focus:ring-steelblue-100"
                  />
                </div>
                <select
                  value={filterField}
                  onChange={(e) => setFilterField(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-steelblue-300 focus:ring-2 focus:ring-steelblue-100"
                >
                  <option value="nombre">Por Nombre</option>
                  <option value="monto">Por Monto</option>
                  <option value="correlativo">Por Correlativo</option>
                  <option value="generacion">Por Generación</option>
                </select>
              </div>

              {/* Back button */}
              <button
                onClick={() => setStep(1)}
                className="text-sm font-medium text-steelblue-300 hover:text-steelblue-200 transition"
              >
                ← Atrás
              </button>

              {/* Facturas list */}
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-steelblue-200 border-t-transparent" />
                </div>
              ) : filteredFacturas.length > 0 ? (
                <div className="space-y-2 max-h-[calc(90vh-350px)] overflow-y-auto">
                  {filteredFacturas.map((factura) => (
                    <button
                      key={factura.codigo_de_generacion}
                      onClick={() => handleSelectFactura(factura)}
                      className="w-full rounded-lg border border-gray-200 bg-white p-3 text-left transition hover:border-steelblue-300 hover:bg-blue-50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-900">{factura.re_name || 'Sin nombre'}</p>
                          <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                            <span>Control: {factura.numero_de_control}</span>
                            <span>•</span>
                            <span>Generación: {factura.codigo_de_generacion}</span>
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {new Date(factura.fecha_y_hora_de_generacion).toLocaleDateString('es-SV')}
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="font-bold text-steelblue-300">
                            ${Number(factura.total_a_pagar || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 bg-slate-50 py-8 text-center">
                  <p className="text-sm text-slate-600">No se encontraron facturas para este tipo de documento</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacturaSelectorModal;
