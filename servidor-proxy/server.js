const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// URL del API original
const API_ORIGEN = 'https://api.dtes.mh.gob.sv/fesv';

// Proxy para recepciondte (enviar facturas)
app.post('/api/recepciondte', async (req, res) => {
  try {
    console.log('[Proxy] POST /api/recepciondte - Enviando al API origen...');
    console.log('[Proxy] Payload:', JSON.stringify(req.body, null, 2));

    const response = await fetch(`${API_ORIGEN}/recepciondte`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MysoftDTE',
        Authorization: req.headers.authorization || ''
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    
    console.log('[Proxy] Status:', response.status);
    console.log('[Proxy] Response:', JSON.stringify(data, null, 2));

    res.status(response.status).json(data);
  } catch (error) {
    console.error('[Proxy] Error:', error.message);
    res.status(502).json({ 
      error: 'Error en proxy',
      message: error.message 
    });
  }
});

// Proxy para anulardte (anular facturas)
app.post('/api/anulardte', async (req, res) => {
  try {
    console.log('[Proxy] POST /api/anulardte - Enviando al API origen...');
    console.log('[Proxy] Payload:', JSON.stringify(req.body, null, 2));

    const response = await fetch(`${API_ORIGEN}/anulardte`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'MysoftDTE',
        Authorization: req.headers.authorization || ''
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    
    console.log('[Proxy] Status:', response.status);
    console.log('[Proxy] Response:', JSON.stringify(data, null, 2));

    res.status(response.status).json(data);
  } catch (error) {
    console.error('[Proxy] Error:', error.message);
    res.status(502).json({ 
      error: 'Error en proxy',
      message: error.message 
    });
  }
});

// Proxy GET para items (si lo necesitas)
app.get('/api/items/get/:id', async (req, res) => {
  try {
    console.log('[Proxy] GET /api/items/get/' + req.params.id);

    const response = await fetch(`${API_ORIGEN}/items/get/${req.params.id}`, {
      method: 'GET',
      headers: {
        Authorization: req.headers.authorization || ''
      }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('[Proxy] Error:', error.message);
    res.status(502).json({ 
      error: 'Error en proxy',
      message: error.message 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy CORS escuchando en puerto ${PORT}`);
  console.log(`📡 Redirigiéndose a: ${API_ORIGEN}`);
});
