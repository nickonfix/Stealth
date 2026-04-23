import React from 'react'
import { useAuth } from '../Context/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

type Props = { children : React.ReactNode}

const ProtectedRoutes = ({ children }: Props) => {
    const location = useLocation();
    const { isLoggedIn } = useAuth();
    const loggedIn = isLoggedIn();
    return loggedIn ? (
        <> {children} </>
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    )
}

export default ProtectedRoutes