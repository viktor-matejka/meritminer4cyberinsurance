import React, { useEffect, useState } from "react";
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
  Schema
} from "rsuite";
import { Risk } from "components/underwriting/Risk";
import { Coverage } from "components/underwriting/Coverage";
import { ConfidenceFactor } from "components/underwriting/ConfidenceFactor";
import { Endpoints } from "const/endpoints";

interface PolicyProps {
  policies: any[];
  setPolicies: (v: any) => void;
  underwritingId: number | undefined;
}

export const Policy: React.FC<PolicyProps> = (props) => {
  const { policies, setPolicies, underwritingId } = props;

  const { Column, HeaderCell, Cell } = Table;

  const [polisModal, setPolisyModal] = useState<boolean>(false);
  const [polisDeleteModal, setPolisyDeleteModal] = useState<boolean>(false);
  const [polisyId, setPolisyId] = useState<string>();
  const [polisyName, setPolisyName] = useState<string>();
  const [polisyInsurerName, setPolisyInsurerName] = useState<string>();
  const [polisyInsurerId, setPolisyInsurerId] = useState<number>();
  const [polisyDescription, setPolisyDescription] = useState<string>();
  const [risks, setRisks] = useState<any[]>([]);
  const [coverages, setCoverages] = useState<any[]>([]);
  const [confidenceFactors, setConfidenceFactors] = useState<any[]>([]);

  const formRef: any = React.useRef();

  const model = Schema.Model({
    polisyName: StringType().isRequired('This field is required.'),
    polisyDescription: StringType().isRequired('This field is required.'),
    polisyInsurerName: StringType().isRequired('This field is required.'),
    polisyInsurerId: NumberType()
    .isRequired("This field is required.")
    .isInteger('It can only be an integer')
  });

  const createPolicy = () => {
    const body = {
      name: polisyName,
      insurer_name: polisyInsurerName,
      inssurer_id: polisyInsurerId,
      description: polisyDescription,
      underwriting_id: underwritingId,
    };

    fetch(Endpoints.policies, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((resp) => {
        resp.json().then((data) => {
          setPolisyId(undefined);
          setPolicies([...policies, data]);
        });
      })
      .catch((err) => {
        console.error(err);
      });
    setPolisyModal(false);
    cleanFields();
  };

  const updatePolicy = () => {
    const body = {
      name: polisyName,
      insurer_name: polisyInsurerName,
      inssurer_id: polisyInsurerId,
      description: polisyDescription,
      underwriting_id: underwritingId,
    };
    fetch(Endpoints.policies + polisyId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    }).then((resp) => {
      resp.json().then((data) => {
        setPolisyId(undefined);
        setPolisyModal(false);
        updatePolicyList(data);
      });
    });
    cleanFields();
  };

  const deletePolicy = () => {
    fetch(Endpoints.policies + polisyId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((resp) => {
      resp.json().then((data) => {
        setPolisyId(undefined);
        setPolisyDeleteModal(false);
      });
    });
    const newPolicies = policies.filter((item: any) => {
      return item.id !== polisyId;
    });
    setPolicies(newPolicies);
  };

  const getPolicies = (id: number) => {
    const url = new URL(Endpoints.policies)
    const params = new URLSearchParams()
    params.append('underwritingId', id.toString())
    url.search = params.toString()

    fetch(url.href)
      .then((response) => response.json())
      .then((data) => {
        setPolicies(data);
      });
  };

  const getRisks = () => {
    const id_list = policies.map((item: any) => {
      return item.id;
    });

    const userUrl = `http://127.0.0.1:8000/api/risks/?policyId=${id_list}`;
    fetch(userUrl)
      .then((response) => response.json())
      .then((data) => {
        setRisks(data);
      });
  };

  const getCoverages = () => {
    const id_list = policies.map((item: any) => {
      return item.id;
    });
    const userUrl = `http://127.0.0.1:8000/api/coverages/?policyId=${id_list}`;
    fetch(userUrl)
      .then((response) => response.json())
      .then((data) => {
        setCoverages(data);
      });
  };

  const getConfidenceFactors = () => {
    const id_list = coverages.map((item: any) => {
      return item.id;
    });
    const userUrl = `http://127.0.0.1:8000/api/confidence-factors/?coverageId=${id_list}`;
    fetch(userUrl)
      .then((response) => response.json())
      .then((data) => {
        setConfidenceFactors(data);
      });
  };

  useEffect(() => {
    if (policies.length === 0) {
      setPolisyId(undefined);
      setRisks([]);
      setCoverages([]);
      setConfidenceFactors([]);
    }
    getRisks();
    getCoverages();
    getConfidenceFactors();
  }, [policies]);

  useEffect(() => {
    if (underwritingId) getPolicies(underwritingId);
  }, [underwritingId]);


  const setPolicyUpdateData = (policyId: any) => {
    const policyForUpdate = policies.find((item) => {
      return item.id === policyId;
    });
    setPolisyName(policyForUpdate.name);
    setPolisyDescription(policyForUpdate.description);
    setPolisyInsurerName(policyForUpdate.insurer_name);
    setPolisyInsurerId(policyForUpdate.inssurer_id);
  };
  const cleanFields = () => {
    setPolisyName("");
    setPolisyDescription("");
    setPolisyInsurerName("");
    setPolisyInsurerId(undefined);
  };
  const updatePolicyList = (data: any) => {
    const newPolicies = policies.map((item: any) => {
      if (item.id === polisyId) {
        return data;
      } else {
        return item;
      }
    });
    setPolicies(newPolicies);
  };
  const handleSubmit = () => {
    if (!formRef.current.check()) {
      console.error("Form Error");
      console.error();
      return;
    }
        createPolicy();
    };
    
  return (
    <div>
      <h4>
        <span>Cyber Insurance Policy</span>
        <Button
          disabled={underwritingId ? false : true}
          color="green"
          className="btn-fill pull-right"
          type="submit"
          onClick={() => {
            setPolisyId(undefined);
            setPolisyModal(true);
          }}
        >
          Add
        </Button>
      </h4>
      {policies && policies.length !== 0 && (
        <Table data={policies} autoHeight={true} minHeight={100}>
          <Column flexGrow={1}>
            <HeaderCell>ID</HeaderCell>
            <Cell dataKey="id" />
          </Column>
          <Column flexGrow={4}>
            <HeaderCell>Policy Name</HeaderCell>
            <Cell dataKey="name" />
          </Column>
          <Column flexGrow={4}>
            <HeaderCell>Insurance company</HeaderCell>
            <Cell dataKey="insurer_name" />
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
                        setPolisyId(rowData.id);
                        setPolisyModal(true);
                        setPolicyUpdateData(rowData.id);
                      }}
                      color="blue"
                    >
                      Update
                    </Button>
                    <Button
                      size="xs"
                      onClick={() => {
                        setPolisyId(rowData.id);
                        setPolisyDeleteModal(true);
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
      {policies &&
        policies.map((policy: any) => {
          return (
            <>
              {risks && (
                <Risk
                  policy={policy}
                  risks={risks.filter((risk: any) => {
                    return risk.policy_id === policy.id;
                  })}
                  setRisks={setRisks}
                />
              )}
              {coverages && (
                <>
                  <Coverage
                    policy={policy}
                    coverages={coverages.filter((i: any) => {
                      return i.policy_id === policy.id;
                    })}
                    setCoverages={setCoverages}
                  />
                  {coverages
                    .filter((i: any) => {
                      return i.policy_id === policy.id;
                    })
                    .map((coverage: any) => {
                      return (
                        <ConfidenceFactor
                          coverage={coverage}
                          confidenceFactors={confidenceFactors.filter(
                            (factor: any) => {
                              return factor.coverage_id === coverage.id;
                            }
                          )}
                          setConfidenceFactors={setConfidenceFactors}
                        />
                      );
                    })}
                </>
              )}
            </>
          );
        })}

      <Modal
        size="md"
        backdrop={true}
        show={polisModal}
        onHide={() => {
          setPolisyModal(false);
          cleanFields();
        }}
      >
        <Modal.Header>
          <Modal.Title>
            {polisyId && "Update"}
            {!polisyId && "Create"} Cyber Insurance Policy
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
                  name="polisyName"
                  value={polisyName}
                  onChange={(v) => {
                    setPolisyName(v);
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <ControlLabel>Description</ControlLabel>
                <FormControl
                  name="polisyDescription"
                  value={polisyDescription}
                  onChange={(v) => {
                    setPolisyDescription(v);
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <ControlLabel>Insurer Name</ControlLabel>
                <FormControl
                  name="polisyInsurerName"
                  value={polisyInsurerName}
                  onChange={(v) => {
                    setPolisyInsurerName(v);
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <ControlLabel>Insurer ID</ControlLabel>
                <FormControl
                  name="polisyInsurerId"
                  value={polisyInsurerId}
                  onChange={(v) => {
                    setPolisyInsurerId(v);
                  }}
                />
              </FormGroup>
            </Col>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {polisyId && (
            <Button
              onClick={() => updatePolicy()}
              appearance="primary"
              color="green"
            >
              Update
            </Button>
          )}
          {!polisyId && (
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
              setPolisyModal(false);
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
        show={polisDeleteModal}
        onHide={() => setPolisyDeleteModal(false)}
      >
        <Modal.Header>
          <Modal.Title>Delete Cyber Insurance Policy</Modal.Title>
        </Modal.Header>
        <Modal.Body>Delete Cyber Insurance Policy #{polisyId}</Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => deletePolicy()}
            appearance="primary"
            color="red"
          >
            Delete
          </Button>
          <Button
            onClick={() => setPolisyDeleteModal(false)}
            appearance="primary"
            color="green"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
