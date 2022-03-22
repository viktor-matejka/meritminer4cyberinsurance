import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Grid,
  Form,
  FormGroup,
  ControlLabel,
  InputPicker,
  HelpBlock,
  RadioGroup,
  Radio,
  ButtonGroup,
  Button,
} from "rsuite";
import Card from "react-bootstrap/Card";
import { LTLChecher } from "components/conformance/LTLCheker";
import { TBRTable } from "components/conformance/TBRTable";
import { AlignmentsTable } from "components/conformance/AlignmentsTable";
import { DFGView } from "components/conformance/DFGView";
import { Endpoints } from "const/endpoints";

export const Conformance = () => {
  const [LTLList, setLTLList] = useState<any>([]);
  const [selectedLTL, setSelectedLTL] = useState<any>();
  const [LTLruleValue, setLTLRuleValue] = useState<string>();
  const [activityA, setActivityA] = useState<string>("");
  const [activityB, setActivityB] = useState<string>("");
  const [activityC, setActivityC] = useState<string>("");
  const [activityD, setActivityD] = useState<string>("");
  const [ltlChecker, setLTLChecker] = useState<boolean>(false);

  const [activities, setActivities] = useState<Record<string, any>[]>([]);
  const [activitiesError, setActivitiesError] = useState<string>("");

  const [eventlogList, setEventlogList] = useState<any>([]);
  const [eventlogId, setEventlogId] = useState<number>();
  const [profileList, setProfileList] = useState<any>([]);
  const [profileId, setProfileId] = useState<number>();
  const [modelList, setModelList] = useState<any>([]);
  const [modelId, setModelId] = useState<number>();
  const [processList, setProcessList] = useState<any>([]);
  const [processId, setProcesslId] = useState<number>();

  // const getLTLList = () => {
  //   if (!eventlogId) return;

  //   const url = new URL(Endpoints.ltl);
  //   const params = new URLSearchParams();
  //   params.append("eventlogId", eventlogId?.toString());
  //   url.search = params.toString();

  //   fetch(url.href)
  //     .then((response) => response.json())
  //     .then((data) => setLTLList(data))
  //     .catch((err) => console.error(err));
  // };

  const getEventlogList = (id: number) => {
    const url = new URL(Endpoints.eventlog);
    const params = new URLSearchParams();
    params.append("processId", id.toString());
    url.search = params.toString();

    fetch(url.href)
      .then((response) => response.json())
      .then((data) => setEventlogList(data))
      .catch((err) => {
        console.error(err);
        setEventlogList([]);
      });
  };

  // const getActivities = (id: Number) => {
  //   // // const getParametersList = (id: number) => {
  //   //   if (!id) return;
  //   //   fetch(Endpoints.eventlog + id + "/view/")
  //   //     .then((response) => response.json())
  //   //     .then((data) => {
  //   //       const parsed = JSON.parse(data["data"]);
  //   //       const headTeableList = Object.keys(parsed[0]);
  //   //       const allParameterValues = headTeableList.map((v) => ({
  //   //         label: v,
  //   //         value: v,
  //   //       }));
  //   //       setActivities(allParameterValues);

  //   //       // setSelectParameters(allParameterValues);
  //   //     })
  //   //     .catch((err) => console.error(err));
  //   // // };

  //   if (!id) return;
  //   fetch(Endpoints.eventlog + id + "/activity/")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (!data["success"]) {
  //         setActivities([]);
  //         setActivitiesError(data["message"]);
  //       } else {
  //         const activitiesData = data["data"].map((item: String) => {
  //           return { label: item, value: item };
  //         });
  //         setActivities(activitiesData);
  //         setActivitiesError("");
  //       }
  //     })
  //     .catch((err) => console.error(err));
  // };

  const getDiscoveryModels = (processId: number) => {
    const url = new URL(Endpoints.discovery);
    const params = new URLSearchParams();
    params.append("processId", processId.toString());
    url.search = params.toString();

    fetch(url.href)
      .then((response) => response.json())
      .then((data) => setModelList(data))
      .catch((err) => console.error(err));
  };

  const getProfiles = () => {
    fetch(Endpoints.profile)
      .then((response) => response.json())
      .then((data) => setProfileList(data))
      .catch((err) => console.error(err));
  };

  const getProcesses = (processId: number) => {
    const url = new URL(Endpoints.process);
    const params = new URLSearchParams();
    params.append("processId", processId.toString());
    url.search = params.toString();

    fetch(url.href)
      .then((response) => response.json())
      .then((data) => setProcessList(data))
      .catch((err) => console.error(err));
  };

  // #TODO
  const getFormData = () => {
    const formData: any = {
      eventlogId,
      modelId,
    };

    if (ltlChecker) {
      formData.ltlChecker = {
        rule: LTLruleValue,
        activityA,
        activityB,
        activityC,
        activityD,
      };
    }

    return formData;
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const profileIdValue = params.get("profileId");
    if (profileIdValue) setProfileId(parseInt(profileIdValue));
    const eventlogIdValue = params.get("eventlogId");
    if (eventlogIdValue) setEventlogId(parseInt(eventlogIdValue));
    const processIdValue = params.get("processId");
    if (processIdValue) setEventlogId(parseInt(processIdValue));

    getProfiles();
  }, []);

  useEffect(() => {
    if (eventlogId) {
      // getLTLList();
      // getActivities(eventlogId);
    }
  }, [eventlogId]);

  // useEffect(() => {
  //   if (selectedLTL) {
  //     setEventlogId(selectedLTL["eventlog_id"]);
  //   }
  // }, [selectedLTL]);

  useEffect(() => {
    if (profileId) {
      getProcesses(profileId);
    } else {
      setProcesslId(undefined);
    }
  }, [profileId]);

  useEffect(() => {
    if (processId && profileId) {
      getDiscoveryModels(processId);
      getEventlogList(processId);
    } else {
      setEventlogId(undefined);
    }
  }, [processId]);

  useEffect(() => {
    switch (LTLruleValue) {
      case "A_eventually_B_eventually_C_eventually_D":
        if (!activityA || !activityB || !activityC || !activityD) return;
        setLTLChecker(true);
        break;
      case "A_eventually_B_eventually_C":
      case "A_next_B_next_C":
        if (!activityA || !activityB || !activityC) return;
        break;
      case "A_eventually_B":
      case "four_eyes_principle":
        if (!activityA || !activityB) return;
        setLTLChecker(true);
        break;
      case "attr_value_different_persons":
        if (!activityA) return;
        setLTLChecker(true);
        break;
      default:
        setLTLChecker(false);
    }
  }, [LTLruleValue, activityA, activityB, activityC, activityD]);

  return (
    <Grid fluid>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Form layout="inline">
                {/* TODO */}
                <div id="mynetwork"></div>
                <FormGroup>
                  <ControlLabel>Profile</ControlLabel>
                  <InputPicker
                    placeholder={"Select Profile"}
                    value={profileId}
                    valueKey="id"
                    labelKey="companyName"
                    data={profileList}
                    onSelect={(v) => {
                      setProfileId(v);
                    }}
                    onClean={() => {
                      setProfileId(undefined);
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Process Name</ControlLabel>
                  <InputPicker
                    placeholder={"Select Process"}
                    value={processId}
                    valueKey="id"
                    labelKey="title"
                    data={processList.filter((item: any) => {
                      return item.profileId === profileId
                    })}
                    onSelect={(v) => {
                      setProcesslId(v);
                    }}
                    onClean={() => {
                      setProcesslId(undefined);
                    }}
                  />
                </FormGroup>
              </Form>
              <hr />
              <DFGView
                eventlogList={eventlogList}
                setEventlogList={setEventlogList}
                modelList={modelList}
                getFormData={getFormData}
                processId={processId}
                profileId={profileId}
              />
              <hr />
              <TBRTable eventlogList={eventlogList} modelList={modelList} />
              <hr />
              <AlignmentsTable
                eventlogList={eventlogList}
                modelList={modelList}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Grid>
  );
};
