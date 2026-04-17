import axios from "axios";
import { toast } from "react-toastify";

export const handleError = (error: any, message?: string) => {
    if(axios.isAxiosError(error)){
        const err = error.response;
        if(Array.isArray(err?.data.errors)){
            for(let val of err?.data.errors){
                toast.warning(val.description);
            }
        }
        else if (typeof err?.data.error === 'object'){
            for(let e in err.data.error){
                toast.warning(err.data.error[e][0]);
            }
        }
        else if (typeof err?.data === "string") {
            toast.warning(err.data);
        }
        else if(err?.status === 401){
            toast.warning("You are not authorized to perform this action");
            window.history.pushState({}, "LoginPage", "/login");
            window.location.reload();
        }
        else if(err?.data){
            toast.warning(err?.data);
        }
        else if (message) {
            toast.warning(message);
        }
    }
    else if (message) {
        toast.warning(message);
    }
}