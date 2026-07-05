import { useState } from 'react';
import PaymentService from '../services/PaymentService';

// Hook para bloquear acciones (crear / firmar / enviar) cuando la cuenta
// está vencida por falta de pago. `guard()` verifica el estado en el momento
// y, si está vencida, abre el modal y devuelve true (para abortar la acción).
export default function usePaymentBlock() {
  const [modalOpen, setModalOpen] = useState(false);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');

  const guard = async () => {
    try {
      const status = await PaymentService.getStatus(userId, token);
      if (status && (status.state === 'vencido' || status.blocked === true)) {
        setModalOpen(true);
        return true;
      }
    } catch (error) {
      // Ante un error de red no bloqueamos (fail-open) para no afectar a
      // usuarios al día; el estado 'vencido' es lo único que bloquea.
      console.error('Error al verificar el estado de pago', error);
    }
    return false;
  };

  return {
    modalOpen,
    closeModal: () => setModalOpen(false),
    guard,
  };
}
