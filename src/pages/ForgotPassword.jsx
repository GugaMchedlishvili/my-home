import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";

//firebase
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

//import Bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";


function ForgotPassword() {
  const [email, setEmail] = useState("");

  const onChange = (e) => setEmail(e.target.value);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email was sent (Check spam)");
    } catch (error) {
      console.log(error);
      toast.error("Could not send reset email");
    }
  };

  return (
    <Container>
      <h1 className="mt-2">Forgot Password</h1>
      <Form className="mt-4" onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label>Enter your email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            onChange={onChange}
          />
        </Form.Group>
        <div className="d-flex align-items-baseline justify-content-sm-between mt-4 px-2">
          <p>Send Reset Link</p>
          <Button variant="primary" type="submit">
            <ArrowRightIcon fill="white" />
          </Button>
        </div>
        <Link to="/sign-in">
          <Button variant="outline-success mt-4" type="button">
            Sign-in
          </Button>
        </Link>
      </Form>
    </Container>
  );
}

export default ForgotPassword;
