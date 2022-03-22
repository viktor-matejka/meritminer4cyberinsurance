import React, { useEffect, useState } from "react";
import { StringType } from "schema-typed";

import {
  Row,
  Button,
  Form,
  FormGroup,
  Col,
  Grid,
  Table,
  InputPicker,
  ControlLabel,
  FormControl,
  Modal,
  Checkbox,
  Icon,
  Whisper,
  Tooltip,
  Schema,
} from "rsuite";
import Card from "react-bootstrap/Card";
import { toast } from "react-toastify";
import { Endpoints } from "const/endpoints";

export const Eventlog = () => {
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [eventlogList, setEventlogList] = useState<any>([]);
  const [fileData, setFileData] = useState<any>();
  const [fileHead, setFileHead] = useState<any>();
  const [fileId, setFileId] = useState<Number>(0);
  const [fileProcessId, setFileProcessId] = useState<Number>(0);
  const [fileDataInfo, setFfileDataInfo] = useState<any>();
  const [selectParameters, setSelectParameters] = useState<any>();
  const [caseParameters, setCaseParameters] = useState<string>("");
  const [activityParameters, setActivityParameters] = useState<string>("");
  const [timestampParameters, setTimestampParameters] = useState<string>("");
  const [profileList, setProfileList] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState<any>();
  const [profileId, setProfileId] = useState<number>();

  const [processList, setProcessList] = useState<any>([]);
  const [processId, setProcessId] = useState<number>();
  const [processName, setProcessName] = useState<string>();
  const [processDescription, setProcessDescription] = useState<string>();
  const [toogelCreateProcess, setToogleCreateProcess] =
    useState<boolean>(false);

  const processFormRef: any = React.useRef();

  const model = Schema.Model({
    processName: StringType().isRequired("This field is required."),
  });

  const { Column, HeaderCell, Cell } = Table;

  function handleChangeFile(value: string, event: any) {
    setFileSelected(event.target.files[0]);
  }

  function uploadEventlog() {
    if (!fileSelected) return;
    if (!processId) return;
    if (!profileId) return;

    const form_data = new FormData();
    form_data.append("file", fileSelected);
    form_data.append("processId", processId.toString());
    form_data.append("profileId", profileId.toString());

    fetch(Endpoints.eventlog, {
      method: "POST",
      body: form_data,
    })
      .then((response) => response.json())
      .then((data) => setEventlogList([...eventlogList, { ...data }]))
      .catch((err) => console.error(err));

    setProcessId(undefined);
  }

  const updatefileList = (processId: number) => {
    if (!profileId) return;

    const url = new URL(Endpoints.eventlog);
    let params = new URLSearchParams();
    params.set("profileId", profileId.toString());
    url.search = params.toString();

    fetch(url.href)
      .then((response) => {
        response.json().then((data) => {
          setEventlogList(data);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getFileView = (id: number) => {
    setFileId(id);
    fetch(Endpoints.eventlog + id + "/view/")
      .then((response) => {
        response.json().then((data) => {
          const parsed = JSON.parse(data["data"]);
          setFileData(parsed);
          const headTeableList = Object.keys(parsed[0]);
          setFileHead(headTeableList);
          const allParameterValues = headTeableList.map((v) => ({
            label: v,
            value: v,
          }));
          setSelectParameters(allParameterValues);

          const parameters = data["parameters"];
          setCaseParameters(parameters["case"]);
          setActivityParameters(parameters["activity"]);
          setTimestampParameters(parameters["timestamp"]);
        });
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const getDeleteView = (id: number) => {
    fetch(Endpoints.eventlog + id + "/", { method: "DELETE" })
      .then((response) => {
        response.json().then((data) => {
          const logAfterDel = filterEvenlogsAfterDelte(data);
          setEventlogList(logAfterDel);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const updateParams = () => {
    if (!fileId) return;

    const body = {
      case: caseParameters,
      activity: activityParameters,
      timestamp: timestampParameters,
    };

    fetch(Endpoints.eventlog + fileId + "/", {
      method: "PUT",
      body: JSON.stringify(body),
    })
      .then((response) => {
        response.json().then((data) => {
          if (data["success"]) {
            toast.success(data["message"]);
          } else {
            toast.error(data["message"]);
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

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

  const createProcessNaming = () => {
    const body = {
      title: processName,
      description: processDescription,
      profileId,
    };

    fetch(Endpoints.process, {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProcessList([...processList, data]);
        setProcessId(data.Id);
      });

    setProcessName(undefined);
    setProcessDescription(undefined);
    setToogleCreateProcess(false);
  };

  const getProcessNaming = (profileId: number) => {
    const url = new URL(Endpoints.process);
    const params = new URLSearchParams();
    params.append("profileId", profileId.toString());
    url.search = params.toString();

    fetch(url.href)
      .then((response) => response.json())
      .then((data) => setProcessList(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (profileId) {
      getProcessNaming(profileId);
    } else {
      return;
    }
    if (!processId) return;

    const url = new URL("http://127.0.0.1:3001/user/discovery");
    let params = new URLSearchParams();
    params.set("eventlogId", fileId.toString());
    params.set("profileId", profileId.toString());
    url.search = params.toString();

  }, [profileId, fileId, processId]);

  useEffect(() => {
    const fileInfo = eventlogList.filter((el: any) => {
      return el.id === fileId;
    });
    setFfileDataInfo(fileInfo[0]);
  }, [fileId, eventlogList]);

  const filterSelectParamaters = (value1: string, value2: string) => {
    return selectParameters.filter((item: any) => {
      return item["value"] !== value1 && item["value"] !== value2;
    });
  };

  useEffect(() => {
    if (profileId) {
      updatefileList(profileId);
      const selected = profileList.filter((item: any) => {
        return item.id === profileId;
      });
      setSelectedProfile(selected[0]);
    } else {
      setEventlogList([]);
    }
  }, [profileId, profileList]);

  useEffect(() => {
    getProfiles();
  }, []);

  const cleanFields = () => {
    setProcessName("");
    setProcessDescription("");
  };

  const handleSubmit = () => {
    if (!processFormRef.current.check()) {
      console.error("Form Error");
      console.error();
      return;
    }
    createProcessNaming();
  };

  const filterEvenlogsAfterDelte = (data: any) => {
    return data.filter((item: any) => {
      return item.profileId === profileId;
    });
  };
  const hints = {
    createProcess: <Tooltip>Create process</Tooltip>,
    uploadFile: <Tooltip>Required file and select process</Tooltip>,
    saveParameters: <Tooltip>Save selected parameters for eventlog</Tooltip>,
  };

  return (
    <Grid fluid>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Form layout="inline">
                <FormGroup>
                  <ControlLabel>Profile</ControlLabel>
                  <InputPicker
                    valueKey={"id"}
                    labelKey={"companyName"}
                    value={profileId}
                    data={profileList}
                    onSelect={(v) => {
                      setSelectParameters(undefined);
                      setProfileId(v);
                    }}
                    onClean={() => {
                      setProfileId(undefined);
                      setFileData(undefined);
                      setFileHead(undefined);
                      setSelectParameters(undefined);
                    }}
                  />
                </FormGroup>
                {profileId && (
                  <FormGroup>
                    <Whisper
                      placement="top"
                      trigger="hover"
                      speaker={hints.createProcess}
                    >
                      <Icon className="mr-2" icon="question2" />
                    </Whisper>
                    <Button
                      color="green"
                      onClick={() => {
                        setToogleCreateProcess(true);
                      }}
                    >
                      New Process
                    </Button>
                  </FormGroup>
                )}
              </Form>
              <h4>Upload event log with process data in XES format. For more information about the format, please refer to the IEEE XES Website. Also, it is recommended to use the default column naming as in the following <a href='https://pm4py.fit.fraunhofer.de/static/assets/examples/running-example.xes'>example</a> </h4>
              {profileId && (
                <Form id="formEventlog">
                  <Row>
                    <Col md={10}>
                      <FormGroup>
                        <ControlLabel>File</ControlLabel>
                        <FormControl
                          accept=".xes,.csv,.bpmn"
                          placeholder="Username"
                          name="uploadEventlog"
                          id="uploadEventlog"
                          type={"file"}
                          onChange={handleChangeFile}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={10}>
                      <FormGroup>
                        <ControlLabel>Process</ControlLabel>
                        <InputPicker
                          valueKey={"id"}
                          labelKey={"title"}
                          value={processId}
                          data={processList}
                          onSelect={(v) => {
                            setProcessId(v);
                          }}
                          onClean={() => {
                            setProcessId(undefined);
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={4}>
                      <FormGroup className="d-flex justify-content-center">
                        <Whisper
                          placement="top"
                          trigger="hover"
                          speaker={hints.uploadFile}
                        >
                          <Icon className="mt-4 mr-2 " icon="question2" />
                        </Whisper>
                        <Button
                          color="green"
                          className="btn-fill pull-right mt-3"
                          type="submit"
                          onClick={uploadEventlog}
                        >
                          Upload
                        </Button>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              )}
              {!profileId && <h5>Before uploading the first event log, please select an insured profile, or create a new one in the profile tab.</h5>}
              <hr />
              {processList.length !== 0 && eventlogList.length !== 0 && (
                <>
                  <h4>Uploaded files for {selectedProfile?.companyName}</h4>
                  <Table data={eventlogList} autoHeight={true}>
                    <Column align="center" flexGrow={1} fixed={"left"}>
                      <HeaderCell>Id</HeaderCell>
                      <Cell dataKey="id" />
                    </Column>
                    <Column flexGrow={4} fixed={"left"}>
                      <HeaderCell>File name</HeaderCell>
                      <Cell dataKey="file_name" />
                    </Column>
                    <Column flexGrow={3}>
                      <HeaderCell>Process name</HeaderCell>
                      <Cell dataKey="processId">
                        {(rowData: any) => {
                          const processes = processList.filter((item: any) => {
                            return item.id === rowData.processId;
                          });
                          if (processes[0])
                            return <span>{processes[0].title}</span>;
                        }}
                      </Cell>
                    </Column>
                    <Column flexGrow={2}>
                      <HeaderCell>Uploaded</HeaderCell>
                      <Cell dataKey="isUploaded">
                        {(rowData: any) => {
                          return (
                            <Checkbox
                              disabled
                              inline
                              checked={rowData.isUploaded}
                            />
                          );
                        }}
                      </Cell>
                    </Column>
                    <Column flexGrow={2}>
                      <HeaderCell>Date</HeaderCell>
                      <Cell dataKey="createdAt" />
                    </Column>
                    <Column flexGrow={2} fixed="right">
                      <HeaderCell>Action</HeaderCell>
                      <Cell>
                        {(rowData: any) => {
                          return (
                            <>
                              <Button
                                className="mr-2"
                                size="xs"
                                onClick={() => {
                                  setFileProcessId(rowData.processId);
                                  getFileView(rowData.id);
                                }}
                                color="blue"
                              >
                                View
                              </Button>
                              <Button
                                size="xs"
                                onClick={() => getDeleteView(rowData.id)}
                                color="red"
                              >
                                Delete
                              </Button>
                            </>
                          );
                        }}
                      </Cell>
                    </Column>
                  </Table>
                </>
              )}
              {fileDataInfo && (
                <>
                  <hr />
                  <h4>{fileDataInfo["title"]}</h4>
                </>
              )}
              {fileData && fileHead && (
                <>
                  {selectParameters && (
                    <>
                      <Form id="parametersValues" layout="inline">
                        <Row>
                          <Col md={7}>
                            <FormGroup controlId="parameterCase">
                              <ControlLabel>Case</ControlLabel>
                              <InputPicker
                                block
                                value={caseParameters}
                                data={filterSelectParamaters(
                                  activityParameters,
                                  timestampParameters
                                )}
                                onSelect={(v) => {
                                  setCaseParameters(v);
                                }}
                                onClean={() => {
                                  setCaseParameters("");
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={7}>
                            <FormGroup controlId="parameterActivity">
                              <ControlLabel>Activity</ControlLabel>
                              <InputPicker
                                block
                                value={activityParameters}
                                data={filterSelectParamaters(
                                  caseParameters,
                                  timestampParameters
                                )}
                                onSelect={(v) => {
                                  setActivityParameters(v);
                                }}
                                onClean={() => {
                                  setActivityParameters("");
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={7}>
                            <FormGroup controlId="parameterTimestamp">
                              <ControlLabel>Timestamp</ControlLabel>
                              <InputPicker
                                block
                                value={timestampParameters}
                                data={filterSelectParamaters(
                                  activityParameters,
                                  caseParameters
                                )}
                                onSelect={(v) => {
                                  setTimestampParameters(v);
                                }}
                                onClean={() => {
                                  setTimestampParameters("");
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <ControlLabel></ControlLabel>
                              <Whisper
                                placement="top"
                                trigger="hover"
                                speaker={hints.saveParameters}
                              >
                                <Icon className="mt-5 mr-2" icon="question2" />
                              </Whisper>
                              <Button
                                className="btn-fill pull-right mt-4"
                                color="green"
                                onClick={() => {
                                  setProcessId(undefined);
                                  updateParams();
                                }}
                              >
                                Save
                              </Button>
                            </FormGroup>
                          </Col>
                        </Row>
                      </Form>

                      <Table data={fileData}>
                        {fileHead.map((name: string) => {
                          return (
                            <Column key={name}>
                              <HeaderCell>{name}</HeaderCell>
                              <Cell dataKey={name} />
                            </Column>
                          );
                        })}
                      </Table>
                    </>
                  )}
                  <br />
                  <a
                    className="btn btn-primary btn-fill pull-right"
                    href={
                      "http://127.0.0.1:3001/user/discovery/?profileId=" +
                      profileId +
                      "&eventlogId=" +
                      fileId +
                      "&processId=" +
                      fileProcessId
                    }
                    aria-disabled="true"
                  >
                    Next to Process Discovery
                  </a>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal
        size="xs"
        backdrop={true}
        show={toogelCreateProcess}
        onHide={() => {
          cleanFields();
          setToogleCreateProcess(false);
        }}
      >
        <Modal.Header>
          <Modal.Title>Create new process name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form model={model} ref={processFormRef} layout="inline">
            <FormGroup>
              <ControlLabel>Process name</ControlLabel>
              <FormControl
                placeholder="Process Name"
                name="processName"
                value={processName}
                onChange={(value) => setProcessName(value)}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl
                placeholder="Process Description"
                name="processDescription"
                value={processDescription}
                onChange={(value) => setProcessDescription(value)}
              />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => handleSubmit()} color="green">
            Create
          </Button>
          <Button
            onClick={() => {
              cleanFields();
              setToogleCreateProcess(false);
            }}
            appearance="primary"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Grid>
  );
};
