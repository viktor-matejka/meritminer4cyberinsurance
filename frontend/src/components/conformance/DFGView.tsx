import React, { useEffect, useState } from "react";
import { Graphviz } from "graphviz-react";
import { Endpoints } from "const/endpoints";
import {
  Button,
  ButtonGroup,
  ControlLabel,
  Form,
  FormGroup,
  InputPicker,
} from "rsuite";
import { LTLChecher } from "./LTLCheker";

interface DFGViewProps {
  eventlogList: any[];
  setEventlogList: (v: any) => void;
  modelList: any[];
  getFormData: () => void;
  processId: number | undefined;
  profileId: number | undefined;
}

const initLTLChecker = {
  rule: undefined,
  activityA: undefined,
  activityB: undefined,
  activityC: undefined,
  activityD: undefined,
  // name: undefined,
  // description: undefined,
};

export const DFGView: React.FC<DFGViewProps> = (props) => {
  const {
    eventlogList,
    setEventlogList,
    modelList,
    getFormData,
    processId,
    profileId,
  } = props;

  const [modelId, setModelId] = useState();
  const [eventlog, setEventlog] = useState<any>();
  const [eventlogId, setEventlogId] = useState();
  const [paramererList, setParameterList] = useState([]);

  const [graphData, setGraphData] = useState<string>();
  const [errorGraphData, setErrorGraphData] = useState<string>();
  const [graphType, setGraphType] = useState<string>("dfg");

  const [caseParameters, setCaseParameters] = useState<string>("");
  const [activityParameters, setActivityParameters] = useState<string>("");
  const [timestampParameters, setTimestampParameters] = useState<string>("");

  const [ltlChecker, setLTLChecker] = useState<any>({ ...initLTLChecker });
  const [validLTL, setValidLTL] = useState<boolean>(false);

  const getGraph = () => {
    if (!eventlogId) {
      setErrorGraphData("First select eventlog");
      return;
    }
    // if (!modelId) {
    //   setErrorGraphData("First select model");
    //   return;
    // }
    const body: any = {
      eventlogId,
      // modelId,
      graphType,
      parameters: {
        case: caseParameters,
        activity: activityParameters,
        timestamp: timestampParameters,
      },
    };

    if (validLTL) body.ltlChecker = ltlChecker;

    fetch(Endpoints.dfg, {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => setGraphData(data["data"]))
      .catch((err) => setErrorGraphData(err));
  };

  const getParameterList = (id: number) => {
    fetch(`http://localhost:8000/api/eventlog/${id}/parameters/`)
      .then((response) => response.json())
      .then((data) => setParameterList(data["data"]))
      .catch((err) => console.error(err));
  };

  const filterParamaters = (value1: string, value2: string) => {
    const filteredParameters = paramererList.filter((v: string) => {
      return v !== value1 && v !== value2;
    });

    return filteredParameters.map((v: string) => {
      return { label: v, value: v };
    });
  };

  // useEffect(() => {
  //   if (eventlogList.length === 0) setEventlogId(undefined);
  // }, [eventlogList]);

  // useEffect(() => {
  //   if (modelList.length === 0) setEventlogId(undefined);
  // }, [modelList]);

  useEffect(() => {
    if (!eventlog) return;

    setActivityParameters(eventlog.activity);
    setCaseParameters(eventlog.case);
    setTimestampParameters(eventlog.timestamp);
  }, eventlog);

  useEffect(() => {
    if (eventlogId) {
      getParameterList(eventlogId);
      const log = eventlogList.filter((i: any) => {
        return i.id === eventlogId;
      })[0];
      setEventlog(log);
    } else {
      setParameterList([]);
      setGraphData(undefined);
      setErrorGraphData(undefined);
      setCaseParameters("");
      setActivityParameters("");
      setTimestampParameters("");
      setLTLChecker({ ...initLTLChecker });
    }
  }, [eventlogId]);

  return (
    <>
      <Form layout="inline">
        <h4>
          <span className="mr-2">Visualization</span>
          <FormGroup>
            <InputPicker
              className="mr-2"
              placeholder="Select Eventlog"
              value={eventlogId}
              valueKey="id"
              labelKey="file_name"
              data={eventlogList}
              onSelect={(value) => setEventlogId(value)}
              onClean={() => setEventlogId(undefined)}
            />
          </FormGroup>
          {/* <FormGroup>
            <InputPicker
              className="mr-2"
              placeholder={"Select Model"}
              valueKey="id"
              labelKey="name"
              value={modelId}
              data={modelList}
              onSelect={(value) => setModelId(value)}
              onClean={() => setModelId(undefined)}
            />
          </FormGroup> */}
          <FormGroup controlId="eventlog">
            <Button appearance="primary" onClick={() => getGraph()}>
              Get Visualization
            </Button>
          </FormGroup>
        </h4>
      </Form>
      <h4>Directly-Follows Graphs</h4>

      <h5>
        {" "}
        Directly-Follows graphs are graphs where the nodes represent the
        events/activities in the log and directed edges are present between
        nodes if there is at least a trace in the log where the source
        event/activity is followed by the target event/activity.{" "}
      </h5>
      <br />

      <Form id="parametersValues" layout="inline">
        <FormGroup controlId="radioList">
          <ControlLabel>Graph type</ControlLabel>
          <ButtonGroup className="ml-2">
            {/* <Button
            appearance={graphType === "pn" ? "primary" : "ghost"}
            onClick={() => setGraphType("pn")}
          >
            Preti Net
          </Button> */}
            <Button
              appearance={graphType === "dfg" ? "primary" : "ghost"}
              onClick={() => setGraphType("dfg")}
            >
              Directly-Follows Graphs
            </Button>
            <Button
              appearance={graphType === "tree" ? "primary" : "ghost"}
              onClick={() => setGraphType("tree")}
            >
              Process Tree
            </Button>
          </ButtonGroup>
        </FormGroup>
      </Form>

      {graphData && (
        <Graphviz dot={graphData} options={{ width: "100%", height: "100%" }} />
      )}
      {errorGraphData && <h5>{errorGraphData.toString()}</h5>}
      <br />
      <Form layout="inline">
        <FormGroup controlId="parameterCase">
          <ControlLabel>Case</ControlLabel>
          <InputPicker
            // block
            value={caseParameters}
            data={filterParamaters(activityParameters, timestampParameters)}
            onSelect={(v) => {
              setCaseParameters(v);
            }}
            onClean={() => {
              setCaseParameters("");
            }}
          />
        </FormGroup>

        <FormGroup controlId="parameterActivity">
          <ControlLabel>Activity</ControlLabel>
          <InputPicker
            // block
            value={activityParameters}
            data={filterParamaters(caseParameters, timestampParameters)}
            onSelect={(v) => {
              setActivityParameters(v);
            }}
            onClean={() => {
              setActivityParameters("");
            }}
          />
        </FormGroup>

        <FormGroup controlId="parameterTimestamp">
          <ControlLabel>Timestamp</ControlLabel>
          <InputPicker
            // block
            value={timestampParameters}
            data={filterParamaters(activityParameters, caseParameters)}
            onSelect={(v) => {
              setTimestampParameters(v);
            }}
            onClean={() => {
              setTimestampParameters("");
            }}
          />
        </FormGroup>
      </Form>

      {eventlogId && (
        <LTLChecher
          eventlogId={eventlogId}
          eventlogList={eventlogList}
          setEventlogList={setEventlogList}
          modelId={modelId}
          paramererList={paramererList}
          ltlChecker={ltlChecker}
          setLTLChecker={setLTLChecker}
          processId={processId}
          profileId={profileId}
          validLTL={validLTL}
          setValidLTL={setValidLTL}
          caseParameters={caseParameters}
          activityParameters={activityParameters}
          timestampParameters={activityParameters}
        />
      )}
    </>
  );
};
