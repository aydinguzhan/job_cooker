import { IBaseUser, IWithPassword } from '../user/user.entity';

export type IAuthRepositry = {
  login(payload: ILogin): Promise<ILoginResult>;
  register(payload: IRegister): Promise<IBaseUser>;
};

export type ILogin = {
  email: string;
  password: string;
};
export type ILoginResult = {
  email: string;
  password_hash: string;
};

export type IRegister = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export interface ITokenResponse {
  user: IUserInfo;
  accessToken: string;
}

export interface IUserInfo {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export type IUser = IBaseUser & IWithPassword;
