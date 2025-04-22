'use client';

import { useState } from 'react';

export default function InmuebleForm() {
    const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    const res: any = await fetch('/api/inmueble', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ codigo_inmueble: codigo }),
    });

    const data = await res.json();
    setLoading(false);
    console.log('datares', data);
    if (data.productId) {
      setMensaje('Código enviado exitosamente');
    } else {
      setMensaje(`Error: ${data.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Código para actualizar o crear producto</h1>
      <form onSubmit={handleSubmit}>
        <label style={styles.label}>Código del inmueble</label>
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          style={styles.input}
          placeholder="Ej: 620-10499"
          required
        />
        <button
          type="submit"
          style={{
            ...styles.button,
            backgroundColor: loading ? '#9A0000' : '#9A0000',
          }}
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
      {mensaje && <div style={styles.message}>{mensaje}</div>}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
    container: {
      maxWidth: '400px',
      margin: '40px auto',
      padding: '24px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      backgroundColor: '#fff',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: 'black',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '500',
      color: 'black',
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      marginBottom: '16px',
      fontSize: '16px',
      background: 'white',
      color: 'black',
    },
    button: {
      width: '100%',
      padding: '10px',
      color: '#fff',
      fontSize: '16px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    message: {
      marginTop: '16px',
      fontSize: '14px',
      textAlign: 'center',
      color: 'black',
    },
  };
  