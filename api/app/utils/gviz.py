from pm4py.algo.discovery.dfg import algorithm as dfg_discovery
from pm4py.visualization.dfg import visualizer as dfg_visualization


def gviz_dfg(log):
    dfg = dfg_discovery.apply(log)
    gviz = dfg_visualization.apply(
        dfg, log=log, variant=dfg_visualization.Variants.FREQUENCY
    )
    return gviz
