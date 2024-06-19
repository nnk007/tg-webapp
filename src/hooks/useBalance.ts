import { DataCtx, DispatchDataCtx } from "@/components/Context";
import { useContext, useEffect, useState } from "react";
import { ActionType } from "./useUserData";

export default function useBalance() {
    const {balance} = useContext(DataCtx);
    const action = useContext(DispatchDataCtx);
    async function syncBalanceDB() {
        action({type:ActionType.REFRESH_BALANCE});
    }
    useEffect(() => {
        syncBalanceDB();
    }, []);
    return {value:balance,refresh:syncBalanceDB};
}