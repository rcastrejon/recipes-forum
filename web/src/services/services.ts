import { Key } from 'react';
import { Recipe,FetchRecipes } from '../interfaces/Recipe';
import { RenderedRecipe } from '../interfaces/RenderedRecipe';
import { deleteMethod, get, post, put,patch } from './base-services';

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

export const searchRecipes = (body:any): Promise<FetchRecipes> => get(
    `recipes?sorting=${body.sorting}&search=${body.name}&page=${body.page}&limit=${body.limit}`);

export const getRecipe = (id:string): Promise<Response> => get(`recipes/${id}`);

export const getProfileInfo = (): Promise<Response> => get(`me/`);

export const getProfileRecipes = (body:any): Promise<FetchRecipes> => get(`me/recipes?page=${body.page}&limit=${body.limit}`);

export const getProfileLikes = (body:any): Promise<FetchRecipes> => get(`me/likes?page=${body.page}&limit=${body.limit}`);

export const likeRecipe = (id:Key): Promise<Response> => post(`recipes/${id}/likes`,{});

export const unlikeRecipe = (id:Key): Promise<Response> => deleteMethod(`recipes/${id}/likes`,{});

export const getLiveRecipes = (): Promise<Recipe[]> => get(`live`);

export const notifyView = (id:Key): Promise<Response> => get(`recipes/${id}`);

export const publishRecipe = async(recipe:any):Promise<Response> => {
    return await fetch('https://recipes-forum-api.onrender.com/recipes',{
        method:'POST',
        headers:{
            "Authorization": 'Bearer ' + localStorage.getItem("security-token") || "",
            "Access-Control-Allow-Origin": "https://recipes-forum-api.onrender.com/"
        },
        body: recipe
    });
}

export const editRecipe = async(recipe:any,id:Key):Promise<Response> => patch(`recipes/${id}`,recipe);

export const deleteRecipe = (id:Key): Promise<Response> => deleteMethod(`recipes/${id}`,{})