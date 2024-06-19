import useClicker from "@/hooks/useClicker";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useContext, useRef } from "react";
import { BalanceCtx, DispatchDataCtx } from "@/components/Context";
import { ActionType } from "@/hooks/useUserData";
import useBalance from "@/hooks/useBalance";


gsap.registerPlugin(useGSAP);

export default function Body() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { contextSafe } = useGSAP({ scope: containerRef });
    const [click] = useClicker();
    const {refresh} = useBalance();
    const animateClick = contextSafe(() => {
        gsap.to(".animatebox", {
            scale: 0.8, duration: 0.1, ease: "back.out(2)", yoyo: true, onComplete: () => {
                gsap.to(".animatebox", { scale: 1, duration: 0.1, ease: "back.inOut(1)" })
            }
        });
    })
    function handleClick() {
        click();
        animateClick();
        refresh();
    }
    return (
        <div ref={containerRef} className={`w-full h-full flex items-center justify-center`}>
            <div className={`animatebox relative h-[200px] aspect-square rounded-full overflow-hidden border-2 transition-all`} onClick={() => { handleClick() }}>
                <Image alt="coin_image" src={"/cat.jpg"} fill sizes="200px" />
            </div>
        </div>
    )
}
