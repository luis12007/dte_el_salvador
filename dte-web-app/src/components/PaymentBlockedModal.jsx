import React from 'react';
import { useNavigate } from 'react-router-dom';

// Modal que se muestra cuando la cuenta está vencida por falta de pago.
// Bloquea crear / firmar / enviar y redirige a la sección de pago.
const PaymentBlockedModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-fadeInUp">
        <div className="flex items-center gap-3 bg-steelblue-300 px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-white">Usuario no activo</h2>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm leading-relaxed text-slate-700">
            Tu usuario no está activo por <strong>falta de pago del servicio</strong>.
            Mientras el pago esté pendiente no podrás crear, firmar ni enviar documentos.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Haz clic aquí para ir a la sección de pago y regularizar tu cuenta.
          </p>
        </div>

        <div className="flex flex-col gap-2 px-6 pb-5">
          <button
            onClick={() => navigate('/pago')}
            className="w-full rounded-xl bg-steelblue-300 py-2.5 font-semibold text-white shadow-lg shadow-steelblue-300/20 transition hover:bg-steelblue-200"
          >
            Ir a la sección de pago
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-xl py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentBlockedModal;
