import pg from "pg";
export async function createUser(telegram_user_id: string) {
    const p = new pg.Pool({ database: 'tg_webapp',user:'postgres',password:(process.env as unknown as {PSQL_PWD:string}).PSQL_PWD });
    const c = await p.connect();
    try {
        await c.query('BEGIN');
        const q1 = `INSERT INTO users(telegram_user_id) VALUES($1);`;
        await c.query(q1, [telegram_user_id]);
        const q2 = `SELECT user_id FROM users WHERE telegram_user_id=$1;`;
        const uid = (await c.query<{ user_id: number }>(q2, [telegram_user_id])).rows[0].user_id;
        const q3 = `INSERT INTO balances(user_id,balance) VALUES($1,0);`
        await c.query(q3, [uid]);
        // FOR upgrade IN SELECT upgrade_id FROM upgrades LOOP
        //set click power to 1
        await c.query(`INSERT INTO user_upgrades(user_id,upgrade_id,upgrade_count) VALUES ($1,1,1);`, [uid]);
        // END LOOP;
        await c.query(`COMMIT`);
        console.log(`User created:`, uid);
    } catch (e) {
        await c.query(`ROLLBACK`);
        throw e;
    } finally {
        await c.release();
        await p.end()
    }
    return;
}