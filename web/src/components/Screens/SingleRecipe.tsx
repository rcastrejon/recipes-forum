import { CardMedia, IconButton } from "@mui/material";
import { useEffect } from "react"
import { fetchEventSource } from "@microsoft/fetch-event-source";
import * as appService from '../../services/services';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import React from "react";
import { Recipe } from "../../interfaces/Recipe";
class FatalError extends Error { }

//Componente que genera la vista de una receta en particular
export const SingleRecipe: React.FC = () => {
    const [recipe,setRecipe] = React.useState<Recipe>(new Recipe);
    const [likes,setLikes] = React.useState(recipe.likes_count);
    const [liked,setLiked] = React.useState(recipe.liked);
    const [counter,setCounter] = React.useState('0');

    const handleLike = () => { 
      const addition = liked ? -1 : 1;
      setLikes(likes + addition);
      setLiked(!liked);
      updateLikes(!liked);
    }

    const getRecipeContent = async(data:string) => {
        await appService.getRecipe(data).then((res:any) => {
            setRecipe(res);
            setLikes(res.likes_count);
            setLiked(res.liked);
          }
        ).catch((err:any) => {
        })
    }

    const updateLikes = async(isLiked:boolean) => {
        isLiked ? 
        await appService.likeRecipe(recipe.id) : 
        await appService.unlikeRecipe(recipe.id);
    }
    
    useEffect(() => {
        const id = window.location.href.split('/')[4];
        getRecipeContent(id);        
        const controller = new AbortController();
        const notify = async(id:string) => {
          await fetchEventSource(`https://recipes-forum-production.up.railway.app/live/${id}`, {
              signal: controller.signal,
              onmessage(event) {
                if(event.event=='update'){
                  setCounter(event.data);
                }
              },
              onclose() {
              },
              onerror(err) {
                console.log('check with server');
                
                throw err;
              },
            });
        }
        notify(id);
        return () => {
          controller.abort();
        }
    }, [])

    return (
        <div className="justify-content-center" style={{maxWidth:700,margin:'auto'}}>
            {recipe.title.length ==0 && <h1>Loading✨</h1>}
            <h1>{recipe.title}</h1>
            
            <CardMedia
                component="img"
                image={recipe.thumbnail_url}
                alt=""
                sx={{borderRadius:3}}

                className='jrounded mx-auto d-block'
            />

            <div className="d-flex justify-content-between p-3 text-black" style={{gap:'.7vw'}}>
                <div className="align-bottom metadata" style={{padding:0,paddingTop:'10px'}}>@{recipe.created_by.display_name}</div>
                <span className="align-bottom metadata" style={{padding:0,paddingTop:'10px'}}>{counter} 👀</span>
                <IconButton onClick={handleLike}>
                    <span style={{fontSize:'15px',marginTop:'5px',marginRight:'3px'}} className='align-text-bottom'>
                        {likes}
                    </span>
                    <ThumbUpIcon sx={{color: liked ? '#387780':'gray'}}/>
                </IconButton>
            </div>

            <div style={{textAlign:"start"}} dangerouslySetInnerHTML={{__html:recipe.content_html}}>
            </div>
        </div>
    )
}