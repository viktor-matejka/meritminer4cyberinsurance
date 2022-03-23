import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  InputPicker,
  Table,
  Icon,
  Tooltip,
  Whisper,
} from "rsuite";
import { Endpoints } from "const/endpoints";

interface TBRTableProps {
  eventlogList: any;
  modelList: any;
}

export const TBRTable: React.FC<TBRTableProps> = (props) => {
  const { eventlogList, modelList } = props;

  const { Column, HeaderCell, Cell, Pagination } = Table;

  const [eventlogId, setEventlogId] = useState<number>();
  const [modelId, setModelId] = useState<number>();
  const [tbrLoading, setTBRLoading] = useState<boolean>(false);
  const [tbrData, setTBDData] = useState<any[]>([]);
  const [displayLengthToken, setDisplayLengthToken] = useState<number>(5);
  const [pageToken, setPageToken] = useState<number>(1);
  const [sortColumn, setSortColumn] = useState<any>();
  const [sortType, setSortType] = useState<any>();
  const [overallFitness, setOverallFitness] = useState<number>();

  const hints = {
    tables: <Tooltip>Select Eventlog and  created Model </Tooltip>,
  };

  const getTBRDataList = () => {
    if (tbrData && sortColumn && sortType) {
      tbrData.sort((a: any, b: any) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (sortType === "asc") {
          return x - y;
        } else {
          return y - x;
        }
      });
    }

    return tbrData.filter((v: number, i: number) => {
      const start = displayLengthToken * (pageToken - 1);
      const end = start + displayLengthToken;
      return i >= start && i < end;
    });
  };

  const getTBR = () => {
    setTBRLoading(true);
    const body = {
      eventlogId,
      modelId,
    };

    fetch(Endpoints.tbr, {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        setTBDData(JSON.parse(data["data"]));
        setOverallFitness(data["fitness"]);
        setTBRLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setTBRLoading(false);
      });
  };

  return (
    <>
      <Form layout="inline">
        <h4>
          <span>Token-based replay</span>
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
          <FormGroup>
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
          </FormGroup>
          <FormGroup controlId="eventlog">
            <Whisper
              placement="top"
              trigger="hover"
              speaker={hints.tables}
            >
              <Icon className="mt-5 mr-2" icon="question2" />
            </Whisper>
            <Button
              disabled={eventlogId && modelId ? false : true}
              appearance="primary"
              onClick={() => getTBR()}
            >
              Get TBR
            </Button>
          </FormGroup>
        </h4>
      </Form>
      <h5>
        Overall fitness (how much of behavior in the event log can be explained
        by the model) {Number(overallFitness).toFixed(2)}%
      </h5>
      <Table
        wordWrap
        autoHeight={true}
        loading={tbrLoading}
        headerHeight={90}
        data={getTBRDataList()}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={(column, type) => {
          setSortColumn(column);
          setSortType(type);
        }}
      >
        <Column flexGrow={4}>
          <HeaderCell>Activated transitions</HeaderCell>
          <Cell dataKey="activated_transitions">
            {(rowData: any) => {
              const data = rowData["activated_transitions_labels"].map(
                (item: any) => {
                  return <span className="mr-1">{item},</span>;
                }
              );
              return data;
            }}
          </Cell>
        </Column>

        <Column flexGrow={1} sortable>
          <HeaderCell>Consumed tokens</HeaderCell>
          <Cell dataKey="consumed_tokens" />
        </Column>

        <Column flexGrow={1} sortable>
          <HeaderCell>Enabled transitions in marking</HeaderCell>
          <Cell dataKey="enabled_transitions_in_marking">
            {(rowData: any) => {
              const data = rowData["enabled_transitions_in_marking_labels"].map(
                (item: any) => {
                  return <span className="mr-1">{item},</span>;
                }
              );
              return data;
            }}
          </Cell>
        </Column>

        <Column flexGrow={1} sortable>
          <HeaderCell>Missing tokens</HeaderCell>
          <Cell dataKey="missing_tokens" />
        </Column>
        <Column flexGrow={1} sortable>
          <HeaderCell>Produced tokens</HeaderCell>
          <Cell dataKey="produced_tokens" />
        </Column>
        <Column flexGrow={1} sortable>
          <HeaderCell>Visited states</HeaderCell>
          <Cell dataKey="visited_states" />
        </Column>
        <Column flexGrow={1} sortable>
          <HeaderCell>Remaining tokens</HeaderCell>
          <Cell dataKey="remaining_tokens" />
        </Column>
        <Column flexGrow={1} sortable>
          <HeaderCell>Trace fitness</HeaderCell>
          <Cell dataKey="trace_fitness">
            {(rowData: any) => {
              return rowData["trace_fitness"].toFixed(4);
            }}
          </Cell>
        </Column>
        <Column flexGrow={1} sortable>
          <HeaderCell>Trace is fit</HeaderCell>
          <Cell dataKey="trace_is_fit" />
        </Column>
        <Column flexGrow={1} sortable>
          <HeaderCell>Transitions with problems</HeaderCell>
          <Cell dataKey="transitions_with_problems">
            {(rowData: any) => {
              const data = rowData["transitions_with_problems"].map(
                (item: any) => {
                  return (
                    <Button className="m-1" size="xs" color="blue">
                      {item}
                    </Button>
                  );
                }
              );
              return data;
            }}
          </Cell>
        </Column>
      </Table>
      <Pagination
        lengthMenu={[
          {
            value: 5,
            label: 5,
          },
          {
            value: 10,
            label: 10,
          },
        ]}
        activePage={pageToken}
        displayLength={displayLengthToken}
        total={tbrData.length}
        onChangePage={(dataKey) => {
          setPageToken(dataKey);
        }}
        onChangeLength={(dataKey) => {
          setDisplayLengthToken(dataKey);
          setPageToken(1);
        }}
      />
    </>
  );
};
