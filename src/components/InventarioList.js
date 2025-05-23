import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Form, Card, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSearch, faBoxOpen, faHistory } from '@fortawesome/free-solid-svg-icons';
import { inventarioService, libroService } from '../services/api';

const InventarioList = () => {
  const [inventarios, setInventarios] = useState([]);
  const [libros, setLibros] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentInventario, setCurrentInventario] = useState({
    id_libro: '',
    stock: 0,
    ultima_actualizacion: new Date().toISOString().slice(0, 10)
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
        
        const [inventariosRes, librosRes] = await Promise.all([
          inventarioService.getAll(),
          libroService.getAll()
        ]);
        
        setInventarios(inventariosRes);
        setLibros(librosRes);
        
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setError('No se pudieron cargar los datos');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar inventarios basado en el término de búsqueda (título de libro)
  const inventariosFiltrados = inventarios.filter(inventario => {
    const libro = libros.find(l => l.id === inventario.id_libro) || {};
    return libro.titulo?.toLowerCase().includes(filtro.toLowerCase()) ||
           libro.autor?.toLowerCase().includes(filtro.toLowerCase()) ||
           libro.categoria?.toLowerCase().includes(filtro.toLowerCase());
  });

  // Función para manejar el envío del formulario (actualizar inventario)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Actualizar un inventario existente
      await inventarioService.update(currentInventario.id, {
        ...currentInventario,
        ultima_actualizacion: new Date().toISOString().slice(0, 10)
      });
      
      setSuccessMessage('¡Inventario actualizado con éxito!');
      
      // Recargar la lista de inventarios
      const res = await inventarioService.getAll();
      setInventarios(res);
      
      // Cerrar el modal y resetear el formulario
      setShowModal(false);
      setCurrentInventario({
        id_libro: '',
        stock: 0,
        ultima_actualizacion: new Date().toISOString().slice(0, 10)
      });
      
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
      
      setLoading(false);
    } catch (error) {
      console.error('Error al actualizar el inventario:', error);
      setError('Error al actualizar el inventario');
      setLoading(false);
    }
  };

  // Función para abrir el modal de edición
  const handleEdit = (inventario) => {
    setCurrentInventario({
      ...inventario,
      ultima_actualizacion: inventario.ultima_actualizacion 
        ? inventario.ultima_actualizacion.split('T')[0] 
        : new Date().toISOString().slice(0, 10)
    });
    setShowModal(true);
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentInventario(prev => ({
      ...prev,
      [name]: name === 'stock' ? Number(value) : value
    }));
  };

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      
      <Row className="mb-4">
        <Col>
          <h2>Gestión de Inventario</h2>
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
              <th>Libro</th>
              <th>Autor</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Última Actualización</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inventariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">No hay inventarios que coincidan con la búsqueda</td>
              </tr>
            ) : (
              inventariosFiltrados.map((inventario) => {
                const libro = libros.find(l => l.id === inventario.id_libro) || {};
                let stockClass = "text-success";
                let stockStatus = "Disponible";
                
                if (inventario.stock <= 0) {
                  stockClass = "text-danger";
                  stockStatus = "Agotado";
                } else if (inventario.stock < 5) {
                  stockClass = "text-warning";
                  stockStatus = "Bajo";
                }
                
                return (
                  <tr key={inventario.id}>
                    <td>{inventario.id}</td>
                    <td>{libro.titulo || 'N/A'}</td>
                    <td>{libro.autor || 'N/A'}</td>
                    <td>{libro.categoria || 'N/A'}</td>
                    <td className={stockClass}>{inventario.stock}</td>
                    <td className={stockClass}>{stockStatus}</td>
                    <td>
                      {inventario.ultima_actualizacion 
                        ? new Date(inventario.ultima_actualizacion).toLocaleDateString() 
                        : 'N/A'}
                    </td>
                    <td>
                      <Button 
                        variant="info" 
                        size="sm" 
                        onClick={() => handleEdit(inventario)}
                        disabled={loading}
                      >
                        <FontAwesomeIcon icon={faEdit} /> Actualizar Stock
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      )}
      
      {/* Modal para actualizar inventario */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon icon={faBoxOpen} className="me-2" />
            Actualizar Inventario
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Libro</Form.Label>
              <Form.Control
                type="text"
                value={libros.find(l => l.id === currentInventario.id_libro)?.titulo || ''}
                disabled
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Stock Actual</Form.Label>
              <Form.Control
                type="number"
                min="0"
                name="stock"
                value={currentInventario.stock}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Fecha de Actualización</Form.Label>
              <Form.Control
                type="date"
                name="ultima_actualizacion"
                value={currentInventario.ultima_actualizacion}
                onChange={handleChange}
                required
              />
              <Form.Text className="text-muted">
                <FontAwesomeIcon icon={faHistory} className="me-1" />
                Última actualización: {
                  currentInventario.ultima_actualizacion 
                    ? new Date(currentInventario.ultima_actualizacion).toLocaleDateString() 
                    : 'N/A'
                }
              </Form.Text>
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
    </Container>
  );
};

export default InventarioList; 