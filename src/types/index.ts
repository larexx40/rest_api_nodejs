export interface Recipe{
    title: string;
    ingredients: string[];
    instructions: string;
    imageUrl?: string;
}
export interface User{
    name: string;
    email: string;
    age: number;
}