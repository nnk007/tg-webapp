import { getUpgrade } from "@/db/upgrade";
import { RouteHandler } from "next/dist/server/base-server";
import { NextRequest, NextResponse } from "next/server";

export const GET:RouteHandler = async (req:NextRequest,res:NextResponse&{params:{upgrade_id:string}})=>{
    const _upgrade_id = res.params.upgrade_id;
    if(!_upgrade_id) return Response.json('No upgrade_id specified',{status:400});
    const upgrade_id = Number.parseInt(_upgrade_id); 
    if(!upgrade_id) return Response.json('Invalid upgrade_id specified',{status:400});
    const upgrade = await getUpgrade(upgrade_id);
    if(!upgrade) return Response.json(`Upgrade with id ${upgrade_id} not found.`,{status:404});
    return Response.json(JSON.stringify(upgrade),{});
};