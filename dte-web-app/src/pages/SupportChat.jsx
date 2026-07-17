import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SupportChatService from '../services/SupportChatService';
import FacturaSelectorModal from '../components/FacturaSelectorModal';
import FacturaViewerModal from '../components/FacturaViewerModal';

const parseMessageContent = (rawMessage) => {
  if (!rawMessage) {
    return { text: '', attachment: null, factura: null };
  }

  if (typeof rawMessage !== 'string') {
    return { text: String(rawMessage), attachment: null, factura: null };
  }

  try {
    const parsed = JSON.parse(rawMessage);
    if (parsed && typeof parsed === 'object' && (parsed.text !== undefined || parsed.attachment !== undefined || parsed.factura !== undefined)) {
      return {
        text: parsed.text || '',
        attachment: parsed.attachment || null,
        factura: parsed.factura || null,
      };
    }
  } catch {
    return { text: rawMessage, attachment: null, factura: null };
  }

  return { text: rawMessage, attachment: null, factura: null };
};

const SupportChat = ({ mode = 'user' }) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');
  const username = localStorage.getItem('username') || 'Usuario';
  const navigate = useNavigate();
  // Solo el usuario id 1 puede usar el panel de soporte (modo admin).
  const isAdmin = mode === 'admin' && Number(userId) === 1;
  const currentRole = isAdmin ? 'support' : 'user';

  const [threads, setThreads] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(isAdmin ? '' : userId);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [showFacturaSelector, setShowFacturaSelector] = useState(false);
  const [viewingFactura, setViewingFactura] = useState(null);

  const bottomRef = useRef(null);
  const attachmentInputRef = useRef(null);
  const composerRef = useRef(null);

  const activeThreadLabel = useMemo(() => {
    if (isAdmin) {
      const activeThread = threads.find((thread) => String(thread.user_id) === String(selectedUserId));
      if (!selectedUserId) {
        return 'Selecciona una conversación';
      }

      return activeThread?.sender_name ? `${activeThread.sender_name} (#${activeThread.user_id})` : `Usuario #${selectedUserId}`;
    }

    return `${username} - Soporte`;
  }, [isAdmin, selectedUserId, threads, username]);

  const loadThreads = async () => {
    if (!isAdmin) {
      return;
    }

    try {
      const data = await SupportChatService.getThreads(token);
      const nextThreads = Array.isArray(data) ? data : [];
      setThreads(nextThreads);

      if (!selectedUserId && nextThreads.length > 0) {
        setSelectedUserId(String(nextThreads[0].user_id));
      }
    } catch (threadsError) {
      console.error('Error al cargar conversaciones', threadsError);
      setError('No se pudieron cargar las conversaciones.');
    }
  };

  const loadMessages = async (threadUserId) => {
    if (!threadUserId) {
      return;
    }

    try {
      if (initialLoad) {
        setLoading(true);
      }
      const data = await SupportChatService.getMessages(token, threadUserId);
      setMessages(Array.isArray(data) ? data : []);

      // Marcar como leído después de cargar los mensajes
      try {
        await SupportChatService.markThreadRead(token, threadUserId);
      } catch (readError) {
        console.error('Error al marcar como leído', readError);
      }

      if (isAdmin) {
        await loadThreads();
      }

      setError('');
    } catch (messagesError) {
      console.error('Error al cargar mensajes', messagesError);
      setError('No se pudieron cargar los mensajes.');
    } finally {
      if (initialLoad) {
        setLoading(false);
        setInitialLoad(false);
      }
      // Scroll al fondo después de cargar
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  };

  useEffect(() => {
    if (!token || !userId) {
      navigate('/ingresar');
      return;
    }

    // El panel de soporte (modo admin) es exclusivo del usuario id 1.
    if (mode === 'admin' && Number(userId) !== 1) {
      navigate('/soporte');
      return;
    }

    if (!isAdmin) {
      setSelectedUserId(userId);
      loadMessages(userId);
      return;
    }

    loadThreads();
  }, [isAdmin, mode, navigate, token, userId]);

  useEffect(() => {
    if (!selectedUserId) {
      return;
    }

    setInitialLoad(true);
    loadMessages(selectedUserId);

    const intervalId = setInterval(() => {
      loadMessages(selectedUserId);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [selectedUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openAttachmentPicker = () => {
    attachmentInputRef.current?.click();
  };

  const handleAttachmentChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachment({
        name: file.name,
        type: file.type,
        dataUrl: String(reader.result || ''),
      });
      setError('');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  const handleSelectFactura = (factura) => {
    setSelectedFactura(factura);
    setShowFacturaSelector(false);
  };

  const removeFactura = () => {
    setSelectedFactura(null);
  };

  const handleSend = async (event) => {
    event.preventDefault();

    if ((!draft.trim() && !attachment && !selectedFactura) || !selectedUserId) {
      return;
    }

    try {
      setSending(true);
      let payload;

      if (selectedFactura && attachment) {
        payload = JSON.stringify({ text: draft.trim(), attachment, factura: selectedFactura });
      } else if (selectedFactura) {
        payload = JSON.stringify({ text: draft.trim(), factura: selectedFactura });
      } else if (attachment) {
        payload = JSON.stringify({ text: draft.trim(), attachment });
      } else {
        payload = draft.trim();
      }

      await SupportChatService.sendMessage(token, selectedUserId, payload);
      setDraft('');
      setAttachment(null);
      setSelectedFactura(null);
      if (composerRef.current) {
        composerRef.current.style.height = 'auto';
      }
      await loadMessages(selectedUserId);
      if (isAdmin) {
        await loadThreads();
      }
    } catch (sendError) {
      console.error('Error al enviar mensaje', sendError);
      setError(sendError?.message || 'No se pudo enviar el mensaje.');
    } finally {
      setSending(false);
    }
  };

  const handleComposerInput = (event) => {
    setDraft(event.target.value);
    const el = event.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  };

  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend(event);
    }
  };

  const formatMessageTime = (value) => {
    try {
      return new Date(value).toLocaleString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const canSend = Boolean((draft.trim() || attachment || selectedFactura) && selectedUserId);

  return (
    <>
      <FacturaSelectorModal
        isOpen={showFacturaSelector}
        onClose={() => setShowFacturaSelector(false)}
        onSelectFactura={handleSelectFactura}
        token={token}
        userId={selectedUserId || userId}
      />
      <FacturaViewerModal
        isOpen={Boolean(viewingFactura)}
        onClose={() => setViewingFactura(null)}
        factura={viewingFactura}
      />
      <div className="flex h-[calc(100dvh-66px)] min-h-[calc(100dvh-66px)] flex-col overflow-hidden bg-steelblue-300 pt-[66px]">
      <div className={`mx-auto flex h-full w-full px-3 py-3 sm:px-6 sm:py-5 lg:px-8 ${isAdmin ? 'max-w-7xl 2xl:max-w-[1600px]' : 'max-w-3xl'}`}>
        <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl">
          {/* Header */}
          <header className="flex items-center justify-between gap-3 border-b border-gray-100 bg-steelblue-300 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 sm:h-11 sm:w-11">
                <svg className="h-5 w-5 text-white sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8m-8 4h5m1 5l-3 3-3-3h-2a4 4 0 01-4-4V6a4 4 0 014-4h12a4 4 0 014 4v8a4 4 0 01-4 4h-3z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-base font-semibold leading-tight text-white sm:text-lg">
                  {isAdmin ? 'Panel de soporte' : 'Soporte'}
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span className="truncate">
                    {isAdmin ? activeThreadLabel : 'En línea · te responderemos aquí'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/principal')}
              className="shrink-0 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/25 sm:px-4 sm:py-2 sm:text-sm"
            >
              Volver
            </button>
          </header>

          <div className={`grid min-h-0 flex-1 overflow-hidden ${isAdmin ? 'lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]' : ''}`}>
            {isAdmin && (
              <aside className="hidden min-h-0 flex-col gap-3 border-r border-gray-100 bg-white p-4 lg:flex lg:overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Conversaciones</h2>
                  <span className="rounded-full bg-steelblue-300 px-2.5 py-0.5 text-xs font-medium text-white">{threads.length}</span>
                </div>
                <div className="space-y-2">
                  {threads.length > 0 ? (
                    threads.map((thread) => {
                      const isActive = String(thread.user_id) === String(selectedUserId);
                      return (
                        <button
                          key={thread.user_id}
                          onClick={() => setSelectedUserId(String(thread.user_id))}
                          className={`w-full rounded-xl border px-4 py-3 text-left transition ${isActive ? 'border-steelblue-200 bg-blue-50' : 'border-gray-100 bg-white hover:bg-slate-50'}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-900">{thread.sender_name || `Usuario #${thread.user_id}`}</p>
                              <p className="mt-1 line-clamp-2 text-xs text-slate-500">{thread.last_message}</p>
                            </div>
                            {thread.unread_count > 0 && (
                              <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">{thread.unread_count}</span>
                            )}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-slate-50 p-4 text-sm text-slate-500">
                      No hay conversaciones aún.
                    </div>
                  )}
                </div>
              </aside>
            )}

            <section className="flex min-h-0 min-w-0 flex-col bg-white">
              {/* Selector de conversación en móvil (admin) */}
              {isAdmin && (
                <div className="border-b border-gray-100 px-3 py-2.5 sm:px-6 lg:hidden">
                  <select
                    value={selectedUserId}
                    onChange={(event) => setSelectedUserId(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-steelblue-200"
                  >
                    <option value="">Selecciona una conversación</option>
                    {threads.map((thread) => (
                      <option key={thread.user_id} value={String(thread.user_id)}>
                        {(thread.sender_name || `Usuario #${thread.user_id}`)}{thread.unread_count > 0 ? ` (${thread.unread_count})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Mensajes */}
              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-slate-50 px-3 py-4 sm:px-6 sm:py-6">
                {loading && messages.length === 0 ? (
                  <div className="flex min-h-[280px] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-steelblue-200 border-t-transparent" />
                  </div>
                ) : messages.length > 0 ? (
                  <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
                    {messages.map((message) => {
                      const parsedContent = parseMessageContent(message.message);
                      const isOwnMessage = message.sender_role === currentRole;
                      return (
                        <article key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[82%] sm:max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                            {!isOwnMessage && (
                              <span className="mb-1 px-1 text-[11px] font-medium text-slate-400">{message.sender_name}</span>
                            )}
                            {parsedContent.text && (
                              <div
                                className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                                  isOwnMessage
                                    ? 'rounded-br-md bg-steelblue-300 text-white'
                                    : 'rounded-bl-md border border-gray-100 bg-white text-slate-800'
                                }`}
                              >
                                <p className="whitespace-pre-wrap break-words">{parsedContent.text}</p>
                              </div>
                            )}
                            {parsedContent.attachment?.dataUrl && (
                              <a
                                href={parsedContent.attachment.dataUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="block overflow-hidden rounded-xl"
                              >
                                <img
                                  src={parsedContent.attachment.dataUrl}
                                  alt={parsedContent.attachment.name || 'Adjunto'}
                                  className="max-h-64 w-full object-cover"
                                />
                              </a>
                            )}
                            {parsedContent.factura && (
                              <button
                                onClick={() => {
                                  if (isAdmin) {
                                    setViewingFactura(parsedContent.factura);
                                  }
                                }}
                                className={`rounded-2xl px-4 py-3 text-left transition ${
                                  isAdmin ? 'cursor-pointer hover:shadow-lg' : 'cursor-default'
                                } ${
                                  isOwnMessage
                                    ? 'rounded-br-md bg-steelblue-400 text-white'
                                    : 'rounded-bl-md border border-gray-200 bg-slate-50'
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-sm">{parsedContent.factura.re_name}</p>
                                    <p className="text-xs opacity-80 mt-1">
                                      Gen: {parsedContent.factura.codigo_de_generacion}
                                    </p>
                                    <p className="text-xs opacity-80">
                                      Monto: ${Number(parsedContent.factura.total_a_pagar || 0).toFixed(2)}
                                    </p>
                                    {isAdmin && (
                                      <p className="text-xs opacity-80 mt-1">Click para editar</p>
                                    )}
                                  </div>
                                </div>
                              </button>
                            )}
                            <span className={`px-1 text-[10px] text-slate-400 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                              {formatMessageTime(message.created_at)}
                            </span>
                          </div>
                        </article>
                      );
                    })}
                    <div ref={bottomRef} />
                  </div>
                ) : (
                  <div className="flex min-h-[280px] items-center justify-center px-4">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-steelblue-100/40 text-steelblue-300">
                        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8m-8 4h5m1 5l-3 3-3-3h-2a4 4 0 01-4-4V6a4 4 0 014-4h12a4 4 0 014 4v8a4 4 0 01-4 4h-3z" />
                        </svg>
                      </div>
                      <p className="text-base font-medium text-slate-800">Todavía no hay mensajes</p>
                      <p className="text-sm text-slate-500">
                        {isAdmin ? 'Selecciona o responde una conversación.' : 'Escribe tu duda y soporte te responderá aquí.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Composer */}
              <div className="border-t border-gray-100 bg-white px-3 py-3 sm:px-6 sm:py-4">
                {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
                <input
                  ref={attachmentInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAttachmentChange}
                />
                {attachment && (
                  <div className="mb-2 flex items-center gap-3 rounded-xl border border-gray-100 bg-slate-50 px-3 py-2">
                    {attachment.dataUrl && (
                      <img src={attachment.dataUrl} alt={attachment.name} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">{attachment.name}</p>
                      <p className="text-xs text-slate-500">Imagen lista para enviar</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeAttachment}
                      className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Quitar
                    </button>
                  </div>
                )}
                {selectedFactura && (
                  <div className="mb-2 flex items-center gap-3 rounded-xl border border-gray-100 bg-slate-50 px-3 py-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-steelblue-100 text-steelblue-300">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">{selectedFactura.re_name}</p>
                      <p className="text-xs text-slate-500">Generación: {selectedFactura.codigo_de_generacion}</p>
                    </div>
                    <button
                      type="button"
                      onClick={removeFactura}
                      className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Quitar
                    </button>
                  </div>
                )}
                <form onSubmit={handleSend} className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={openAttachmentPicker}
                    title="Adjuntar imagen"
                    aria-label="Adjuntar imagen"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-steelblue-300"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFacturaSelector(true)}
                    title="Adjuntar factura"
                    aria-label="Adjuntar factura"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-steelblue-300"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  <textarea
                    ref={composerRef}
                    value={draft}
                    onChange={handleComposerInput}
                    onKeyDown={handleComposerKeyDown}
                    rows={1}
                    className="max-h-32 min-h-[44px] w-full flex-1 resize-none rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-steelblue-200 focus:ring-2 focus:ring-steelblue-100"
                    placeholder={isAdmin ? 'Responder al usuario...' : 'Escribe tu mensaje...'}
                  />
                  <button
                    type="submit"
                    disabled={sending || !canSend}
                    aria-label="Enviar mensaje"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-steelblue-300 text-white shadow-lg shadow-steelblue-300/20 transition hover:bg-steelblue-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sending ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l0-14M5 12l7-7 7 7" />
                      </svg>
                    )}
                  </button>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SupportChat;