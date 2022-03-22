import React, { useState } from "react";
import { StringType } from 'schema-typed';

import {
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Col,
  Table,
  Modal,
  Schema
} from "rsuite";

interface CoverageProps {
  policy: any;
  coverages: any;
  setCoverages: (v: any) => void;
}

export const Coverage: React.FC<CoverageProps> = (props) => {
  const { policy, coverages, setCoverages } = props;

  const { Column, HeaderCell, Cell } = Table;

  const [coverageModal, setCoverageModal] = useState<boolean>();
  const [coverageDeleteModal, setCoverageDeleteModal] =
    useState<boolean>(false);

  const [coverageId, setCoverageId] = useState<number>();
  const [coverageName, setCoverageName] = useState<string>();
  const [coverageDescription, setCoverageDescription] = useState<string>();

  const formRef: any = React.useRef();


  const createCoverage = () => {
    const body = {
      name: coverageName,
      description: coverageDescription,
      policy_id: policy.id,
    };
    const url = "http://127.0.0.1:8000/api/coverages/";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    }).then((resp) => {
      resp.json().then((data) => {
        setCoverageId(data.id);
        setCoverages((prev: any) => [...prev, data]);
        setCoverageModal(false);
      });
      cleanFields();
    });
  };

  const updateCoverage = () => {
    const body = {
      name: coverageName,
      description: coverageDescription,
      policy_id: policy.id,
    };
    const url = `http://127.0.0.1:8000/api/coverage/${coverageId}`;
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    }).then((resp) => {
      resp.json().then((data) => {
        setCoverageId(undefined);
        setCoverageModal(false);
        updateCoverageList(data);
      });
      cleanFields();
    });
  };

  const deleteCoverage = () => {
    const url = `http://127.0.0.1:8000/api/coverage/${coverageId}`;
    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((resp) => {
      resp.json().then((data) => {
        setCoverageId(undefined);
        setCoverageDeleteModal(false);
      });
    });
    const newPolicies = coverages.filter((item: any) => {
      return item.id !== coverageId;
    });
    setCoverages(newPolicies);
  };

  const updateCoverageList = (data: any) => {
    const newRisks = coverages.map((item: any) => {
      if (item.id === coverageId) {
        return data;
      } else {
        return item;
      }
    });
    setCoverages(newRisks);
  };

  const setCoverageUpdateData = (coverageId: any) => {
    const coverageForUpdate = coverages.find((item: any) => {
      return item.id === coverageId;
    });
    setCoverageName(coverageForUpdate.name);
    setCoverageDescription(coverageForUpdate.description);
  };

  const cleanFields = () => {
    setCoverageName("");
    setCoverageDescription("");
    setCoverageId(undefined);
  };

  const model = Schema.Model({
    coverageName: StringType().isRequired('This field is required.'),
    coverageDescription: StringType().isRequired('This field is required.')
  });

  const handleSubmit = () => {
    if (!formRef.current.check()) {
      console.error('Form Error');
      return;
    }
    createCoverage()
  };

  return (
    <>
      <h4>
        <span>Coverage elements for selected policy: {policy.name}</span>
        <Button
          color="green"
          className="btn-fill pull-right"
          type="submit"
          onClick={() => {
            setCoverageModal(true);
          }}
        >
          Add
        </Button>
      </h4>
      {coverages && coverages.length !== 0 && (
        <Table data={coverages} autoHeight={true} minHeight={60}>
          <Column flexGrow={1}>
            <HeaderCell>Id</HeaderCell>
            <Cell dataKey="id" />
          </Column>
          <Column flexGrow={7}>
            <HeaderCell>Coverage Name</HeaderCell>
            <Cell dataKey="name" />
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Policy ID</HeaderCell>
            <Cell dataKey="policy_id" />
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
                        setCoverageId(rowData.id);
                        setCoverageModal(true);
                        setCoverageUpdateData(rowData.id);
                      }}
                      color="blue"
                    >
                      Update
                    </Button>
                    <Button
                      size="xs"
                      onClick={() => {
                        setCoverageId(rowData.id);
                        setCoverageDeleteModal(true);
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
        show={coverageModal}
        onHide={() => {
          setCoverageModal(false);
          cleanFields();
        }}
      >
        <Modal.Header>
          <Modal.Title>
            {coverageId && "Update"}
            {!coverageId && "Create"} Coverage {policy.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form 
          model={model}
          ref={formRef}
          >
            <Col md={12}>
              <FormGroup>
                <ControlLabel>Name</ControlLabel>
                <FormControl
                  name="coverageName"
                  value={coverageName}
                  onChange={(v) => {
                    setCoverageName(v);
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <ControlLabel>Description</ControlLabel>
                <FormControl
                  name="coverageDescription"
                  value={coverageDescription}
                  onChange={(v) => {
                    setCoverageDescription(v);
                  }}
                />
              </FormGroup>
            </Col>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {coverageId && (
            <Button
              color="green"
              appearance="primary"
              onClick={() => {
                setCoverageModal(false);
                updateCoverage();
              }}
            >
              Update
            </Button>
          )}
          {!coverageId && (
            <Button
              type="submit"
              onClick={() => handleSubmit()}
              appearance="primary"
              color="green"
            >
              Save
            </Button>
          )}
          <Button
            onClick={() => {
              setCoverageModal(false);
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
        show={coverageDeleteModal}
        onHide={() => setCoverageDeleteModal(false)}
      >
        <Modal.Header>
          <Modal.Title>Delete Coverage</Modal.Title>
        </Modal.Header>
        <Modal.Body>Delete Coverage #{coverageId}</Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => deleteCoverage()}
            appearance="primary"
            color="red"
          >
            Delete
          </Button>
          <Button
            onClick={() => setCoverageDeleteModal(false)}
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
