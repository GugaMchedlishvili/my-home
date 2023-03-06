import { Link } from "react-router-dom";
import rentCategoryImage from "../assets/jpg/rentCategoryImage.jpg";
import sellCategoryImage from "../assets/jpg/sellCategoryImage.jpg";

import Slider from "../components/Slider";

//import Bootstrap
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";





function Explore() {
  return (
    <Container fluid className="pt-5 vh-100">
      {/* Slider */}
      <div className="pt-2">
        <Slider />
      </div>
      <div className="mt-3">
        <h2>Explore</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit ad
          expedita dolores soluta iste totam? Sed dolorem quae recusandae ullam.
        </p>
      </div>
      <Row className="justify-content-center">
        <Col xl={2} lg={3} md={4} xs={6}>
          <Link
            to="/category/rent"
            style={{
              textDecoration: "none",
            }}
          >
            <Card className="mt-3 h-100">
              <Card.Img
                className="h-75"
                variant="top"
                src={rentCategoryImage}
                alt="img"
              />
              <Card.Body>
                <Card.Title>Spaces For Rent</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        </Col>
        <Col xl={2} lg={3} md={4} xs={6}>
          <Link
            to="/category/sell"
            style={{
              textDecoration: "none",
            }}
          >
            <Card className="mt-3 h-100">
              <Card.Img
                className="h-75"
                variant="top"
                src={sellCategoryImage}
                alt="img"
              />
              <Card.Body>
                <Card.Title>Spaces For Sale</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

export default Explore;
