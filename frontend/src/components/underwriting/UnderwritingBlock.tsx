import React, { useEffect, useState } from "react";
import { StringType, NumberType } from "schema-typed";

import {
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Col,
  Schema,
  InputPicker,
  SelectPicker,
  Row,
} from "rsuite";
import { Endpoints } from "const/endpoints";

interface UnderwritingBlockProps {
  underwritingId: number | undefined;
  setUnderwritingId: (v: number) => void;
  underwritingsList: any;
  setUnderwritingsList: (v: any) => void;
}

export const UnderwritingBlock: React.FC<UnderwritingBlockProps> = (props) => {
  const {
    underwritingId,
    setUnderwritingId,
    underwritingsList,
    setUnderwritingsList,
  } = props;

  const [assessmentName, setAssessmentName] = useState<string>();
  const [eventlogList, setEventlogList] = useState<any>([]);
  const [eventlogId, setEventlogId] = useState<number>();
  const [profileList, setProfileList] = useState<any>([]);
  const [profileId, setProfileId] = useState<number>();

  const getProfiles = () => {
    fetch(Endpoints.profile)
      .then((response) => response.json())
      .then((data) => setProfileList(data))
      .catch((err) => console.error(err));
  };

  const getEventlogs = (profileId: number) => {
    const url = new URL(Endpoints.eventlog);
    const params = new URLSearchParams();
    params.append("profileId", profileId.toString());
    url.search = params.toString();

    fetch(url.href)
      .then((response) => response.json())
      .then((data) => {
        setEventlogList(data);
      });
  };

  const createUnderwriting = () => {
    const body = {
      assessmentName,
      profileId,
      eventlogId,
    };

    const url = underwritingId
      ? Endpoints.underwritings + underwritingId
      : Endpoints.underwritings;
    fetch(url, {
      method: underwritingId ? "PUT" : "POST",
      body: JSON.stringify(body),
    }).then((resp) => {
      resp.json().then((data: any) => {
        if (underwritingId) {
          const underwritings = underwritingsList.map((item: any) => {
            if (item.id === underwritingId) {
              return data;
            } else {
              return item;
            }
          });
          setUnderwritingsList(underwritings);
        } else {
          setUnderwritingId(data["id"]);
          setUnderwritingsList([...underwritingsList, data]);
        }
      });
    });
  };

  useEffect(() => {
    if (profileId) {
      getEventlogs(profileId);
    } else {
      setEventlogList([]);
    }
  }, [profileId]);

  useEffect(() => {
    if (underwritingId) {
      const underwriting = underwritingsList.filter((i: any) => {
        return i.id === underwritingId;
      })[0];
      if (underwriting) {
        setProfileId(underwriting["profileId"]);
        setAssessmentName(underwriting["assessmentName"]);
        setEventlogId(underwriting["eventlogId"]);
      }
    } else {
      setProfileId(undefined);
      setAssessmentName(undefined);
      setEventlogId(undefined);
    }
  }, [underwritingId, underwritingsList]);

  useEffect(() => {
    getProfiles();
  }, []);

  return (
    <>
      <h4>
        <span>Create a new risk assessment from process mining analysis</span>
        <Button
          color="cyan"
          className="btn-fill pull-right"
          // className="d-flex justify-content-right"
          onClick={() => createUnderwriting()}
        >
          {!underwritingId && "Save assessment"}
          {underwritingId && "Update assessment"}
        </Button>
      </h4>
      <Form>
        <Row>
          <Col sm={8}>
            <FormGroup>
              <ControlLabel>Prospective insured</ControlLabel>
              <FormControl
                accepter={InputPicker}
                data={profileList}
                labelKey="companyName"
                valueKey="id"
                name="customerName"
                value={profileId}
                onSelect={(v: number) => setProfileId(v)}
                onClean={() => setProfileId(undefined)}
              />
            </FormGroup>
          </Col>
          <Col sm={8}>
            <FormGroup>
              <ControlLabel>Cyber Risk Assessment</ControlLabel>
              <FormControl
                style={{ width: "inherit" }}
                name="assessmentName"
                value={assessmentName}
                onChange={(v) => setAssessmentName(v)}
              />
            </FormGroup>
          </Col>
          <Col sm={8}>
            <FormGroup>
              <ControlLabel>Considered event log</ControlLabel>
              <FormControl
                accepter={InputPicker}
                name="eventlogList"
                valueKey="id"
                labelKey="file_name"
                value={eventlogId}
                data={eventlogList}
                onSelect={(v: number) => setEventlogId(v)}
                onClean={() => setEventlogId(undefined)}
              />
            </FormGroup>
          </Col>
        </Row>
      </Form>
    </>
  );
};
