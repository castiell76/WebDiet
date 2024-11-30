import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Dropdown } from 'react-bootstrap';

function NavbarBasic() {
    const { user, logout } = useAuth();
    console.log("Current user:", user);
    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img
                        src="/assets/logo.png"
                        width="150"
                        alt="logo"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/about">About Us</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                        <NavDropdown title="Database" id="collapsible-nav-dropdown">
                            <NavDropdown title="Ingredients">
                                <NavDropdown.Item as={Link} to="/ingredients">Ingredients List</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/ingredients/add">Add New Ingredient</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="Meals">
                                <NavDropdown.Item as={Link} to="/meals">Meals List</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/meals/add">Add New Meal</NavDropdown.Item>
                            </NavDropdown>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <div className="ms-auto">
                            {!user ? (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => window.location.href = '/account/login'}
                                >
                                    Sign In
                                </button>
                            ) : (
                                <Dropdown align="end">
                                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                                        {user.name || "Your Account"}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            )}
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarBasic;
