import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AnnouncementService from '../services/AnnouncementService';

const AnnouncementAdmin = () => {
  const token = localStorage.getItem('token');
  const currentUserId = Number(localStorage.getItem('user_id'));
  // Solo el usuario id 1 puede administrar el anuncio.
  const isAdmin = currentUserId === 1;
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [version, setVersion] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/principal');
      return;
    }

    const fetchConfig = async () => {
      try {
        const data = await AnnouncementService.getAdmin(token);
        setMessage(data.message || '');
        setEnabled(Boolean(data.enabled));
        setVersion(Number(data.version) || 1);
      } catch (error) {
        console.error('Error al cargar el anuncio', error);
        toast.error('No se pudo cargar la configuración');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    if (!message.trim()) {
      toast.info('Escribe un mensaje antes de guardar');
      return;
    }
    setSaving(true);
    try {
      const updated = await AnnouncementService.update(token, { message: message.trim(), enabled });
      setMessage(updated.message || '');
      setEnabled(Boolean(updated.enabled));
      setVersion(Number(updated.version) || version);
      toast.success('Anuncio actualizado');
    } catch (error) {
      console.error('Error al guardar el anuncio', error);
      toast.error('No se pudo guardar el anuncio');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-steelblue-300 px-3 py-6 sm:px-6 sm:py-10 animate-fadeIn">
      <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl">
        {/* Header */}
        <header className="flex items-center justify-between gap-3 border-b border-gray-100 bg-steelblue-300 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 sm:h-11 sm:w-11">
              <svg className="h-5 w-5 text-white sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold leading-tight text-white sm:text-lg">Anuncio / Changelogs</h1>
              <p className="truncate text-xs text-white/80">Mensaje del menú principal</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/principal')}
            className="shrink-0 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/25 sm:px-4 sm:py-2 sm:text-sm"
          >
            Volver
          </button>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-steelblue-200 border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-5 p-4 sm:p-6">
            <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
              Este mensaje aparece <span className="font-medium text-slate-800">una sola vez</span> a cada cliente en el menú principal.
              Al cambiar el texto o volver a activarlo, todos los clientes lo verán nuevamente.
            </p>

            {/* Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">Mostrar anuncio</p>
                <p className={`text-xs font-medium ${enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {enabled ? 'Activado' : 'Desactivado'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEnabled((prev) => !prev)}
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 ${
                  enabled ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
                aria-pressed={enabled}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300 ${
                    enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Mensaje */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-900">Mensaje</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                maxLength={2000}
                placeholder="Escribe las novedades / actualizaciones para los clientes..."
                className="w-full resize-none rounded-xl border border-gray-200 bg-white p-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-steelblue-200 focus:ring-2 focus:ring-steelblue-100"
              />
              <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                <span>Versión actual: {version}</span>
                <span>{message.length}/2000</span>
              </div>
            </div>

            {/* Vista previa */}
            {message.trim() && (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Vista previa</p>
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-800">{message}</p>
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-steelblue-300 py-3 font-semibold text-white shadow-lg shadow-steelblue-300/20 transition hover:bg-steelblue-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        )}
      </div>

      <ToastContainer position="top-center" autoClose={3000} theme="light" />
    </div>
  );
};

export default AnnouncementAdmin;
