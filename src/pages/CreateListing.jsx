import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

//firebase
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";

//import react icons
import { GiKeyring } from "react-icons/gi";
import { BiBuildingHouse } from "react-icons/bi";
import { IoBed } from "react-icons/io5";
import { FaBath } from "react-icons/fa";
import { TbParking, TbParkingOff } from "react-icons/tb";
import { TbDeviceLaptopOff, TbDeviceLaptop } from "react-icons/tb";
import { TbWorldLatitude, TbWorldLongitude, TbDiscount2 } from "react-icons/tb";
import { MdOutlineLocalOffer } from "react-icons/md";
import { GiPriceTag } from "react-icons/gi";

//import Bootstrap
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

//components
import Spinner from "../components/Spinner";

function CreateListing() {
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: true,
    furnished: false,
    address: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/sign-in");
        }
      });
    }
    return () => {
      isMounted.current = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error("Discounted price must be less than regular price");
      return;
    }

    if (images.length >= 6) {
      setLoading(false);
      toast.error("max 6 images");
      return;
    }

    let geolocation = {};
    let location;

    if (geoLocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_API_KEY}`
      );

      const data = await response.json();

      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;
      location =
        data.status === "ZERO_RESULTS"
          ? undefined
          : data.results[0]?.formatted_address;

      if (location === undefined || location.includes("undefined")) {
        setLoading(false);
        toast.error("Pleas enter correct location");
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    // Store images in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, `images/${fileName}`);

        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };

    formDataCopy.location = address;
    delete formDataCopy.images;
    delete formDataCopy.address;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    console.log(formDataCopy);

    const docRef = await addDoc(collection(db, "listings"), formDataCopy);

    setLoading(false);
    toast.success("Listing saved");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    //Files
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: e.target.files,
      }));
    }

    //Text/Bools/Numbers
    if (!e.currentTarget.files) {
      setFormData((prev) => ({
        ...prev,
        // if boolean is null
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Container fluid className="pt-5">
      <Form onSubmit={onSubmit} className="py-2">
        <Row className="justify-content-center">
          <Col xs={12} sm={10} lg={6}>
            <h2 className="text-center">Make New Offer</h2>
          </Col>
        </Row>

        {/* Sale Or Rent */}
        <Row className="justify-content-center">
          <Col xs={12} sm={10} lg={6}>
            <Card className="mt-3 px-3 py-3 bg-light">
              <Card.Title>Sell / Rent</Card.Title>
              <Card.Text>Select sell or rent your property</Card.Text>
              <div className="">
                <Button
                  type="button"
                  id="type"
                  value="sell"
                  variant={type === "rent" ? "outline-success" : "success"}
                  onClick={onMutate}
                >
                  <BiBuildingHouse className="mx-1" />
                  Sale
                </Button>

                <Button
                  className="mx-3"
                  type="button"
                  id="type"
                  value="rent"
                  variant={type === "sell" ? "outline-success" : "success"}
                  onClick={onMutate}
                >
                  <GiKeyring className="mx-1" />
                  Rent
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Name input  */}
        <Row className="justify-content-center">
          <Col xs={12} sm={10} lg={6}>
            <Card className="mt-3 px-3 py-3 bg-light">
              <Card.Title>Name</Card.Title>
              <Card.Text>Please specify the name of the application</Card.Text>
              <InputGroup>
                <InputGroup.Text>
                  {type === "rent" ? <GiKeyring /> : <BiBuildingHouse />}
                </InputGroup.Text>
                <Form.Control
                  placeholder="Name"
                  type="text"
                  id="name"
                  value={name}
                  onChange={onMutate}
                  required
                />
              </InputGroup>
            </Card>
          </Col>
        </Row>

        {/* bedrooms / bathrooms */}
        <Row className="justify-content-center">
          <Col xs={12} sm={10} lg={6}>
            <Card className=" mt-3 px-3 py-3 bg-light">
              <Card.Title>Bed/Bath - rooms</Card.Title>
              <Card.Text>Number of bathrooms and bedrooms </Card.Text>
              <div className="d-flex flex-row align-items-center justify-content-around">
                <div className="d-flex flex-column align-items-center">
                  <Card.Text>
                    Bedrooms
                    <IoBed className="ms-2" />
                  </Card.Text>
                  <InputGroup className="w-50">
                    <Form.Control
                      className="text-center"
                      type="number"
                      id="bedrooms"
                      value={bedrooms}
                      onChange={onMutate}
                      required
                    />
                  </InputGroup>
                </div>
                <div className="d-flex flex-column align-items-center">
                  <Card.Text>
                    Bathrooms
                    <FaBath className="ms-2" />
                  </Card.Text>
                  <InputGroup className="w-50">
                    <Form.Control
                      style={{
                        appearance: "none",
                      }}
                      className="text-center"
                      type="number"
                      id="bathrooms"
                      value={bathrooms}
                      onChange={onMutate}
                      required
                    />
                  </InputGroup>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Parking Spot */}
        <Row className="justify-content-center">
          <Col xs={12} sm={10} lg={6}>
            <Card className="mt-3 px-3 py-3 bg-light">
              <Card.Title>Parking spot</Card.Title>
              <Card.Text>Is parking included ?</Card.Text>
              <div className="">
                <Button
                  type="button"
                  id="parking"
                  value={true}
                  variant={parking ? "success" : "outline-success"}
                  onClick={onMutate}
                >
                  <TbParking size={25} className="mx-1" />
                  Yes
                </Button>
                <Button
                  className="mx-3"
                  type="button"
                  id="parking"
                  value={false}
                  variant={parking ? "outline-success" : "success"}
                  onClick={onMutate}
                >
                  <TbParkingOff size={25} className="mx-1" />
                  No
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Furniture */}
        <Row className="justify-content-center">
          <Col xs={12} sm={10} lg={6}>
            <Card className="mt-3 px-3 py-3 bg-light">
              <Card.Title>Furniture</Card.Title>
              <Card.Text>Is furniture included ?</Card.Text>
              <div>
                <Button
                  type="button"
                  id="furnished"
                  value={true}
                  variant={furnished ? "success" : "outline-success"}
                  onClick={onMutate}
                >
                  <TbDeviceLaptop size={25} className="mx-1" />
                  Yes
                </Button>
                <Button
                  className="mx-3"
                  type="button"
                  id="furnished"
                  value={false}
                  variant={furnished ? "outline-success" : "success"}
                  onClick={onMutate}
                >
                  <TbDeviceLaptopOff size={25} className="mx-1" />
                  No
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Adress altitude longitude */}
        <Row className="justify-content-center">
          <Col xs={12} sm={10} lg={6}>
            <Card className="mt-3 px-3 py-3 bg-light">
              <Card.Title>Address</Card.Title>
              <Form.Control
                as="textarea"
                id="address"
                value={address}
                onChange={onMutate}
                required
              />
              {!geoLocationEnabled && (
                <div className="d-flex flex-row align-items-center justify-content-between mt-3">
                  <div className="d-flex flex-column align-items-center">
                    <Card.Title>
                      <p>
                        Latitude
                        <TbWorldLatitude className="ms-2" />
                      </p>
                    </Card.Title>
                    <InputGroup className="w-50">
                      <Form.Control
                        className="text-center"
                        type="number"
                        id="latitude"
                        value={latitude}
                        onChange={onMutate}
                        required
                      />
                    </InputGroup>
                  </div>
                  <div className="d-flex flex-column align-items-center">
                    <Card.Title>
                      <p>
                        Longitude
                        <TbWorldLongitude className="ms-2" />
                      </p>
                    </Card.Title>
                    <InputGroup className="w-50">
                      <Form.Control
                        style={{
                          appearance: "none",
                        }}
                        className="text-center"
                        type="number"
                        id="longitude"
                        value={longitude}
                        onChange={onMutate}
                        required
                      />
                    </InputGroup>
                  </div>
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* Offer */}
        <Row className="justify-content-center">
          <Col xs={12} sm={10} lg={6}>
            <Card className="mt-3 px-3 py-3 bg-light">
              <Card.Title>
                Offer
                <MdOutlineLocalOffer className="mx-2" size={25} />?
              </Card.Title>
              <div className="my-3">
                <Button
                  type="button"
                  id="offer"
                  value={true}
                  variant={offer ? "success" : "outline-success"}
                  onClick={onMutate}
                >
                  Yes
                </Button>
                <Button
                  className="mx-3"
                  type="button"
                  id="offer"
                  value={false}
                  variant={offer ? "outline-success" : "success"}
                  onClick={onMutate}
                >
                  No
                </Button>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Regular/Discounted Price */}
        <Row className="justify-content-center">
          <Col xs={12} sm={10} lg={6}>
            <Card className="mt-3 px-3 py-3 bg-light">
              <Card.Title>Regular Price</Card.Title>
              <InputGroup className="my-3">
                <InputGroup.Text>
                  <GiPriceTag size={25} />
                </InputGroup.Text>
                <Form.Control
                  type="number"
                  id="regularPrice"
                  value={regularPrice}
                  onChange={onMutate}
                  required
                />
              </InputGroup>

              {/* discounted price */}
              {offer && (
                <>
                  <Card.Title>Discounted Price</Card.Title>
                  <InputGroup className="my-3">
                    <InputGroup.Text>
                      <TbDiscount2 size={25} />
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      id="discountedPrice"
                      value={discountedPrice}
                      onChange={onMutate}
                      required
                    />
                  </InputGroup>
                </>
              )}
            </Card>
          </Col>
        </Row>

        {/* Image  */}
        <Row className="justify-content-center">
          <Col xs={12} sm={10} lg={6}>
            <Card className="mt-3 px-3 py-3 bg-light">
              <Card.Title>Images</Card.Title>
              <Card.Text>The first image will be the cover (max 6)</Card.Text>
              <Form.Control
                type="file"
                id="images"
                onChange={onMutate}
                accept=".jpg, .png, .jpeg"
                max="6"
                multiple
                required
              />
            </Card>
          </Col>
        </Row>

        {/* Submit */}
        <Row className="justify-content-center">
          <Col xs={12} sm={10} lg={6}>
            <Card className="mt-3 px-3 py-3 bg-light">
              <Button type="submit" variant="success">
                Submit Form
              </Button>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default CreateListing;
