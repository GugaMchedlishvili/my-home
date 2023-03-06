import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";
import { AiOutlineShareAlt } from "react-icons/ai";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

//import Bootstrap
import Carousel from "react-bootstrap/Carousel";
import Container from "react-bootstrap/Container";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";


//icons
import { IoBed } from "react-icons/io5";
import { FaBath } from "react-icons/fa";
import { TbParking, TbParkingOff } from "react-icons/tb";
import { TiInputChecked } from "react-icons/ti";
import { MdDoNotDisturb } from "react-icons/md";

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="pt-5">
      {/* Slideshow */}
      <div>
        <Carousel>
          {listing.imgUrls.map((image, index) => (
            <Carousel.Item
              key={index}
              className="bg-dark"
              style={{ height: "50vh" }}
            >
              <div className="bg-dark h-100 d-flex justify-content-center">
                <img
                  src={`${image}`}
                  className=" d-block h-100"
                  alt="img.img"
                />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      <div className="d-flex align-items-center justify-content-start">
        <div
        className="bg-light d-flex align-items-center justify-content-center rounded-circle"
        style={{
          height: '60px',
          width: '60px',
          cursor: 'pointer'
        }}
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setShareLinkCopied(true);
            setTimeout(() => {
              setShareLinkCopied(false);
            }, 2000);
          }}
        >
          <span>
            <AiOutlineShareAlt style={{ cursor: "pointer" }} size={30} />
          </span>
        </div>
          {shareLinkCopied && <p className="ms-3 mt-2">Link copied</p>}
      </div>
      <Container>
        <div className="my-2">
          <h2>
            {listing.name} - $
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " /Month"}
          </h2>
          <p>{listing.location}</p>
        </div>
        <div className="h4 my-2">
          <Badge bg="info" className="mx-2">
            For {listing.type === "rent" ? "Rent" : "Sale"}
          </Badge>
          <Badge bg="success">
            {listing.offer &&
              `$ ${listing.regularPrice - listing.discountedPrice} - discount`}
          </Badge>
        </div>
        <div className="h5 my-4">
          <p className="my-3">
            <IoBed />
            {listing.bedrooms > 1
              ? ` - Bedrooms : ${listing.bedrooms}`
              : ` - Bedroom : 1`}
          </p>
          <p className="my-3">
            <FaBath />
            {listing.bathrooms > 1
              ? ` - Bathrooms : ${listing.bathrooms}`
              : ` - Bathroom : 1`}
          </p>
          {listing.parkin ? (
            <p className="my-3">
              <TbParking /> - Parking
            </p>
          ) : (
            <p className="my-3">
              <TbParkingOff /> - No Parking
            </p>
          )}
          {listing.furnished ? (
            <p className="my-3">
              <TiInputChecked /> - Furnished
            </p>
          ) : (
            <p className="my-3">
              <MdDoNotDisturb /> - Not Furniture
            </p>
          )}
        </div>
        <div className="my-3">
          {auth.currentUser?.uid !== listing.userRef && (
            <Link
              to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            >
              <Button variant="primary">Contact Owner</Button>
            </Link>
          )}
        </div>
      </Container>
      <div style={{ height: "50vh" }} className="bg-primary">
        <MapContainer
          style={{ height: "100%", width: "100%" }}
          center={[listing.geolocation.lat, listing.geolocation.lng]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
            <Popup>{listing.location}</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default Listing;
