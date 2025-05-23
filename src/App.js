import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Componentes
import Navbar from './components/Navbar';
import LibrosList from './components/LibrosList';
import ClientesList from './components/ClientesList';
import VentasList from './components/VentasList';
import InventarioList from './components/InventarioList';
import ProveedoresList from './components/ProveedoresList';
import EmpleadosList from './components/EmpleadosList';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="py-4">
          <Routes>
            <Route path="/" element={<LibrosList />} />
            <Route path="/clientes" element={<ClientesList />} />
            <Route path="/ventas" element={<VentasList />} />
            <Route path="/inventario" element={<InventarioList />} />
            <Route path="/proveedores" element={<ProveedoresList />} />
            <Route path="/empleados" element={<EmpleadosList />} />
          </Routes>
        </main>
        <footer className="mt-5 py-3 text-center text-muted">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Librería Gestión - Desarrollado por Juan David Beltran</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
