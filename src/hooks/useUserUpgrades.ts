import { DataCtx, DispatchDataCtx } from "@/components/Context";
import { useContext, useEffect, useState } from "react";
import { ActionType } from "./useUserData";

export default function useUserUpgrades() {
    const udata = useContext(DataCtx);
    const action = useContext(DispatchDataCtx);
    const uUpgrades = (udata.upgrades);
    async function syncUUDB() {
        action({type:ActionType.REFRESH_UPGRADES});
    }
    async function submitPurchaseUpgrade(upgrade_name:string) {
        action({type:ActionType.PURCHASE_UPGRADE,payload:upgrade_name});
    }
    useEffect(() => {
        syncUUDB();
    }, []);
    return {user_upgrades:uUpgrades,purchaseUpgrade:submitPurchaseUpgrade,refresh:syncUUDB};
}