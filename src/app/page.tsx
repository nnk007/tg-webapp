'use client'
import Body from "@/components/Body";
import { BalanceCtx, DataCtx, DispatchDataCtx, WebAppCtx } from "@/components/Context";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import useBalance from "@/hooks/useBalance";
import useIsAuthorized from "@/hooks/useSession";
import useTGColorScheme from "@/hooks/useTGColorScheme";
import { useUserData } from "@/hooks/useUserData";
import useUserUpgrades from "@/hooks/useUserUpgrades";
import { ReactNode, useEffect, useState } from "react";

async function loadTgCloudBalance(cloudstore: TG.CloudStorage): Promise<number> {
  return new Promise<number>((res, rej) => cloudstore.getItem("balance", async (error, value) => {
    if (error || !value) {
      console.error("[CloudStorage] Error loading balance");
      return rej(error);
    } else {
      let bal = Number.parseInt(value);
      return Number.isNaN(bal) ? res(0) : res(bal);
    }
  }));
};

async function loadAllUpgrades(): Promise<Upgrade[]> {
  const res = await fetch("/api/upgrades", {});
  if (!res.ok) return [];
  return await res.json();
}

/*
------------------------------------
*/
export default function Root() {
  const [webapp, setWebapp] = useState<TG.WebApp | null>(null)
  useEffect(() => {
    if (typeof window == "undefined") return;
    const _webapp = (window as any).Telegram.WebApp;
    setWebapp(_webapp ? _webapp : null);
  }, []);

  if (!!webapp) return (
    <div className="flex flex-col h-screen overflow-hidden">
      <WebAppCtx.Provider value={webapp}>
        <SessionGateway init_data={webapp.initData}>
          <Page />
        </SessionGateway>
      </WebAppCtx.Provider>
    </div>)
  else return (<Loading />)
}

function SessionGateway({ init_data, children }: { init_data: string, children: ReactNode }) {
  const isAuthorized = useIsAuthorized(init_data);
  if (!isAuthorized)
    return <div>Logging in...</div>;
  return <>{children}</>
}

function Page() {
  const { data, action } = useUserData();
  const tg = useTGColorScheme();
  return (
    <DataCtx.Provider value={data}>
      <DispatchDataCtx.Provider value={action}>

        <div className={`flex flex-col h-screen overflow-hidden ${tg.bg} ${tg.text}`}>
          <Header></Header>
          <Body></Body>
          <Footer></Footer>
        </div>

      </DispatchDataCtx.Provider>
    </DataCtx.Provider>
  )
}

function Loading() {
  return <div>Loading</div>
}