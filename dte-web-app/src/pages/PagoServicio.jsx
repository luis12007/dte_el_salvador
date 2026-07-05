import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentService from '../services/PaymentService';

// Cuentas bancarias placeholder (editar cuando estén las reales).
const BANK_ACCOUNTS = [
  {
    bank: 'Banco Agrícola',
    type: 'Cuenta Corriente',
    number: '0000-0000-0000',
    holder: 'MySoftware SV, S.A. de C.V.',
    doc: 'NIT 0000-000000-000-0',
  },
  {
    bank: 'Banco Cuscatlán',
    type: 'Cuenta de Ahorro',
    number: '1111-1111-1111',
    holder: 'MySoftware SV, S.A. de C.V.',
    doc: 'NIT 0000-000000-000-0',
  },
];

const MAX_PROOF_MB = 8;

const statusMeta = (status) => {
  switch (status) {
    case 'confirmed':
      return { label: 'Confirmado', cls: 'bg-emerald-100 text-emerald-700' };
    case 'pending':
      return { label: 'En revisión', cls: 'bg-amber-100 text-amber-700' };
    case 'rejected':
      return { label: 'Rechazado', cls: 'bg-red-100 text-red-700' };
    default:
      return { label: 'Sin pago', cls: 'bg-slate-100 text-slate-500' };
  }
};

const money = (v) => `$${Number(v || 0).toFixed(2)}`;

