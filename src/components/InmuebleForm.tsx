'use client';

import { useState } from 'react';

export default function InmuebleForm() {
    const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
      setMensaje('Inmueble creado/actualizado correctamente');
    } else {
      setMensaje(`Error: ${data.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      const res: any = await fetch("/api/inmueble", {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codigo_inmueble: codigo }),
      });
      setShowModal(false);
      if (!res.ok) {
        // Si el status code NO está entre 200–299
        const errorText = await res.text();
        alert(`Error al eliminar: ${res.status} - ${errorText} vuelve a intentarlo`);
      } else {
        alert('Elemento eliminado con éxito');
      }
    } catch (error) {
      alert("Hubo un error al tratar de eliminar intentalo de nuevo");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Código para actualizar, crear o eliminar un producto</h1>
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
          {loading ? 'Enviando...' : 'Crear o actualizar'}
        </button>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          style={{ ...styles.button, ...styles.deleteButton }}
        >
          Eliminar
        </button>
      </form>
      {mensaje && <div style={styles.message}>{mensaje}</div>}

      {showModal && (
        <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
          <p style={{color: 'black'}}>¿Estás seguro de que deseas eliminar este inmueble?</p>
          <div style={styles.modalButtons}>
            <button
              onClick={() => setShowModal(false)}
              style={{ ...styles.modalButton, ...styles.cancelButton }}
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              style={{ ...styles.modalButton, ...styles.confirmButton }}
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
      )}
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
    marginBottom: '10px',
  },
  deleteButton: {
    backgroundColor: '#d9534f',
  },
  submitButton: {
    backgroundColor: '#007bff',
  },
  message: {
    marginTop: '16px',
    fontSize: '14px',
    textAlign: 'center',
    color: 'black',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    maxWidth: '300px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  modalButton: {
    flex: 1,
    padding: '10px',
    margin: '0 5px',
    fontSize: '16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
  },
  confirmButton: {
    backgroundColor: '#d9534f',
    color: 'white',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    color: 'black',
  },
};
  