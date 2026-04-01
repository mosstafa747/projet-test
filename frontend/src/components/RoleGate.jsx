import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function RoleGate({ allowedRoles }) {
  const { user, token } = useAuthStore();

  const is_admin = !!user?.is_admin;
  const is_driver = !!user?.is_driver;
  const is_guest = !token || !user;
  const is_customer = !is_guest && !is_admin && !is_driver;

  // Build list of roles user possesses
  const userRoles = [];
  if (is_admin) userRoles.push('admin');
  if (is_driver) userRoles.push('driver');
  if (is_customer) userRoles.push('customer');
  if (is_guest) userRoles.push('guest');

  // Check if at least one role is allowed
  const hasAccess = allowedRoles.some(role => userRoles.includes(role));

  if (!hasAccess) {
    // If no access, redirect to their primary staff silo or login
    if (is_admin) return <Navigate to="/admin" replace />;
    if (is_driver) return <Navigate to="/driver" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
