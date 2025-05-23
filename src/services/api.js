import axios from 'axios';

// Determinar la URL base para las llamadas a la API
const BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_API_URL || 'https://libreria-app-backend.onrender.com/api'  // URL de producción desde variable de entorno
  : 'http://localhost:5000/api';                // URL local para desarrollo

// Configuración base de axios
const api = axios.create({
  baseURL: BASE_URL
});

// Servicios de API para libros
export const libroService = {
  getAll: async () => {
    try {
      const response = await api.get('/libros');
      return response.data;
    } catch (error) {
      console.error('Error al obtener libros:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/libros/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener libro con id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (libro) => {
    try {
      const response = await api.post('/libros', libro);
      return response.data;
    } catch (error) {
      console.error('Error al crear libro:', error);
      throw error;
    }
  },
  
  update: async (id, libro) => {
    try {
      const response = await api.put(`/libros/${id}`, libro);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar libro con id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/libros/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar libro con id ${id}:`, error);
      throw error;
    }
  }
};

// Servicios para clientes
export const clienteService = {
  getAll: async () => {
    try {
      const response = await api.get('/clientes');
      return response.data;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener cliente con id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (cliente) => {
    try {
      const response = await api.post('/clientes', cliente);
      return response.data;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error;
    }
  },
  
  update: async (id, cliente) => {
    try {
      const response = await api.put(`/clientes/${id}`, cliente);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar cliente con id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar cliente con id ${id}:`, error);
      throw error;
    }
  }
};

// Servicios para ventas
export const ventaService = {
  getAll: async () => {
    try {
      const response = await api.get('/ventas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener ventas:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/ventas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener venta con id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (venta) => {
    try {
      const response = await api.post('/ventas', venta);
      return response.data;
    } catch (error) {
      console.error('Error al crear venta:', error);
      throw error;
    }
  },
  
  update: async (id, venta) => {
    try {
      const response = await api.put(`/ventas/${id}`, venta);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar venta con id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/ventas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar venta con id ${id}:`, error);
      throw error;
    }
  }
};

// Servicios para inventario
export const inventarioService = {
  getAll: async () => {
    try {
      const response = await api.get('/inventario');
      return response.data;
    } catch (error) {
      console.error('Error al obtener inventario:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/inventario/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener inventario con id ${id}:`, error);
      throw error;
    }
  },
  
  update: async (id, inventario) => {
    try {
      const response = await api.put(`/inventario/${id}`, inventario);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar inventario con id ${id}:`, error);
      throw error;
    }
  }
};

// Servicios para proveedores
export const proveedorService = {
  getAll: async () => {
    try {
      const response = await api.get('/proveedores');
      return response.data;
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/proveedores/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener proveedor con id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (proveedor) => {
    try {
      const response = await api.post('/proveedores', proveedor);
      return response.data;
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      throw error;
    }
  },
  
  update: async (id, proveedor) => {
    try {
      const response = await api.put(`/proveedores/${id}`, proveedor);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar proveedor con id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/proveedores/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar proveedor con id ${id}:`, error);
      throw error;
    }
  }
};

// Servicios para empleados
export const empleadoService = {
  getAll: async () => {
    try {
      const response = await api.get('/empleados');
      return response.data;
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      throw error;
    }
  },
  
  getById: async (id) => {
    try {
      const response = await api.get(`/empleados/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener empleado con id ${id}:`, error);
      throw error;
    }
  },
  
  create: async (empleado) => {
    try {
      const response = await api.post('/empleados', empleado);
      return response.data;
    } catch (error) {
      console.error('Error al crear empleado:', error);
      throw error;
    }
  },
  
  update: async (id, empleado) => {
    try {
      const response = await api.put(`/empleados/${id}`, empleado);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar empleado con id ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      const response = await api.delete(`/empleados/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar empleado con id ${id}:`, error);
      throw error;
    }
  }
};

// Exportar el cliente API para otros usos
export default api; 