import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Form, Card, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { libroService, proveedorService } from '../services/api';

const LibrosList = () => {
  const [libros, setLibros] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentLibro, setCurrentLibro] = useState({
    titulo: '',
    autor: '',
    anio: '',
    categoria: '',
    precio: '',
    id_proveedor: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Obtener libros y proveedores al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const librosRes = await libroService.getAll();
        setLibros(librosRes);
        
        try {
          const proveedoresRes = await proveedorService.getAll();
          setProveedores(proveedoresRes);
        } catch (error) {
          console.error('Error al obtener proveedores:', error);
          setError('No se pudieron cargar los proveedores');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener libros:', error);
        setError('No se pudieron cargar los libros');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar libros basado en el término de búsqueda
  const librosFiltrados = libros.filter(libro => 
    libro.titulo.toLowerCase().includes(filtro.toLowerCase()) || 
    libro.autor.toLowerCase().includes(filtro.toLowerCase()) || 
    libro.categoria.toLowerCase().includes(filtro.toLowerCase())
  );

  // Función para manejar el envío del formulario (crear/editar libro)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (currentLibro.id) {
        // Editando un libro existente
        await libroService.update(currentLibro.id, currentLibro);
        setSuccessMessage('¡Libro actualizado con éxito!');
      } else {
        // Creando un nuevo libro
        await libroService.create(currentLibro);
        setSuccessMessage('¡Libro creado con éxito!');
      }
      
      // Recargar la lista de libros
      const res = await libroService.getAll();
      setLibros(res);
      
      // Cerrar el modal y resetear el formulario
      setShowModal(false);
      setCurrentLibro({
        titulo: '',
        autor: '',
        anio: '',
        categoria: '',
        precio: '',
        id_proveedor: ''
      });
      
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setLoading(false);
    } catch (error) {
      console.error('Error al guardar el libro:', error);
      setError('Error al guardar el libro');
      setLoading(false);
    }
  };

  // Función para eliminar un libro
  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await libroService.delete(currentLibro.id);
      
      // Recargar la lista de libros
      const res = await libroService.getAll();
      setLibros(res);
      
      // Cerrar el modal de confirmación
      setShowDeleteModal(false);
      setSuccessMessage('¡Libro eliminado con éxito!');
      
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setLoading(false);
    } catch (error) {
      console.error('Error al eliminar el libro:', error);
      setError('Error al eliminar el libro');
      setLoading(false);
    }
  };

  // Función para abrir el modal de edición
  const handleEdit = (libro) => {
    setCurrentLibro(libro);
    setShowModal(true);
  };

  // Función para abrir el modal de confirmación de eliminación
  const handleDeleteConfirmation = (libro) => {
    setCurrentLibro(libro);
    setShowDeleteModal(true);
  };

  // Función para abrir el modal para crear nuevo libro
  const handleNew = () => {
    setCurrentLibro({
      titulo: '',
      autor: '',
      anio: '',
      categoria: '',
      precio: '',
      id_proveedor: ''
    });
    setShowModal(true);
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentLibro(prev => ({
      ...prev,
      [name]: name === 'anio' || name === 'precio' ? Number(value) : value
    }));
  };

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      
      <Row className="mb-4">
        <Col>
          <h2>Gestión de Libros</h2>
        </Col>
        <Col md="auto">
          <Button variant="primary" onClick={handleNew} disabled={loading}>
            <FontAwesomeIcon icon={faPlus} /> Nuevo Libro
          </Button>
        </Col>
      </Row>
      
      <Card className="mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Buscar por título, autor o categoría..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="mb-3"
            />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
          </Form.Group>
        </Card.Body>
      </Card>
      
      {loading ? (
        <div className="text-center my-5">
          <p>Cargando datos...</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Título</th>
              <th>Autor</th>
              <th>Año</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Proveedor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {librosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">No hay libros que coincidan con la búsqueda</td>
              </tr>
            ) : (
              librosFiltrados.map((libro) => (
                <tr key={libro.id}>
                  <td>{libro.id}</td>
                  <td>{libro.titulo}</td>
                  <td>{libro.autor}</td>
                  <td>{libro.anio}</td>
                  <td>{libro.categoria}</td>
                  <td>${Number(libro.precio).toLocaleString()}</td>
                  <td>
                    {proveedores.find(p => p.id === libro.id_proveedor)?.nombre || 'N/A'}
                  </td>
                  <td>
                    <Button 
                      variant="info" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleEdit(libro)}
                      disabled={loading}
                    >
                      <FontAwesomeIcon icon={faEdit} /> Editar
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDeleteConfirmation(libro)}
                      disabled={loading}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
      
      {/* Modal para crear/editar libros */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentLibro.id ? 'Editar Libro' : 'Nuevo Libro'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="titulo"
                value={currentLibro.titulo}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Autor</Form.Label>
              <Form.Control
                type="text"
                name="autor"
                value={currentLibro.autor}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Año</Form.Label>
              <Form.Control
                type="number"
                name="anio"
                value={currentLibro.anio}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                type="text"
                name="categoria"
                value={currentLibro.categoria}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="precio"
                value={currentLibro.precio}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Proveedor</Form.Label>
              <Form.Select
                name="id_proveedor"
                value={currentLibro.id_proveedor}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar proveedor</option>
                {proveedores.map(proveedor => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      
      {/* Modal de confirmación para eliminar */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Está seguro que desea eliminar el libro "{currentLibro.titulo}"?</p>
          <p>Esta acción no se puede deshacer.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LibrosList; 