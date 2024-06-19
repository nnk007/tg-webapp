interface Upgrade {
    id:number,
    _name:string,
    name:string,
    description:string
    base_price:number
}
interface UserUpgrade extends Upgrade {
    lvl:number
}