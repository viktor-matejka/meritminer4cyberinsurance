import React, { useEffect, useState } from "react";
import useAppState from "../hooks/use-app-state";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import NumberFormat from "react-number-format";
import {
  Row,
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  SelectPicker,
  Col,
  Schema,
  RadioGroup,
  Radio,
  Icon,
  Grid,
  HelpBlock,
  InputPicker,
} from "rsuite";
import { Regions } from "../const/regions";
import { ExternalAdvisor } from "../const/externalAdvisor";
import Card from "react-bootstrap/Card";
import { ActionTypes, UserProfile } from "../reducers/UserProfile/types";
import { Industries } from "../const/industries";
import { Endpoints } from "const/endpoints";

const { StringType, NumberType, BooleanType } = Schema.Types;

const model = Schema.Model({
  companyName: StringType().isRequired("This field is required."),
  industry: StringType().isRequired("This field is required."),
  region: StringType().isRequired("This field is required."),
  businessValue: NumberType(),
  nrEmployees: NumberType(),
  budget: NumberType(),
  investedAmount: NumberType(),
  knownVulnerabilities: NumberType(),
  externalAdvisor: BooleanType().isRequired("This field is required."),
  successfulAttacks: NumberType(),
  failedAttacks: NumberType(),
  budgetWeight: NumberType(),

  employeeTraining: NumberType(),
});

class AmountInput extends React.Component<{ onChange: any }> {
  render() {
    let { onChange, ...rest } = this.props;
    return (
      <NumberFormat
        {...rest}
        className="rs-input"
        displayType={"input"}
        onValueChange={(values) => {
          const { value } = values;
          onChange(parseInt(value));
        }}
        thousandSeparator={true}
      />
    );
  }
}

class AmountField extends React.PureComponent {
  render() {
    // @ts-ignore
    const { name, message, label, accepter, error, iconName, ...props } =
      this.props;
    return (
      <FormGroup className={error ? "has-error" : ""}>
        <ControlLabel>{label}</ControlLabel>
        <div className="rs-input-group rs-input-number">
          <span className="rs-input-group-addon">
            <Icon icon={iconName} />
          </span>
          <FormControl
            name={name}
            accepter={accepter}
            errorMessage={error}
            {...props}
          />
        </div>
        <HelpBlock>{message}</HelpBlock>
      </FormGroup>
    );
  }
}

const emptyProfile = {
  budget: 0,
  budgetWeight: 1,
  businessValue: 0,
  companyName: "",
  employeeTraining: 1,
  externalAdvisor: false,
  failedAttacks: 0,
  industry: "",
  investedAmount: 0,
  knownVulnerabilities: 0,
  nrEmployees: 0,
  region: "",
  successfulAttacks: 0,
};

