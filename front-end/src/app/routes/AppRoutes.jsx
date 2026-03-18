import { Routes, Route } from "react-router-dom";

import Login from "../../features/auth/pages/Login";
import Register from "../../features/auth/pages/Register";
import Reset from "../../features/auth/pages/Reset";

import Home from "../pages/Home";
import PersonalWorkspace from "../pages/PersonalWorkspace";
import Calendar from "../pages/Calendar";
import GroupWorkspace from "../pages/GroupWorkspace";

import PrivateRoute from "./PrivateRoute";
import { AppLayout } from "../layouts/AppLayout";

import TaskDetails from "../../features/tasks/pages/TaskDetails";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset" element={<Reset />} />

      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/calendar" element={<Calendar />} />

          <Route path="/personal" element={<PersonalWorkspace />} />
          <Route
            path="/personal/project/:projectId"
            element={<PersonalWorkspace />}
          />

          <Route path="/groups" element={<GroupWorkspace />} />
          <Route path="/groups/:workspaceId" element={<GroupWorkspace />} />
          <Route
            path="/groups/:workspaceId/project/:projectId"
            element={<GroupWorkspace />}
          />
          <Route
            path="/groups/:workspaceId/settings"
            element={<GroupWorkspace />}
          />

          <Route path="/tasks/:taskId" element={<TaskDetails />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
