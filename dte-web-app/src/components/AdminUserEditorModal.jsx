import React, { useState, useEffect } from 'react';
import UserService from '../services/UserServices';
import { toast } from 'react-toastify';

const AdminUserEditorModal = ({ isOpen, onClose, userId, token }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('info'); // info, emisor

  useEffect(() => {
    if (isOpen && userId) {
      loadUserData();
    }
  }, [isOpen, userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const data = await UserService.getUserInfo(userId, token);
      setUserData(data);
      setFormData(data);
      setEditMode(false);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      toast.error('Error al cargar datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await UserService.updateUser(formData, token);
      toast.success('Usuario actualizado correctamente');
      setUserData(formData);
      setEditMode(false);
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      toast.error('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(userData);
    setEditMode(false);
  };

  if (!isOpen || !userData) {
    return null;
  }

  const infoFields = [
    { label: 'Nombre (Emisor)', name: 'name', type: 'text' },
    { label: 'NIT', name: 'nit', type: 'text' },
    { label: 'NRC', name: 'nrc', type: 'text' },
    { label: 'Nombre Comercial', name: 'nombre_comercial', type: 'text' },
    { label: 'Descripción Actividad', name: 'descactividad', type: 'text' },
    { label: 'Código Actividad', name: 'codactividad', type: 'text' },
    { label: 'Dirección', name: 'direccion', type: 'text' },
    { label: 'Teléfono', name: 'numero_de_telefono', type: 'text' },
    { label: 'Correo Electrónico', name: 'correo_electronico', type: 'email' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 bg-steelblue-300 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">Editar Usuario</h2>
            <p className="text-sm text-white/80">ID Usuario: {userId}</p>
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

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-200 bg-gray-50 px-6 flex-shrink-0">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition ${
              activeTab === 'info'
                ? 'border-steelblue-300 text-steelblue-300'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Información General
          </button>
          <button
            onClick={() => setActiveTab('usuario')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition ${
              activeTab === 'usuario'
                ? 'border-steelblue-300 text-steelblue-300'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Datos Tabla Usuario
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-steelblue-200 border-t-transparent" />
            </div>
          ) : (
            <>
              {activeTab === 'info' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {infoFields.map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name] || ''}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition ${
                            editMode
                              ? 'border-gray-300 bg-white focus:border-steelblue-300 focus:ring-2 focus:ring-steelblue-100'
                              : 'border-gray-200 bg-slate-50 text-slate-600'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'usuario' && (
                <div className="space-y-4">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <h3 className="font-semibold text-slate-900 mb-3">Información de la Tabla Usuario</h3>
                    <pre className="overflow-x-auto text-xs text-slate-700 whitespace-pre-wrap break-words max-h-96">
                      {JSON.stringify(
                        Object.entries(userData)
                          .filter(([key]) => ['id', 'id_usuario', 'usuario', 'password', 'rol', 'id_rol'].includes(key))
                          .reduce((obj, [key, value]) => {
                            obj[key] = value;
                            return obj;
                          }, {}),
                        null,
                        2
                      )}
                    </pre>
                  </div>

                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Información Adicional del Emisor</h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
                      {Object.entries(userData)
                        .filter(
                          ([key]) =>
                            ![
                              'id',
                              'id_usuario',
                              'usuario',
                              'password',
                              'rol',
                              'id_rol',
                              ...infoFields.map((f) => f.name),
                            ].includes(key)
                        )
                        .map(([key, value]) => (
                          <div key={key} className="flex flex-col">
                            <span className="font-medium text-blue-900">{key}</span>
                            <span className="text-blue-700">{String(value || 'N/A').substring(0, 50)}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-slate-50 px-6 py-4 flex justify-end gap-3 flex-shrink-0">
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
              {activeTab === 'info' && (
                <button
                  onClick={() => setEditMode(true)}
                  className="rounded-lg bg-steelblue-300 px-4 py-2 text-sm font-semibold text-white transition hover:bg-steelblue-200"
                >
                  Editar Información
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserEditorModal;