const PagoServicio = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');
  const navigate = useNavigate();

  const [tab, setTab] = useState('transfer'); // transfer | card | history
  const [sub, setSub] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [proof, setProof] = useState(null); // { dataUrl, mime, name, isImage }
  const [reference, setReference] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const fileInputRef = useRef(null);

  const loadData = async () => {
    try {
      const [subscription, mine] = await Promise.all([
        PaymentService.getSubscription(userId, token),
        PaymentService.getMyPayments(userId, token),
      ]);
      setSub(subscription);
      setHistory(Array.isArray(mine) ? mine : []);
    } catch (error) {
      console.error('Error al cargar el pago', error);
      toast.error('No se pudo cargar la información de pago');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !userId) {
      navigate('/ingresar');
      return;
    }
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';
    if (!isImage && !isPdf) {
      toast.info('Solo se permiten imágenes o PDF.');
      return;
    }
    if (file.size > MAX_PROOF_MB * 1024 * 1024) {
      toast.info(`El archivo supera los ${MAX_PROOF_MB} MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProof({ dataUrl: String(reader.result || ''), mime: file.type, name: file.name, isImage });
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success('Copiado');
    } catch {
      toast.info('No se pudo copiar');
    }
  };

  const handleSubmitTransfer = async () => {
    if (!proof) {
      toast.info('Adjunta el comprobante de la transferencia.');
      return;
    }
    setSubmitting(true);
    try {
      await PaymentService.submitTransfer(userId, token, {
        proof: proof.dataUrl,
        proof_mime: proof.mime,
        proof_name: proof.name,
        reference: reference.trim(),
      });
      toast.success('Comprobante enviado. Soporte lo validará pronto.');
      setProof(null);
      setReference('');
      await loadData();
    } catch (error) {
      console.error('Error al enviar el comprobante', error);
      toast.error(error?.message || 'No se pudo enviar el comprobante');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadTicket = async (paymentId) => {
    setDownloadingId(paymentId);
    try {
      const url = await PaymentService.getTicketBlobUrl(paymentId, token);
      window.open(url, '_blank', 'noopener');
      setTimeout(() => window.URL.revokeObjectURL(url), 60000);
    } catch (error) {
      console.error('Error al descargar el ticket', error);
      toast.error(error?.message || 'No se pudo descargar el ticket');
    } finally {
      setDownloadingId(null);
    }
  };

  const current = sub?.currentPayment;
  const currentMeta = statusMeta(current?.status);
  const alreadyPaid = current?.status === 'confirmed';

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setTab(id)}
      className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
        tab === id
          ? 'bg-steelblue-300 text-white shadow-sm'
          : 'text-slate-600 hover:bg-white hover:text-slate-900'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-steelblue-300 px-3 py-6 sm:px-6 sm:py-10 animate-fadeIn">
      <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl">
        {/* Header */}
        <header className="flex items-center justify-between gap-3 border-b border-gray-100 bg-steelblue-300 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 sm:h-11 sm:w-11">
              <svg className="h-5 w-5 text-white sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold leading-tight text-white sm:text-lg">Pago de servicio</h1>
              <p className="truncate text-xs text-white/80">{sub ? `Periodo ${sub.periodLabel}` : 'Cargando...'}</p>
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
          <div className="p-4 sm:p-6">
            {/* Resumen del monto */}
            <div className="mb-5 flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Monto del mes</p>
                <p className="mt-1 text-3xl font-bold text-steelblue-300">{money(sub?.amount)}</p>
                <p className="mt-1 text-xs text-slate-500">Vence el {sub?.dueDay} de {sub?.periodLabel}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${currentMeta.cls}`}>{currentMeta.label}</span>
            </div>

            {/* Tabs */}
            <div className="mb-5 flex gap-1 rounded-xl border border-gray-200 bg-slate-100 p-1">
              <TabButton id="transfer" label="Transferencia" />
              <TabButton id="card" label="Tarjeta" />
              <TabButton id="history" label="Historial" />
            </div>

            {/* --- Transferencia --- */}
            {tab === 'transfer' && (
              <div className="space-y-4">
                {alreadyPaid ? (
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    El pago de {sub.periodLabel} ya fue confirmado. ¡Gracias!
                  </div>
                ) : current?.status === 'pending' ? (
                  <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    Ya enviaste un comprobante este mes. Está en revisión; puedes reemplazarlo abajo si lo necesitas.
                  </div>
                ) : null}

                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-900">1. Transfiere a una de estas cuentas</p>
                  <div className="space-y-3">
                    {BANK_ACCOUNTS.map((acc) => (
                      <div key={acc.number} className="rounded-xl border border-gray-100 p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-900">{acc.bank}</p>
                          <span className="text-xs text-slate-400">{acc.type}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <span className="font-mono text-base tracking-wide text-slate-800">{acc.number}</span>
                          <button
                            onClick={() => copyToClipboard(acc.number)}
                            className="shrink-0 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                          >
                            Copiar
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{acc.holder}</p>
                        <p className="text-xs text-slate-400">{acc.doc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-900">2. Sube el comprobante</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={handleFile}
                  />
                  {!proof ? (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-8 text-slate-500 transition hover:border-steelblue-200 hover:bg-slate-50"
                    >
                      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm font-medium">Adjuntar imagen o PDF</span>
                      <span className="text-xs text-slate-400">Máx {MAX_PROOF_MB} MB</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-slate-50 p-3">
                      {proof.isImage ? (
                        <img src={proof.dataUrl} alt={proof.name} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">{proof.name}</p>
                        <p className="text-xs text-slate-500">Listo para enviar</p>
                      </div>
                      <button onClick={() => setProof(null)} className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50">
                        Quitar
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-900">Referencia (opcional)</label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="N.º de referencia de la transferencia"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-steelblue-200 focus:ring-2 focus:ring-steelblue-100"
                  />
                </div>

                <button
                  onClick={handleSubmitTransfer}
                  disabled={submitting || !proof}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-steelblue-300 py-3 font-semibold text-white shadow-lg shadow-steelblue-300/20 transition hover:bg-steelblue-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                  {submitting ? 'Enviando...' : 'Enviar comprobante'}
                </button>
              </div>
            )}

            {/* --- Tarjeta (placeholder) --- */}
            {tab === 'card' && (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 py-14 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-steelblue-100/40 text-steelblue-300">
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-slate-800">Pago con tarjeta</p>
                <p className="max-w-xs text-sm text-slate-500">
                  Esta opción se está construyendo. Muy pronto podrás pagar y activar el cobro automático con tu tarjeta.
                </p>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">En construcción</span>
              </div>
            )}

            {/* --- Historial --- */}
            {tab === 'history' && (
              <div className="space-y-3">
                {history.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-sm text-slate-500">
                    Aún no tienes pagos registrados.
                  </div>
                ) : (
                  history.map((p) => {
                    const meta = statusMeta(p.status);
                    return (
                      <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold capitalize text-slate-900">{p.periodLabel}</p>
                          <p className="text-xs text-slate-500">
                            {money(p.amount)} · {p.method === 'card' ? 'Tarjeta' : 'Transferencia'}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${meta.cls}`}>{meta.label}</span>
                          {p.status === 'confirmed' && (
                            <button
                              onClick={() => handleDownloadTicket(p.id)}
                              disabled={downloadingId === p.id}
                              className="rounded-lg bg-steelblue-300 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-steelblue-200 disabled:opacity-60"
                            >
                              {downloadingId === p.id ? '...' : 'Ticket'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <ToastContainer position="top-center" autoClose={3500} theme="light" />
    </div>
  );
};

export default PagoServicio;
