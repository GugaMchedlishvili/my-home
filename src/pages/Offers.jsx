import { useEffect, useState } from "react";

//import Firebase
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

//import Bootstrap
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Badge from "react-bootstrap/Badge";


function Offers() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        //Get reference
        const listingsRef = collection(db, "listings");

        //Create a query
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        //Execute query
        const querySnap = await getDocs(q);

        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        let listings = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch listings");
      }
    };

    fetchListings();
  }, []);

    //Pagination / Load more
    const onFetchMoreListings = async () => {
      try {
        //Get reference
        const listingsRef = collection(db, "listings");
  
        //Create a query
        const q = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timestamp", "desc"),
          startAfter(lastFetchedListing),
          limit(10)
        );
  
        //Execute query
        const querySnap = await getDocs(q);
  
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);
  
        let listings = [];
  
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings((prev) => [...prev, ...listings]);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch listings");
      }
    };
  

  return (
    <Container fluid>
      <header className="mt-5">
        <h2>Offers</h2>
      </header>

      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main className="mt-5">
            <ListGroup className="d-flex">
              <Row className="justify-content-sm-center justify-content-md-start">
                {listings.map((listing) => (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                  />
                ))}
              </Row>
            </ListGroup>
          </main>
          <br />
          <br />
          {lastFetchedListing && (
            <Badge className="mb-3" onClick={onFetchMoreListings}>
              Load More ...{" "}
            </Badge>
          )}
        </>
      ) : (
        <p>There are no offers</p>
      )}
    </Container>
  );
}

export default Offers;
