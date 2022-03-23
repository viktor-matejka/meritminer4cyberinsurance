import { Endpoints } from "const/endpoints";
import React, { useState } from "react";
import { Button, Form, FormGroup, InputPicker, Table, Tooltip, Whisper, Icon } from "rsuite";

interface AlignmentsTableProps {
  eventlogList: any;
  modelList: any;
}

export const AlignmentsTable: React.FC<AlignmentsTableProps> = (props) => {
  const { eventlogList, modelList } = props;

  const { Column, HeaderCell, Cell, Pagination } = Table;

  const [eventlogId, setEventlogId] = useState<number>();
  const [modelId, setModelId] = useState<number>();
  const [alignmentsLoading, setAlignmentsLoading] = useState<boolean>();
  const [alignmentsData, setAlignmentsData] = useState<any>([]);
  const [displayLengthAlignment, setDisplayLengthAlignment] =
    useState<number>(5);
  const [pageAlignment, setPageAlignment] = useState<number>(1);
  const [sortColumn, setSortColumn] = useState<any>();
  const [sortType, setSortType] = useState<any>();
  const [overallFitness, setOverallFitness] = useState<number>();

  const hints = {
    tables: <Tooltip>Select Eventlog and  created Model </Tooltip>,
  };

  const getAligmentsDataList = () => {
    if (alignmentsData && sortColumn && sortType) {
      alignmentsData.sort((a: any, b: any) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (sortType === "asc") {
          return x - y;
        } else {
          return y - x;
        }
      });
    }

    return alignmentsData.filter((v: number, i: number) => {
      const start = displayLengthAlignment * (pageAlignment - 1);
      const end = start + displayLengthAlignment;
      return i >= start && i < end;
    });
  };

  const getAligments = () => {
    setAlignmentsLoading(true);
    const body = {
      eventlogId,
      modelId,
    };

    fetch(Endpoints.alignment, {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        setAlignmentsData(JSON.parse(data["data"]));
        setOverallFitness(data["fitness"]);
        setAlignmentsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setAlignmentsLoading(false);
      });
  };

  return (
    <>
      <Form layout="inline">
        <h4>
          <span>Alignment</span>
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
              onClick={() => getAligments()}
            >
              Get Alignment
            </Button>
          </FormGroup>
        </h4>
      </Form>
      <h5>Overal fitness: {Number(overallFitness).toFixed(2)}%</h5>
      <Table
        wordWrap
        autoHeight={true}
        data={getAligmentsDataList()}
        loading={alignmentsLoading}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={(column, type) => {
          setSortColumn(column);
          setSortType(type);
        }}
      >
        <Column flexGrow={3}>
          <HeaderCell>alignment</HeaderCell>
          <Cell dataKey="alignment">
            {(rowData: any) => {
              const data = rowData["alignment"].map((item: any) => {
                return <span className="mr-1">{item[0]},</span>;
              });
              return data;
            }}
          </Cell>
        </Column>

        <Column flexGrow={1} sortable>
          <HeaderCell>bwc</HeaderCell>
          <Cell dataKey="bwc" />
        </Column>

        <Column flexGrow={1} sortable>
          <HeaderCell>cost</HeaderCell>
          <Cell dataKey="cost" />
        </Column>

        <Column flexGrow={1} sortable>
          <HeaderCell>fitness</HeaderCell>
          <Cell dataKey="fitness">
            {(rowData: any) => rowData["fitness"].toFixed(2)}
          </Cell>
        </Column>

        <Column flexGrow={1} sortable>
          <HeaderCell>lp solved</HeaderCell>
          <Cell dataKey="lp_solved" />
        </Column>
        <Column flexGrow={1} sortable>
          <HeaderCell>queued states</HeaderCell>
          <Cell dataKey="queued_states" />
        </Column>
        <Column flexGrow={1} sortable>
          <HeaderCell>traversed arcs</HeaderCell>
          <Cell dataKey="traversed_arcs" />
        </Column>
        <Column flexGrow={1} sortable>
          <HeaderCell>visited states</HeaderCell>
          <Cell dataKey="visited_states" />
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
          {
            value: 20,
            label: 20,
          },
          {
            value: 50,
            label: 50,
          },
        ]}
        activePage={pageAlignment}
        displayLength={displayLengthAlignment}
        total={alignmentsData.length}
        onChangePage={(dataKey) => {
          setPageAlignment(dataKey);
        }}
        onChangeLength={(dataKey) => {
          setDisplayLengthAlignment(dataKey);
          setPageAlignment(1);
        }}
      />
    </>
  );
};
