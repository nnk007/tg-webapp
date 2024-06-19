import { NextRequest } from "next/server";
import * as db from "@/db/db";
export async function resolveUser(request: NextRequest): Promise<number> {
    const session_cookie = request.cookies.get('SESSION');
    if (!session_cookie) throw 'SESSION unset';
    const { value: session_token } = session_cookie;
    let user_id = 0;
    let res = await db.query<{ user_id: number, expires_timestamp: string }>(`SELECT user_id,expires_timestamp::text FROM user_sessions WHERE session_token='${session_token}';`);
    if (res.rowCount == 0 || new Date(res.rows[0].expires_timestamp) < new Date(Date.now())) {
        if (new Date(res.rows[0].expires_timestamp) < new Date(Date.now())) {
            await db.query(`DELETE FROM user_sessions WHERE session_token='${session_token}';`);
        };
        throw 'SESSION expired';
    }
    return res.rows[0].user_id;
}