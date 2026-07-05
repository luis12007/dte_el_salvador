-- =============================================================
-- Pagos de servicio - SQL manual (Postgres)
-- Idempotente: se puede correr varias veces sin romper nada.
-- Las migraciones knex hacen lo mismo automáticamente en el deploy;
-- este archivo es para aplicarlo a la DB en vivo de una vez.
-- =============================================================

-- 1) Tabla de pagos del servicio (transferencia / tarjeta) --------------------
CREATE TABLE IF NOT EXISTS service_payments (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL,
    period      VARCHAR(7) NOT NULL,              -- 'YYYY-MM' (vence el 15)
    status      VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending | confirmed | rejected
    method      VARCHAR(20),                      -- card | transfer
    amount      NUMERIC(12,2),
    reference   VARCHAR(255),
    proof       TEXT,                             -- dataURL base64 (imagen o PDF)
    proof_mime  VARCHAR(255),
    proof_name  VARCHAR(255),
    note        TEXT,
    reviewed_by INTEGER,
    confirmed_at TIMESTAMP,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Por si la tabla ya existía sin estas columnas:
ALTER TABLE service_payments ADD COLUMN IF NOT EXISTS proof_mime  VARCHAR(255);
ALTER TABLE service_payments ADD COLUMN IF NOT EXISTS proof_name  VARCHAR(255);
ALTER TABLE service_payments ADD COLUMN IF NOT EXISTS note        TEXT;

CREATE INDEX IF NOT EXISTS idx_service_payments_user      ON service_payments (user_id);
CREATE INDEX IF NOT EXISTS idx_service_payments_user_prd  ON service_payments (user_id, period);

-- 2) Configuración de suscripción por cliente (lista de precios) --------------
CREATE TABLE IF NOT EXISTS subscription_config (
    user_id     INTEGER PRIMARY KEY,             -- = usuario.id
    amount      NUMERIC(12,2) NOT NULL DEFAULT 0,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    card_token  VARCHAR(255),                    -- reservado para Wompi (fase 2)
    card_last4  VARCHAR(8),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 3) (Opcional) Tabla de anuncios / changelogs (por si aún no existe) ---------
CREATE TABLE IF NOT EXISTS announcements (
    id         SERIAL PRIMARY KEY,
    message    TEXT NOT NULL DEFAULT '',
    enabled    BOOLEAN NOT NULL DEFAULT FALSE,
    version    INTEGER NOT NULL DEFAULT 1,
    updated_by INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
INSERT INTO announcements (id, message, enabled, version)
VALUES (1, '', FALSE, 1)
ON CONFLICT (id) DO NOTHING;
