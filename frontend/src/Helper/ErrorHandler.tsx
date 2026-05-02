import axios from "axios";
import { toast } from "react-toastify";

export const handleError = (error: any, message?: string) => {
    const toastStyle = {
        borderRadius: 0,
        background: "#1f2228",
        color: "#ef4444",
        border: "1px solid rgba(239,68,68,0.2)",
        fontFamily: "'Geist Mono', monospace",
        fontSize: "12px",
        textTransform: "uppercase" as const,
        letterSpacing: "0.5px"
    };

    if(axios.isAxiosError(error)){
        const err = error.response;
        if(Array.isArray(err?.data.errors)){
            for(let val of err?.data.errors){
                toast.error(`ERROR: ${val.description}`, { style: toastStyle });
            }
        }
        else if (typeof err?.data.error === 'object'){
            for(let e in err.data.error){
                toast.error(`FIELD_ERR: ${err.data.error[e][0]}`, { style: toastStyle });
            }
        }
        else if (typeof err?.data === "string") {
            toast.error(`SYSTEM_ERR: ${err.data}`, { style: toastStyle });
        }
        else if(err?.status === 401){
            toast.error("AUTH_ERR: Session Expired / Unauthorized", { style: toastStyle });
            window.history.pushState({}, "LoginPage", "/login");
            window.location.reload();
        }
        else if(err?.data){
            toast.error(`ERR_CODE: ${err?.data}`, { style: toastStyle });
        }
        else if (message) {
            toast.error(`MSG: ${message}`, { style: toastStyle });
        }
    }
    else if (message) {
        toast.error(`MSG: ${message}`, { style: toastStyle });
    }
}