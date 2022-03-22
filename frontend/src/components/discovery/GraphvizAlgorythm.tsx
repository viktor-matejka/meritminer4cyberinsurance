import React from "react";
import { Graphviz } from "graphviz-react";

interface GraphvizAlgorithmProps {
  graphvizData: any;
  error: any;
}

export const GraphvizAlgorithm: React.FC<GraphvizAlgorithmProps> = (props) => {
  const { graphvizData, error } = props;

  return (
    <>
      <hr />
      <h4>Model</h4>
      {graphvizData && graphvizData?.png && (
        <img src={`data:image/png;base64,${graphvizData.png}`} width="100%" />
      )}
      {graphvizData && graphvizData?.gviz && (
        <Graphviz
          dot={graphvizData.gviz}
          options={{ width: "100%", height: "100%" }}
        />
      )}
      {!graphvizData && (
        <p>
          No file data. Please, start by selecting an Eventlog or Proces Model
          to display
        </p>
      )}
      {error && <p>Please specify parameters</p>}
    </>
  );
};
