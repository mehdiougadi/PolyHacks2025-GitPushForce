import Item from "./item";

export default interface User{
    uid: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    items: Item[];
    profilePicture: string;
}