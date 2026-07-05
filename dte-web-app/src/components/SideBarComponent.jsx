import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PaymentBlockedModal from "./PaymentBlockedModal";
import usePaymentBlock from "../hooks/usePaymentBlock";

// Icono genérico (heroicon-style, stroke currentColor).
const Icon = ({ d, className = "h-5 w-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
  </svg>
);

const PATHS = {
  home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  doc: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  list: "M4 6h16M4 12h16M4 18h16",
  plus: "M12 4v16m8-8H4",
  ban: "M18.364 5.636L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  users: "M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1a4 4 0 10-8 0 4 4 0 008 0zm8-3a4 4 0 11-8 0 4 4 0 018 0z",
  user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  folder: "M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z",
  download: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
  chart: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  wallet: "M3 10h18M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z",
  card: "M3 10h18M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z",
  chat: "M8 10h8m-8 4h5m1 5l-3 3-3-3h-2a4 4 0 01-4-4V6a4 4 0 014-4h12a4 4 0 014 4v8a4 4 0 01-4 4h-3z",
  shield: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  megaphone: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
  logout: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  chevron: "M19 9l-7 7-7-7",
};

const GroupComponent = ({ visible, setVisible }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUserId = Number(localStorage.getItem("user_id"));
  // Solo el usuario id 1 es administrador (paneles de soporte, pagos y anuncios).
  const isMainAdmin = currentUserId === 1;

  const sections = [
    {
      key: "dte",
      label: "DTE's",
      icon: PATHS.doc,
      items: [
        { label: "Lista de DTE", path: "/facturas", icon: PATHS.list },
        { label: "Crear DTE", path: "/crear/factura", icon: PATHS.plus, guard: true },
        { label: "Invalidar DTE", path: "/invalidar", icon: PATHS.ban },
      ],
    },
    {
      key: "info",
      label: "Información",
      icon: PATHS.info,
      items: [
        { label: "Receptores", path: "/clientes", icon: PATHS.users },
        { label: "Perfil", path: "/perfil", icon: PATHS.user },
      ],
    },
    {
      key: "conta",
      label: "Documentos / Contabilidad",
      icon: PATHS.folder,
      items: [
        { label: "Descargar DTE'S", path: "/descargar-dtes", icon: PATHS.download },
        { label: "Reportes", path: "/facturas/libros", icon: PATHS.chart },
      ],
    },
    {
      key: "pagos",
      label: "Pagos y soporte",
      icon: PATHS.wallet,
      items: [
        { label: "Pago de servicio", path: "/pago", icon: PATHS.card },
        { label: "Soporte / Chat", path: "/soporte", icon: PATHS.chat },
      ],
    },
    ...(isMainAdmin
      ? [
          {
            key: "admin",
            label: "Administración",
            icon: PATHS.shield,
            admin: true,
            items: [
              { label: "Panel de soporte", path: "/testadmin/support-chat", icon: PATHS.chat },
              { label: "Pagos (admin)", path: "/testadmin/pagos", icon: PATHS.wallet },
              { label: "Anuncio / Changelogs", path: "/testadmin/changelog", icon: PATHS.megaphone },
            ],
          },
        ]
      : []),
  ];

  // Abre por defecto la sección que contiene la ruta actual.
  const [open, setOpen] = useState(() => {
    const initial = {};
    sections.forEach((s) => {
      initial[s.key] = s.items.some((it) => it.path === location.pathname);
    });
    return initial;
  });

  const toggle = (key) => setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  // Bloqueo por falta de pago (cuenta vencida).
  const { modalOpen: paymentBlockedOpen, closeModal: closePaymentBlocked, guard: guardPayment } = usePaymentBlock();

  const go = async (item) => {
    const path = typeof item === "string" ? item : item.path;
    const needsGuard = typeof item === "object" && item.guard;
    if (needsGuard && (await guardPayment())) {
      return; // Cuenta vencida: no puede crear
    }
    navigate(path);
    setVisible(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Modal de cuenta bloqueada por falta de pago */}
      <PaymentBlockedModal open={paymentBlockedOpen} onClose={closePaymentBlocked} />

      {/* Overlay para cerrar al hacer click afuera */}
      {visible && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-40"
          onClick={() => setVisible(false)}
        />
      )}

      {/* Drawer lateral */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 sm:w-72 bg-white border-r border-gray-200 shadow-xl z-50 transform transition-transform duration-300 ease-out ${
          visible ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!visible}
      >
        {/* Encabezado */}
        <div className="flex items-center gap-2 px-4 py-3.5 bg-steelblue-300">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/25">
            <Icon d={PATHS.doc} className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-wide text-white">Menú</span>
        </div>

        <nav className="h-[calc(100vh-57px)] overflow-y-auto p-3 space-y-1.5">
          {/* Home */}
          <button
            onClick={() => go("/principal")}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition ${
              isActive("/principal")
                ? "bg-blue-50 text-steelblue-300"
                : "text-gray-700 hover:bg-slate-100"
            }`}
          >
            <Icon d={PATHS.home} className="h-5 w-5" />
            <span className="text-sm font-semibold">Home</span>
          </button>

          {/* Secciones */}
          {sections.map((section) => {
            const isOpen = open[section.key];
            const hasActive = section.items.some((it) => isActive(it.path));
            return (
              <div key={section.key} className="rounded-lg">
                <button
                  onClick={() => toggle(section.key)}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition ${
                    hasActive || isOpen
                      ? "text-steelblue-300"
                      : "text-gray-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon d={section.icon} className="h-5 w-5" />
                  <span className="flex-1 text-left text-sm font-semibold">{section.label}</span>
                  {section.admin && (
                    <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-steelblue-300">
                      admin
                    </span>
                  )}
                  <Icon
                    d={PATHS.chevron}
                    className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Panel colapsable (animación de altura con grid-rows) */}
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-3">
                      {section.items.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => go(item)}
                          className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                            isActive(item.path)
                              ? "bg-blue-50 text-steelblue-300 font-semibold"
                              : "text-gray-600 hover:bg-slate-100 hover:text-gray-900"
                          }`}
                        >
                          <Icon d={item.icon} className="h-[18px] w-[18px]" />
                          <span className="text-sm">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Cerrar sesión */}
          <div className="pt-2 mt-2 border-t border-gray-100">
            <button
              onClick={() => go("/ingresar")}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-700 transition hover:bg-red-50 hover:text-red-700 group"
            >
              <Icon d={PATHS.logout} className="h-5 w-5 text-gray-500 group-hover:text-red-600" />
              <span className="text-sm font-semibold">Cerrar sesión</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default GroupComponent;
