import crypto from "node:crypto";
import { QueryConfig, types } from "pg";
import { query } from "./db";
import dayjs from "dayjs";

export async function createSession(user_id: number) {
    const creationTime = dayjs();
    const expireTime = creationTime.add(5,"minute");
    const session_token = crypto.createHash("sha256").update(creationTime.toString() + user_id).digest('hex')
    const q: QueryConfig = {
        text: `INSERT INTO user_sessions(user_id,session_token,expires_timestamp) VALUES ($1,$2,$3);`,
        values: [user_id, session_token, expireTime.format()]
    };
    await query(q);
}

export async function createAndReturnSession(user_id: number) {
    const creationTime = dayjs();
    const expireTime = creationTime.add(5, "minute");
    const session_token = crypto.createHash("sha256").update(creationTime.toString() + user_id).digest('hex')
    const q: QueryConfig = {
        text: `INSERT INTO user_sessions(user_id,session_token,expires_timestamp) VALUES ($1,$2,$3);`,
        values: [user_id, session_token, expireTime.format()]
    };
    await query(q);
    const parsers = {
        1114: (val: string) => {
            console.log(`received timestamp`, val);
            return val;
        }
    }
    {
        const q: QueryConfig = {
            text: `SELECT session_id,session_token,user_id,expires_timestamp::text FROM user_sessions WHERE session_token=$1;`,
            values: [session_token],
            types: {
                //@ts-ignore
                getTypeParser: (oid, format) => {
                    if (oid === 1114) {
                        return parsers[1114];
                    }
                    // Fall back to the default parser
                    //@ts-expect-error
                    return types.getTypeParser(oid, format);
                }
            }
        };
        return (await query<{ session_id: string, session_token: string, user_id: string, expires_timestamp: string }>(q)).rows[0];
    }
}