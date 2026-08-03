import { useEffect, useState, useCallback } from 'react';
import PaymentService from '../services/PaymentService';

const seenKey = (userId) => `payment_seen_${userId}`;

const paymentSignature = (payment) =>
  payment ? `${payment.id}:${payment.status}:${payment.confirmed_at || ''}` : null;

// Detecta cuando el pago del periodo actual pasa a confirmado/pagado y el
// cliente todavía no lo ha visto (comparado contra la última firma vista,
// guardada en localStorage por usuario).
const usePaymentNotifications = (token, userId) => {
  const [hasPaymentUpdate, setHasPaymentUpdate] = useState(false);

  useEffect(() => {
    if (!token || !userId) {
      return;
    }

    const checkPaymentUpdate = async () => {
      try {
        const sub = await PaymentService.getSubscription(userId, token);
        const payment = sub?.currentPayment;
        const signature = paymentSignature(payment);
        const isPaid = payment && ['confirmed', 'paid_elsewhere'].includes(payment.status);
        const stored = localStorage.getItem(seenKey(userId));

        if (stored === null) {
          // Primera vez que revisamos este usuario: no notificar por estado ya existente.
          if (signature) {
            localStorage.setItem(seenKey(userId), signature);
          }
          setHasPaymentUpdate(false);
          return;
        }

        setHasPaymentUpdate(Boolean(isPaid && signature !== stored));
      } catch (error) {
        console.error('Error al verificar notificaciones de pago:', error);
      }
    };

    checkPaymentUpdate();
    const intervalId = setInterval(checkPaymentUpdate, 5000);

    return () => clearInterval(intervalId);
  }, [token, userId]);

  // Marca el pago actual como visto (llamar al entrar a la pantalla de pagos).
  const markPaymentSeen = useCallback(async () => {
    if (!token || !userId) {
      return;
    }
    try {
      const sub = await PaymentService.getSubscription(userId, token);
      const signature = paymentSignature(sub?.currentPayment);
      if (signature) {
        localStorage.setItem(seenKey(userId), signature);
      }
    } catch (error) {
      console.error('Error al marcar el pago como visto:', error);
    }
    setHasPaymentUpdate(false);
  }, [token, userId]);

  return { hasPaymentUpdate, markPaymentSeen };
};

export default usePaymentNotifications;
