'use server'
import { addBalance } from "@/db/balance";
import { getUserUpgrade } from "@/db/upgrade";
import { resolveUser } from "@/functions/resolveUser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    let user_id;
    try {
        user_id = await resolveUser(request);
    } catch (err) {
        const res = new NextResponse('', { status: 401 });
        res.cookies.delete("SESSION");
        return res;
    };
    await clickAs(user_id);
    return Response.json('',{status:200});
}

async function clickAs(user_id:number) {
    const {lvl:clickPower} = (await getUserUpgrade(user_id,1))!; //click_power = 1;
    const nb = await addBalance(''+user_id,+clickPower);
    console.log('NB:',nb);
    return;
}