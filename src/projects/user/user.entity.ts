export interface IUserRepository {
  post(payload: IBaseUser & {password_hash:string}): Promise<IBaseUser >;
  put(payload: IBaseUser): Promise<IUpdateUser>;
  get(id: string): Promise<IBaseUser>;
  delete(id: string): Promise<void>;
}

export interface IBaseUser {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active?: boolean;
}

export type IUpdateUser = {
  first_name: string;
  last_name: string;
  email: string;
};

export interface IWithPassword {
  password: string;
}
