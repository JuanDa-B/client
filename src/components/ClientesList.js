import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Form, Card, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { clienteService } from '../services/api';

const ClientesList = () => {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCliente, setCurrentCliente] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Obtener clientes al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const clientesRes = await clienteService.getAll();
        setClientes(clientesRes);
        
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener clientes:', error);
        setError('No se pudieron cargar los clientes');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar clientes basado en el término de búsqueda
  const clientesFiltrados = clientes.filter(cliente => 
    cliente.nombre.toLowerCase().includes(filtro.toLowerCase()) || 
    cliente.email.toLowerCase().includes(filtro.toLowerCase()) || 
    cliente.telefono.includes(filtro)
  );

  // Función para manejar el envío del formulario (crear/editar cliente)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (currentCliente.id) {
        // Editando un cliente existente
        await clienteService.update(currentCliente.id, currentCliente);
        setSuccessMessage('¡Cliente actualizado con éxito!');
      } else {
        // Creando un nuevo cliente
        await clienteService.create(currentCliente);
        setSuccessMessage('¡Cliente creado con éxito!');
      }
      
      // Recargar la lista de clientes
      const res = await clienteService.getAll();
      setClientes(res);
      
      // Cerrar el modal y resetear el formulario
      setShowModal(false);
      setCurrentCliente({
        nombre: '',
        email: '',
        telefono: '',
        direccion: ''
      });
      
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setLoading(false);
    } catch (error) {
      console.error('Error al guardar el cliente:', error);
      setError('Error al guardar el cliente');
      setLoading(false);
    }
  };

  // Función para eliminar un cliente
  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await clienteService.delete(currentCliente.id);
      
      // Recargar la lista de clientes
      const res = await clienteService.getAll();
      setClientes(res);
      
      // Cerrar el modal de confirmación
      setShowDeleteModal(false);
      setSuccessMessage('¡Cliente eliminado con éxito!');
      
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setLoading(false);
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
      setError('Error al eliminar el cliente');
      setLoading(false);
    }
  };

  // Función para abrir el modal de edición
  const handleEdit = (cliente) => {
    setCurrentCliente(cliente);
    setShowModal(true);
  };

  // Función para abrir el modal de confirmación de eliminación
  const handleDeleteConfirmation = (cliente) => {
    setCurrentCliente(cliente);
    setShowDeleteModal(true);
  };

  // Función para abrir el modal para crear nuevo cliente
  const handleNew = () => {
    setCurrentCliente({
      nombre: '',
      email: '',
      telefono: '',
      direccion: ''
    });
    setShowModal(true);
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentCliente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      
      <Row className="mb-4">
        <Col>
          <h2>Gestión de Clientes</h2>
        </Col>
        <Col md="auto">
          <Button variant="primary" onClick={handleNew} disabled={loading}>
            <FontAwesomeIcon icon={faPlus} /> Nuevo Cliente
          </Button>
        </Col>
      </Row>
      
      <Card className="mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
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
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No hay clientes que coincidan con la búsqueda</td>
              </tr>
            ) : (
              clientesFiltrados.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.id}</td>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.direccion}</td>
                  <td>
                    <Button 
                      variant="info" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleEdit(cliente)}
                      disabled={loading}
                    >
                      <FontAwesomeIcon icon={faEdit} /> Editar
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDeleteConfirmation(cliente)}
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
      
      {/* Modal para crear/editar clientes */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentCliente.id ? 'Editar Cliente' : 'Nuevo Cliente'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={currentCliente.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={currentCliente.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={currentCliente.telefono}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={currentCliente.direccion}
                onChange={handleChange}
              />
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
          <p>¿Está seguro que desea eliminar al cliente "{currentCliente.nombre}"?</p>
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

export default ClientesList; 