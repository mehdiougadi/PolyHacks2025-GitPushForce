import Item from "./item";

export default interface Category{
    name: string;
    items: Item[];
    icon: string;  
}