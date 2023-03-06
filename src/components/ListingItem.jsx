import { useState } from "react";
import { Link } from "react-router-dom";

//bootstrap
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

//assets
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";

import bedIcon from "../assets/svg/bedIcon.svg";
import bathroomIcon from "../assets/svg/bathroomIcon.svg";

function ListingItem({ listing, id, onEdit, onDelete }) {
  const [listingHover, setListingHover] = useState(true);

  const mouseEnter = (e) => {
    setListingHover(false);
  };
  const mouseLeave = (e) => {
    setListingHover(true);
  };
  return (
    <>
      <Col xl={3} lg={4} sm={6} xs={12} className="my-2">
        <ListGroup.Item
          className="d-flex justify-content-center"
          style={{
            border: "0px solid white",
            backgroundColor: "rgba(0,0,0,0)",
          }}
        >
          <Link
            to={`/category/${listing.type}/${id}`}
            className="text-decoration-none"
          >
            <Card
              style={{
                height: "500px",
                width: "300px",
              }}
            >
              <Card.Img
                onMouseEnter={mouseEnter}
                onMouseLeave={mouseLeave}
                src={listingHover ? listing.imgUrls[0] : listing.imgUrls[1]}
                alt="img.jpeg"
                style={{
                  height: "200px",
                }}
              />
              <Card.Body className="text-dark py-3">
                <Card.Title>{listing.name}</Card.Title>
                <Card.Text>{listing.location}</Card.Text>
                <Card.Text className="text-primary">
                  $
                  {listing.offer
                    ? listing.discountedPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    : listing.regularPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  {listing.type === "rent" && " / Month"}
                </Card.Text>
                <Row>
                  <Col md={12} xs={6} className="mt-2">
                    <Card.Text>
                      <Badge>
                        <img src={bedIcon} alt="bedIconImage" />
                      </Badge>
                      {listing.bedrooms > 1
                        ? ` - ${listing.bedrooms} Bedrooms`
                        : ` - ${listing.bedrooms} Bedroom`}
                    </Card.Text>
                  </Col>
                  <Col md={12} xs={6} className="mt-2">
                    <Card.Text>
                      <Badge>
                        <img src={bathroomIcon} alt="bedIconImage" />
                      </Badge>
                      {listing.bathrooms > 1
                        ? ` - ${listing.bathrooms} Bathrooms`
                        : ` - ${listing.bathrooms} Bathroom`}
                    </Card.Text>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Link>
          <div>
            {onDelete && (
              <div className="d-block">
                <DeleteIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => onDelete(listing.id, listing.name)}
                />
              </div>
            )}
            {onEdit && (
              <div>
                <EditIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => onEdit(listing.id)}
                />
              </div>
            )}
          </div>
        </ListGroup.Item>
      </Col>
    </>
  );
}

export default ListingItem;
