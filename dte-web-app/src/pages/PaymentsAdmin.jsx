import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentService from '../services/PaymentService';

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const labelFor = (period) => {
  const [y, m] = String(period || '').split('-');
  const idx = Number(m) - 1;
  return idx >= 0 && idx < 12 ? `${MONTHS[idx]} ${y}` : period;
};

const shiftPeriod = (period, delta) => {
  const [y, m] = period.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const money = (v) => `$${Number(v || 0).toFixed(2)}`;

// Convierte un dataURL base64 a un blob URL (más confiable para abrir PDFs).
const dataUrlToBlobUrl = (dataUrl) => {
  const [header, base64] = String(dataUrl).split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return window.URL.createObjectURL(new Blob([bytes], { type: mime }));
};

const statusMeta = (status) => {
  switch (status) {
    case 'confirmed':
      return { label: 'Recibido', cls: 'bg-emerald-100 text-emerald-700' };
    case 'pending':
      return { label: 'En revisión', cls: 'bg-amber-100 text-amber-700' };
    case 'rejected':
      return { label: 'Rechazado', cls: 'bg-red-100 text-red-700' };
    default:
      return { label: 'Sin pago', cls: 'bg-slate-100 text-slate-500' };
  }
};

const PaymentsAdmin = () => {
  const token = localStorage.getItem('token');
  const currentUserId = Number(localStorage.getItem('user_id'));
  const navigate = useNavigate();

  const [period, setPeriod] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [amountDraft, setAmountDraft] = useState('');
  const [savingAmount, setSavingAmount] = useState(false);
  const [reviewingId, setReviewingId] = useState(null);
  const [proofView, setProofView] = useState(null); // { mime, data, name }
  const [proofLoading, setProofLoading] = useState(false);
  const [skipCertificateDraft, setSkipCertificateDraft] = useState(false);
  const [savingSkipCertificate, setSavingSkipCertificate] = useState(false);

  const loadClients = async (targetPeriod) => {
    setLoading(true);
    try {
      const data = await PaymentService.adminGetClients(token, targetPeriod);
      setPeriod(data.period);
      setClients(Array.isArray(data.clients) ? data.clients : []);
    } catch (error) {
      console.error('Error al cargar clientes', error);
      toast.error('No se pudieron cargar los pagos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId !== 1) {
      navigate('/principal');
      return;
    }
    loadClients();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openClient = async (client) => {
    setSelected(client);
    setAmountDraft(String(client.amount ?? ''));
    setSkipCertificateDraft(Boolean(client.skip_certificate_validation ?? false));
    setDetailLoading(true);
    try {
      const rows = await PaymentService.adminGetUserPayments(client.user_id, token);
      setDetail(Array.isArray(rows) ? rows : []);
    } catch (error) {
      console.error('Error al cargar historial', error);
      toast.error('No se pudo cargar el historial');
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setSelected(null);
    setDetail([]);
    setProofView(null);
  };

  const refreshAfterChange = async () => {
    await loadClients(period);
    if (selected) {
      const rows = await PaymentService.adminGetUserPayments(selected.user_id, token);
      setDetail(Array.isArray(rows) ? rows : []);
    }
  };

  const handleReview = async (paymentId, action) => {
    setReviewingId(paymentId);
    try {
      await PaymentService.adminReview(paymentId, token, action);
      toast.success(action === 'confirm' ? 'Pago confirmado' : 'Pago rechazado');
      await refreshAfterChange();
    } catch (error) {
      console.error('Error al revisar el pago', error);
      toast.error(error?.message || 'No se pudo actualizar el pago');
    } finally {
      setReviewingId(null);
    }
  };

  const handleViewProof = async (paymentId) => {
    setProofLoading(true);
    try {
      const data = await PaymentService.getProof(paymentId, token);
      const isImage = String(data.proof_mime || '').startsWith('image/');
      if (isImage) {
        setProofView({ data: data.proof, mime: data.proof_mime, name: data.proof_name });
      } else {
        // PDF u otro: abrir en pestaña nueva vía blob.
        const url = dataUrlToBlobUrl(data.proof);
        window.open(url, '_blank', 'noopener');
        setTimeout(() => window.URL.revokeObjectURL(url), 60000);
        setProofView(null);
      }
    } catch (error) {
      console.error('Error al ver el comprobante', error);
      toast.error(error?.message || 'No se pudo abrir el comprobante');
    } finally {
      setProofLoading(false);
    }
  };

  const handleDownloadTicket = async (paymentId) => {
    try {
      const url = await PaymentService.getTicketBlobUrl(paymentId, token);
      window.open(url, '_blank', 'noopener');
      setTimeout(() => window.URL.revokeObjectURL(url), 60000);
    } catch (error) {
      toast.error(error?.message || 'No se pudo descargar el ticket');
    }
  };

  const handleSaveAmount = async () => {
    const value = Number(amountDraft);
    if (Number.isNaN(value) || value < 0) {
      toast.info('Ingresa un monto válido');
      return;
    }
    setSavingAmount(true);
    try {
      await PaymentService.adminSetAmount(selected.user_id, token, value);
      toast.success('Monto actualizado');
      await refreshAfterChange();
      setSelected((prev) => (prev ? { ...prev, amount: value, configured: true } : prev));
    } catch (error) {
      console.error('Error al guardar el monto', error);
      toast.error(error?.message || 'No se pudo guardar el monto');
    } finally {
      setSavingAmount(false);
    }
  };

  const handleSaveSkipCertificate = async () => {
    setSavingSkipCertificate(true);
    try {
      await PaymentService.adminSetSkipCertificate(selected.user_id, token, skipCertificateDraft);
      toast.success(skipCertificateDraft ? 'Validación sin certificado habilitada' : 'Validación sin certificado deshabilitada');
      setSelected((prev) => (prev ? { ...prev, skip_certificate_validation: skipCertificateDraft } : prev));
    } catch (error) {
      console.error('Error al guardar skip_certificate_validation', error);
      toast.error(error?.message || 'No se pudo actualizar la configuración');
      setSkipCertificateDraft(!skipCertificateDraft);
    } finally {
      setSavingSkipCertificate(false);
    }
  };

  const clientsArray = Array.isArray(clients) ? clients : [];
  const receivedCount = clientsArray.filter((c) => c.period_status === 'confirmed').length;
  const pendingCount = clientsArray.filter((c) => c.period_status === 'pending').length;

  return (
    <div className="min-h-screen bg-steelblue-300 px-3 py-6 sm:px-6 sm:py-10 animate-fadeIn">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl">
        {/* Header */}
        <header className="flex items-center justify-between gap-3 border-b border-gray-100 bg-steelblue-300 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 sm:h-11 sm:w-11">
              <svg className="h-5 w-5 text-white sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m-6 4h6m-6 4h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold leading-tight text-white sm:text-lg">Pagos</h1>
              <p className="truncate text-xs text-white/80">Validación y precios de clientes</p>
            </div>
          </div>
          <button
            onClick={() => (selected ? closeDetail() : navigate('/principal'))}
            className="shrink-0 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/25 sm:px-4 sm:py-2 sm:text-sm"
          >
            {selected ? 'Atrás' : 'Volver'}
          </button>
        </header>

        {/* Selector de periodo */}
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 sm:px-6">
          <button
            onClick={() => loadClients(shiftPeriod(period, -1))}
            disabled={!period || loading}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            ‹
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold capitalize text-slate-900">{period ? labelFor(period) : '...'}</p>
            {!selected && (
              <p className="text-xs text-slate-500">
                {receivedCount} recibidos · {pendingCount} en revisión
              </p>
            )}
          </div>
          <button
            onClick={() => loadClients(shiftPeriod(period, 1))}
            disabled={!period || loading}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            ›
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-steelblue-200 border-t-transparent" />
          </div>
        ) : selected ? (
          /* ---------- Detalle de cliente ---------- */
          <div className="p-4 sm:p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">{selected.name}</h2>
              <p className="text-xs text-slate-500">@{selected.username} · #{selected.user_id}</p>
            </div>

            {/* Editar monto */}
            <div className="mb-5 rounded-xl border border-gray-100 p-4">
              <label className="mb-1.5 block text-sm font-semibold text-slate-900">Monto mensual</label>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amountDraft}
                  onChange={(e) => setAmountDraft(e.target.value)}
                  className="w-32 rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-steelblue-200 focus:ring-2 focus:ring-steelblue-100"
                />
                <button
                  onClick={handleSaveAmount}
                  disabled={savingAmount}
                  className="rounded-lg bg-steelblue-300 px-4 py-2 text-sm font-semibold text-white transition hover:bg-steelblue-200 disabled:opacity-60"
                >
                  {savingAmount ? '...' : 'Guardar'}
                </button>
                {!selected.configured && (
                  <span className="text-xs text-amber-600">Placeholder</span>
                )}
              </div>
            </div>

            {/* Validar sin certificado */}
            <div className="mb-5 rounded-xl border border-gray-100 p-4">
              <label className="mb-3 block text-sm font-semibold text-slate-900">Validación de pago</label>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Permitir validar sin certificado</p>
                  <p className="text-xs text-slate-500">Habilita validación de pagos sin requerir certificado digital</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSkipCertificateDraft(!skipCertificateDraft)}
                    disabled={savingSkipCertificate}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      skipCertificateDraft ? 'bg-emerald-500' : 'bg-gray-300'
                    } ${savingSkipCertificate ? 'opacity-60' : ''}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        skipCertificateDraft ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  {savingSkipCertificate && <span className="text-xs text-slate-500">Guardando...</span>}
                </div>
              </div>
              {skipCertificateDraft !== Boolean(selected.skip_certificate_validation ?? false) && (
                <button
                  onClick={handleSaveSkipCertificate}
                  disabled={savingSkipCertificate}
                  className="mt-3 rounded-lg bg-steelblue-300 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-steelblue-200 disabled:opacity-60"
                >
                  {savingSkipCertificate ? 'Guardando...' : 'Aplicar cambio'}
                </button>
              )}
            </div>

            {/* Historial de pagos */}
            <p className="mb-2 text-sm font-semibold text-slate-900">Historial</p>
            {detailLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="h-7 w-7 animate-spin rounded-full border-4 border-steelblue-200 border-t-transparent" />
              </div>
            ) : detail.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center text-sm text-slate-500">
                Sin pagos registrados.
              </div>
            ) : (
              <div className="space-y-3">
                {detail.map((p) => {
                  const meta = statusMeta(p.status);
                  return (
                    <div key={p.id} className="rounded-xl border border-gray-100 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold capitalize text-slate-900">{p.periodLabel}</p>
                          <p className="text-xs text-slate-500">
                            {money(p.amount)} · {p.method === 'card' ? 'Tarjeta' : 'Transferencia'}
                            {p.reference ? ` · Ref: ${p.reference}` : ''}
                          </p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.cls}`}>{meta.label}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {p.has_proof && (
                          <button
                            onClick={() => handleViewProof(p.id)}
                            disabled={proofLoading}
                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                          >
                            Ver comprobante
                          </button>
                        )}
                        {p.status !== 'confirmed' && (
                          <button
                            onClick={() => handleReview(p.id, 'confirm')}
                            disabled={reviewingId === p.id}
                            className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-400 disabled:opacity-60"
                          >
                            {reviewingId === p.id ? '...' : 'Confirmar recibido'}
                          </button>
                        )}
                        {p.status === 'pending' && (
                          <button
                            onClick={() => handleReview(p.id, 'reject')}
                            disabled={reviewingId === p.id}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                          >
                            Rechazar
                          </button>
                        )}
                        {p.status === 'confirmed' && (
                          <button
                            onClick={() => handleDownloadTicket(p.id)}
                            className="rounded-lg bg-steelblue-300 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-steelblue-200"
                          >
                            Descargar ticket
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ---------- Lista de clientes ---------- */
          <div className="p-4 sm:p-6">
            {clientsArray.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-sm text-slate-500">
                No hay clientes.
              </div>
            ) : (
              <div className="space-y-2">
                {clientsArray.map((c) => {
                  const meta = statusMeta(c.period_status);
                  return (
                    <button
                      key={c.user_id}
                      onClick={() => openClient(c)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-gray-100 p-4 text-left transition hover:bg-slate-50"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{c.name}</p>
                        <p className="truncate text-xs text-slate-500">
                          @{c.username} · {money(c.amount)}{!c.configured ? ' (placeholder)' : ''}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {c.payment?.has_proof && c.period_status === 'pending' && (
                          <span className="h-2 w-2 rounded-full bg-amber-500" title="Comprobante por revisar" />
                        )}
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${meta.cls}`}>{meta.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de comprobante (imagen) */}
      {proofView && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setProofView(null)}
        >
          <div className="max-h-[90vh] max-w-3xl overflow-auto rounded-xl bg-white p-2" onClick={(e) => e.stopPropagation()}>
            <img src={proofView.data} alt={proofView.name || 'Comprobante'} className="h-auto w-full rounded-lg" />
          </div>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} theme="light" />
    </div>
  );
};

export default PaymentsAdmin;
