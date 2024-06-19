'use server';
import { NextResponse } from "next/server";
import { loginUser as logUserLogin } from "@/db/loginUser";
import { retrieveUserLogins } from "@/db/retrieveUserLogins";
import { resolveUserId } from "@/db/resolveUserId";
import { createAndReturnSession, createSession } from "@/db/createSession";
import crypto from "node:crypto";
import dayjs from "dayjs";
export async function POST(request: Request) {
    let json;
    try {
        json = (await request.json()) as {init_data:string};
        console.log(json);
    } catch (err) {
        return new Response('dog', { status: 500 });
    }
    const init_data = parseInitData(json.init_data);
    const valid = validate(init_data);
    if(!valid) {
        console.log("Hash mismatch, message not from TG");
        return new Response('dog', { status: 403 });
    };
    // fetch last login date
    const { id: telegram_user_id } = init_data.user!;
    let user_id = await resolveUserId(''+telegram_user_id);
    console.log('UID:', user_id);
    const logins = await retrieveUserLogins(user_id);
    console.log(`${logins.rowCount} LOGINS:\n`,logins.rows.map(row=>row.timestamp));
    logUserLogin(user_id);
    const {session_token,expires_timestamp} = await createAndReturnSession(user_id);
    console.log(`Create session:`,session_token,"Expires",dayjs(expires_timestamp).toISOString());
    // calculate earnings
    /* last displayed balance value should be stored in TG CloudStorage and updated with a fancy animation after login */
    // return ok
    const res = new NextResponse();
    res.cookies.set("SESSION",session_token,{maxAge:300,expires:dayjs(expires_timestamp).toDate()});
    return res;
}

function parseInitData(_init_data:string):TG.WebAppInitData{
    const pairs:string[][] = decodeURIComponent(_init_data).split('&').map(pair=>pair.split("="));
    const init_data = {};
    pairs.forEach(kv=>{
        console.log(kv[0],kv[1]);
        if(kv[0]=='user' || kv[0]=='receiver' || kv[0] == 'chat')
            return Object.assign(init_data, { [kv[0]]: JSON.parse(kv[1]) });
        Object.assign(init_data,{[kv[0]]:kv[1]});
    })
    console.log(init_data);
    return init_data as TG.WebAppInitData;
}

function validate(_init_data:TG.WebAppInitData){
    const token = process.env['BOT_TOKEN'];
    const pairs = Object.entries(_init_data);
    const data_check_string = pairs.map(kv=>[kv[0],typeof kv[1] == 'object' ? JSON.stringify(kv[1]) : encodeURIComponent(kv[1])]).toSorted((a,b)=>alphabeticCompare(a[0],b[0])).filter(kva=>kva[0]!="hash").map(kva=>kva.join("=")).join('\n');
    const remote_hash = _init_data.hash;
    console.log(data_check_string);
    if(!token) throw 'Bot token Envvar unset';
    const secret = crypto.createHmac("sha256","WebAppData").update(token).digest();
    const hash = crypto.createHmac("sha256",secret).update(data_check_string).digest("hex");
    return hash==remote_hash;
}


function alphabeticCompare(lhs:string,rhs:string):number {
    const compLen = lhs.length < rhs.length ? lhs.length : rhs.length;
    for(let i = 0; i < compLen;++i){
        if(lhs.charCodeAt(i) < rhs.charCodeAt(i)) return -1
        else if(lhs.charCodeAt(i) > rhs.charCodeAt(i)) return 1
        else continue;
    };
    return 0;
}