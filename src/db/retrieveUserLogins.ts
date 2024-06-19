import { QueryConfig } from "pg";
import { query } from "./db";

export async function retrieveUserLogins(user_id:number){
    const retrieve_logins_query:QueryConfig = {
        name:"retrieve_user_logins",
        text:`SELECT login_id, timestamp FROM login_timestamps WHERE user_id=$1;`,
        values:[user_id]
    }
    return await query<{ login_id: number, timestamp: string }>(retrieve_logins_query);
}