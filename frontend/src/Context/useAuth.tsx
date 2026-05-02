import React, { createContext, useEffect, useState } from "react";
import { UserPorfileToken } from "../Models/User"
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { loginAPI, RegisterAPI } from "../Services/AuthService";
import axios from "axios";

type UserContextType = {
    user: UserPorfileToken | null;
    token: string| null;
    register: (email: string, username: string, password: string) => void;
    loginUser: (username: string, password: string) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
}

type Props = {children: React.ReactNode};

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({children}: Props)=>{

    const navigate = useNavigate();
    const [token, setToken] = useState<string| null>(null);
    const [user, setUser] = useState<UserPorfileToken | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(()=>{
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if(user && token){
            setUser(JSON.parse(user));
            setToken(token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setIsReady(true);
    },[]);

    const register = async(email: string, username: string, password: string) => {
        await RegisterAPI(username, password, email).then((res)=>{
            if(res){
                localStorage.setItem("token", res.data.token);
                const userObj = {
                    userName: res?.data.userName,
                    email: res?.data.email
                }
                localStorage.setItem("user", JSON.stringify(userObj));
                setToken(res?.data.token!);
                setUser(res.data);
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
                toast.success("Identity Verified / Access Granted", {
                    icon: <span>✓</span>,
                    style: {
                        borderRadius: 0,
                        background: "#1f2228",
                        color: "#ffffff",
                        border: "1px solid rgba(255,255,255,0.1)",
                        fontFamily: "'Geist Mono', monospace",
                        fontSize: "12px",
                        textTransform: "uppercase",
                        letterSpacing: "1px"
                    }
                });
                navigate("/search", { replace: true });  
            }
        }).catch(e=> toast.error("Verification Failed / Server Error", {
            style: {
                borderRadius: 0,
                background: "#1f2228",
                color: "#ef4444",
                border: "1px solid rgba(239,68,68,0.2)",
                fontFamily: "'Geist Mono', monospace",
                fontSize: "12px",
                textTransform: "uppercase"
            }
        }))
    }

    const loginUser = async (username: string, password: string) => {
        await loginAPI(username, password).then((res) => {
            if(res){
                localStorage.setItem("token", res.data.token);
                const userObj = {
                    userName: res?.data.userName,
                    email: res?.data.email
                }
                localStorage.setItem("user", JSON.stringify(userObj));
                setToken(res?.data.token!);
                setUser(res.data);
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
                toast.success("Protocol Accepted / session_start", {
                    icon: <span>⚡</span>,
                    style: {
                        borderRadius: 0,
                        background: "#1f2228",
                        color: "#ffffff",
                        border: "1px solid rgba(255,255,255,0.1)",
                        fontFamily: "'Geist Mono', monospace",
                        fontSize: "12px",
                        textTransform: "uppercase",
                        letterSpacing: "1px"
                    }
                });
                navigate("/search", { replace: true });
            }
        }).catch(e => toast.error("Invalid Credentials / access_denied", {
            style: {
                borderRadius: 0,
                background: "#1f2228",
                color: "#ef4444",
                border: "1px solid rgba(239,68,68,0.2)",
                fontFamily: "'Geist Mono', monospace",
                fontSize: "12px",
                textTransform: "uppercase"
            }
        }))
    }

    const isLoggedIn = () => {
        if (user && token) {
            return true;
        }

        // Fallback prevents route-guard flicker during reload/state hydration.
        const persistedUser = localStorage.getItem("user");
        const persistedToken = localStorage.getItem("token");
        return !!persistedUser && !!persistedToken;
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
        delete axios.defaults.headers.common['Authorization'];
        navigate("/");
    }

    return (
        <UserContext.Provider value={{ loginUser, user, token, logout, isLoggedIn, register }}>
            {isReady ? children : null}
        </UserContext.Provider>
    )
}

export const useAuth = () => React.useContext(UserContext);
