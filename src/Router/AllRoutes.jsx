import { Route, Routes } from "react-router-dom";
import SprintDashboard from "../Components/Sprints/SprintDashboard";
import ProjectDashboard from "../Components/Projects/ProjectDashboard";
import DashboardWrapper from "../Components/Common/DashboardWrapper";
import GetStartedComponent from "../Components/GetStarted/GetStarted";
import Settings from "../Components/Settings/Settings";
import Login from "../Components/Login/Login";
import Onboarding from "../Components/Onboarding/Onboarding";
import LoginWrapper from "../Components/Common/LoginWrapper";
import PrivateRoute from "../assets/Config/PrivateRoute";

export default function AllRoutes() {
  return (
    <Routes>
      {/* <Route path="/" element={<LoginWrapper><Login/></LoginWrapper>} /> */}
      <Route path="/login" element={<LoginWrapper><Login/></LoginWrapper>} />
      <Route path="/" element={<PrivateRoute><GetStartedComponent/></PrivateRoute>} />
      <Route path="/onboarding" element={<PrivateRoute><LoginWrapper><Onboarding/></LoginWrapper></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><GetStartedComponent/></PrivateRoute>} />
      <Route path="/sprints/:sprintId" element={<PrivateRoute><SprintDashboard/></PrivateRoute>} />
      <Route path="/projects/:projectId" element={<PrivateRoute><ProjectDashboard/></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings/></PrivateRoute>} />
      <Route path="*" element={<PrivateRoute><GetStartedComponent/></PrivateRoute>} />
    </Routes>
  );
}
