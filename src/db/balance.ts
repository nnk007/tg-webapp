import { Query, QueryConfig } from "pg";
import { query } from "./db";

export async function getBalance(user_id:string){
    const q:QueryConfig = {
        name:"getUserBalance",
        text:`SELECT balance FROM balances WHERE user_id=$1;`,
        values:[user_id]
    };
    let result = (await query<{ balance: number }>(q));
    if(result.rowCount==0) throw `User without balance ?`;
 /*    if (result.rowCount == 0) {
        await query(`INSERT INTO balances(user_id) VALUES (${user_id})`);
        result = await query<{ balance: number }>(q);
    } */
    return +(result.rows[0].balance);

}

async function setBalance(user_id:string,new_balance:number){
    const q:QueryConfig = {
        name:"setUserBalance",
        text:`UPDATE balances SET balance=$2 WHERE user_id=$1 RETURNING balance;`,
        values:[user_id,new_balance]
    };
    let result = (await query<{balance:number}>(q));
    return result.rows[0].balance;
}

export async function addBalance(user_id:string,value:number){
    //UPDATE balances SET balance=(SELECT balance FROM balances WHERE user_id=3)+(SELECT uu.upgrade_count FROM user_upgrades as uu INNER JOIN upgrades u ON uu.upgrade_id=u.upgrade_id WHERE user_id=3) WHERE user_id=3;
    const q:QueryConfig = {
        name:`addBalance`,
        text:`UPDATE balances SET balance=(SELECT balance FROM balances WHERE user_id=$1)+$2 WHERE user_id=$1 RETURNING balance;`,
        values:[user_id,value]
    }
    let result = (await query<{balance:number}>(q));
    const newBalance = result.rows[0].balance;
    return newBalance;
}
export async function subBalance(user_id:string,value:number){
    const balance = await getBalance(user_id);
    const q:QueryConfig = {
        name:`subBalance`,
        text:`UPDATE balances SET balance=(SELECT balance FROM balances WHERE user_id=$1)-$2 WHERE user_id=$1 RETURNING balance;`,
        values:[user_id,balance-value<0 ? balance : value]
    }
    let result = (await query<{balance:number}>(q));
    const newBalance = result.rows[0].balance;
    return newBalance;
}
