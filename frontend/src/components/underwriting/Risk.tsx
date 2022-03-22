import React, { useState } from "react";
import { StringType, NumberType } from "schema-typed";

import {
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Col,
  Table,
  Modal,
  Schema,
} from "rsuite";

interface RiskProps {
  policy: any;
  risks: any;
  setRisks: (v: any) => void;
}

export const Risk: React.FC<RiskProps> = (props) => {
  const { policy, risks, setRisks } = props;

  const { Column, HeaderCell, Cell } = Table;

  const [riskModal, setRiskModal] = useState<boolean>(false);
  const [riskDeleteModal, setRiskDeleteModal] = useState<boolean>(false);

  const [riskId, setRiskId] = useState<string>();
  const [riskName, setRiskName] = useState<string>();
  const [riskRating, setRiskRating] = useState<number | undefined>(undefined);

  const formRef: any = React.useRef();

  const model = Schema.Model({
    riskName: StringType().isRequired("This field is required."),
    riskRating: NumberType()
      .isRequired("This field is required.")
      .pattern(/[+-]?(0-9)*[.]?[0-9]+/, "Must be a number"),
  });

  const createRisk = () => {
    const body = { name: riskName, rating: riskRating, policy_id: policy.id };
    const url = "http://127.0.0.1:8000/api/risks/";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    }).then((resp) => {
      resp.json().then((data) => {
        setRiskId(data.id);
        setRisks((prev: any) => [...prev, data]);
        setRiskModal(false);
      });
      cleanFields();
    });
  };

  const updateRisk = () => {
    const body = {
      name: riskName,
      rating: riskRating,
      policy_id: policy.id,
    };
    const url = `http://127.0.0.1:8000/api/risks/${riskId}`;
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    }).then((resp) => {
      resp.json().then((data) => {
        setRiskId(undefined);
        setRiskModal(false);
        updateRiskList(data);
      });
      cleanFields();
    });
  };

  const deleteRisk = () => {
    const url = `http://127.0.0.1:8000/api/risks/${riskId}`;
    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((resp) => {
      resp.json().then((data) => {
        setRiskId(undefined);
        setRiskDeleteModal(false);
      });
    });
    const newPolicies = risks.filter((item: any) => {
      return item.id !== riskId;
    });
    setRisks(newPolicies);
  };

  const updateRiskList = (data: any) => {
    const newRisks = risks.map((item: any) => {
      if (item.id === riskId) {
        return data;
      } else {
        return item;
      }
    });
    setRisks(newRisks);
  };

  const setRiskUpdateData = (riskId: any) => {
    const riskForUpdate = risks.find((item: any) => {
      return item.id === riskId;
    });
    setRiskName(riskForUpdate.name);
    setRiskRating(riskForUpdate.rating);
  };

  const cleanFields = () => {
    setRiskName("");
    setRiskRating(undefined);
    setRiskId(undefined);
  };

  const handleSubmit = () => {
    if (!formRef.current.check()) {
      console.error("Form Error");
      console.error();
      return;
    }
    createRisk();
  };

  return (
    <>
      <h4>
        <span>Enterprise-level confidence factors for the: {policy.name}</span>
        <Button
          color="green"
          className="btn-fill pull-right"
          type="submit"
          onClick={() => {
            setRiskId(undefined);
            setRiskModal(true);
          }}
        >
          Add
        </Button>
      </h4>
      {risks && risks.length !== 0 && (
        <Table data={risks} autoHeight={true} minHeight={60}>
          <Column flexGrow={1}>
            <HeaderCell>Id</HeaderCell>
            <Cell dataKey="id" />
          </Column>
          <Column flexGrow={7}>
            <HeaderCell>Risk Name</HeaderCell>
            <Cell dataKey="name" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Rating</HeaderCell>
            <Cell dataKey="rating" />
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
                        setRiskId(rowData.id);
                        setRiskModal(true);
                        setRiskUpdateData(rowData.id);
                      }}
                      color="blue"
                    >
                      Update
                    </Button>
                    <Button
                      size="xs"
                      onClick={() => {
                        setRiskId(rowData.id);
                        setRiskDeleteModal(true);
                      }}
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
      )}
      <Modal
        size="md"
        backdrop={true}
        show={riskModal}
        onHide={() => {
          setRiskModal(false);
          cleanFields();
        }}
      >
        <Modal.Header>
          <Modal.Title>
            {riskId && "Update"}
            {!riskId && "Create"} Enterprise-level confidence factors {policy.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form model={model} ref={formRef}>
            <Col md={12}>
              <FormGroup>
                <ControlLabel>Name</ControlLabel>
                <FormControl
                  name="riskName"
                  value={riskName}
                  onChange={(v) => {
                    setRiskName(v);
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <ControlLabel>Rating</ControlLabel>
                <FormControl
                  name="riskRating"
                  value={riskRating}
                  onChange={(v) => {
                    setRiskRating(v);
                  }}
                />
              </FormGroup>
            </Col>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {riskId && (
            <Button
              onClick={() => updateRisk()}
              appearance="primary"
              color="green"
            >
              Update
            </Button>
          )}
          {!riskId && (
            <Button
              onClick={() => handleSubmit()}
              appearance="primary"
              color="green"
            >
              Save
            </Button>
          )}
          <Button
            onClick={() => {
              setRiskModal(false);
              cleanFields();
            }}
            appearance="primary"
            color="red"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        size="md"
        backdrop={true}
        show={riskDeleteModal}
        onHide={() => setRiskDeleteModal(false)}
      >
        <Modal.Header>
          <Modal.Title>Delete Enterprise-level confidence factors</Modal.Title>
        </Modal.Header>
        <Modal.Body>Delete Enterprise-level confidence factors #{riskId}</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => deleteRisk()} appearance="primary" color="red">
            Delete
          </Button>
          <Button
            onClick={() => setRiskDeleteModal(false)}
            appearance="primary"
            color="green"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
