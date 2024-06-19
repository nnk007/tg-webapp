import Image from "next/image";

export default function UpgradeOption({ name, price,lvl_purchased:lvl,available,onPurchase:handlePurchase}: { name: string, price: string,lvl_purchased:number,available:boolean,onPurchase:()=>void}) {
  return (
    <div className="flex flex-col items-center justify-around w-full aspect-square rounded-sm bg-white/5">
      <div>{name}</div>
      <div className="relative w-1/2 aspect-square overflow-hidden rounded-sm z-0">
        <div className="absolute right-0 bottom-0 z-10 p-1 font-bold text-end">
          <span className="inline-block">LV.</span>
          <span className="inline-block min-w-[1ch]">{lvl}</span>
        </div>
        <Image alt="upgrade_illustration" src={"/cat.jpg"} fill sizes="200px" className="object-fill z-0" />
      </div>
      <button disabled={!available} onClick={()=>{
        handlePurchase();
      }} className={`rounded-md bg-green-600 disabled:bg-[#333] px-2 py-1 justify-between flex w-4/5`}>
        <div className="">BUY</div>
        <span>+1</span>
        <div className="border-l-2 pl-2">{price}</div>
      </button>
    </div>
  )
}