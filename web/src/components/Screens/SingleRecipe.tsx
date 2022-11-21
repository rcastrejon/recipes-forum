import { CardMedia, IconButton } from "@mui/material";
import { useEffect } from "react"
import { useParams } from "react-router-dom";
import * as appService from '../../services/services';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import React from "react";
import { Recipe } from "../../interfaces/Recipe";

//Componente que genera la vista de una receta en particular
export const SingleRecipe: React.FC = () => {
    const [recipe,setRecipe] = React.useState<Recipe>(new Recipe);
    const [likes,setLikes] = React.useState(recipe.likes_count);
    const [liked,setLiked] = React.useState(recipe.liked);

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
        
    }, [])

    return (
        <div className="justify-content-center" style={{maxWidth:700,margin:'auto'}}>
            <h1>{recipe.title}</h1>
            
            <CardMedia
                component="img"
                image={recipe.thumbnail_url}
                alt="sandwich"
                sx={{borderRadius:3}}

                className='jrounded mx-auto d-block'
            />

            <div className="d-flex justify-content-between p-3 text-black" style={{gap:'.7vw'}}>
                <div className="align-bottom" style={{padding:0,paddingTop:'5px'}}>@{recipe.created_by.display_name}</div>

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