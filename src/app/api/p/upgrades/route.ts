import { resolveUserId } from "@/db/resolveUserId";
import { getUserUpgrades } from "@/db/upgrade";
import { resolveUser } from "@/functions/resolveUser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){
    let user_id:string;
    try {
        user_id = (await resolveUser(request)).toString();
    } catch (err) {
        const res = new NextResponse('', { status: 401 });
        res.cookies.delete("SESSION");
        return res;
    };
    const upgrades = await getUserUpgrades(user_id);
    return Response.json(upgrades);
}