import { Endpoints } from "const/endpoints";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { DataSet } from "vis-data/peer/umd/vis-data";
import { Network } from "vis-network/peer/umd/vis-network";

interface StatisticsProps {
  eventlogId: number;
  caseValue: string;
  activity: string;
  timestamp: string;
  statisticsData: any;
  setStatisticsData: (v: any) => void;
  showStatistics: boolean;
  statData: any;
  statError: boolean;
}

export const Statistics: React.FC<StatisticsProps> = (props) => {
  const {
    eventlogId,
    caseValue,
    activity,
    timestamp,
    statisticsData,
    setStatisticsData,
    showStatistics,
    statData,
    statError,
  } = props;

  const [nodes, setNodes] = useState<any>();
  const [edges, setEdges] = useState<any>();
  const networkRef = useRef<HTMLDivElement>(null);

  // const getStatisticsData = () => {
  //   if (!eventlogId) return;

  //   const url = new URL(Endpoints.discovery + "statistics/");
  //   const urlSearchParams = new URLSearchParams();
  //   urlSearchParams.set("eventlogId", eventlogId.toString());
  //   urlSearchParams.set("case", caseValue);
  //   urlSearchParams.set("activity", activity);
  //   urlSearchParams.set("timestamp", timestamp);
  //   url.search = urlSearchParams.toString();

  //   fetch(url.href)
  //     .then((response) => {
  //       response.json().then((data) => {
  //         const statData = data["statistics"];
  //         const how = statData[7];
  //         console.log("how");

  //         if (how["value"] !== "null") {
  //           setNodes(JSON.parse(data["statistics"][7]["value"])["nodes"]);
  //           setEdges(JSON.parse(data["statistics"][7]["value"])["edges"]);
  //         } else {
  //           setNodes([]);
  //           setEdges([]);
  //         }
  //         setStatisticsData(statData);
  //       });
  //     })
  //     .catch((err) => console.error(err));
  // };

  useEffect(() => {
    if (statData) {
      console.log("statData", statData.statistics);
      // statistics[7].value
      // console.log("statData",  statData[7]);
      // console.log("statData", typeof statData[7]);
      // const how = statData[7];
      if (statData.statistics[7].value !== "null") {
        setNodes(JSON.parse(statData.statistics[7].value)["nodes"]);
        setEdges(JSON.parse(statData.statistics[7].value)["edges"]);
      } else {
        setNodes([]);
        setEdges([]);
      }
      setStatisticsData(statData.statistics);
    }
  }, [statData]);

  // useEffect(() => {
  //   if (caseValue && activity && timestamp) {
  //     getStatisticsData();
  //   }
  // }, [eventlogId, caseValue, activity, timestamp]);

  // useEffect(() => {
  //   if (showStatistics) getStatisticsData();
  // }, [showStatistics]);

  const nodesNet = new DataSet<any>(nodes);
  const edgesNet = new DataSet<any>(edges);

  const data = {
    nodes: nodesNet,
    edges: edgesNet,
  };
  const options = {
    autoResize: true,
    height: "300px",
    width: "100%",
  };

  useLayoutEffect(() => {
    if (networkRef.current) {
      const network = new Network(networkRef.current, data, options);
    }
  }, [networkRef, nodesNet, edgesNet]);

  useEffect(() => {
    if (!statisticsData) {
      setNodes([]);
      setEdges([]);
    }
  }, [statisticsData]);

  return (
    <>
      {statError && (
        <p>
          Please select and configure an event log first in order to display
          process statistics.
        </p>
      )}
      {statData && (
        <div className="row">
          <div className="col-md-5">
            <h4>Statistics</h4>
            {!statisticsData && (
              <p>
                Please select and configure an event log first in order to
                display process statistics.
              </p>
            )}
            {statisticsData &&
              statisticsData.slice(0, -1).map((data: any, index: number) => {
                return (
                  <p key={index.toString()}>
                    {data["key"]}: {data["value"]}
                  </p>
                );
              })}
          </div>
          <div className="col-md-7">
            <h4 className="text-center">Handover of work network</h4>
            <div ref={networkRef} />
          </div>
        </div>
      )}
    </>
  );
};
