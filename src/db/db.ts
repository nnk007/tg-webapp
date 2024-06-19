import pg from 'pg'
const { Pool } = pg
const pool = new Pool({database:"tg_webapp",user:'postgres',password:(process.env as unknown as {PSQL_PWD:string}).PSQL_PWD});

export function query<T extends pg.QueryResultRow>(query:pg.QueryConfig):Promise<pg.QueryResult<T>>;
export function query<T extends pg.QueryResultRow>(text:string,params?:any[]):Promise<pg.QueryResult<T>>;
export async function query<T extends pg.QueryResultRow>(...args:any[]){
  if(args.length==1 && Object.hasOwn(args[0]!,"text")) {
    const query:pg.QueryConfig = args[0];
    return await pool.query(query);
  } else {
    const text = args[0];
    const params = args[1];
    return await pool.query<T>(text, params);
  }
}