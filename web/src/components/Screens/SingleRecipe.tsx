import { CardMedia, IconButton } from "@mui/material";
import { useEffect } from "react"
import { useParams } from "react-router-dom";
import { oneRecipe } from "../../placeHolders/DashboardCards";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import React from "react";

//Componente que genera la vista de una receta en particular
export const SingleRecipe: React.FC = () => {
    //const { id } = useParams();
    const [likes,setLikes] = React.useState(10);
    const [liked,setLiked] = React.useState(true);

    const handleLike = () => { 
      const addition = liked ? -1 : 1;
      setLikes(likes + addition);
      setLiked(!liked);
    }
    
    useEffect(() => {
    }, [])

    return (
        <div className="justify-content-center" style={{maxWidth:700,margin:'auto'}}>
            <h1>{oneRecipe.title}</h1>
            
            <CardMedia
                component="img"
                image={oneRecipe.thumbnail_url}
                alt="sandwich"
                sx={{borderRadius:3}}

                className='jrounded mx-auto d-block'
            />

            <div className="d-flex justify-content-between p-3 text-black" style={{gap:'.7vw'}}>
                <div className="align-bottom" style={{padding:0,paddingTop:'5px'}}>@{oneRecipe.created_by.display_name}</div>

                <IconButton onClick={handleLike}>
                    <span style={{fontSize:'15px',marginTop:'5px',marginRight:'3px'}} className='align-text-bottom'>
                        {likes}
                    </span>
                    <ThumbUpIcon sx={{color: liked ? '#387780':'gray'}}/>
                </IconButton>
            </div>

            <div style={{textAlign:"start"}} dangerouslySetInnerHTML={{__html:oneRecipe.content_html}}>
            </div>
        </div>
    )
}