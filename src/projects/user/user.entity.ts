export interface IUserRepository {
  post(payload: IBaseUser & IWithPassword): Promise<IBaseUser & IWithPassword>;
  put(payload: IBaseUser): Promise<IUpdateUser>;
  get(id: string): Promise<IBaseUser>;
  delete(id: string): Promise<void>;
}

export interface IBaseUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_active: boolean;
}

export type IUpdateUser = {
  first_name: string;
  last_name: string;
  email: string;
};

export interface IWithPassword {
  password: string;
}
