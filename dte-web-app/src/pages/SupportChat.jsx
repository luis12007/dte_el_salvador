import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SupportChatService from '../services/SupportChatService';

const decodeJwtPayload = (token) => {
  if (!token) {
    return null;
  }

  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return JSON.parse(window.atob(padded));
  } catch (error) {
    console.error('Error al decodificar el token', error);
    return null;
  }
};

const getCurrentUserRole = () => {
  const storedRole = localStorage.getItem('user_role') || localStorage.getItem('role') || localStorage.getItem('rol');

  if (storedRole !== null && storedRole !== '') {
    const parsedRole = Number(storedRole);
    return Number.isNaN(parsedRole) ? storedRole : parsedRole;
  }

  const token = localStorage.getItem('token');
  const decodedToken = decodeJwtPayload(token);

  if (!decodedToken) {
    return null;
  }

  return decodedToken.role ?? decodedToken.rol ?? decodedToken.id_rol ?? decodedToken.tipo_usuario ?? decodedToken.tipoUsuario ?? decodedToken.user_role ?? null;
};

const parseMessageContent = (rawMessage) => {
  if (!rawMessage) {
    return { text: '', attachment: null };
  }

  if (typeof rawMessage !== 'string') {
    return { text: String(rawMessage), attachment: null };
  }

  try {
    const parsed = JSON.parse(rawMessage);
    if (parsed && typeof parsed === 'object' && (parsed.text !== undefined || parsed.attachment !== undefined)) {
      return {
        text: parsed.text || '',
        attachment: parsed.attachment || null,
      };
    }
  } catch {
    return { text: rawMessage, attachment: null };
  }

  return { text: rawMessage, attachment: null };
};

