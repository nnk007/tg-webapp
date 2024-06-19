import { QueryConfig } from "pg";
import { query } from "./db";
import { createUser } from "./createUser";

export async function resolveUserId(telegram_user_id:string) {
    const q:QueryConfig = {
        name:"resolveUIDfromTgUID",
        text:`SELECT user_id FROM users WHERE telegram_user_id=$1;`,
        values:[telegram_user_id]
    };
    let res = await query<{ user_id: number }>(q);
    // if user not in the db, create user
    if (res.rowCount == 0) {
        await createUser(telegram_user_id);
        res = (await query<{ user_id: number }>(q));
        if (res.rowCount == 0) throw "dog";
    }
    return res.rows[0].user_id;
}


/* 
CREATE OR REPLACE FUNCTION create_user(telegram_user_id bigint) RETURNS integer as $$
INSERT INTO users(telegram_user_id) VALUES(create_user.telegram_user_id);
SELECT user_id INTO uid FROM users WHERE telegram_user_id=create_user.telegram_user_id;
INSERT INTO balances(user_id,balance) VALUES(uid,0);
FOR upgrade IN
    SELECT upgrade_id FROM upgrades
LOOP
    INSERT INTO user_upgrades(user_id,upgrade_id,upgrade_count) VALUES (uid,1,1);
END LOOP;
SELECT user_id FROM users WHERE telegram_user_id=create_user.telegram_user_id;
$$ LANGUAGE SQL;
 */