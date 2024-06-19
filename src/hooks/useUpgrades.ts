import { useEffect, useState } from "react";

async function loadUpgrades(): Promise<Upgrade[]> {
    const res = await fetch("/api/upgrades");
    if (!res.ok) throw "Failed loading main balance";
    const upgrades = await res.json();
    console.log('U:',upgrades);
    return upgrades;
}

export default function useUpgrades() {
    const [upgrades, setUpgrades] = useState<Upgrade[]>([]);
    async function load() {
        const u = await loadUpgrades();
        setUpgrades(_ => u);
    }
    useEffect(() => {
        load();
    }, []);
    return upgrades;
}