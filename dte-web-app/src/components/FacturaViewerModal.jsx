import React from 'react';
import { useNavigate } from 'react-router-dom';

const FACTURA_TYPES = {
  '01': 'Factura',
  '02': 'Nota de Crédito',
  '03': 'Crédito Fiscal',
  '04': 'Comprobante de Retención',
  '05': 'Nota de Débito',
  '06': 'Sujeto Excluido',
  '07': 'Comprobante de Liquidación',
};

const getEditPath = (tipo, codigo_de_generacion) => {
  switch (tipo) {
    case '01':
      return `/editar/factura/${codigo_de_generacion}`;
    case '02':
      return `/editar/NC/${codigo_de_generacion}`;
    case '03':
      return `/editar/CreditoFiscal/${codigo_de_generacion}`;
    case '04':
      return `/editar/CR/${codigo_de_generacion}`;
    case '05':
      return `/editar/ND/${codigo_de_generacion}`;
    case '06':
      return `/editar/sujEx/${codigo_de_generacion}`;
    case '07':
      return `/editar/CI/${codigo_de_generacion}`;
    default:
      return null;
  }
};

const FacturaViewerModal = ({ isOpen, onClose, factura }) => {
  const navigate = useNavigate();

  if (!isOpen || !factura) {
    return null;
  }

  const editPath = getEditPath(factura.tipo, factura.codigo_de_generacion);

  const handleEdit = () => {
    if (editPath) {
      navigate(editPath);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 bg-steelblue-300 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Detalles de {FACTURA_TYPES[factura.tipo] || 'Documento'}</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-1 transition"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Información del cliente */}
            <div>
              <h3 className="mb-3 font-semibold text-slate-900">Cliente</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-slate-500">Nombre:</span> {factura.re_name}
                </p>
                <p>
                  <span className="text-slate-500">NIT/DUI:</span> {factura.re_nit || factura.re_numdocumento}
                </p>
              </div>
            </div>

            {/* Información del documento */}
            <div>
              <h3 className="mb-3 font-semibold text-slate-900">Documento</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-slate-500">Tipo:</span> {FACTURA_TYPES[factura.tipo]}
                </p>
                <p>
                  <span className="text-slate-500">Generación:</span> {factura.codigo_de_generacion}
                </p>
                <p>
                  <span className="text-slate-500">Control:</span> {factura.numero_de_control}
                </p>
                <p>
                  <span className="text-slate-500">Fecha:</span>{' '}
                  {new Date(factura.fecha_y_hora_de_generacion).toLocaleDateString('es-SV')}
                </p>
              </div>
            </div>

            {/* Montos */}
            <div>
              <h3 className="mb-3 font-semibold text-slate-900">Montos</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-slate-500">Subtotal:</span> ${Number(factura.total_agravada || 0).toFixed(2)}
                </p>
                <p>
                  <span className="text-slate-500">Exento:</span> ${Number(factura.totalexenta || 0).toFixed(2)}
                </p>
                <p>
                  <span className="text-slate-500">IVA:</span> ${Number(factura.iva_percibido || 0).toFixed(2)}
                </p>
                <p className="pt-2 border-t border-gray-200">
                  <span className="font-semibold text-slate-900">Total:</span> ${Number(factura.total_a_pagar || 0).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Estado */}
            <div>
              <h3 className="mb-3 font-semibold text-slate-900">Estado</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-slate-500">Estado:</span>{' '}
                  <span className="inline-block rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                    {factura.sello_de_recepcion ? 'Validado' : 'Pendiente'}
                  </span>
                </p>
                {factura.sello_de_recepcion && (
                  <p>
                    <span className="text-slate-500">Sello:</span> {factura.sello_de_recepcion.substring(0, 20)}...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* JSON preview */}
          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <h3 className="mb-3 font-semibold text-slate-900">Datos completos</h3>
            <pre className="max-h-48 overflow-y-auto rounded bg-slate-100 p-3 text-xs text-slate-700 whitespace-pre-wrap break-words">
              {JSON.stringify(factura, null, 2).substring(0, 500)}...
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-slate-50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Cerrar
          </button>
          {editPath && (
            <button
              onClick={handleEdit}
              className="rounded-lg bg-steelblue-300 px-4 py-2 text-sm font-semibold text-white transition hover:bg-steelblue-200"
            >
              Editar Documento
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FacturaViewerModal;
