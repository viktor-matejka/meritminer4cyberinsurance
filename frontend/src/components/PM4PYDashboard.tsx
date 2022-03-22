import React, { useEffect, useState } from "react";
import {
  Row,
  Button,
  Col,
  Grid,
  Form,
  FormGroup,
  ControlLabel,
  InputPicker,
} from "rsuite";
import { Card, CardGroup } from "react-bootstrap";
import { Endpoints } from "const/endpoints";

export const PM4PYDashboard = () => {
  const [coverageData, setCoverageData] = useState<any>([]);
  const [riskData, setRiskData] = useState<any>([]);
  const [ltlData, setLtlData] = useState<any>([]);
  const [summaryData, setSummaryData] = useState<any>([]);

  const [profileList, setProfileList] = useState<any>([]);
  const [profileId, setProfileId] = useState<number>();
  const [processList, setProcessList] = useState<any[]>([]);
  const [processId, setProcessId] = useState<number>();
  const [eventlogTitle, setEventlogTitle] = useState<string>();
  const [overallFitness, setOverallFitness] = useState<any>();

  useEffect(() => {
    getProfiles();
  }, []);
  useEffect(() => {
    if (profileId) {
      const profileUrl = new URL(Endpoints.process);
      let params = new URLSearchParams();
      params.set("profileId", profileId.toString());
      profileUrl.search = params.toString();

      fetch(profileUrl.href)
        .then((response) => {
          response.json().then((data) => {
            setProcessList(data);
          });
        })
        .catch((err) => {
          console.error(err);
        });

      const eventlogUrl = new URL("http://127.0.0.1:8000/api/summary/");
      const eventlogUrlParams = new URLSearchParams();
      eventlogUrlParams.append("profileId", profileId.toString());
      eventlogUrl.search = eventlogUrlParams.toString();

      fetch(eventlogUrl.href)
        .then((response) => response.json())
        .then((data) => {
          setSummaryData(data["data"] || []);
        });
    } else {
      setCoverageData([]);
      setRiskData([]);
      setSummaryData([]);
      setLtlData([]);
      setOverallFitness(undefined);
    }
  }, [profileId]);

  useEffect(() => {
    if (!processId) return;

    // const ltlUrl = new URL("http://127.0.0.1:8000/api/conformance/ltl/");
    // const ltlUrlParams = new URLSearchParams();
    // ltlUrlParams.append("processId", processId.toString());
    // ltlUrl.search = ltlUrlParams.toString();
    // fetch(ltlUrl.href)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setLtlData(data);
    //   });

    const dashboardUrl = new URL("http://127.0.0.1:8000/api/dashboard/");
    let cdashboardParams = new URLSearchParams();
    cdashboardParams.set("processId", processId.toString());
    dashboardUrl.search = cdashboardParams.toString();
    fetch(dashboardUrl.href)
      .then((response) => response.json())
      .then((data) => {
        setOverallFitness(data["overallFitness"]);
        setRiskData(data["risks"]);
        setCoverageData(data["coverages"]);
        setLtlData(data['ltlRules'])
      });
  }, [processId]);

  const coverageCards = coverageData.map((item: any) => {
    return (
      <>
        <Card.Text className="text-right text-secondary">
          <small>Coverage {item.name}</small>
        </Card.Text>
        <Card.Text className="text-right text-dark">
          {item.description}
        </Card.Text>
      </>
    );
  });
  const riskCards = riskData.map((item: any) => {
    return (
      <>
        <Card.Text className="text-right text-secondary">
          <small>{item.name}</small>
        </Card.Text>
        <Card.Text className="text-right text-dark">{item.rating}</Card.Text>
      </>
    );
  });

  const ltlCards = ltlData.map((item: any) => {
    return (
      <>
        <Card.Text className="text-right text-secondary">
          <small>
            Rule {item.rule}
          </small>
        </Card.Text>
        <Card.Text className="text-right text-dark">
          {item.fitness}
        </Card.Text>
      </>
    );
  });
  const summaryCards = summaryData.map((item: any) => {
    return (
      <>
        <Card.Text className="text-right text-secondary">
          <small>{item.key}</small>
        </Card.Text>
        <Card.Text className="text-right text-dark">{item.value}</Card.Text>
      </>
    );
  });

  const getProfiles = () => {
    fetch(Endpoints.profile)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setProfileList(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const processButtons = processList.map((item: any) => {
    return (
      <Col className="d-flex justify-content-center m-2">
        <Button
          className={`btn btn-${
            item.id === processId ? "primary" : "secondary"
          } btn-center active`}
          onClick={() => {
            setProcessId(item.id);
            setEventlogTitle(item["title"] ? item["title"] : item["file_name"]);
          }}
        >
          {item["title"] ? item["title"] : item["file_name"]}
        </Button>
      </Col>
    );
  });

  return (
    <Grid fluid>
      <Row>
        <Col xs={24}>
          <Card>
            <Card.Body>
              <Form layout="inline">
                <FormGroup>
                  <ControlLabel>Profile</ControlLabel>
                  <InputPicker
                    value={profileId}
                    valueKey="id"
                    labelKey="companyName"
                    data={profileList}
                    onSelect={(v) => {
                      setLtlData([]);
                      setRiskData([]);
                      setCoverageData([]);
                      setProfileId(v);
                      setOverallFitness(undefined);
                    }}
                    onClean={() => {
                      setProcessList([]);
                      setProfileId(undefined);
                    }}
                  />
                </FormGroup>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={7}>
          <Card>
            <Card.Header className="text-center text-dark">
              <h4>Summary</h4>
            </Card.Header>
            <Card.Body>
              <Card.Title className="text-center text-dark">
                <h5>Summary of analysed processes</h5>
              </Card.Title>
              {summaryCards}
              {profileId && summaryData.length === 0 && (
                <h4 className="text-center text-dark">No data, Add eventlog</h4>
              )}
              {processList.length > 0 && (
                <Card.Text className="text-center text-dark">
                  <small>
                    <strong>Select process for drill-down</strong>
                  </small>
                </Card.Text>
              )}

              <Row className="m-2">{processButtons}</Row>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header className="text-center text-dark">
              <h4>Drill-down {eventlogTitle ? `- ${eventlogTitle}` : null}</h4>
            </Card.Header>
          </Card>
        </Col>
        <CardGroup className="card-deck">
          <Card className="card col-md-4">
            <Card.Header className="text-center text-dark">
              Conformance
            </Card.Header>
            <hr />
            <Card.Body>
              {overallFitness >= 0 && (
                <>
                  <Card.Text className="text-right text-secondary">
                    <small>Overall fitness of log to selected model</small>
                  </Card.Text>
                  <Card.Text className="text-right text-dark">
                    {overallFitness}
                  </Card.Text>
                </>
              )}
              {ltlCards}
            </Card.Body>
          </Card>
          <Card className="card col-md-4">
            <Card.Header className="text-center text-dark">
              Selected coverage
            </Card.Header>
            <hr />
            <Card.Body className='mt="-3px'>{coverageCards}</Card.Body>
          </Card>
          <Card className="card col-md-4">
            <Card.Header className="text-center text-dark">
              Product of all enterprise-specific risk modifiers
            </Card.Header>
            <hr />
            <Card.Body>{riskCards}</Card.Body>
          </Card>
        </CardGroup>
      </Row>
    </Grid>
  );
};
