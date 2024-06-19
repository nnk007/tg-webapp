import { QueryConfig } from "pg";
import { query } from "./db";
export async function loginUser(user_id:number){
    const q:QueryConfig = {
        name:"login_user",
        text:`INSERT INTO login_timestamps(user_id) VALUES ($1);`,
        values:[user_id]
    };
    await query(q);
}