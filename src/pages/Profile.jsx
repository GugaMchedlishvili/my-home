import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { AiFillHome, AiOutlineArrowRight } from "react-icons/ai";

//components
import ListingItem from "../components/ListingItem";

//router
import { useNavigate, Link } from "react-router-dom";

//import Firebase
import { getAuth, updateProfile } from "firebase/auth";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";

//import Bootstrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");

      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );

      const querySnap = await getDocs(q);

      let listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    };

    fetchUserListings();
  }, [auth.currentUser.uid]);

  const logOut = () => {
    auth.signOut();
    navigate("/");
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        //update display name in fb
        await updateProfile(auth.currentUser, { displayName: name });
        // update firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }

      //Update in firebase
    } catch (err) {
      toast.err("Could not update profile details");
    }
  };

  const onChange = (e) => {
    e.preventDefault();
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onDelete = async (itemId) => {
    if (window.confirm("Are you sure? You want to delete?")) {
      await deleteDoc(doc(db, "listings", itemId));
      const updatedListings = listings.filter(
        (listing) => listing.id !== itemId
      );
      setListings(updatedListings);
      toast.success("Successfully deleted listing");
    }
  };

  const onEdit = (itemId) => navigate(`/edit-listing/${itemId}`);

  return (
    <Container fluid className="pt-5">
      <h2 className="text-center mt-3">My Profile</h2>
      {/* Main */}

      <Row className="justify-content-sm-center">
        <Col lg={7} md={9}>
          <div className="d-flex align-items-baseline justify-content-between">
            <h4>Personal Details</h4>
            <Button
              variant="primary"
              onClick={() => {
                changeDetails && onSubmit();
                setChangeDetails((prevState) => !prevState);
              }}
            >
              {changeDetails ? "done" : "Edit"}
            </Button>
          </div>
          <Form className="p-3 mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                value={name}
                id="name"
                disabled={!changeDetails}
                onChange={onChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Your Email</Form.Label>
              <Form.Control
                value={email}
                id="email"
                disabled={!changeDetails}
                onChange={onChange}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>

      <Row className="justify-content-sm-center">
        <Col lg={4} md={6} sm={9} xs={12}>
          <Link to="/create-listing">
            <Button className="w-100 d-flex justify-content-around align-items-center">
              <AiFillHome />
              Add New Offer
              <AiOutlineArrowRight />
            </Button>
          </Link>
        </Col>
      </Row>
      <Button variant="secondary" className="mt-4" onClick={logOut}>
        Log out
      </Button>
      {!loading && listings?.length > 0 && (
        <ListGroup>
          <Row className="justify-content-sm-center justify-content-md-start">
            <h3 className="mt-3 text-center">Your Listings</h3>

            {listings.map((item) => (
              <ListingItem
                key={item.id}
                listing={item.data}
                id={item.id}
                onDelete={() => onDelete(item.id)}
                onEdit={() => onEdit(item.id)}
              />
            ))}
          </Row>
        </ListGroup>
      )}
    </Container>
  );
}

export default Profile;
