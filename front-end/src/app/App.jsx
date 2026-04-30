import { BrowserRouter } from "react-router-dom";
import "../shared/styles/app.css";
import "../shared/styles/theme.css";
import AppRoutes from "./routes/AppRoutes";
import { ToastProvider } from "../shared/context/toastContext";
import { AuthProvider } from "../shared/context/authContext";
import { ConfirmProvider } from "./provider/ConfirmProvider";
import { NotificationProvider } from "../shared/context/notificationContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConfirmProvider>
          <ToastProvider>
            <NotificationProvider>
              <AppRoutes />
            </NotificationProvider>
          </ToastProvider>
        </ConfirmProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
