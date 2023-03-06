import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

//import Firesbase
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase.config";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

//Components
import OAuth from "../components/Oauth";

//Import Assests
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import closedVisibilityIcon from "../assets/svg/closed-eye.svg";

//import Bootstrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

// import { async } from "@firebase/util"

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { email, password, name } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      updateProfile(auth.currentUser, {
        displayName: name,
      });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      navigate("/");
    } catch (error) {
      toast.error("Bad User Credentials");
    }
  };

  return (
    <>
      <div className="container pt-5 vh-100">
        <div className="signin-heading text-center">
          <h2>Welcome Back!</h2>
        </div>

        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                id="name"
                type="text"
                value={name}
                placeholder="Enter Your Name"
                onChange={onChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                id="email"
                type="email"
                value={email}
                placeholder="Enter Your Email"
                onChange={onChange}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                id="password"
                value={password}
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your Password"
                onChange={onChange}
              />
              <InputGroup.Text>
                <img
                  src={showPassword ? visibilityIcon : closedVisibilityIcon}
                  alt="show password"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <div className="d-flex align-items-center justify-content-between justify-content-lg-start my-3">
            <Button className="mx-3 bg-success" type="submit">
              Sign Up
              <ArrowRightIcon fill="white" />
            </Button>
            <Link
              className="text-success"
              to="/forgot-password"
              style={{ textDecoration: "none" }}
            >
              Forgot Password
            </Link>
          </div>
        </Form>

        <div className="text-center">
          <OAuth />
          <Link
            to="/sign-in"
            style={{
              textDecoration: "none",
            }}
            className="h4 text-success"
          >
            <Button variant="success">Sign In Instead</Button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Signup;
