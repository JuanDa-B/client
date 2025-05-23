import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Form, Card, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ventaService, libroService, clienteService, empleadoService } from '../services/api';

const VentasList = () => {
  const [ventas, setVentas] = useState([]);
  const [libros, setLibros] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentVenta, setCurrentVenta] = useState({
    id_cliente: '',
    id_libro: '',
    id_empleado: '',
    fecha_compra: new Date().toISOString().slice(0, 10),
    cantidad: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Obtener datos al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [ventasRes, librosRes, clientesRes, empleadosRes] = await Promise.all([
          ventaService.getAll(),
          libroService.getAll(),
          clienteService.getAll(),
          empleadoService.getAll()
        ]);
        
        setVentas(ventasRes);
        setLibros(librosRes);
        setClientes(clientesRes);
        setEmpleados(empleadosRes);
        
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setError('No se pudieron cargar los datos');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar ventas basado en el término de búsqueda (cliente o libro)
  const ventasFiltradas = ventas.filter(venta => {
    const clienteNombre = clientes.find(c => c.id === venta.id_cliente)?.nombre || '';
    const libroTitulo = libros.find(l => l.id === venta.id_libro)?.titulo || '';
    
    return clienteNombre.toLowerCase().includes(filtro.toLowerCase()) || 
           libroTitulo.toLowerCase().includes(filtro.toLowerCase()) ||
           venta.fecha_compra.includes(filtro);
  });

  // Función para manejar el envío del formulario (crear/editar venta)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (currentVenta.id) {
        // Editando una venta existente
        await ventaService.update(currentVenta.id, currentVenta);
        setSuccessMessage('¡Venta actualizada con éxito!');
      } else {
        // Creando una nueva venta
        await ventaService.create(currentVenta);
        setSuccessMessage('¡Venta registrada con éxito!');
      }
      
      // Recargar la lista de ventas
      const res = await ventaService.getAll();
      setVentas(res);
      
      // Cerrar el modal y resetear el formulario
      setShowModal(false);
      setCurrentVenta({
        id_cliente: '',
        id_libro: '',
        id_empleado: '',
        fecha_compra: new Date().toISOString().slice(0, 10),
        cantidad: 1
      });
      
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setLoading(false);
    } catch (error) {
      console.error('Error al guardar la venta:', error);
      setError('Error al guardar la venta');
      setLoading(false);
    }
  };

  // Función para eliminar una venta
  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await ventaService.delete(currentVenta.id);
      
      // Recargar la lista de ventas
      const res = await ventaService.getAll();
      setVentas(res);
      
      // Cerrar el modal de confirmación
      setShowDeleteModal(false);
      setSuccessMessage('¡Venta eliminada con éxito!');
      
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setLoading(false);
    } catch (error) {
      console.error('Error al eliminar la venta:', error);
      setError('Error al eliminar la venta');
      setLoading(false);
    }
  };

  // Función para abrir el modal de edición
  const handleEdit = (venta) => {
    setCurrentVenta({
      ...venta,
      fecha_compra: venta.fecha_compra.split('T')[0] // Formato YYYY-MM-DD
    });
    setShowModal(true);
  };

  // Función para abrir el modal de confirmación de eliminación
  const handleDeleteConfirmation = (venta) => {
    setCurrentVenta(venta);
    setShowDeleteModal(true);
  };

  // Función para abrir el modal para crear nueva venta
  const handleNew = () => {
    setCurrentVenta({
      id_cliente: '',
      id_libro: '',
      id_empleado: '',
      fecha_compra: new Date().toISOString().slice(0, 10),
      cantidad: 1
    });
    setShowModal(true);
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentVenta(prev => ({
      ...prev,
      [name]: name === 'cantidad' ? Number(value) : value
    }));
  };

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      
      <Row className="mb-4">
        <Col>
          <h2>Gestión de Ventas</h2>
        </Col>
        <Col md="auto">
          <Button variant="primary" onClick={handleNew} disabled={loading}>
            <FontAwesomeIcon icon={faPlus} /> Nueva Venta
          </Button>
        </Col>
      </Row>
      
      <Card className="mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Buscar por cliente, libro o fecha..."
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
              <th>Cliente</th>
              <th>Libro</th>
              <th>Empleado</th>
              <th>Fecha</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">No hay ventas que coincidan con la búsqueda</td>
              </tr>
            ) : (
              ventasFiltradas.map((venta) => {
                const libro = libros.find(l => l.id === venta.id_libro) || {};
                const cliente = clientes.find(c => c.id === venta.id_cliente) || {};
                const empleado = empleados.find(e => e.id === venta.id_empleado) || {};
                const total = libro.precio ? Number(libro.precio) * venta.cantidad : 0;
                
                return (
                  <tr key={venta.id}>
                    <td>{venta.id}</td>
                    <td>{cliente.nombre || 'N/A'}</td>
                    <td>{libro.titulo || 'N/A'}</td>
                    <td>{empleado.nombre || 'N/A'}</td>
                    <td>{new Date(venta.fecha_compra).toLocaleDateString()}</td>
                    <td>{venta.cantidad}</td>
                    <td>${total.toLocaleString()}</td>
                    <td>
                      <Button 
                        variant="info" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEdit(venta)}
                        disabled={loading}
                      >
                        <FontAwesomeIcon icon={faEdit} /> Editar
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDeleteConfirmation(venta)}
                        disabled={loading}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Eliminar
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      )}
      
      {/* Modal para crear/editar ventas */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentVenta.id ? 'Editar Venta' : 'Nueva Venta'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Cliente</Form.Label>
              <Form.Select
                name="id_cliente"
                value={currentVenta.id_cliente}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Libro</Form.Label>
              <Form.Select
                name="id_libro"
                value={currentVenta.id_libro}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar libro</option>
                {libros.map(libro => (
                  <option key={libro.id} value={libro.id}>
                    {libro.titulo} - ${Number(libro.precio).toLocaleString()}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Empleado</Form.Label>
              <Form.Select
                name="id_empleado"
                value={currentVenta.id_empleado}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar empleado</option>
                {empleados.map(empleado => (
                  <option key={empleado.id} value={empleado.id}>
                    {empleado.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                name="fecha_compra"
                value={currentVenta.fecha_compra}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                min="1"
                name="cantidad"
                value={currentVenta.cantidad}
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
          <p>¿Está seguro que desea eliminar esta venta?</p>
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

export default VentasList; 