import React from 'react'
import { Navigate } from 'react-router-dom';
import Hero from '../../Components/Hero/Hero'
import { useAuth } from '../../Context/useAuth';

interface Props { }

const HomePage = (props: Props) => {
    const { isLoggedIn } = useAuth();

    if (isLoggedIn()) {
        return <Navigate to="/search" replace />;
    }

    return (
        <div>
            <Hero />
        </div>
    )
}

export default HomePage