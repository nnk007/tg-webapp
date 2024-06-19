import { createContext } from "react";
import { extDispatch } from "@/hooks/useUserData";
import { Theme } from "@/hooks/useTGColorScheme";

// @ts-expect-error
export const WebAppCtx = createContext<TG.WebApp>();

export const BalanceCtx = createContext<{value:number,refresh:()=>void}>({value:0,refresh:()=>{}});

//@ts-ignore
export const DataCtx = createContext<UserData>();
//@ts-ignore
export const DispatchDataCtx = createContext<extDispatch>();

// export const TGColorSchemeCtx = createContext<Theme>({});
