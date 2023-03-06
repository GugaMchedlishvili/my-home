import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

//Components
import OAuth from "../components/Oauth";

//import firstore
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import closedVisibilityIcon from "../assets/svg/closed-eye.svg";

//import Bootstrap
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";


function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
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

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        navigate("/");
      }
    } catch (error) {
      toast.error("Bad user Credentials");
    }
  };

  return (
    <>
      <div className="container pt-5 vh-100">
        <div className="signin-heading mb-4 text-center">
          <h2>Welcome Back!</h2>
        </div>

        <Form onSubmit={onSubmit}>
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
                value={password}
                id="password"
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

          <div className="d-flex align-items-center justify-content-between justify-content-lg-start">
            <Button variant="success" type="submit">
              Sign In
              <ArrowRightIcon fill="white" />
            </Button>
            <Link
              className="text-success"
              to="/forgot-password"
              style={{
                textDecoration: "none",
              }}
            >
              Forgot Password
            </Link>
          </div>
        </Form>

        <div className="text-center p-3">
          <OAuth />
          <Link
            to="/sign-up"
            style={{
              textDecoration: "none",
            }}
          >
            <Button className="bg-success">Sign Up Instead</Button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Signin;
