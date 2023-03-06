import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase.config";

//import Assets
import { Spinner } from "react-bootstrap";

//import Bootstrap
import Carousel from "react-bootstrap/Carousel";
import Badge from "react-bootstrap/Badge";

function Slider() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);

      let listing = [];

      querySnap.forEach((doc) => {
        return listing.push({ id: doc.id, data: doc.data() });
      });
      setListings(listing);
      setLoading(false);
    };
    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }
  if(listings.length === 0){
    return<></>
  }
  return (
    listings && (
      <Carousel>
        {listings.map((listing, index) => (
          <Carousel.Item
            key={index}
            className="bg-dark"
            style={{ height: "50vh" }}
          >
            <div
              className="bg-dark h-100 w-100"
              style={{
                background: `url(${listing.data.imgUrls[0]}) center no-repeat`,
                backgroundSize: "cover",
                cursor: "pointer",
              }}
              onClick={() =>
                navigate(`/category/${listing.data.type}/${listing.id}`)
              }
            >
              <Carousel.Caption className="bg-dark rounded">
                <h5>
                  {listing.data.name} -{" "}
                  <Badge className="bg-info">
                    $
                    {listing.data.offer
                      ? listing.data.discountedPrice
                      : listing.data.regularPrice}
                  </Badge>
                  {listing.data.type === "rent" && " / Monthly"}
                </h5>
                <p>{listing.data.location}</p>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    )
  );
}

export default Slider;
