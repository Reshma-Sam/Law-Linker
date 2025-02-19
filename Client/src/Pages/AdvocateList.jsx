import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, ListGroup, Spinner, Button, Row, Col } from "react-bootstrap";


const AdvocateList = () => {
  const apiUrl = import.meta.env.VITE_API_URL
  const location = useLocation();
  const navigate = useNavigate();
  const specialization = location.state?.specialization || "";

  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/category/advocates/specialization?specialization=${specialization}`
        );
        setAdvocates(response.data.advocates);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching advocates");
      } finally {
        setLoading(false);
      }
    };

    if (specialization) {
      fetchAdvocates();
    } else {
      setLoading(false);
      setError("Specialization is required.");
    }
  }, [specialization]);

  return (
    <div>
    <Container className="py-5">
      <h2 className="text-center mb-4 text-dark">Available Advocates</h2>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}
      {error && <p className="text-center text-danger">{error}</p>}

      {!loading && !error && advocates.length === 0 && (
        <p className="text-center text-dark">No advocates found.</p>
      )}

      {!loading && advocates.length > 0 && (
        <Row className="g-4"> {/* Bootstrap row with gap */}
          {advocates.map((advocate, index) => (
            <Col key={index} md={6}> {/* 2 cards per row */}
              <Card className="long-card">
                <Card.Body className="d-flex align-items-center p-4">
                  {/* Profile Picture */}
                  <img
                    src={advocate.profilePicture || "https://dummyimage.com/150"}
                    alt="Advocate Profile"
                    className="profile-img"
                  />

                  {/* Advocate Details */}
                  <div className="flex-grow-1 advocate-details">
                    <Card.Title className="advocate-name">
                      {advocate.firstname} {advocate.lastname}
                    </Card.Title>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="advocate-detail">
                        <strong>Specialization:</strong> {advocate.specialization}
                      </ListGroup.Item>
                      <ListGroup.Item className="advocate-detail">
                        <strong>Experience:</strong> {advocate.experience} years
                      </ListGroup.Item>
                      <ListGroup.Item className="advocate-detail">
                        <strong>Email:</strong> {advocate.email}
                      </ListGroup.Item>
                      <ListGroup.Item className="advocate-detail">
                        <strong>Rating:</strong> ⭐ {advocate.rating}/5
                      </ListGroup.Item>
                    </ListGroup>

                    {/* View Profile Button */}
                    <div className="text-center mt-3">
                      {/* <Button
                        variant="dark"
                        className="loginButton"
                        onClick={() => {
                          if (advocate._id && advocate.usertype) {
                            navigate(`/profile/other/${advocate.usertype}/${advocate._id}`);
                          } else {
                            console.error("Advocate ID or userType is undefined!", advocate);
                          }
                        }}
                      >
                        Profile
                      </Button> */}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
    </div>
  );
};

export default AdvocateList;
