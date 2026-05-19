export interface INavgatorEntitiy {
  get(role: string): Promise<INavigatorItem[]>;
}
export type  INavigatorItem = {
    label : string,
    route_link : string,
    icon : string
    role : string
}
