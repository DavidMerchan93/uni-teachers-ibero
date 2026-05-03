import { useState, useEffect } from 'react';
import './App.css';

function App() {

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [titulo, setTitulo] = useState('');
  const [areaAcademica, setAreaAcademica] = useState('');
  const [dedicacion, setDedicacion] = useState('');
  const [aniosExperiencia, setAniosExperiencia] = useState(0);

  const [registros, setRegistros] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    cargarDocentes();
  }, []);

  const cargarDocentes = async () => {
    try {
      const response = await fetch('http://localhost:4000/docentes');
      const data = await response.json();
      setRegistros(data);
    } catch (error) {
      alert('Error al cargar el listado de docentes :(');
    }
  };

  const limpiarFormulario = () => {
    setNombre('');
    setCorreo('');
    setTelefono('');
    setTitulo('');
    setAreaAcademica('');
    setDedicacion('');
    setAniosExperiencia(0);
    setEditIndex(null);
  };

  const iniciarEdicion = (index) => {
    const docente = registros[index];
    setNombre(docente.nombre);
    setCorreo(docente.correo);
    setTelefono(docente.telefono);
    setTitulo(docente.titulo);
    setAreaAcademica(docente.area_academica);
    setDedicacion(docente.dedicacion);
    setAniosExperiencia(docente.anios_experiencia);
    setEditIndex(index);
  };

  const registrarDocente = async (e) => {
    e.preventDefault();

    const payload = {
      nombre,
      correo,
      telefono,
      titulo,
      area_academica: areaAcademica,
      dedicacion,
      anios_experiencia: aniosExperiencia
    };

    if (editIndex !== null) {
      try {
        const docente = registros[editIndex];
        const response = await fetch(`http://localhost:4000/docentes/${docente.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const nuevoRegistro = [...registros];
          nuevoRegistro[editIndex] = {
            ...docente,
            nombre,
            correo,
            telefono,
            titulo,
            area_academica: areaAcademica,
            dedicacion,
            anios_experiencia: Number(aniosExperiencia)
          };
          setRegistros(nuevoRegistro);
          limpiarFormulario();
          alert('Docente actualizado con éxito');
        } else {
          const err = await response.json().catch(() => ({}));
          alert(err.error || 'Error al actualizar el docente');
        }
      } catch (error) {
        alert('No se pudo conectar con el servidor para actualizar');
      }

    } else {
      try {
        const response = await fetch('http://localhost:4000/docentes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const nuevoDocente = await response.json();
          setRegistros([...registros, nuevoDocente]);
          limpiarFormulario();
          alert('Docente registrado con éxito');
        } else {
          const err = await response.json().catch(() => ({}));
          alert(err.error || 'Error al registrar el docente');
        }
      } catch (error) {
        alert('No se pudo conectar con el servidor para registrar');
      }
    }
  };

  const eliminarDocente = async (index) => {
    const docente = registros[index];
    if (!window.confirm(`¿Seguro que deseas eliminar a ${docente.nombre}?`)) return;

    try {
      const response = await fetch(`http://localhost:4000/docentes/${docente.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setRegistros(registros.filter((_, i) => i !== index));
        alert('Docente eliminado con éxito');
      } else {
        const err = await response.json().catch(() => ({}));
        alert(err.error || 'Error al eliminar el docente');
      }
    } catch (error) {
      alert('No se pudo conectar con el servidor para eliminar');
    }
  };

  return (
    <div className="App">

      {/* ── ENCABEZADO ── */}
      <header className="app-header">
        <h1>Gestión de docentes universitarios</h1>
        <p>Registro de profesores: datos académicos y de contacto</p>
      </header>

      {/* ── FORMULARIO ── */}
      <form className="form-card" onSubmit={registrarDocente}>

        {/* Fila superior: 5 campos */}
        <div className="form-grid">
          <div className="form-group">
            <label>Nombre completo:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. María García"
              required
            />
          </div>

          <div className="form-group">
            <label>Correo institucional:</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Ej. mgarcia@universidad.edu"
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono:</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej. +57 300 1234567"
              required
            />
          </div>

          <div className="form-group">
            <label>Título académico máximo:</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej. Maestría en Sistemas"
              required
            />
          </div>

          <div className="form-group">
            <label>Área o programa académico:</label>
            <input
              type="text"
              value={areaAcademica}
              onChange={(e) => setAreaAcademica(e.target.value)}
              placeholder="Ej. Ingeniería de Sistemas"
              required
            />
          </div>
        </div>

        {/* Fila inferior: 2 campos */}
        <div className="form-grid-bottom">
          <div className="form-group">
            <label>Dedicación:</label>
            <select value={dedicacion} onChange={(e) => setDedicacion(e.target.value)} required>
              <option value="">-- Selecciona --</option>
              <option value="Tiempo completo">Tiempo completo</option>
              <option value="Medio tiempo">Medio tiempo</option>
              <option value="Cátedra">Cátedra</option>
            </select>
          </div>

          <div className="form-group">
            <label>Años de experiencia docente:</label>
            <input
              type="number"
              min="0"
              value={aniosExperiencia}
              onChange={(e) => setAniosExperiencia(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-submit">
          {editIndex !== null ? 'Actualizar' : 'Registrar'}
        </button>

        {editIndex !== null && (
          <button type="button" className="btn-cancel" onClick={limpiarFormulario}>
            Cancelar
          </button>
        )}
      </form>

      {/* ── TABLA ── */}
      <div className="table-section">
        <h2>Docentes registrados ({registros.length})</h2>

        {registros.length === 0 ? (
          <div className="table-wrapper">
            <p className="empty-msg">No hay docentes registrados aún.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Título</th>
                  <th>Área académica</th>
                  <th>Dedicación</th>
                  <th>Años doc.</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((docente, index) => (
                  <tr key={docente.id}>
                    <td>{docente.nombre}</td>
                    <td>{docente.correo}</td>
                    <td>{docente.telefono}</td>
                    <td>{docente.titulo}</td>
                    <td>{docente.area_academica}</td>
                    <td>{docente.dedicacion}</td>
                    <td>{docente.anios_experiencia}</td>
                    <td>
                      <button className="btn-edit" onClick={() => iniciarEdicion(index)}>Editar</button>
                      <button className="btn-delete" onClick={() => eliminarDocente(index)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

export default App;
