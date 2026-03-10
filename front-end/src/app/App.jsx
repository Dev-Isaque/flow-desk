import "../shared/styles/app.css";
import "../shared/styles/theme.css";
import AppRoutes from "./routes/AppRoutes";
import { ToastProvider } from "../shared/context/toastContext";

export default function App() {
  return (
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  );
}
