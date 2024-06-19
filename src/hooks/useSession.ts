import { useEffect, useState } from "react";

async function authorizeValidate(init_data:string): Promise<boolean> {
    const res = await fetch("/api/login",{method:"POST",body:JSON.stringify({init_data:init_data})});
    if (!res.ok) throw "Failed authorization";
    return true;
}

export default function useIsAuthorized(init_data:string) {
    const [authorized,setAuthorized] = useState<boolean>(false);
    async function authorize() {
        const isAuhtorized = await authorizeValidate(init_data);
        setAuthorized(_ => isAuhtorized);
    }
    useEffect(() => {
        try{
        authorize();
    } catch(err){
        setAuthorized(_=>false);
    }
    }, []);
    return authorized;
}