import { useContext } from "react";
import AuthContext from "../../../shared/context/authContext.jsx";

export const useAuth = () => useContext(AuthContext);