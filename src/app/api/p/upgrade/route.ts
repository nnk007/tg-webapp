'use server'
import { addBalance } from "@/db/balance";
import { getUpgrade, getUpgrade2, getUserUpgrade, purchaseUpgrade } from "@/db/upgrade";
import { resolveUser } from "@/functions/resolveUser";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    let user_id;
    try {
        user_id = await resolveUser(request);
    } catch (err) {
        const res = new NextResponse('', { status: 401 });
        res.cookies.delete("SESSION");
        return res;
    };
    const { id, _name } = await request.json() as { id?: string, _name?: string };
    if (id) {
        await purchaseViaId(user_id, id);
        return Response.json('', { status: 200 });
    } else if (_name) {
        await purchaseViaName(user_id, _name);
        return Response.json('', { status: 200 });
    } else return Response.json('', { status: 400 });
}

async function purchaseViaId(user_id: number, upgrade_id: string) {
    const ok = await purchaseUpgrade(user_id, +upgrade_id);
    if(!ok) throw 'dog';
    return;
}
async function purchaseViaName(user_id: number, upgrade_name: string) {
    const {id:upgrade_id} = await getUpgrade2(upgrade_name);
    const ok = await purchaseUpgrade(user_id, +upgrade_id);
    if(!ok) throw 'dog';
    return;
}