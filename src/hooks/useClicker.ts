import { useState } from "react";

async function submitClick() {
    const r = await fetch("/api/p/click", { method: 'POST' });
    if (r.ok) return { error: undefined, result: true };
    else return { error: undefined, result: false };
  }
  

export default function useClicker():[()=>void] {
    const [timesClicked,setTimesClicked] = useState(0);
    function click(){
        setTimesClicked(timesClicked+1);
        submitClick();
    }
    return [click];
}