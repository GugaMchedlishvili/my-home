import { useNavigate, useLocation } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";

function NavbarComponent() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <header
    // className="position-relative"
    >
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="light"
        variant="light"
        className="position-absolute top-0 start-0 w-100"
      >
        <Navbar.Brand className="btn pointer" onClick={() => navigate("/")}>
          My Home
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar" className="mx-2" />
        <Navbar.Collapse id="responsive-navbar">
          <Nav className=" d-flex flex-row justify-content-around">
            <Nav.Link
              onClick={() => navigate("/")}
              style={{
                color: `${pathMatchRoute("/") ? "#2c2c2c" : "#8f8f8f"}`,
              }}
            >
              Explore
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/offers")}
              style={{
                color: `${pathMatchRoute("/offers") ? "#2c2c2c" : "#8f8f8f"}`,
              }}
            >
              Offers
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate("/profile")}
              style={{
                color: `${pathMatchRoute("/profile") ? "#2c2c2c" : "#8f8f8f"}`,
              }}
            >
              Profile
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}

export default NavbarComponent;
