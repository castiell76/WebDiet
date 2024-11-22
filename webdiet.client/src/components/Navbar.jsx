import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function NavbarBasic() {
    return (

        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">
                    <img
                        src="/assets/logo.png"
                        width = "150">
                    </img>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#features">About us</Nav.Link>
                        <Nav.Link href="#pricing">Contact</Nav.Link>
                        <NavDropdown title="Database" id="collapsible-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Ingredients</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">
                                Meals
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Link href="#deets">Account?</Nav.Link>
                        <Nav.Link eventKey={2} href="#memes">
                            Dank memes
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
       
    );
}

export default NavbarBasic;