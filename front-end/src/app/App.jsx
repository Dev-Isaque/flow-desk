import { BrowserRouter } from "react-router-dom";
import "../shared/styles/app.css";
import "../shared/styles/theme.css";
import AppRoutes from "./routes/AppRoutes";
import { ToastProvider } from "../shared/context/toastContext";
import { AuthProvider } from "../shared/context/authContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
