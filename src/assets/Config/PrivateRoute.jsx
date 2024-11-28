import { Navigate } from "react-router-dom";
import { generalFunction } from "./generalFunction";

const PrivateRoute = ({ children }) => {
    return (
        (
            generalFunction.getUserId() && 
            generalFunction.getLastLoginSession() &&
            new Date().getTime() - generalFunction.getLastLoginSession() < 518400000
        ) 
        ? children 
        : <Navigate to={"/login"} />
    )
};

export default PrivateRoute;
