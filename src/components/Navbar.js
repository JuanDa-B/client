import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUsers, faShoppingCart, faBoxes, faUserTie, faTruck } from '@fortawesome/free-solid-svg-icons';

const NavbarComponent = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <FontAwesomeIcon icon={faBook} className="me-2" />
            Librería Gestión
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <LinkContainer to="/">
              <Nav.Link><FontAwesomeIcon icon={faBook} className="me-1" /> Libros</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/clientes">
              <Nav.Link><FontAwesomeIcon icon={faUsers} className="me-1" /> Clientes</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/ventas">
              <Nav.Link><FontAwesomeIcon icon={faShoppingCart} className="me-1" /> Ventas</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/inventario">
              <Nav.Link><FontAwesomeIcon icon={faBoxes} className="me-1" /> Inventario</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/proveedores">
              <Nav.Link><FontAwesomeIcon icon={faTruck} className="me-1" /> Proveedores</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/empleados">
              <Nav.Link><FontAwesomeIcon icon={faUserTie} className="me-1" /> Empleados</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent; 