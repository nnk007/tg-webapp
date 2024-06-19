import { getAllUpgrades } from "@/db/upgrade";
import { NextRequest,  } from "next/server";

export async function GET(request:NextRequest){
    const upgrades = await getAllUpgrades();
    return Response.json(upgrades);
}