import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  Form,
  FormControl,
  FormGroup,
  ControlLabel,
  InputPicker,
  Whisper,
  Icon,
  Tooltip,
} from "rsuite";
import { LTLRule } from "../../const/LTLRule";
import { useHistory } from "react-router";
import { Endpoints } from "const/endpoints";

interface LTLChecherProps {
  eventlogId: number | undefined;
  modelId: number | undefined;
  paramererList: any;
  ltlChecker: any;
  setLTLChecker: (v: any) => void;
  processId: number | undefined;
  profileId: number | undefined;
  eventlogList: any;
  setEventlogList: (v: any) => void;
  validLTL: boolean | undefined;
  setValidLTL: (v: any) => void;

  caseParameters: string | undefined;
  activityParameters: string | undefined;
  timestampParameters: string | undefined;
}

export const LTLChecher: React.FC<LTLChecherProps> = (props) => {
  const {
    eventlogId,
    modelId,
    paramererList,
    ltlChecker,
    setLTLChecker,
    processId,
    profileId,
    eventlogList,
    setEventlogList,
    validLTL,
    setValidLTL,
    caseParameters,
    activityParameters,
    timestampParameters,
  } = props;

  const [ltlId, setLTLid] = useState<number>();
  const [ltlList, setLTLList] = useState<any>([]);
  const [LTLName, setLTLName] = useState<string>("");
  const [LTLDescription, setLTLDescription] = useState<string>("");
  const [activityList, setActivityList] = useState<any>();

  const [LTLruleValue, setLTLRuleValue] = useState<string>();
  const [activityA, setActivityA] = useState<string>("");
  const [activityB, setActivityB] = useState<string>("");
  const [activityC, setActivityC] = useState<string>("");
  const [activityD, setActivityD] = useState<string>("");
  const [parameterData, setParameterData] = useState<any>([]);
  const [activityCount, setActivityCount] = useState<number>();

  const history = useHistory();

  const hints = {
    saveLog: (
      <Tooltip>
        RULE, ACTIVITY and LTL NAME is required for save new log
      </Tooltip>
    ),
  };

  const saveLTL = () => {
    const body = {
      eventlogId,
      activityA,
      activityB,
      activityC,
      activityD,
      rule: LTLruleValue,
      name: LTLName,
      description: LTLDescription,
    };

    fetch(Endpoints.ltl, {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => setLTLList([...ltlList, data]))
      .catch((err) => console.error(err));
  };

  const getActivities = (
    id: number,
    activityParameters: string | undefined
  ) => {
    let url = Endpoints.eventlog + id + "/activity/";
    if (activityParameters) {
      url += "?activity=" + activityParameters;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (!data["data"]) {
          setActivityList([]);
        } else {
          const activitiesData = data["data"].map((item: String) => {
            return { label: item, value: item };
          });
          setActivityList(activitiesData);
        }
      })
      .catch((err) => console.error(err));
  };

  const getLTL = (id: number) => {
    const url = new URL(Endpoints.ltl);
    const params = new URLSearchParams();
    params.append("eventlogId", id.toString());
    url.search = params.toString();

    fetch(url.href)
      .then((response) => response.json())
      .then((data) => setLTLList(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    switch (LTLruleValue) {
      case "A_eventually_B_eventually_C_eventually_D":
        setActivityCount(4);
        break;
      case "A_eventually_B_eventually_C":
      case "A_next_B_next_C":
        setActivityCount(3);
        break;
      case "A_eventually_B":
      case "four_eyes_principle":
        setActivityCount(2);
        break;
      case "attr_value_different_persons":
        setActivityCount(1);
        break;
      default:
        setActivityCount(undefined);

        setLTLName("");
        setLTLDescription("");
    }
  }, [LTLruleValue]);

  const filterActivity = (v1: String, v2: String, v3: String) => {
    if (activityList.length) {
      return activityList.filter((i: any) => {
        return i["value"] !== v1 && i["value"] !== v2 && i["value"] !== v3;
      });
    }
  };

  const createLog = () => {
    const body = {
      eventlogId,
      activityA,
      activityB,
      activityC,
      activityD,
      rule: LTLruleValue,
      processId,
      profileId,
    };

    fetch(Endpoints.conformanceLog, {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        setEventlogList([...eventlogList, data]);
        discoveryWithRule(data.id);
      })
      .catch((err) => console.error(err));
  };

  const discoveryWithRule = (id: number) => {
    if (!profileId && !id) return;

    const url = "/user/discovery/?";
    const params = new URLSearchParams();
    if (id) {
      params.append("eventlogId", id.toString() || "");
    } else {
      params.append("eventlogId", eventlogId?.toString() || "");
    }
    params.append("profileId", profileId?.toString() || "");
    params.append("processId", processId?.toString() || "");
    params.append("case", caseParameters || "");
    params.append("activity", activityParameters || "");
    params.append("timestamp", timestampParameters || "");

    history.push(url + params.toString());
  };

  useEffect(() => {
    switch (activityCount) {
      case 4:
        if (activityA && activityB && activityC && activityD) {
          setValidLTL(true);
        } else {
          setValidLTL(false);
        }
        break;
      case 3:
        if (activityA && activityB && activityC) {
          setValidLTL(true);
        } else {
          setValidLTL(false);
        }
        break;
      case 2:
        if (activityA && activityB) {
          setValidLTL(true);
        } else {
          setValidLTL(false);
        }
        break;
      case 1:
        if (activityA) {
          setValidLTL(true);
        } else {
          setValidLTL(false);
        }
        break;
      default:
        setValidLTL(false);
    }

    setLTLChecker({
      rule: LTLruleValue,
      activityA,
      activityB,
      activityC,
      activityD,
    });
  }, [LTLruleValue, activityA, activityB, activityC, activityD]);

  useEffect(() => {
    const data = paramererList.map((v: string) => {
      return { label: v, value: v };
    });
    setParameterData(data);
  }, [paramererList]);

  useEffect(() => {
    if (!eventlogId) return;
    getActivities(eventlogId, activityParameters);
  }, [eventlogId, activityParameters]);

  useEffect(() => {
    if (ltlId) {
      const selectedLTL = ltlList.filter((i: any) => {
        return i.id === ltlId;
      })[0];
      setLTLRuleValue(selectedLTL.rule || "");
      const atr = selectedLTL.source_inssurer;
      setActivityA(atr.A || "");
      setActivityB(atr.B || "");
      setActivityC(atr.C || "");
      setActivityD(atr.D || "");
      setLTLName(selectedLTL.name || "");
      setLTLDescription(selectedLTL.description || "");
    } else {
      setLTLRuleValue("");
      setActivityA("");
      setActivityB("");
      setActivityC("");
      setActivityD("");
      setLTLName("");
      setLTLDescription("");
    }
  }, [ltlId]);

  useEffect(() => {
    setLTLRuleValue("");
    setActivityA("");
    setActivityB("");
    setActivityC("");
    setActivityD("");
    setLTLName("");
    setLTLDescription("");
    if (eventlogId) getLTL(eventlogId);
  }, [eventlogId]);

  return (
    <>
      <>
        <h4>LTL Checker</h4>
        <h5>
          LTL Checking is a form of filtering/conformance checking in which some
          rules are verified against the process executions contained in the
          log.
        </h5>
        <Row>
          <Col md={24}>
            <Form layout="inline">
              <FormGroup controlId="rule">
                <ControlLabel>Saved LTL</ControlLabel>
                <InputPicker
                  value={ltlId}
                  labelKey="name"
                  valueKey="id"
                  data={ltlList}
                  onSelect={(value) => setLTLid(value)}
                  onClean={() => setLTLid(undefined)}
                />
              </FormGroup>
              <FormGroup controlId="rule">
                <ControlLabel>Rule</ControlLabel>
                <InputPicker
                  value={LTLruleValue}
                  data={LTLRule}
                  onSelect={(value) => {
                    setLTLRuleValue(value);
                  }}
                  onClean={() => setLTLRuleValue(undefined)}
                />
              </FormGroup>
              <>
                {activityCount && activityCount >= 1 && (
                  <FormGroup controlId="activity_a">
                    <ControlLabel>A</ControlLabel>
                    <InputPicker
                      value={activityA}
                      data={filterActivity(activityB, activityC, activityD)}
                      onSelect={(value) => setActivityA(value)}
                      onClean={() => setActivityA("")}
                    />
                  </FormGroup>
                )}
                {activityCount && activityCount >= 2 && (
                  <FormGroup controlId="activity_b">
                    <ControlLabel>B</ControlLabel>
                    <InputPicker
                      value={activityB}
                      data={filterActivity(activityA, activityC, activityD)}
                      onSelect={(value) => setActivityB(value)}
                      onClean={() => setActivityB("")}
                    />
                  </FormGroup>
                )}
                {activityCount && activityCount >= 3 && (
                  <FormGroup controlId="activity_c">
                    <ControlLabel>C</ControlLabel>
                    <InputPicker
                      value={activityC}
                      data={filterActivity(activityA, activityB, activityD)}
                      onSelect={(value) => setActivityC(value)}
                      onClean={() => setActivityC("")}
                    />
                  </FormGroup>
                )}
                {activityCount === 4 && (
                  <FormGroup controlId="activity_d">
                    <ControlLabel>D</ControlLabel>
                    <InputPicker
                      value={activityD}
                      data={filterActivity(activityA, activityB, activityC)}
                      onSelect={(value) => setActivityD(value)}
                      onClean={() => setActivityD("")}
                    />
                  </FormGroup>
                )}
              </>
              {activityList && activityList.length === 0 && (
                <p>
                  You need to select parameters on the event event log page for
                  this file
                </p>
              )}
              <FormGroup>
                <ControlLabel>LTL Name</ControlLabel>
                <FormControl
                  name="LTLName"
                  value={LTLName}
                  onChange={(value: string) => {
                    setLTLName(value);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Description of the rule</ControlLabel>
                <FormControl
                  name="LTLDescription"
                  value={LTLDescription}
                  onChange={(value: string) => {
                    setLTLDescription(value);
                  }}
                />
              </FormGroup>
              <Whisper
                placement="top"
                trigger="hover"
                speaker={hints.saveLog}
                style={{ display: "inline-block" }}
              >
                <Icon className="mr-2" icon="question2" />
              </Whisper>
              <Button
                color="green"
                appearance="primary"
                disabled={LTLName && validLTL ? false : true}
                onClick={() => saveLTL()}
              >
                Save Rule for later reuse
              </Button>
              <Button
                disabled={validLTL ? false : true}
                appearance="primary"
                onClick={createLog}
              >
                Save Log and Discovery
              </Button>
            </Form>
          </Col>
        </Row>
      </>
    </>
  );
};
