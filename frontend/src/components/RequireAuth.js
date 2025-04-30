// src/components/RequireAuth.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import getUserInfo from '../utilities/decodeJwt';

const RequireAuth = () => {
  const user = getUserInfo();
  // if no token / no decoded user, send to login
  if (!user) return <Navigate to="/login" replace />;
  // otherwise render the child route(s)
  return <Outlet />;
};

export default RequireAuth;
