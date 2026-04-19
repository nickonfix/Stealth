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
        console.log("Initializing Auth Context. LocalStorage User:", user, "Token:", token);

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
                    userName: res?.data.username,
                    email: res?.data.email
                }
                localStorage.setItem("user", JSON.stringify(userObj));
                setToken(res?.data.token!);
                setUser(res.data);
                toast.success("Registered Successfully");
                navigate("/search");  
            }
        }).catch(e=> toast.warning("Server Error Occured!"))
    }

    const loginUser = async (username: string, password: string) => {
        await loginAPI(username, password).then((res) => {
            if(res){
                localStorage.setItem("token", res.data.token);
                const userObj = {
                    userName: res?.data.username,
                    email: res?.data.email
                }
                localStorage.setItem("user", JSON.stringify(userObj));
                setToken(res?.data.token!);
                setUser(res.data);
                toast.success("Login Successfully");
                navigate("/search");
            }
        }).catch(e => toast.warning("Server Error Occured!"))
    }

    const isLoggedIn = () => {
        console.log("Checking isLoggedIn. User:", user, "Token:", token);
        return !!user && !!token;
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
        navigate("/");
    }

    return (
        <UserContext.Provider value={{ loginUser, user, token, logout, isLoggedIn, register }}>
            {isReady ? children : null}
        </UserContext.Provider>
    )
}

export const useAuth = () => React.useContext(UserContext);
