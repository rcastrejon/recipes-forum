import { User } from "./User";

export class RenderedRecipe{
    created_at: string='';
    updated_at: string='';
    id: string='';
    title: string='';
    content_md: string='';
    content_html: string='';
    created_by: User = new User();
    likes_count: number = 0;
    thumbnail_url: string='';
    liked: boolean = true
}