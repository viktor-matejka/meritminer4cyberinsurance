import React, { useEffect, useState } from "react";
import { StringType, NumberType } from "schema-typed";

import {
  Row,
  Col,
  Grid,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  InputPicker,
  ButtonGroup,
  Button,
  Input,
  Modal,
  Schema,
  Whisper,
  Icon,
  Tooltip,
  Toggle,
} from "rsuite";
import Card from "react-bootstrap/Card";
import { GraphvizAlgorithm } from "components/discovery/GraphvizAlgorythm";
import { Statistics } from "components/discovery/Statistics";
import { Endpoints } from "const/endpoints";
import { toast } from "react-toastify";
import { setTimeout } from "timers";

export const Discovery = () => {
  const [eventlogList, setEventlogList] = useState<any>([]);
  const [eventlogId, setEventlogId] = useState<any>();
  const [algorithm, setAlgorithm] = useState<string>("alpha_miner");
  const [caseParameter, setCaseParameter] = useState<string>("");
  const [activityParameter, setActivityParameter] = useState<string>("");
  const [timestampParameter, setTimestampParameter] = useState<string>("");
  const [profileList, setProfileList] = useState<any>([]);
  const [profileId, setProfileId] = useState<number>();

  const [processList, setProcesssList] = useState<any>([]);
  const [processId, setProcessId] = useState<any>();
  const [modelName, setModelName] = useState<string>();
  const [modelList, setModelList] = useState<any>([]);
  const [modelId, setModelId] = useState<number>();

  const [processTree, setProcessTree] = useState<boolean>(false);
  const [heuNet, setHeuNet] = useState<boolean>(false);

  const [formModelName, setFormModelName] = useState<string>();
  const [formModelFile, setFormModelFile] = useState<File | null>(null);
  const [formModelProcessId, setFormModelProcessId] = useState<any>();
  const [formModelEventlogId, setFormModelEventlogId] = useState<any>(null);
  const [formModelAlgorithm, setFormModelAlgorithm] = useState<any>("");
  const [showModelModal, setShowModelModal] = useState<boolean>(false);

  const [selectParameters, setSelectParameters] = useState<any>([]);

  const [showGraph, setShowGraph] = useState<boolean>(false);
  const [showStatistics, setShowStatistics] = useState<boolean>(false);

  const [statData, setStatData] = useState<any>();
  const [statError, setStatError] = useState<boolean>(false);

  const hints = {
    saveModel: (
      <Tooltip>
        CASE, ACTIVITY, TIMESTAMP and MODEL NAME are required for save new model
      </Tooltip>
    ),
  };

  const modelRef: any = React.useRef();

  const algorithms = [
    { title: "Alpta", name: "alpha_miner" },
    { title: "Inductive", name: "inductive_miner" },
    { title: "Heuristics", name: "heuristics_miner" },
  ];
  const model = Schema.Model({
    modelName: StringType().isRequired("This field is required."),
    modelFile: StringType().isRequired("This field is required."),
  });

  const getProfiles = () => {
    fetch(Endpoints.profile)
      .then((response) => response.json())
      .then((data) => setProfileList(data))
      .catch((err) => console.error(err));
  };

  const getProcessNaming = (profileId: number) => {
    const url = new URL(Endpoints.process);
    const paramms = new URLSearchParams();
    paramms.append("profileId", profileId.toString());
    url.search = paramms.toString();

    fetch(url.href)
      .then((response) => response.json())
      .then((data) => setProcesssList(data))
      .catch((err) => console.error(err));
  };

  const getEventlogList = (processId: number) => {
    const url = new URL(Endpoints.eventlog);
    const params = new URLSearchParams();
    params.append("processId", processId.toString());
    url.search = params.toString();

    fetch(url.href)
      .then((response) => response.json())
      .then((data) => {
        setEventlogList(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getModelList = (processId: number) => {
    const url = new URL(Endpoints.discovery);
    const params = new URLSearchParams();
    params.append("processId", processId.toString());
    url.search = params.toString();

    fetch(url.href)
      .then((response) => response.json())
      .then((data) => setModelList(data))
      .catch((err) => console.error(err));
  };

  const conformanceURL = () => {
    const url = new URL("http://127.0.0.1:3001/user/conformance/");
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append("eventlogId", eventlogId?.toString() || "");
    urlSearchParams.append("processId", processId?.toString() || "");
    urlSearchParams.append("profileId", profileId?.toString() || "");
    url.search = urlSearchParams.toString();
    return url.href;
  };

  const getParametersList = (id: number) => {
    if (!id) return;
    fetch(Endpoints.eventlog + id + "/view/")
      .then((response) => response.json())
      .then((data) => {
        const parsed = JSON.parse(data["data"]);
        const headTeableList = Object.keys(parsed[0]);
        const allParameterValues = headTeableList.map((v) => ({
          label: v,
          value: v,
        }));
        setSelectParameters(allParameterValues);
      })
      .catch((err) => console.error(err));
  };

  const filterSelectParamaters = (value1: string, value2: string) => {
    return selectParameters.filter((item: any) => {
      return item["value"] !== value1 && item["value"] !== value2;
    });
  };

  const saveDiscovery = () => {
    const body = {
      eventlogId,
      processId,
      algorithm,
      case: caseParameter,
      activity: activityParameter,
      timestamp: timestampParameter,
      name: modelName,
    };

    fetch(Endpoints.discovery, {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => setModelList([...modelList, data]))
      .catch((err) => console.error(err));
  };

  const saveBPMN = () => {
    if (!formModelFile) return;
    if (!processId) return;
    if (!formModelName) return;
    const form_data = new FormData();
    form_data.append("file", formModelFile);
    form_data.append("processId", formModelProcessId);
    form_data.append("case", "");
    form_data.append("algorithm", formModelAlgorithm);
    form_data.append("activity", "");
    form_data.append("timestamp", "");
    form_data.append("name", formModelName);
    if (formModelEventlogId) {
      form_data.append("eventlogId", formModelEventlogId);
    }
    const url = new URL(Endpoints.discovery + "bpmn/");

    fetch(url.href, {
      method: "POST",
      body: form_data,
    })
      .then((response) => response.json())
      .then((data) => setModelList([...modelList, data]))
      .catch((err) => console.error(err));

    setShowModelModal(false);
    cleanFields();
  };
  const handleSubmit = () => {
    if (!modelRef.current.check()) {
      console.error("Form Error");
      return;
    }
    saveBPMN();
  };
  function handleChangeFile(value: string, event: any) {
    setFormModelFile(event.target.files[0]);
  }

  const cleanFields = () => {
    setFormModelName("");
    setFormModelEventlogId(undefined);
    setFormModelProcessId(undefined);
    setFormModelAlgorithm("");
  };

  const getModel = (value: any) => {
    const currentModel = modelList.filter((item: any) => {
      return item.id === value;
    });
    if (currentModel.lemgth) {
      setEventlogId(currentModel[0]["eventlogId"]);
      getParametersList(currentModel[0]["eventlogId"]);
      setAlgorithm(currentModel[0]["algorithm"]);

      if (currentModel[0]["case"]) setCaseParameter(currentModel[0]["case"]);
      if (currentModel[0]["activity"])
        setActivityParameter(currentModel[0]["activity"]);
      if (currentModel[0]["timestamp"])
        setTimestampParameter(currentModel[0]["timestamp"]);
    }
  };

  const setEventlogParameters = (id: number) => {
    if (id) {
      getParametersList(id);
      const selectedEventlog = eventlogList.filter(
        (eventlog: any) => eventlog.id === id
      );

      if (selectedEventlog.length) {
        setCaseParameter(selectedEventlog[0]["case"]);
        setActivityParameter(selectedEventlog[0]["activity"]);
        setTimestampParameter(selectedEventlog[0]["timestamp"]);
        setModelName("");
        setModelId(undefined);
      }
    }
  };

  const getStatisticsData = () => {
    if (!eventlogId) return;

    const url = new URL(Endpoints.discovery + "statistics/");
    const urlSearchParams = new URLSearchParams();

    urlSearchParams.set("eventlogId", eventlogId.toString());
    urlSearchParams.set("case", caseParameter);
    urlSearchParams.set("activity", activityParameter);
    urlSearchParams.set("timestamp", timestampParameter);
    url.search = urlSearchParams.toString();

    fetch(url.href)
      .then((response) => {
        response.json().then((data) => {
          setStatData(data);
          setStatError(false);
        });
      })
      .catch((err) => {
        console.log("2333333");

        setStatError(true);
        console.error(err);
      });
  };

  const setModelParameters = (id: number) => {
    if (id) {
      const selectedModel = modelList.filter((model: any) => model.id === id);

      if (selectedModel[0].eventlogId) {
        getParametersList(selectedModel[0].eventlogId);
      }
      if (selectedModel[0].case) setCaseParameter(selectedModel[0].case);
      if (selectedModel[0].activity)
        setActivityParameter(selectedModel[0].activity);
      if (selectedModel[0].timestamp)
        setTimestampParameter(selectedModel[0].timestamp);
      if (selectedModel[0].name) setModelName(selectedModel[0].name);
      if (selectedModel[0].eventlogId) {
        setEventlogId(selectedModel[0].eventlogId);
      } else {
        setEventlogId(undefined);
      }
    } else {
      setSelectParameters([]);
      setCaseParameter("");
      setActivityParameter("");
      setTimestampParameter("");
      setModelName("");
      setEventlogId(undefined);
      setGraphvizData("");
    }
  };

  const [graphvizData, setGraphvizData] = useState<string>();
  const [error, setError] = useState<boolean>();

  const [statisticsData, setStatisticsData] = useState<any>();

  const getGaphvizData = (id: any) => {
    const body: any = {
      eventlogId: eventlogId | 0,
      algorithm,
      case: caseParameter,
      activity: activityParameter,
      timestamp: timestampParameter,
      id: id ? id : modelId,
    };

    if (algorithm === "inductive_miner" && processTree) {
      body.processTree = processTree;
    }

    if (algorithm === "heuristics_miner" && heuNet) {
      body.heuNet = heuNet;
    }

    setTimeout(
      () => {
        fetch(Endpoints.discovery + "gviz/", {
          method: "POST",
          body: JSON.stringify(body),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("data", data);
            if (data) {
              setGraphvizData(data);
              setError(false);
            } else {
              setGraphvizData(undefined);
              setError(true);
            }
          })
          .catch((err) => {
            console.error(err);
            setError(true);
            setGraphvizData(undefined);
          });
      },

      500
    );
  };

  useEffect(() => {
    if (eventlogList && eventlogId) setEventlogParameters(eventlogId);
  }, [eventlogList, eventlogId]);

  useEffect(() => {
    if (!modelId && modelId === 0) return;
    getModel(modelId);
  }, [modelId]);

  useEffect(() => {
    if (processId) {
      getEventlogList(processId);
      getModelList(processId);
      setActivityParameter("");
      setCaseParameter("");
      setTimestampParameter("");
    } else {
      setEventlogId(undefined);
      setEventlogList([]);
      setModelList([]);
      setModelId(0);
      setActivityParameter("");
      setCaseParameter("");
      setTimestampParameter("");
    }
  }, [processId]);

  useEffect(() => {
    if (profileId) {
      getProcessNaming(profileId);
    }
  }, [profileId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const profileIdValue = params.get("profileId");
    if (profileIdValue) setProfileId(parseInt(profileIdValue));
    const eventlogIdValue = params.get("eventlogId");
    if (eventlogIdValue) {
      setEventlogId(parseInt(eventlogIdValue));
      getParametersList(parseInt(eventlogIdValue));
    }
    const processIdValue = params.get("processId");
    if (processIdValue) setProcessId(parseInt(processIdValue));
    const caseValue = params.get("case");
    if (caseValue) setCaseParameter(caseValue);
    const activityValue = params.get("activity");
    if (activityValue) setActivityParameter(activityValue);
    const timestampValue = params.get("timestamp");
    if (timestampValue) setTimestampParameter(timestampValue);
    getProfiles();
  }, []);

  return (
    <>
      <Grid fluid>
        <Row>
          <Col>
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
                        setEventlogId(undefined);
                        setProcessId(undefined);
                        setShowGraph(false);
                        setShowStatistics(false);
                        setProfileId(v);
                      }}
                      onClean={() => {
                        setEventlogId(undefined);
                        setProcessId(undefined);
                        setProfileId(undefined);
                        setShowGraph(false);
                        setShowStatistics(false);
                      }}
                    />
                  </FormGroup>
                  {profileId && (
                    <>
                      <FormGroup>
                        <ControlLabel>Process</ControlLabel>
                        <InputPicker
                          value={processId}
                          labelKey="title"
                          valueKey="id"
                          data={processList}
                          onSelect={(value) => {
                            setEventlogId(undefined);
                            setProcessId(value);
                            setShowGraph(false);
                            setShowStatistics(false);
                          }}
                          onClean={() => {
                            setEventlogId(undefined);
                            setProcessId(undefined);
                            setShowGraph(false);
                            setShowStatistics(false);
                          }}
                        />
                      </FormGroup>
                      {processId && (
                        <div>
                          <h4>
                            Select source for Discovery, you can either discover
                            a model from an event log you previously set-up, or
                            you can upload a BPMN 2.0 model for later
                            conformance checking
                          </h4>
                          <FormGroup>
                            <ControlLabel className="d-block">
                              Eventlog
                            </ControlLabel>
                            <InputPicker
                              value={eventlogId}
                              labelKey="file_name"
                              valueKey="id"
                              data={eventlogList.filter((item: any) => {
                                return item.processId === processId;
                              })}
                              onSelect={(value) => {
                                setEventlogId(value);
                                setShowGraph(false);
                                setShowStatistics(false);
                              }}
                              onClean={() => {
                                setModelId(0);
                                setEventlogId(undefined);
                                setModelName("");
                                setCaseParameter("");
                                setActivityParameter("");
                                setTimestampParameter("");
                                setGraphvizData(undefined);
                                setStatisticsData(undefined);
                                setShowGraph(false);
                                setShowStatistics(false);
                              }}
                            />
                          </FormGroup>
                          <FormGroup className="ml-5">
                            <ControlLabel className="d-block">
                              Upload BPMN 2.0 process model
                            </ControlLabel>
                            <InputPicker
                              value={modelId}
                              valueKey="id"
                              labelKey="name"
                              data={modelList}
                              onSelect={(value) => {
                                setModelId(value);
                                setModelParameters(value);
                                // getGaphvizData(value);
                                setShowGraph(false);
                                setShowStatistics(false);
                              }}
                              onClean={() => {
                                setGraphvizData("");
                                setShowGraph(false);
                                setShowStatistics(false);
                                setModelId(undefined);
                                setStatisticsData(undefined);
                                setModelName("");
                              }}
                            />
                          </FormGroup>
                          <br />
                          <br />
                          {profileId && (
                            <FormGroup>
                              <ControlLabel>
                                SELECT BPMN PROCESS MODEL TO UPLOAD
                              </ControlLabel>
                              <Button
                                className="ml-4"
                                color="green"
                                onClick={() => {
                                  setFormModelProcessId(processId);
                                  setShowModelModal(true);
                                }}
                              >
                                Upload BPMN
                              </Button>
                            </FormGroup>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </Form>
                {processId && (
                  <Form id="parametersValues" layout="inline">
                    <hr />
                    <h4>Select parameters for Discovery</h4>
                    <FormGroup controlId="parameterCase">
                      <ControlLabel className="d-block">Case</ControlLabel>
                      <InputPicker
                        value={caseParameter}
                        data={filterSelectParamaters(
                          activityParameter,
                          timestampParameter
                        )}
                        onSelect={(v) => setCaseParameter(v)}
                        onClean={() => setCaseParameter("")}
                      />
                    </FormGroup>
                    <FormGroup controlId="parameterActivity">
                      <ControlLabel className="d-block">Activity</ControlLabel>
                      <InputPicker
                        value={activityParameter}
                        data={filterSelectParamaters(
                          caseParameter,
                          timestampParameter
                        )}
                        onSelect={(v) => setActivityParameter(v)}
                        onClean={() => setActivityParameter("")}
                      />
                    </FormGroup>
                    <FormGroup controlId="parameterTimestamp">
                      <ControlLabel className="d-block">Timestamp</ControlLabel>
                      <InputPicker
                        value={timestampParameter}
                        data={filterSelectParamaters(
                          activityParameter,
                          caseParameter
                        )}
                        onSelect={(v) => setTimestampParameter(v)}
                        onClean={() => setTimestampParameter("")}
                      />
                    </FormGroup>
                    <Form></Form>
                    <FormGroup>
                      <ControlLabel className="d-block">
                        Please select a discovery algorithm to apply
                      </ControlLabel>
                      <ButtonGroup className="ml-2">
                        <Button
                          appearance={
                            algorithm === "alpha_miner" ? "primary" : "ghost"
                          }
                          onClick={() => setAlgorithm("alpha_miner")}
                        >
                          Alpha Miner
                        </Button>
                        <Button
                          appearance={
                            algorithm === "inductive_miner"
                              ? "primary"
                              : "ghost"
                          }
                          onClick={() => setAlgorithm("inductive_miner")}
                        >
                          Inductive Miner
                        </Button>
                        <Button
                          appearance={
                            algorithm === "heuristics_miner"
                              ? "primary"
                              : "ghost"
                          }
                          onClick={() => setAlgorithm("heuristics_miner")}
                        >
                          Heuristics Miner
                        </Button>
                      </ButtonGroup>
                    </FormGroup>
                    {algorithm === "inductive_miner" && (
                      <FormGroup className="mt-4" controlId="parameterActivity">
                        <ControlLabel className="d-block">
                          Use process tree notation
                        </ControlLabel>
                        <Toggle
                          checked={processTree}
                          onChange={(v) => setProcessTree(v)}
                        />
                      </FormGroup>
                    )}
                    {algorithm === "heuristics_miner" && (
                      <FormGroup className="mt-4" controlId="parameterActivity">
                        <ControlLabel className="d-block">
                          Use Heuristic Net notation
                        </ControlLabel>
                        <Toggle
                          checked={heuNet}
                          onChange={(v) => setHeuNet(v)}
                        />
                      </FormGroup>
                    )}
                    <FormGroup controlId="parameterActivity">
                      <ControlLabel className="d-block">
                        Input name to save discovered model
                      </ControlLabel>

                      <FormControl
                        value={modelName}
                        onChange={(v) => setModelName(v)}
                      />
                    </FormGroup>
                    <FormGroup style={{ widows: "200px" }}>
                      <ControlLabel className="d-block"></ControlLabel>

                      <Whisper
                        placement="top"
                        trigger="hover"
                        speaker={hints.saveModel}
                        style={{ display: "inline-block" }}
                      >
                        <Icon className="mr-2" icon="question2" />
                      </Whisper>
                      <Button
                        disabled={
                          modelName &&
                          caseParameter &&
                          activityParameter &&
                          timestampParameter &&
                          algorithm
                            ? false
                            : true
                        }
                        color="green"
                        style={{ display: "inline-block" }}
                        onClick={() => {
                          setModelName("");
                          saveDiscovery();
                        }}
                      >
                        Save discovered model
                      </Button>
                    </FormGroup>
                  </Form>
                )}
                <Button
                  active={showGraph}
                  className="m-3"
                  color="blue"
                  onClick={() => getGaphvizData(modelId)}
                >
                  Display visualisation of process
                </Button>
                {(graphvizData || error) && (
                  <GraphvizAlgorithm
                    graphvizData={graphvizData}
                    error={error}
                  />
                )}
                <Button
                  active={showStatistics}
                  className="m-3"
                  color="blue"
                  onClick={() => getStatisticsData()}
                >
                  Display process statistics
                </Button>
                <Statistics
                  eventlogId={eventlogId}
                  caseValue={caseParameter}
                  activity={activityParameter}
                  timestamp={timestampParameter}
                  statisticsData={statisticsData}
                  setStatisticsData={setStatisticsData}
                  showStatistics={showStatistics}
                  statData={statData}
                  statError={statError}
                />

                <br />
                {eventlogId && (
                  <a
                    className="btn btn-primary btn-fill pull-right btn-sm"
                    href={conformanceURL()}
                    aria-disabled="true"
                  >
                    Continue to conformance checking
                  </a>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Grid>

      <Modal
        size="xs"
        backdrop={true}
        show={showModelModal}
        onHide={() => {
          setShowModelModal(false);
          cleanFields();
        }}
      >
        <Modal.Header>
          <Modal.Title>SELECT BPMN PROCESS MODEL TO UPLOAD</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form model={model} ref={modelRef}>
            <FormGroup>
              <ControlLabel className="d-block">Name</ControlLabel>
              <FormControl
                name="modelName"
                value={formModelName}
                onChange={(v) => {
                  setFormModelName(v);
                }}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel className="d-block">
                Upload BPMN 2.0 XML process model
              </ControlLabel>
              <FormControl
                accept=".bpmn"
                placeholder="Username"
                name="modelFile"
                id="uploadModel"
                type={"file"}
                onChange={handleChangeFile}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel className="d-block">Set process</ControlLabel>
              <FormControl
                accepter={InputPicker}
                name="modelProcess"
                value={formModelProcessId}
                labelKey="title"
                valueKey="id"
                data={processList}
                onSelect={(value: any) => {
                  setFormModelProcessId(value);
                }}
                onClean={() => {
                  setFormModelProcessId(undefined);
                }}
              />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => handleSubmit()}
            appearance="primary"
            color="green"
          >
            Save
          </Button>
          <Button
            onClick={() => {
              cleanFields();
              setShowModelModal(false);
            }}
            appearance="primary"
            color="blue"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
