import { useContext, useState } from "react";
import UpgradeOption from "@/components/footer/UpgradeOption";
import { getAllUpgrades } from "@/db/upgrade";
import useUpgrades from "@/hooks/useUpgrades";
import useUserUpgrades from "@/hooks/useUserUpgrades";
import useBalance from "@/hooks/useBalance";
import { formatNumber } from "@/functions/formatNumber";

export default function Footer() {
    const [activeCategory, setActiveCategory] = useState<number>(-1);
    const menuOptions = ["upgrades", "prestige", "leaderboards", "settings"];
    const categories = [<UpgradesMenu key={"upgrade_menu"}/>,<PrestigeMenu key={"prestige_menu"}/>,<Leaderboards key={"leaderboards"}/>,<Settings key={"settings"}/>];
    // const [upgrades,setUpgrades] = useState<UserUpgrade[]>([]);
    // useEffect(()=>{
    //   loadAllUpgrades().then(upgrades=>{
    //     const u = upgrades.map<UserUpgrade>(upgrade=>{
    //       return {...upgrade,lvl:0}
    //     });
    //     setUpgrades(u);
    //   })
    // },[])
    return (
      <div className="relative">
        <div className="flex justify-evenly px-4 py-2 gap-1 opacity-0">MENU</div>
        <div className={`absolute ${activeCategory != -1 ? "-bottom-0" : "-bottom-[50vh]"} transition-all w-full border-t divide-y bg-black px-4`}>
          <div className="flex justify-evenly items-center gap-1 py-2">
            {menuOptions.map((v, i, a) => {
              return <div key={i + v} className={`${activeCategory == i ? "font-semibold underline" : ""} cursor-pointer`} onClick={() => { setActiveCategory(activeCategory == i ? -1 : i) }}>{v}</div>
            })}
          </div>
          <div className={`p-2 h-[50vh] overflow-auto`}>
            {
              categories[activeCategory]
            }
          </div>
        </div>
      </div>
    )
}


function UpgradesMenu() {
  const upgrades = useUpgrades();
  const {value:balance} = useBalance();
  const {user_upgrades,purchaseUpgrade} = useUserUpgrades();
  const _u:[string,Upgrade][] = upgrades.map(upgrade=>[upgrade._name,upgrade]);
  const _uu:[string,UserUpgrade][] = user_upgrades.map(upgrade=>[upgrade._name,upgrade]);
  const u = new Map<string,UserUpgrade>([..._u.map<[string,UserUpgrade]>(kv=>[kv[0],{...kv[1],lvl:0}]),..._uu,]);
  console.log(upgrades,user_upgrades);
  return (
    <div className="grid grid-cols-2 gap-2">
      {
        [...u.values()].map(upgrade => {
          const price = upgrade.lvl>0 ? upgrade.base_price * (upgrade.lvl + 1) : upgrade.base_price;
          return <UpgradeOption key={upgrade._name} name={upgrade.name} price={formatNumber(price)} lvl_purchased={upgrade.lvl} available={balance > price} onPurchase={() => {
            purchaseUpgrade(upgrade._name);
          }} />

        })
      }
      <div className="flex flex-col items-center justify-around w-full aspect-square ">
        <div className="w-4/5 text-lg font-extralight">More coming soon...</div>
      </div>
    </div>
  )
}

function PrestigeMenu(){
  return <div>TBA</div>
}
function Leaderboards(){
  return <div>TBA</div>
}
function Settings(){
  return <div>TBA</div>
}