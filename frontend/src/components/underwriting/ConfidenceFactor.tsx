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

interface ConfidenceFactorProps {
  coverage: any;
  confidenceFactors: any;
  setConfidenceFactors: (v: any) => void;
}

export const ConfidenceFactor: React.FC<ConfidenceFactorProps> = (props) => {
  const { coverage, confidenceFactors, setConfidenceFactors } = props;

  const { Column, HeaderCell, Cell } = Table;

  const [factorModal, setFactorModal] = useState<boolean>(false);
  const [factorDeleteModal, setFactorDeleteModal] = useState<boolean>(false);
  const [factorId, setFactorId] = useState<number>();
  const [factorName, setFactorName] = useState<string>();
  const [factorDescription, setFactorDescription] = useState<string>();
  const [factorRating, setFactorRating] = useState<number | undefined>();

  const formRef: any = React.useRef();

  const createFactor = () => {
    const body = {
      name: factorName,
      description: factorDescription,
      rating: factorRating,
      coverage_id: coverage.id,
    };
    const url = "http://127.0.0.1:8000/api/confidence-factors/";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    }).then((resp) => {
      resp.json().then((data) => {
        setFactorId(data.id);
        setConfidenceFactors((prev: any) => [...prev, data]);
        setFactorModal(false);
      });
      cleanFields();
    });
  };

  const updateFacor = () => {
    const body = {
      name: factorName,
      description: factorDescription,
      rating: factorRating,
      coverage_id: coverage.id,
    };
    const url = `http://127.0.0.1:8000/api/confidence-factors/${factorId}`;
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    }).then((resp) => {
      resp.json().then((data) => {
        setFactorId(undefined);
        setFactorModal(false);
        updateFactorList(data);
      });
      cleanFields();
    });
  };

  const deleteFactor = () => {
    const url = `http://127.0.0.1:8000/api/confidence-factors/${factorId}`;
    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((resp) => {
      resp.json().then((data) => {
        setFactorId(undefined);
        setFactorDeleteModal(false);
      });
    });
    const newFactors = confidenceFactors.filter((item: any) => {
      return item.id !== factorId;
    });
    setConfidenceFactors(newFactors);
  };

  const updateFactorList = (data: any) => {
    const newRisks = confidenceFactors.map((item: any) => {
      if (item.id === factorId) {
        return data;
      } else {
        return item;
      }
    });
    setConfidenceFactors(newRisks);
  };

  const setFactorUpdateData = (factorId: any) => {
    const factorForUpdate = confidenceFactors.find((item: any) => {
      return item.id === factorId;
    });
    setFactorName(factorForUpdate.name);
    setFactorDescription(factorForUpdate.description);
    setFactorRating(factorForUpdate.rating);
  };

  const cleanFields = () => {
    setFactorName("");
    setFactorDescription("");
    setFactorRating(undefined);
    setFactorId(undefined);
  };

  const model = Schema.Model({
    factorName: StringType().isRequired("This field is required."),
    factorRating: NumberType()
      .isRequired("This field is required.")
      .pattern(/[+-]?(0-9)*[.]?[0-9]+/, "Must be a number"),
    factorDescription: StringType().isRequired("This field is required."),
  });

  const handleSubmit = () => {
    if (!formRef.current.check()) {
      console.error("Form Error");
      return;
    }
    createFactor();
  };

  return (
    <>
      <h4>
        <span>Confidence Factor for coverage: {coverage.name}</span>
        <Button
          color="green"
          className="btn-fill pull-right"
          type="submit"
          onClick={() => {
            setFactorModal(true);
          }}
        >
          Add
        </Button>
      </h4>
      {confidenceFactors && confidenceFactors.length !== 0 && (
        <Table data={confidenceFactors} autoHeight={true} minHeight={60}>
          <Column flexGrow={1}>
            <HeaderCell>Id</HeaderCell>
            <Cell dataKey="id" />
          </Column>
          <Column flexGrow={7}>
            <HeaderCell>Name</HeaderCell>
            <Cell dataKey="name" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Rating</HeaderCell>
            <Cell dataKey="rating" />
          </Column>
          <Column flexGrow={2} fixed='right'>
            <HeaderCell>Actions</HeaderCell>
            <Cell>
              {(rowData: any) => {
                return (
                  <>
                    <Button
                      className="mr-2"
                      size="xs"
                      onClick={() => {
                        setFactorId(rowData.id);
                        setFactorModal(true);
                        setFactorUpdateData(rowData.id);
                      }}
                      color="blue"
                    >
                      Update
                    </Button>
                    <Button
                      size="xs"
                      onClick={() => {
                        setFactorId(rowData.id);
                        setFactorDeleteModal(true);
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
        show={factorModal}
        onHide={() => {
          setFactorModal(false);
          cleanFields();
        }}
      >
        <Modal.Header>
          <Modal.Title>
            {factorId && "Update"}
            {!factorId && "Create"} Confidence Factor {coverage.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form model={model} ref={formRef}>
            <Col md={12}>
              <FormGroup>
                <ControlLabel>Name</ControlLabel>
                <FormControl
                  name="factorName"
                  value={factorName}
                  onChange={(v) => {
                    setFactorName(v);
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <ControlLabel>Rating</ControlLabel>
                <FormControl
                  name="factorRating"
                  value={factorRating}
                  onChange={(v) => {
                    setFactorRating(v);
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <ControlLabel>Description</ControlLabel>
                <FormControl
                  name="factorDescription"
                  value={factorDescription}
                  onChange={(v) => {
                    setFactorDescription(v);
                  }}
                />
              </FormGroup>
            </Col>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {factorId && (
            <Button
              color="green"
              appearance="primary"
              onClick={() => {
                updateFacor();
                setFactorModal(false);
              }}
            >
              Update
            </Button>
          )}
          {!factorId && (
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
              setFactorModal(false);
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
        show={factorDeleteModal}
        onHide={() => setFactorDeleteModal(false)}
      >
        <Modal.Header>
          <Modal.Title>Delete Confidence Factor</Modal.Title>
        </Modal.Header>
        <Modal.Body>Delete Confidence Factor #{factorId}</Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => deleteFactor()}
            appearance="primary"
            color="red"
          >
            Delete
          </Button>
          <Button
            onClick={() => setFactorDeleteModal(false)}
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
