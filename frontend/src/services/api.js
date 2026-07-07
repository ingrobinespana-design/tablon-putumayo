const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function manejarRespuesta(res) {
  if (!res.ok) {
    let detalle = 'Ocurrió un error inesperado';
    try {
      const data = await res.json();
      detalle = data.detail || detalle;
    } catch (_) {}
    throw new Error(detalle);
  }
  return res.json();
}

export const api = {
  listarAnimales: async (filtros = {}) => {
    const params = new URLSearchParams();
    if (filtros.proposito) params.append('proposito', filtros.proposito);
    if (filtros.zona) params.append('zona', filtros.zona);
    const res = await fetch(`${API_URL}/api/animales?${params.toString()}`);
    return manejarRespuesta(res);
  },

  obtenerAnimal: async (id) => {
    const res = await fetch(`${API_URL}/api/animales/${id}`);
    return manejarRespuesta(res);
  },

  publicarAnimal: async (formData) => {
    const res = await fetch(`${API_URL}/api/animales`, { method: 'POST', body: formData });
    return manejarRespuesta(res);
  },

  registrarOferta: async (animalId, datos) => {
    const res = await fetch(`${API_URL}/api/animales/${animalId}/ofertas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    return manejarRespuesta(res);
  },

  // ---------- Admin ----------
  adminLogin: async (clave) => {
    const res = await fetch(`${API_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clave }),
    });
    return manejarRespuesta(res);
  },

  adminListarAnimales: async (clave, estado = null) => {
    const params = estado ? `?estado=${estado}` : '';
    const res = await fetch(`${API_URL}/api/admin/animales${params}`, {
      headers: { 'X-Admin-Clave': clave },
    });
    return manejarRespuesta(res);
  },

  adminObtenerAnimal: async (clave, animalId) => {
    const res = await fetch(`${API_URL}/api/admin/animales/${animalId}`, {
      headers: { 'X-Admin-Clave': clave },
    });
    return manejarRespuesta(res);
  },

  adminAprobar: async (clave, animalId) => {
    const res = await fetch(`${API_URL}/api/admin/animales/${animalId}/aprobar`, {
      method: 'POST',
      headers: { 'X-Admin-Clave': clave },
    });
    return manejarRespuesta(res);
  },

  adminRechazar: async (clave, animalId, motivo) => {
    const res = await fetch(`${API_URL}/api/admin/animales/${animalId}/rechazar`, {
      method: 'POST',
      headers: { 'X-Admin-Clave': clave, 'Content-Type': 'application/json' },
      body: JSON.stringify({ motivo }),
    });
    return manejarRespuesta(res);
  },

  adminListarOfertas: async (clave, animalId) => {
    const res = await fetch(`${API_URL}/api/admin/animales/${animalId}/ofertas`, {
      headers: { 'X-Admin-Clave': clave },
    });
    return manejarRespuesta(res);
  },

  adminContraofertar: async (clave, ofertaId, montoContraoferta, notaContraoferta) => {
    const res = await fetch(`${API_URL}/api/admin/ofertas/${ofertaId}/contraofertar`, {
      method: 'POST',
      headers: { 'X-Admin-Clave': clave, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        monto_contraoferta: montoContraoferta,
        nota_contraoferta: notaContraoferta || null,
      }),
    });
    return manejarRespuesta(res);
  },

  adminCerrarVenta: async (clave, animalId, ofertaId, comisionPct, usarContraoferta = false) => {
    const res = await fetch(`${API_URL}/api/admin/animales/${animalId}/cerrar-venta`, {
      method: 'POST',
      headers: { 'X-Admin-Clave': clave, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        oferta_id: ofertaId,
        comision_pct: comisionPct,
        usar_contraoferta: usarContraoferta,
      }),
    });
    return manejarRespuesta(res);
  },

  adminResumen: async (clave) => {
    const res = await fetch(`${API_URL}/api/admin/resumen`, {
      headers: { 'X-Admin-Clave': clave },
    });
    return manejarRespuesta(res);
  },
};

export { API_URL };
