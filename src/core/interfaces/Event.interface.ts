import { IAssets } from "./Assets.interface";

export interface IrecentEvents{
    addressId:string,
    assets: IAssets[],
    id:string,
    startDate:Date,
    title:string
}