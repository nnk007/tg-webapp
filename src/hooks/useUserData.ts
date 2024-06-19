import { Dispatch, useEffect, useReducer } from "react";

type ReducerState = UserData;
export type extDispatch = (action:ExtendedReducerAction)=>Promise<void>;
export function useUserData(_userdata:UserData={balance:0,upgrades:[]}){
    const _ = useReducer<(state:ReducerState,action:ReducerAction)=>ReducerState>(reducer,_userdata);
    const [userdata,dispatch] = _ as [ReducerState,Dispatch<ReducerAction>];

    async function extDispatch(action:ExtendedReducerAction):Promise<void> {
        switch (action.type){
            case ActionType.REFRESH_DATA:{
                const b = await loadBalance();
                const uu = await loadUserUpgrades();
                console.log("uu:",uu);
                dispatch({type:_ActionType.SET_DATA,payload:{balance:b,upgrades:uu}})
            }
            case ActionType.REFRESH_BALANCE:{
                const b = await loadBalance();
                dispatch({type:_ActionType.SET_BALANCE,payload:b});
                break;
            }
            case ActionType.REFRESH_UPGRADES:{
                const uu = await loadUserUpgrades();
                dispatch({type:_ActionType.SET_UPGRADES,payload:uu});
                break;
            }
            case ActionType.PURCHASE_UPGRADE:{
                await purchaseUpgrade(action.payload);
                extDispatch({type:ActionType.REFRESH_DATA});
                break;
            }
            default:{
                dispatch(action as ReducerAction)
            }
        }
    }

    useEffect(()=>{
        (async()=>{
            extDispatch({type:ActionType.REFRESH_DATA});
        })()
    },[])

    return {data:userdata,action:extDispatch};
}

export enum ActionType {
    REFRESH_DATA,
    REFRESH_BALANCE,
    REFRESH_UPGRADES,
    PURCHASE_UPGRADE
}

enum _ActionType {
    SET_BALANCE=0,
    SET_UPGRADES=1,
    SET_DATA=2,
}
interface BaseReducerAction { type:_ActionType, payload?: any }
interface AsyncBaseReducerAction { type: ActionType, payload?: any }
interface SetDataAction extends BaseReducerAction {
    type:_ActionType.SET_DATA,
    payload:UserData
};
interface SetBalanceAction extends BaseReducerAction {
    type:_ActionType.SET_BALANCE,
    payload:number
}
interface SetUpgradesAction extends BaseReducerAction {
    type:_ActionType.SET_UPGRADES,
    payload:UserUpgrade[]
}
interface RefreshDataAction extends AsyncBaseReducerAction {
    type:ActionType.REFRESH_DATA,
}
interface RefreshBalanceAction extends AsyncBaseReducerAction {
    type:ActionType.REFRESH_BALANCE,
}
interface RefreshUpgradesAction extends AsyncBaseReducerAction {
    type:ActionType.REFRESH_UPGRADES,
}
interface PurhcaseUpgradeAction extends AsyncBaseReducerAction {
    type:ActionType.PURCHASE_UPGRADE,
    payload:string
}
type ReducerAction = SetDataAction | SetBalanceAction | SetUpgradesAction
type ExtendedReducerAction = ReducerAction |RefreshDataAction| RefreshBalanceAction | RefreshUpgradesAction | PurhcaseUpgradeAction;
function reducer(state: UserData, action: SetBalanceAction): UserData;
function reducer(state: UserData, action: SetUpgradesAction): UserData;
function reducer<S extends ReducerState,A extends ReducerAction,>(state: S, action: A): S {
    switch (action.type) {
        case _ActionType.SET_BALANCE:{
            return {
                ...state,
                balance:action.payload
            };
            break;
        }
        case _ActionType.SET_UPGRADES:{
            return {
                ...state,
                upgrades:action.payload
            };
            break;
        }
        case _ActionType.SET_DATA:{
            return {
                ...state,
                balance:action.payload.balance,
                upgrades:action.payload.upgrades,
            }
        };
        break;
        default:{
            console.error("Unknown action");
            return state;
            break;
        }
    }
}

async function loadUserUpgrades(): Promise<UserUpgrade[]> {
    const res = await fetch("/api/p/upgrades");
    if (!res.ok) throw "Failed loading upgrades";
    const uUpgrades: UserUpgrade[] = await res.json();
    return uUpgrades;
}
async function loadBalance(): Promise<number> {
    const res = await fetch("/api/p/balance");
    if (!res.ok) throw "Failed loading main balance";
    const { balance } = await res.json();
    let bal = Number.parseInt(balance);
    return Number.isNaN(bal) ? 0 : bal;
}

async function purchaseUpgrade(upgrade__name:string):Promise<EAV.Response>{
    const res = await fetch(`/api/p/upgrade`,{method:"POST",body:JSON.stringify({_name:upgrade__name})});
    if (!res.ok) return {error:"Failed the purchase",result:undefined};
    return {result:true}
}