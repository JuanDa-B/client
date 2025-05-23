import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Form, Card, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { proveedorService } from '../services/api';

const ProveedoresList = () => {
  const [proveedores, setProveedores] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentProveedor, setCurrentProveedor] = useState({
    nombre: '',
    contacto: '',
    telefono: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Obtener proveedores al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const proveedoresRes = await proveedorService.getAll();
        setProveedores(proveedoresRes);
        
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener proveedores:', error);
        setError('No se pudieron cargar los proveedores');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar proveedores basado en el término de búsqueda
  const proveedoresFiltrados = proveedores.filter(proveedor => 
    proveedor.nombre.toLowerCase().includes(filtro.toLowerCase()) || 
    (proveedor.contacto && proveedor.contacto.toLowerCase().includes(filtro.toLowerCase())) || 
    (proveedor.email && proveedor.email.toLowerCase().includes(filtro.toLowerCase())) ||
    (proveedor.telefono && proveedor.telefono.includes(filtro))
  );

  // Función para manejar el envío del formulario (crear/editar proveedor)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (currentProveedor.id) {
        // Editando un proveedor existente
        await proveedorService.update(currentProveedor.id, currentProveedor);
        setSuccessMessage('¡Proveedor actualizado con éxito!');
      } else {
        // Creando un nuevo proveedor
        await proveedorService.create(currentProveedor);
        setSuccessMessage('¡Proveedor creado con éxito!');
      }
      
      // Recargar la lista de proveedores
      const res = await proveedorService.getAll();
      setProveedores(res);
      
      // Cerrar el modal y resetear el formulario
      setShowModal(false);
      setCurrentProveedor({
        nombre: '',
        contacto: '',
        telefono: '',
        email: ''
      });
      
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setLoading(false);
    } catch (error) {
      console.error('Error al guardar el proveedor:', error);
      setError('Error al guardar el proveedor');
      setLoading(false);
    }
  };

  // Función para eliminar un proveedor
  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await proveedorService.delete(currentProveedor.id);
      
      // Recargar la lista de proveedores
      const res = await proveedorService.getAll();
      setProveedores(res);
      
      // Cerrar el modal de confirmación
      setShowDeleteModal(false);
      setSuccessMessage('¡Proveedor eliminado con éxito!');
      
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setLoading(false);
    } catch (error) {
      console.error('Error al eliminar el proveedor:', error);
      setError('Error al eliminar el proveedor');
      setLoading(false);
    }
  };

  // Función para abrir el modal de edición
  const handleEdit = (proveedor) => {
    setCurrentProveedor(proveedor);
    setShowModal(true);
  };

  // Función para abrir el modal de confirmación de eliminación
  const handleDeleteConfirmation = (proveedor) => {
    setCurrentProveedor(proveedor);
    setShowDeleteModal(true);
  };

  // Función para abrir el modal para crear nuevo proveedor
  const handleNew = () => {
    setCurrentProveedor({
      nombre: '',
      contacto: '',
      telefono: '',
      email: ''
    });
    setShowModal(true);
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentProveedor(prev => ({
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
          <h2>Gestión de Proveedores</h2>
        </Col>
        <Col md="auto">
          <Button variant="primary" onClick={handleNew} disabled={loading}>
            <FontAwesomeIcon icon={faPlus} /> Nuevo Proveedor
          </Button>
        </Col>
      </Row>
      
      <Card className="mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre, contacto, teléfono o email..."
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
              <th>Contacto</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedoresFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No hay proveedores que coincidan con la búsqueda</td>
              </tr>
            ) : (
              proveedoresFiltrados.map((proveedor) => (
                <tr key={proveedor.id}>
                  <td>{proveedor.id}</td>
                  <td>{proveedor.nombre}</td>
                  <td>{proveedor.contacto || 'N/A'}</td>
                  <td>{proveedor.telefono || 'N/A'}</td>
                  <td>{proveedor.email || 'N/A'}</td>
                  <td>
                    <Button 
                      variant="info" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleEdit(proveedor)}
                      disabled={loading}
                    >
                      <FontAwesomeIcon icon={faEdit} /> Editar
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDeleteConfirmation(proveedor)}
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
      
      {/* Modal para crear/editar proveedores */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentProveedor.id ? 'Editar Proveedor' : 'Nuevo Proveedor'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={currentProveedor.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Contacto</Form.Label>
              <Form.Control
                type="text"
                name="contacto"
                value={currentProveedor.contacto || ''}
                onChange={handleChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="telefono"
                value={currentProveedor.telefono || ''}
                onChange={handleChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={currentProveedor.email || ''}
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
          <p>¿Está seguro que desea eliminar al proveedor "{currentProveedor.nombre}"?</p>
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

export default ProveedoresList; 