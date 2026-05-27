export interface INavigationEntitiy{
    get(user_id:string): Promise<INavigationEntitiy[]>
}
export interface INavigationItem {
  id: string;
  label: string;
  icon: string;
  route_link: string;
  role_id: string;
  created_at: string;
  updated_at:string;
  deleted_at:string;
  status: boolean;
}
