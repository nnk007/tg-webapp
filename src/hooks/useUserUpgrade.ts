import { DataCtx } from "@/components/Context";
import { useContext } from "react";

export function useUserUpgrade(upgrade_name:string):UserUpgrade|undefined;
export function useUserUpgrade(upgrade_id:number):UserUpgrade|undefined;
export default function useUserUpgrade(upgrade_selector:number|string) {
    const udata = useContext(DataCtx);
    console.log(udata);
    const u_upgrade = udata.upgrades.find(v=>(typeof upgrade_selector == "number" ? v.id : v._name)==upgrade_selector);
    return u_upgrade;
}