export const Profile = () => {
  const { profile } = useAppState((s) => s.profile);
  const [formValue, setFormValue] = useState({ ...profile });
  const [profileId, setProfileId] = useState<number>();
  const [profileList, setProfileList] = useState<any>([]);
  const [formError, setFormError] = React.useState({});
  const dispatch = useDispatch();

  const PATH = "http://localhost:8000/api/profile/";

  const createProfile = () => {
    const body = { ...formValue, userId: 1 };
    fetch(PATH, {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("data", data);
        setProfileList([...profileList, data.data]);
        setProfileId(data.data.id);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const updateProfile = () => {
    const body = { ...formValue };
    delete body.id;
    delete body.userId;
    fetch(PATH + profileId + "/", {
      method: "PUT",
      body: JSON.stringify(body),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const profiles = profileList.map((profile: any) => {
          if (profile.id === data.id) {
            return data;
          } else {
            return profile;
          }
        });
        setProfileList(profiles);
        setProfileId(data.id);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getProfiles = () => {
    return fetch(Endpoints.profile)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setProfileList(data);
        return data;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getProfiles();
  }, []);

  useEffect(() => {
    if (profileId) {
      const selectedProfile = profileList.filter((item: any) => {
        return item.id === profileId;
      });
      setFormValue(selectedProfile[0]);
      dispatch({
        type: ActionTypes.UPDATING_PROFILE,
        profile: formValue,
      });
    }
  }, [profileId, profileList]);

  useEffect(() => {
    if (formValue && formValue.id) {
      setProfileId(formValue.id);
    }
  }, [formValue]);

  useEffect(() => {
    console.log(" cahnge formValue", formValue);
  }, [formValue]);

  return (
    <Grid fluid>
      <Row>
        <Col style={{ width: 700 }}>
          <Card>
            <Card.Header>
              <Row>
                <Col md={18}>
                  <Card.Title as="h3">General Information</Card.Title>
                </Col>
                <Col md={6}>
                  <InputPicker
                    name="profileList"
                    labelKey="companyName"
                    valueKey="id"
                    value={formValue?.id}
                    data={profileList}
                    onSelect={(profileId: number) => {
                      const selectedProfile = profileList.filter(
                        (profile: any) => {
                          return profile.id === profileId;
                        }
                      );
                      setFormValue(selectedProfile[0]);
                      setProfileId(profileId);
                    }}
                    onClean={() => {
                      setProfileId(undefined);
                      setFormValue(emptyProfile);
                    }}
                  />
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <hr />
              <Form
                onCheck={setFormError}
                model={model}
                formValue={formValue}
                onChange={(formValues) => {
                  setFormValue(formValues as UserProfile);
                }}
              >
                <Row style={{ marginTop: 22 }}>
                  <Col md={12}>
                    <FormGroup>
                      <ControlLabel>Company</ControlLabel>
                      <div className="rs-input-group rs-input-number">
                        <span className="rs-input-group-addon">
                          <Icon icon="building-o" />
                        </span>
                        <FormControl name="companyName" />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={12}>
                    <FormGroup>
                      <ControlLabel>Industry</ControlLabel>
                      <FormControl
                        style={{ width: "21.5em" }}
                        name="industry"
                        accepter={SelectPicker}
                        searchable={false}
                        data={Industries}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row style={{ marginTop: 22 }}>
                  <Col md={12}>
                    <FormGroup>
                      <ControlLabel>Operational Region</ControlLabel>
                      <FormControl
                        style={{ width: "21.5em" }}
                        name="region"
                        accepter={SelectPicker}
                        searchable={false}
                        data={Regions}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={8}>
                    <AmountField
                      // @ts-ignore
                      name="businessValue"
                      label="Business Value (Revenue)"
                      accepter={AmountInput}
                      // @ts-ignore
                      error={formError.businessValue}
                      iconName="usd"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <AmountField
                      // @ts-ignore
                      name="nrEmployees"
                      label="Number of Employees"
                      accepter={AmountInput}
                      // @ts-ignore
                      error={formError.nrEmployees}
                      iconName="group"
                    />
                  </Col>
                  <Col md={8}>
                    <FormGroup>
                      <ControlLabel>Employee Training</ControlLabel>
                      <FormControl
                        inline
                        appearance="picker"
                        name="employeeTraining"
                        accepter={RadioGroup}
                      >
                        <Radio value={1}>
                          <span style={{ fontSize: 12 }}>Low</span>
                        </Radio>
                        <Radio value={2}>
                          <span style={{ fontSize: 12 }}>Medium</span>
                        </Radio>
                        <Radio value={3}>
                          <span style={{ fontSize: 12 }}>High</span>
                        </Radio>
                      </FormControl>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <AmountField
                      // @ts-ignore
                      name="budget"
                      label="Cybersecurity Budget"
                      accepter={AmountInput}
                      // @ts-ignore
                      error={formError.budget}
                      iconName="usd"
                    />
                  </Col>
                  <Col md={8}>
                    <FormGroup>
                      <ControlLabel>Priority</ControlLabel>
                      <FormControl
                        inline
                        appearance="picker"
                        name="budgetWeight"
                        accepter={RadioGroup}
                      >
                        <Radio value={1}>
                          <span style={{ fontSize: 12 }}>Low</span>
                        </Radio>
                        <Radio value={2}>
                          <span style={{ fontSize: 12 }}>Medium</span>
                        </Radio>
                        <Radio value={3}>
                          <span style={{ fontSize: 12 }}>High</span>
                        </Radio>
                      </FormControl>
                    </FormGroup>
                  </Col>
                </Row>
                <h3>Technical Details</h3>
                <Row style={{ marginTop: 22 }}>
                  <Col md={9}>
                    <AmountField
                      // @ts-ignore
                      name="investedAmount"
                      label="Invested Amount in Cybersecurity"
                      accepter={AmountInput}
                      // @ts-ignore
                      error={formError.investedAmount}
                      iconName="usd"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <AmountField
                      // @ts-ignore
                      name="knownVulnerabilities"
                      label="Known Vulnerabilities"
                      accepter={AmountInput}
                      // @ts-ignore
                      error={formError.knownVulnerabilities}
                      iconName="crosshairs"
                    />
                  </Col>
                  <Col md={8}>
                    <FormGroup>
                      <ControlLabel>External Advisor</ControlLabel>
                      <FormControl
                        style={{ width: "21.5em" }}
                        name="externalAdvisor"
                        accepter={SelectPicker}
                        searchable={false}
                        data={ExternalAdvisor}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row style={{ marginTop: 5 }}>
                  <Col md={12}>
                    <AmountField
                      // @ts-ignore
                      name="successfulAttacks"
                      label="Successful Past Attacks"
                      accepter={AmountInput}
                      // @ts-ignore
                      error={formError.successfulAttacks}
                      iconName="user-secret"
                    />
                  </Col>
                  <Col md={9}>
                    <AmountField
                      // @ts-ignore
                      name="failedAttacks"
                      label="Failed Past Attacks"
                      accepter={AmountInput}
                      // @ts-ignore
                      error={formError.failedAttacks}
                      iconName="shield"
                    />
                  </Col>
                </Row>
                <hr />
                {profileId && (
                  <Button
                    disabled={Object.keys(formError).length !== 0}
                    onClick={() => {
                      updateProfile();
                      toast.success("Profile updated successfully!");
                      dispatch({
                        type: ActionTypes.UPDATING_PROFILE,
                        profile: formValue,
                      });
                    }}
                    color="green"
                    className="btn-fill pull-right"
                    type="submit"
                  >
                    Update
                  </Button>
                )}
                {!profileId && (
                  <Button
                    disabled={Object.keys(formError).length !== 0}
                    onClick={() => {
                      createProfile();
                      toast.success("Profile Create successfully!");
                      dispatch({
                        type: ActionTypes.UPDATING_PROFILE,
                        profile: formValue,
                      });
                    }}
                    color="green"
                    className="btn-fill pull-right"
                    type="submit"
                  >
                    Create
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Grid>
  );
};
