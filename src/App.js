import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

//Import Pages
import Explore from "./pages/Explore";
import ForgotPassword from "./pages/ForgotPassword";
import Offers from "./pages/Offers";
import Profile from "./pages/Profile";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Category from "./pages/Category";
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import Contact from "./pages/Contact";
import EditListing from './pages/EditListing'

//Import Components
import NavbarComponent from "./components/NavbarComponent";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <div
        className="pt-5"
        style={{
          backgroundColor: "#ccd9e0",
        }}
      >
        <Router>
          <NavbarComponent />
          <Routes>
            <Route path="/" element={<Explore />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/category/:categoryName" element={<Category />} />
            <Route path="/profile" element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/sign-in" element={<Signin />} />
            <Route path="/sign-up" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/edit-listing/:listingId" element={<EditListing />} />
            <Route
              path="/category/:categoryName/:listingId"
              element={<Listing />}
            />
            <Route path="/contact/:landlordId" element={<Contact />} />
          </Routes>
        </Router>
        <ToastContainer />
      </div>
    </>
  );
}

export default App;
