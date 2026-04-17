import { useState, useEffect } from 'react';
import './App.css';

function App() {

  // Campos del formulario — cada uno guarda lo que el usuario escribe
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [titulo, setTitulo] = useState('');
  const [areaAcademica, setAreaAcademica] = useState('');
  const [dedicacion, setDedicacion] = useState('');
  const [aniosExperiencia, setAniosExperiencia] = useState(0);

  // Lista de docentes que se muestra en la tabla
  const [registros, setRegistros] = useState([]);

  // Guarda la posición del docente que se está editando; null = modo creación
  const [editIndex, setEditIndex] = useState(null);

  // Al cargar la página, trae los docentes desde el servidor
  useEffect(() => {
    cargarDocentes();
  }, []);

  // Pide al servidor la lista de todos los docentes y la guarda en 'registros'
  const cargarDocentes = async () => {
    try {
      const response = await fetch('http://localhost:4000/docentes');
      const data = await response.json();
      setRegistros(data);
    } catch (error) {
      alert('Error al cargar el listado de docentes :(');
    }
  };

  // Deja todos los campos del formulario en blanco y sale del modo edición
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

  // Llena el formulario con los datos del docente seleccionado para editar
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

  // Envía el formulario: crea un docente nuevo o actualiza uno existente
  const registrarDocente = async (e) => {
    e.preventDefault();

    // Empaqueta todos los datos del formulario en un objeto
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
      // Modo edición: actualiza el docente en el servidor
      try {
        const docente = registros[editIndex];
        const response = await fetch(`http://localhost:4000/docentes/${docente.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          // Reemplaza el registro viejo con los datos nuevos en la lista local
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
      // Modo creación: envía los datos al servidor para guardar un docente nuevo
      try {
        const response = await fetch('http://localhost:4000/docentes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const nuevoDocente = await response.json();
          // Agrega el docente recién creado al final de la lista
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

  // Elimina un docente del servidor y lo quita de la lista
  const eliminarDocente = async (index) => {
    const docente = registros[index];
    if (!window.confirm(`¿Seguro que deseas eliminar a ${docente.nombre}?`)) return;

    try {
      const response = await fetch(`http://localhost:4000/docentes/${docente.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Filtra la lista para quitar el docente eliminado
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

      <h1>Registro de Docentes</h1>

      {/* ── FORMULARIO ── */}
      <form onSubmit={registrarDocente}>
        <h2>{editIndex !== null ? 'Editar Docente' : 'Nuevo Docente'}</h2>

        <label>
          Nombre completo
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. María García"
            required
          />
        </label>

        <label>
          Correo electrónico
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="Ej. mgarcia@universidad.edu"
            required
          />
        </label>

        <label>
          Teléfono
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ej. 3001234567"
            required
          />
        </label>

        <label>
          Título académico
          <select value={titulo} onChange={(e) => setTitulo(e.target.value)} required>
            <option value="">-- Selecciona --</option>
            <option value="Técnico">Técnico</option>
            <option value="Tecnólogo">Tecnólogo</option>
            <option value="Pregrado">Pregrado</option>
            <option value="Especialización">Especialización</option>
            <option value="Maestría">Maestría</option>
            <option value="Doctorado">Doctorado</option>
            <option value="Postdoctorado">Postdoctorado</option>
          </select>
        </label>

        <label>
          Área académica
          <input
            type="text"
            value={areaAcademica}
            onChange={(e) => setAreaAcademica(e.target.value)}
            placeholder="Ej. Ingeniería de Sistemas"
            required
          />
        </label>

        <label>
          Tipo de dedicación
          <select value={dedicacion} onChange={(e) => setDedicacion(e.target.value)} required>
            <option value="">-- Selecciona --</option>
            <option value="Tiempo completo">Tiempo completo</option>
            <option value="Medio tiempo">Medio tiempo</option>
            <option value="Cátedra">Cátedra</option>
          </select>
        </label>

        <label>
          Años de experiencia
          <input
            type="number"
            min="0"
            value={aniosExperiencia}
            onChange={(e) => setAniosExperiencia(e.target.value)}
            required
          />
        </label>

        {/* Botón principal: cambia texto según si se está editando o creando */}
        <button type="submit">
          {editIndex !== null ? 'Actualizar' : 'Registrar'}
        </button>

        {/* El botón cancelar solo aparece cuando se está editando */}
        {editIndex !== null && (
          <button type="button" onClick={limpiarFormulario}>
            Cancelar
          </button>
        )}
      </form>

      {/* ── TABLA DE DOCENTES ── */}
      <h2>Docentes registrados ({registros.length})</h2>

      {registros.length === 0 ? (
        <p>No hay docentes registrados aún.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Título</th>
              <th>Área académica</th>
              <th>Dedicación</th>
              <th>Años exp.</th>
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
                  <button onClick={() => iniciarEdicion(index)}>Editar</button>
                  <button onClick={() => eliminarDocente(index)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}

export default App;
