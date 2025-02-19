import React, { useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";

const categories = [
  { title: "Civil / Debt Matters", specialization: "civil-debt" },
  { title: "Cheque Bounce", specialization: "cheque-bounce" },
  { title: "Civil Litigation", specialization: "civil-litigation" },
  { title: "Consumer Court", specialization: "consumer-court" },
  { title: "Documentation", specialization: "documentation" },
  { title: "Recovery", specialization: "recovery" },
  
  { title: "Corporate Law", specialization: "corporate-law" },
  { title: "Arbitration", specialization: "arbitration" },
  { title: "Banking / Finance", specialization: "banking-finance" },
  { title: "Startup", specialization: "startup" },
  { title: "Tax", specialization: "tax" },
  { title: "Trademark & Copyright", specialization: "trademark-copyright" },

  { title: "Criminal / Property", specialization: "criminal-property" },
  { title: "Criminal Litigation", specialization: "criminal-litigation" },
  { title: "Cyber Crime", specialization: "cyber-crime" },
  { title: "Landlord / Tenant", specialization: "landlord-tenant" },
  { title: "Property", specialization: "property" },
  { title: "Revenue", specialization: "revenue" },

  { title: "Personal / Family", specialization: "personal-family" },
  { title: "Child Custody", specialization: "child-custody" },
  { title: "Divorce", specialization: "divorce" },
  { title: "Family Dispute", specialization: "family-dispute" },
  { title: "Labour & Service", specialization: "labour-service" },
  { title: "Medical Negligence", specialization: "medical-negligence" },
  { title: "Motor Accident", specialization: "motor-accident" },
  { title: "Muslim Law", specialization: "muslim-law" },
  { title: "Wills / Trusts", specialization: "wills-trusts" },

  { title: "Others", specialization: "others" },
  { title: "Armed Forces Tribunal", specialization: "armed-forces" },
  { title: "Immigration", specialization: "immigration" },
  { title: "Insurance", specialization: "insurance" },
  { title: "International Law", specialization: "international-law" },
  { title: "Notary", specialization: "notary" },
  { title: "Property Redevelopment", specialization: "property-redevelopment" },
  { title: "Supreme Court", specialization: "supreme-court" }
];

const GetLawyer = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCategoryClick = async (specialization) => {
    navigate('/advocates', { state: { specialization } });
  }

  return (
    <div>
    <Container className="mt-4">
    <h2 className="text-center mb-4 page-title">Find Lawyer By Catogory</h2>
    <center>
    <Row className="justify-content-center align-items-center">
      {categories.map((category, index) => (
        <Col key={index} md={6} lg={4} className="mb-4">
          <Card
            className="category-card"
            onClick={() => handleCategoryClick(category.specialization)}
          >
            <Card.Body>
              <Card.Title className="category-title">
                {category.title}
              </Card.Title>
              {loading && (
                <Spinner animation="border" variant="light" size="sm" />
              )}
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
    </center>
  </Container>
  <section>
    <Footer/>
  </section>
  </div>
  )
}

export default GetLawyer;
