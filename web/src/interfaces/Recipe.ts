import { User } from "./User";

export class Recipe{
    id: string = "";
    title: string = "";
    created_at: string = "";
    updated_at: string = "";
    created_by: User = new User();
    likes_count: number = 0;
    thumbnail_url: string = "";
    liked: boolean = false;
    content_html: string = "";
}

export interface FetchRecipes{
    data:Recipe[],
    cursor:Cursor
}

export interface Cursor{
    next_page: number | null,
    previous_page: number | null
}