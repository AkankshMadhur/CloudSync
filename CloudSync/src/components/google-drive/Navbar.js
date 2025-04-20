import React from "react"
import { Navbar, Nav } from "react-bootstrap"
import { Link } from "react-router-dom"

export default function NavbarComponent() {
  return (
    <Navbar bg="light" expand="sm" className="shadow-sm px-3">
      <Navbar.Brand
        as={Link}
        to="/"
        style={{
          color: "#007bff",
          fontSize: "1.8rem",
          fontWeight: "bold",
          letterSpacing: "1px"
        }}
      >
        CloudSync
      </Navbar.Brand>
      <Nav className="ms-auto">
        <Nav.Link as={Link} to="/user">
          Profile
        </Nav.Link>
      </Nav>
    </Navbar>
  )
}
