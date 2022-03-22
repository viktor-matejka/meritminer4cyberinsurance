import React, { useEffect, useState } from "react";
import { Row, ControlLabel, FormGroup, InputPicker, Col, Grid } from "rsuite";
import Card from "react-bootstrap/Card";
import { UnderwritingBlock } from "components/underwriting/UnderwritingBlock";
import { Policy } from "components/underwriting/Policy";
import { Endpoints } from "const/endpoints";

export const Underwriting = () => {
  const [underwritingsList, setUnderwritingsList] = useState<any[]>([]);
  const [underwritingId, setUnderwritingId] = useState<number>();
  const [policies, setPolicies] = useState<any[]>([]);

  const getUnderwritingsList = () => {
    fetch(Endpoints.underwritings)
      .then((response) => response.json())
      .then((data) => {
        setUnderwritingsList(data);
      });
  };

  useEffect(() => {
    if (!underwritingId) {
      setPolicies([]);
    }
  }, [underwritingId]);

  useEffect(() => {
    getUnderwritingsList();
  }, []);

  return (
    <Grid fluid>
      <Row>
        <Col md={24}>
          <Card>
            <Card.Body>
            {/* <Card.Header> */}
              <div className="pb-4">
                <span></span>
                <InputPicker
                  placeholder="Select saved assessment"
                  className="btn-fill pull-right"
                  labelKey="assessmentName"
                  valueKey="id"
                  data={underwritingsList}
                  onChange={(value) => {
                    setUnderwritingId(value);
                  }}
                />
              </div>
            {/* </Card.Header> */}
              <UnderwritingBlock
                underwritingId={underwritingId}
                setUnderwritingId={setUnderwritingId}
                underwritingsList={underwritingsList}
                setUnderwritingsList={setUnderwritingsList}
              />
              <Policy
                policies={policies}
                setPolicies={setPolicies}
                underwritingId={underwritingId}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Grid>
  );
};
