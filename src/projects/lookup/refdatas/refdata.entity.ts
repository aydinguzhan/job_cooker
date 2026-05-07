export interface  IRefdataEntity{
    getSkills() : Promise<IRefdata[]>;

}
export interface IRefdata{
    id :string;
    name : string;
    short_key : string
}