const SupportChat = ({ mode = 'user' }) => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');
  const username = localStorage.getItem('username') || 'Usuario';
  const navigate = useNavigate();
  const currentUserRole = getCurrentUserRole();
  const isAdmin = mode === 'admin' || Number(currentUserRole) === 1 || Number(userId) === 1;
  const currentRole = isAdmin ? 'support' : 'user';

  const [threads, setThreads] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(isAdmin ? '' : userId);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [attachment, setAttachment] = useState(null);

  const bottomRef = useRef(null);
  const attachmentInputRef = useRef(null);

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
      setLoading(true);
      const data = await SupportChatService.getMessages(token, threadUserId);
      setMessages(Array.isArray(data) ? data : []);
      await SupportChatService.markThreadRead(token, threadUserId);

      if (isAdmin) {
        await loadThreads();
      }

      setError('');
    } catch (messagesError) {
      console.error('Error al cargar mensajes', messagesError);
      setError('No se pudieron cargar los mensajes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !userId) {
      navigate('/ingresar');
      return;
    }

    if (!isAdmin) {
      setSelectedUserId(userId);
      loadMessages(userId);
      return;
    }

    loadThreads();
  }, [isAdmin, navigate, token, userId]);

  useEffect(() => {
    if (!selectedUserId) {
      return;
    }

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

  const handleSend = async (event) => {
    event.preventDefault();

    if (!draft.trim() || !selectedUserId) {
      return;
    }

    try {
      setSending(true);
      const payload = attachment
        ? JSON.stringify({ text: draft.trim(), attachment })
        : draft.trim();

      await SupportChatService.sendMessage(token, selectedUserId, payload);
      setDraft('');
      setAttachment(null);
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

  const chatSubtitle = isAdmin
    ? 'Selecciona una conversación y responde desde soporte.'
    : 'Escribe aquí tu duda y soporte te responderá en este mismo chat.';

  return (
    <div className="min-h-screen bg-steelblue-300 text-slate-900 pt-[66px] pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1600px]">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl xl:min-h-[calc(100vh-170px)] xl:max-h-[calc(100vh-170px)]">
          <header className="border-b border-gray-200 bg-gradient-to-r from-steelblue-300 via-steelblue-200 to-deepskyblue px-5 py-4 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-white/80">Centro de soporte</p>
                <h1 className="mt-1 text-2xl sm:text-3xl font-semibold text-white">Chat {isAdmin ? 'de soporte' : 'con soporte'}</h1>
                <p className="mt-1 text-sm text-white/90 max-w-2xl">{chatSubtitle}</p>
              </div>
              <button
                onClick={() => navigate('/principal')}
                className="rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/25"
              >
                Volver
              </button>
            </div>
          </header>

          <div className="grid min-h-[calc(100vh-170px)] lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[380px_minmax(0,1fr)]">
            {isAdmin && (
              <aside className="border-r border-gray-200 bg-white p-4 sm:p-5 lg:flex lg:flex-col lg:gap-4 xl:sticky xl:top-[66px] xl:max-h-[calc(100vh-170px)] xl:overflow-y-auto">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">Conversaciones</h2>
                  <span className="rounded-full bg-steelblue-100 px-3 py-1 text-xs text-white">{threads.length}</span>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-slate-50 p-3 text-sm text-slate-600 lg:block">
                  <p className="font-semibold text-slate-900">Panel de soporte</p>
                  <p className="mt-1 text-xs leading-5">Aquí puedes cambiar entre chats de clientes, responder y revisar mensajes anteriores.</p>
                </div>
                <div className="space-y-2">
                  {threads.length > 0 ? (
                    threads.map((thread) => {
                      const isActive = String(thread.user_id) === String(selectedUserId);
                      return (
                        <button
                          key={thread.user_id}
                          onClick={() => setSelectedUserId(String(thread.user_id))}
                          className={`w-full rounded-2xl border px-4 py-3 text-left transition ${isActive ? 'border-steelblue-200 bg-blue-50' : 'border-gray-200 bg-white hover:bg-slate-50'}`}
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
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-slate-50 p-4 text-sm text-slate-500">
                      No hay conversaciones aún.
                    </div>
                  )}
                </div>
              </aside>
            )}

            <section className="flex min-h-0 flex-col bg-white xl:max-h-[calc(100vh-170px)]">
              <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Conversación activa</p>
                    <h2 className="text-lg font-semibold text-slate-900">{activeThreadLabel}</h2>
                  </div>
                  {!isAdmin && (
                    <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                      Soporte responderá aquí
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-5 sm:px-6">
                {loading ? (
                  <div className="flex min-h-[320px] items-center justify-center">
                    <div className="flex flex-col items-center gap-3 text-slate-500">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-steelblue-200 border-t-transparent" />
                      <span>Cargando chat...</span>
                    </div>
                  </div>
                ) : messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const parsedContent = parseMessageContent(message.message);
                      const isOwnMessage = message.sender_role === currentRole;
                      return (
                        <article key={message.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] rounded-3xl px-4 py-3 shadow-sm ${isOwnMessage ? 'bg-steelblue-300 text-white' : 'bg-white text-slate-800 border border-gray-200'}`}>
                            <div className="mb-1 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.18em] opacity-80">
                              <span>{message.sender_name}</span>
                              <span>{new Date(message.created_at).toLocaleString('es-ES')}</span>
                            </div>
                            {parsedContent.text && (
                              <p className="whitespace-pre-wrap text-sm leading-6">{parsedContent.text}</p>
                            )}
                            {parsedContent.attachment?.dataUrl && (
                              <a href={parsedContent.attachment.dataUrl} target="_blank" rel="noreferrer" className="mt-3 block overflow-hidden rounded-2xl border border-white/20 bg-black/5">
                                <img src={parsedContent.attachment.dataUrl} alt={parsedContent.attachment.name || 'Adjunto'} className="max-h-72 w-full object-cover" />
                              </a>
                            )}
                          </div>
                        </article>
                      );
                    })}
                    <div ref={bottomRef} />
                  </div>
                ) : (
                  <div className="flex min-h-[320px] items-center justify-center">
                    <div className="rounded-3xl border border-dashed border-gray-200 bg-white px-6 py-8 text-center text-slate-500">
                      <p className="text-base font-medium text-slate-900">Todavía no hay mensajes</p>
                      <p className="mt-1 text-sm">Envía el primer mensaje para abrir el hilo.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 bg-white px-4 py-4 sm:px-6">
                {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
                <input
                  ref={attachmentInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAttachmentChange}
                />
                {attachment && (
                  <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">{attachment.name}</p>
                      <p className="text-xs text-slate-500">Imagen lista para enviar</p>
                    </div>
                    <button type="button" onClick={removeAttachment} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-red-600 shadow-sm ring-1 ring-gray-200 transition hover:bg-red-50">
                      Quitar
                    </button>
                  </div>
                )}
                <form onSubmit={handleSend} className="flex flex-col gap-3 sm:flex-row xl:flex-nowrap">
                  <div className="flex flex-1 flex-col gap-3 sm:flex-row xl:flex-nowrap">
                    <textarea
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      rows={3}
                      className="min-h-[92px] w-full flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-steelblue-200 focus:ring-2 focus:ring-steelblue-100"
                      placeholder={isAdmin ? 'Responder al usuario...' : 'Escribe tu mensaje de soporte...'}
                    />
                    <div className="flex gap-2 sm:w-44 sm:flex-col xl:w-48">
                      <button
                        type="button"
                        onClick={openAttachmentPicker}
                        className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                      >
                        Subir foto
                      </button>
                      <button
                        type="submit"
                        disabled={sending || (!draft.trim() && !attachment)}
                        className="inline-flex items-center justify-center rounded-2xl bg-steelblue-300 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-steelblue-300/20 transition hover:bg-steelblue-200 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {sending ? 'Enviando...' : 'Enviar'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportChat;