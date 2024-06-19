import { NextRequest, NextResponse } from "next/server";
import { resolveUser } from "@/functions/resolveUser";
import { getBalance } from "@/db/balance";
export async function GET(request: NextRequest) {
    let user_id:number;
    try {
        user_id = await resolveUser(request);
    } catch (err) {
        console.log("No user_id",err);
        const res = new NextResponse('', { status: 401 });
        res.cookies.delete("SESSION");
        return res;
    };
    const balance = await getBalance(`${user_id}`);
    console.log(`User`,user_id, `Balance`,balance);
    return Response.json({ balance: balance });
}