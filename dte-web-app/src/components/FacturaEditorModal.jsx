import React, { useState, useEffect } from 'react';
import PlantillaService from '../services/PlantillaService';
import { toast } from 'react-toastify';

// Campos que NO se deben editar (protegidos)
const PROTECTED_FIELDS = ['id', 'codigo_de_generacion', 'sello_de_recepcion'];

// Mapa de etiquetas para campos de la tabla plantilla
const FIELD_LABELS = {
  codigo_de_generacion: 'Código de Generación',
  numero_de_control: 'Número de Control',
  tipo: 'Tipo de DTE',
  re_name: 'Nombre Receptor',
  re_nit: 'NIT Receptor',
  re_numdocumento: 'Número Documento Receptor',
  total_a_pagar: 'Total a Pagar',
  total_agravada: 'Total Gravada',
  totalexenta: 'Total Exenta',
  iva_percibido: 'IVA Percibido',
  retencion_de_renta: 'Retención de Renta',
  fecha_y_hora_de_generacion: 'Fecha y Hora de Generación',
  horemi: 'Hora de Emisión',
  sello_de_recepcion: 'Sello de Recepción',
};

const FacturaEditorModal = ({ isOpen, onClose, factura, token, userId }) => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen && factura) {
      setFormData(factura);
      setEditMode(false);
      setLoading(false);
    }
  }, [isOpen, factura]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.codigo_de_generacion) {
      toast.error('El código de generación es requerido');
      return;
    }

    try {
      setSaving(true);
      // Usar el método update de PlantillaService
      await PlantillaService.update(userId, formData, [], token, formData.codigo_de_generacion);
      toast.success('Factura actualizada correctamente');
      setEditMode(false);
    } catch (error) {
      console.error('Error al guardar factura:', error);
      toast.error('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(factura);
    setEditMode(false);
  };

  const handleDelete = async () => {
    if (!formData.codigo_de_generacion) {
      toast.error('No se puede eliminar sin código de generación');
      return;
    }

    try {
      setDeleting(true);
      // Primero crear el registro en invalidated
      await PlantillaService.createinvalidated(formData, token, userId);
      // Luego eliminar la plantilla
      await PlantillaService.deletePlantillabyCodeGeneration(formData.codigo_de_generacion, token);
      toast.success('Factura eliminada e invalidada correctamente');
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error('Error al eliminar factura:', error);
      toast.error('Error al eliminar la factura');
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen || !formData) {
    return null;
  }

  // Obtener todos los campos editables
  const editableFields = Object.keys(formData)
    .filter(key => !PROTECTED_FIELDS.includes(key))
    .sort();

  const protectedFields = Object.keys(formData)
    .filter(key => PROTECTED_FIELDS.includes(key))
    .sort();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 bg-steelblue-300 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">Editar Factura/Documento</h2>
            <p className="text-sm text-white/80">Generación: {formData.codigo_de_generacion}</p>
          </div>
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
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-steelblue-200 border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 mb-4">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">ℹ️ Campos protegidos:</span> Código de Generación y Sello de Recepción no se pueden editar.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Campos protegidos (solo lectura) */}
                {protectedFields.map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {FIELD_LABELS[key] || key}
                      <span className="text-red-500 ml-1">🔒</span>
                    </label>
                    <input
                      type="text"
                      value={String(formData[key] || '')}
                      disabled
                      className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-slate-500 cursor-not-allowed truncate"
                    />
                  </div>
                ))}

                {/* Campos editables */}
                {editableFields.map((fieldName) => (
                  <div key={fieldName}>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {FIELD_LABELS[fieldName] || fieldName}
                    </label>
                    <input
                      type={
                        fieldName.includes('fecha') || fieldName.includes('generacion')
                          ? 'date'
                          : fieldName.includes('hora') || fieldName.includes('horemi')
                          ? 'time'
                          : fieldName.includes('total') ||
                            fieldName.includes('iva') ||
                            fieldName.includes('retencion') ||
                            fieldName.includes('gravada') ||
                            fieldName.includes('exenta')
                          ? 'number'
                          : 'text'
                      }
                      name={fieldName}
                      value={formData[fieldName] || ''}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      step={fieldName.includes('total') || fieldName.includes('iva') || fieldName.includes('retencion') ? '0.01' : undefined}
                      className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                        editMode
                          ? 'border-gray-300 bg-white focus:border-steelblue-300 focus:ring-2 focus:ring-steelblue-100'
                          : 'border-gray-200 bg-slate-50 text-slate-600'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* JSON preview de datos completos */}
              <div className="mt-6 rounded-lg bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-900 mb-2">Vista previa de datos (JSON)</h3>
                <pre className="overflow-x-auto text-xs text-slate-700 whitespace-pre-wrap break-words max-h-48 bg-white p-3 rounded border border-gray-200">
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-slate-50 px-6 py-4 flex justify-between gap-3 flex-shrink-0">
          <div>
            {!editMode && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                🗑️ Eliminar Factura
              </button>
            )}
          </div>
          <div className="flex gap-3">
            {editMode ? (
              <>
                <button
                  onClick={handleCancel}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-steelblue-300 px-4 py-2 text-sm font-semibold text-white transition hover:bg-steelblue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => setEditMode(true)}
                  className="rounded-lg bg-steelblue-300 px-4 py-2 text-sm font-semibold text-white transition hover:bg-steelblue-200"
                >
                  Editar Todos los Campos
                </button>
              </>
            )}
          </div>
        </div>

        {/* Modal de confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
              <div className="bg-red-50 border-b border-red-200 px-6 py-4">
                <h3 className="text-lg font-bold text-red-900">⚠️ Eliminar Factura</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-slate-700 mb-2">
                  ¿Estás seguro de que deseas eliminar esta factura?
                </p>
                <p className="text-sm text-slate-500 mb-4">
                  Código de generación: <span className="font-semibold">{formData.codigo_de_generacion}</span>
                </p>
                <p className="text-sm text-slate-600">
                  Se eliminarán los datos de la factura y se creará un registro de invalidación.
                  <strong className="text-red-600"> Esta acción no se puede deshacer.</strong>
                </p>
              </div>
              <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Eliminando...' : 'Sí, Eliminar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacturaEditorModal;
