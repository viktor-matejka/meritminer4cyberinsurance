import Dashboard from "../views/Dashboard";
import { Profile } from "../components/Profile";
import { Eventlog } from "../components/Eventlog";
import { Discovery } from "../components/Discovery";
import { Conformance } from "../components/Conformance";
import { PM4PYDashboard } from "../components/PM4PYDashboard";
import { Underwriting } from "../components/Underwriting";

export interface route {
  path: string;
  name: string;
  icon: string;
  component: any;
  layout: string;
  title?: string;
  redirect?: any;
  upgrade?: any;
}

const dashboardRoutes: route[] = [
  {
    path: "/dashboard",
    name: "SecRiskAI",
    icon: "fas fa-tachometer-alt",
    component: Dashboard,
    layout: "/user",
  },
  {
    path: "/profile",
    name: "Profile",
    icon: "nc-icon nc-circle-09",
    component: Profile,
    layout: "/user",
  },
  {
    path: "/eventlogs",
    name: "EventLogs",
    icon: "nc-icon nc-cloud-upload-94",
    component: Eventlog,
    layout: "/user",
  },
  {
    path: "/discovery",
    name: "Discovery",
    title: "Process Discovery",
    icon: "nc-icon nc-compass-05",
    component: Discovery,
    layout: "/user",
  },
  {
    path: "/conformance",
    name: "Conformance",
    title: "Conformance Checking",
    icon: "nc-icon nc-preferences-circle-rotate",
    component: Conformance,
    layout: "/user",
  },
  {
    path: "/underwriting",
    name: "Underwriting",
    title: "Cyber Insurance Underwriting Workflow",
    icon: "nc-icon nc-umbrella-13",
    component: Underwriting,
    layout: "/user",
  },
  {
    path: "/process_mining_dashboard",
    name: "Dashboard",
    title: "Dashboard",
    icon: "nc-icon nc-chart-bar-32",
    component: PM4PYDashboard,
    layout: "/user",
  },
];

export default dashboardRoutes;
