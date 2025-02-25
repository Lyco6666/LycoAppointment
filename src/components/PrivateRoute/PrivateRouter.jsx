import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../App";

const PrivateRoute = ({ role }) => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    if (role && user.role !== role) return <Navigate to="/unauthorized" replace />;
    return <Outlet />;
};

export default PrivateRoute;
