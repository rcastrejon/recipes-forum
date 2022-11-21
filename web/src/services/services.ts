import { Key } from 'react';
import { Recipe,FetchRecipes } from '../interfaces/Recipe';
import { deleteMethod, get, post, put } from './base-services';

/**
 * Valida si el token de aplicacion es valido
 * @returns 
 */
export const hasValidToken = (): Promise<Response> => get('is_authenticated')

//post login
export const postLogin = (body: any): Promise<Response> => {
    const query = new URLSearchParams();
    query.append('username',body.username);
    query.append('password',body.password);
    
    return fetch('https://recipes-forum-api.onrender.com/login',{
        body:query,
        method:'POST'
    }).then(
        res=> {
            if(res.status == 200){
                return res.json();
              } else {
                alert('Usuario o contraseña incorrectos');
                throw new Error();
              }
            
        }
    )
}

export const postRegister = (body:any): Promise<Response> =>{
    return post('register',body);
}

export const getRecipes = (body:any): Promise<FetchRecipes> => get(
    `recipes?sorting=${body.sorting}&page=${body.page}&limit=${body.limit}`);

export const getRecipe = (id:string): Promise<Response> => get(`recipes/${id}`);

export const getProfileInfo = (): Promise<Response> => get(`me/`);

export const getProfileRecipes = (): Promise<Response> => get(`me/recipes`);

export const getProfileLikes = (): Promise<Response> => get(`me/likes`);

export const likeRecipe = (id:Key): Promise<Response> => post(`recipes/${id}/likes`,{});

export const unlikeRecipe = (id:Key): Promise<Response> => deleteMethod(`recipes/${id}/likes`,{});

export const getLiveRecipes = (): Promise<Recipe[]> => get(`live`);

export const notifyView = (id:Key): Promise<Response> => get(`recipes/${id}`);