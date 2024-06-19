import { BalanceCtx, DataCtx, WebAppCtx } from "@/components/Context";
import { formatNumber } from "@/functions/formatNumber";
import useBalance from "@/hooks/useBalance";
import useUserUpgrade from "@/hooks/useUserUpgrade";
import Image from "next/image";
import { useContext } from "react";

export default function Header() {
  const {value} = useBalance();
  const clkPow = useUserUpgrade(1);
  const pasPow = useUserUpgrade('passive_power');
  const webapp = useContext(WebAppCtx);
  if (!webapp.initDataUnsafe.user) return null;
  return (
    <div className="flex p-2 w-full justify-center">
      <div className="flex items-center gap-x-4">
        <div className="divide-x flex ">
          <div className="p-2">+{clkPow ? clkPow.lvl : 0}</div>
          <div className="p-2">+{pasPow ? pasPow.lvl : 0}</div>
        </div>
        <div className="border rounded-full px-2 py-1 gap-2 w-full text-start transition-all flex justify-evenly items-center">
          <div className="inline-flex">{formatNumber(+value)}</div>
          <div className="relative rounded-full overflow-hidden w-[20px] h-[20px]">
            <Image alt="coin" src={"/cat.jpg"} fill sizes="50" className="absolute top-0 left-0" />
          </div>
        </div>
      </div>
     {/*  <div className="w-auto flex items-center justify-center">
        <div>
          <div className="inline-block font-sans">{getGreeting()}</div>
          <span>, </span>
          <div className={`inline-block italic`}>{webapp.initDataUnsafe.user.first_name}</div>
        </div>
      </div>
      <div className="w-[25%]">
        <div className="h-[50px] w-[50px] relative rounded-full overflow-hidden">
          <Image src={webapp.initDataUnsafe.user.photo_url ? webapp.initDataUnsafe.user.photo_url : "/cat.jpg"} alt="profile_pic" fill className="object-fill" sizes="50px" />
        </div>
      </div> */}
    </div>
  )
}


function getGreeting() {
  const localHour = new Date(Date.now()).getHours();
  if (localHour >= 0 && localHour < 5) {
    return "Good Night";
  } else if (localHour >= 5 && localHour < 12) {
    return "Good Morning";
  } else if (localHour >= 12 && localHour < 18) {
    return "Good Day";
  } else return "Good Evening";
}

