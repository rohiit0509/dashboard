import { useContext } from "react";
import { AuthContext } from "./auth";

export const Check = () => {
    const { currentUser } = useContext(AuthContext);


    if (currentUser) {
        return true
    }
    else {
        return false
    }


}
