import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

//import Bootstrap
import  Container from "react-bootstrap/Container";
import  Form from "react-bootstrap/Form";
import  Button from "react-bootstrap/Button";




function Contact() {
  const [message, setMessage] = useState("");
  const [landlord, setLandlord] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, "users", params.landlordId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Could not get owner data");
      }
    };
    getLandlord();
  }, [params.landlordId]);

  const onChange = (e) => setMessage(e.target.value);
  return (
    <Container className="my-5 py-3 vh-100">
      <header>
        <h2>Contact Owner</h2>
      </header>
      <div>{landlord !== null && <p>Contact to : {landlord?.name}</p>}</div>
      <Form>
        <Form.Label>Messege</Form.Label>
        <Form.Control
          as="textarea"
          id="message"
          rows={3}
          value={message}
          onChange={onChange}
        />

        <a
          style={{
            textDecoration: "none",
            color: "white",
          }}
          href={`mailto:${landlord?.email}?Subject=${searchParams.get(
            "listingName"
          )}&body=${message}`}
        >
          <Button type="button" className="my-3" variant="success">
            Sand Message
          </Button>
        </a>
      </Form>
    </Container>
  );
}

export default Contact;
