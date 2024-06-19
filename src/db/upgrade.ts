import { QueryConfig } from "pg";
import { query } from "./db";
import { getBalance, subBalance } from "./balance";

export async function getAllUpgrades():Promise<Upgrade[]> {
    const q: QueryConfig = {
        name: "getAllUpgrades",
        text: `SELECT upgrade_id,name,display_name,description,base_price FROM upgrades;`,
        values: []
    };
    let result = (await query<{ upgrade_id: number,name:string,display_name:string,description:string,base_price:string }>(q));
    return result.rows.map(row=>{
        return {
            id:row.upgrade_id,
            _name:row.name,
            name:row.display_name,
            description:row.description,
            base_price:+row.base_price,
        }
    });
}
export async function getUpgrade(upgrade_id:number):Promise<Upgrade|null> {
    const q: QueryConfig = {
        name: "getUpgradeByID",
        text: `SELECT upgrade_id,name,display_name,description,base_price FROM upgrades WHERE upgrade_id=$1;`,
        values: [upgrade_id]
    };
    let result = (await query<{ upgrade_id: number,name:string,display_name:string,description:string,base_price:string }>(q));
    if(result.rowCount===0) return null;
    return result.rows.map(row=>{
        return {
            id:row.upgrade_id,
            _name:row.name,
            name:row.display_name,
            description:row.description,
            base_price:+row.base_price,
        }
    })[0];
}
export async function getUpgrade2(upgrade_name:string):Promise<Upgrade|null> {
    const q: QueryConfig = {
        name: "getUpgradeByName",
        text: `SELECT upgrade_id,name,display_name,description,base_price FROM upgrades WHERE name=$1;`,
        values: [upgrade_name]
    };
    let result = (await query<{ upgrade_id: number,name:string,display_name:string,description:string,base_price:string }>(q));
    if(result.rowCount===0) return null;
    return result.rows.map(row=>{
        return {
            id:row.upgrade_id,
            _name:row.name,
            name:row.display_name,
            description:row.description,
            base_price:+row.base_price,
        }
    })[0];
}
export async function getUserUpgrades(user_id:string):Promise<UserUpgrade[]>{
    const q: QueryConfig = {
        name: "getUserUpgrades",
        text: `SELECT uu.upgrade_id, uu.upgrade_count AS upgrade_level, u.name AS upgrade_name, u.display_name, u.description AS upgrade_description, u.base_price AS upgrade_base_price FROM user_upgrades uu INNER JOIN upgrades u ON uu.upgrade_id = u.upgrade_id WHERE user_id=$1;`,
        values: [user_id]
    };
    let result = (await query<{ upgrade_id: number,upgrade_level:number,upgrade_name:string,display_name:string,upgrade_description:string,upgrade_base_price:string }>(q));
    return result.rows.map(row=>{
        return {
            id:row.upgrade_id,
            _name:row.upgrade_name,
            name:row.display_name,
            description:row.upgrade_description,
            base_price:+row.upgrade_base_price,
            lvl:row.upgrade_level
        }
    });
}

export async function getUserUpgrade(user_id:number,upgrade_id:number):Promise<UserUpgrade|undefined>{
    const q:QueryConfig = {
        text: `SELECT uu.upgrade_id, uu.upgrade_count AS upgrade_level, u.name AS upgrade_name, u.display_name, u.description AS upgrade_description, u.base_price AS upgrade_base_price FROM user_upgrades uu INNER JOIN upgrades u ON uu.upgrade_id = u.upgrade_id WHERE uu.user_id=$1 AND uu.upgrade_id=$2;`,
        values:[user_id,upgrade_id]
    };
    let result = (await query<{ upgrade_id: number,upgrade_level:number,upgrade_name:string,display_name:string,upgrade_description:string,upgrade_base_price:string }>(q));
    if(result.rowCount==0) return undefined;
    const r = result.rows[0];
    return {
        id: r.upgrade_id,
        _name:r.upgrade_name,
        name:r.display_name,
        description:r.upgrade_description,
        base_price:+r.upgrade_base_price,
        lvl:r.upgrade_level
    };
}
export async function getUserUpgrade2(user_id:number,upgrade_name:string):Promise<UserUpgrade|undefined>{
    const q:QueryConfig = {
        text: `SELECT uu.upgrade_id, uu.upgrade_count AS upgrade_level, u.name AS upgrade_name, u.display_name, u.description AS upgrade_description, u.base_price AS upgrade_base_price FROM user_upgrades uu INNER JOIN upgrades u ON uu.upgrade_id = u.upgrade_id WHERE uu.user_id=$1 AND u.upgrade_name=$2;`,
        values:[user_id,upgrade_name]
    };
    let result = (await query<{ upgrade_id: number,upgrade_level:number,upgrade_name:string,display_name:string,upgrade_description:string,upgrade_base_price:string }>(q));
    if(result.rowCount==0) return undefined;
    const r = result.rows[0];
    return {
        id: r.upgrade_id,
        _name:r.upgrade_name,
        name:r.display_name,
        description:r.upgrade_description,
        base_price:+r.upgrade_base_price,
        lvl:r.upgrade_level
    };
}
export async function purchaseUpgrade(user_id:number,upgrade_id:number):Promise<boolean>{
    let upgrade:Upgrade|undefined = await getUserUpgrade(user_id,upgrade_id);
    let upgrade_level = 0;
    const uu = upgrade as UserUpgrade;
    if(uu && uu.lvl) {
        upgrade_level=uu.lvl+1;
    }
    else {
        upgrade = await getUpgrade(upgrade_id);
        upgrade_level = 1;

    }
    const upgrade_price = upgrade_level * upgrade!.base_price;
    //calc price, test sub from balance, proceed ?
    const balance = await getBalance(''+user_id);
    if(balance<upgrade_price){
        console.log(balance,upgrade_price);
        return false;
    }
    const nb = await subBalance(''+user_id,upgrade_price);
    console.log('PrePurchase PostSub:',nb);
    const q: QueryConfig = {
        name: "purchaseUpgrade",
        text: `UPDATE user_upgrades SET upgrade_count=$3 WHERE user_id=$1 AND upgrade_id=$2 RETURNING upgrade_count;`,
        values: [user_id,upgrade_id,upgrade_level]
    };
    const result = await query<{upgrade_count:number}>(q);
    console.log(`New upgrade level = `,result.rows[0].upgrade_count);
    return true;
}