import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Form, Card, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { empleadoService } from '../services/api';

const EmpleadosList = () => {
  const [empleados, setEmpleados] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentEmpleado, setCurrentEmpleado] = useState({
    nombre: '',
    cargo: '',
    email: '',
    fecha_ingreso: new Date().toISOString().slice(0, 10)
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Obtener empleados al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const empleadosRes = await empleadoService.getAll();
        setEmpleados(empleadosRes);
        
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener empleados:', error);
        setError('No se pudieron cargar los empleados');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar empleados basado en el término de búsqueda
  const empleadosFiltrados = empleados.filter(empleado => 
    empleado.nombre.toLowerCase().includes(filtro.toLowerCase()) || 
    empleado.cargo.toLowerCase().includes(filtro.toLowerCase()) || 
    (empleado.email && empleado.email.toLowerCase().includes(filtro.toLowerCase()))
  );

  // Función para manejar el envío del formulario (crear/editar empleado)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (currentEmpleado.id) {
        // Editando un empleado existente
        await empleadoService.update(currentEmpleado.id, currentEmpleado);
        setSuccessMessage('¡Empleado actualizado con éxito!');
      } else {
        // Creando un nuevo empleado
        await empleadoService.create(currentEmpleado);
        setSuccessMessage('¡Empleado creado con éxito!');
      }
      
      // Recargar la lista de empleados
      const res = await empleadoService.getAll();
      setEmpleados(res);
      
      // Cerrar el modal y resetear el formulario
      setShowModal(false);
      setCurrentEmpleado({
        nombre: '',
        cargo: '',
        email: '',
        fecha_ingreso: new Date().toISOString().slice(0, 10)
      });
      
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setLoading(false);
    } catch (error) {
      console.error('Error al guardar el empleado:', error);
      setError('Error al guardar el empleado');
      setLoading(false);
    }
  };

  // Función para eliminar un empleado
  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await empleadoService.delete(currentEmpleado.id);
      
      // Recargar la lista de empleados
      const res = await empleadoService.getAll();
      setEmpleados(res);
      
      // Cerrar el modal de confirmación
      setShowDeleteModal(false);
      setSuccessMessage('¡Empleado eliminado con éxito!');
      
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setLoading(false);
    } catch (error) {
      console.error('Error al eliminar el empleado:', error);
      setError('Error al eliminar el empleado');
      setLoading(false);
    }
  };

  // Función para abrir el modal de edición
  const handleEdit = (empleado) => {
    setCurrentEmpleado({
      ...empleado,
      fecha_ingreso: empleado.fecha_ingreso ? empleado.fecha_ingreso.split('T')[0] : ''
    });
    setShowModal(true);
  };

  // Función para abrir el modal de confirmación de eliminación
  const handleDeleteConfirmation = (empleado) => {
    setCurrentEmpleado(empleado);
    setShowDeleteModal(true);
  };

  // Función para abrir el modal para crear nuevo empleado
  const handleNew = () => {
    setCurrentEmpleado({
      nombre: '',
      cargo: '',
      email: '',
      fecha_ingreso: new Date().toISOString().slice(0, 10)
    });
    setShowModal(true);
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentEmpleado(prev => ({
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
          <h2>Gestión de Empleados</h2>
        </Col>
        <Col md="auto">
          <Button variant="primary" onClick={handleNew} disabled={loading}>
            <FontAwesomeIcon icon={faPlus} /> Nuevo Empleado
          </Button>
        </Col>
      </Row>
      
      <Card className="mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre, cargo o email..."
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
              <th>Cargo</th>
              <th>Email</th>
              <th>Fecha de Ingreso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleadosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No hay empleados que coincidan con la búsqueda</td>
              </tr>
            ) : (
              empleadosFiltrados.map((empleado) => (
                <tr key={empleado.id}>
                  <td>{empleado.id}</td>
                  <td>{empleado.nombre}</td>
                  <td>{empleado.cargo}</td>
                  <td>{empleado.email || 'N/A'}</td>
                  <td>{empleado.fecha_ingreso ? new Date(empleado.fecha_ingreso).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <Button 
                      variant="info" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleEdit(empleado)}
                      disabled={loading}
                    >
                      <FontAwesomeIcon icon={faEdit} /> Editar
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => handleDeleteConfirmation(empleado)}
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
      
      {/* Modal para crear/editar empleados */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentEmpleado.id ? 'Editar Empleado' : 'Nuevo Empleado'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={currentEmpleado.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Cargo</Form.Label>
              <Form.Control
                type="text"
                name="cargo"
                value={currentEmpleado.cargo}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={currentEmpleado.email || ''}
                onChange={handleChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Ingreso</Form.Label>
              <Form.Control
                type="date"
                name="fecha_ingreso"
                value={currentEmpleado.fecha_ingreso || ''}
                onChange={handleChange}
                required
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
          <p>¿Está seguro que desea eliminar al empleado "{currentEmpleado.nombre}"?</p>
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

export default EmpleadosList; 