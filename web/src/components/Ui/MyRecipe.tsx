import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { Recipe } from '../../interfaces/Recipe';
import { CardMedia, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import React, { useEffect, useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 145,
  width:320,
  lineHeight: '60px',
}));

const lightTheme = createTheme({ palette: { mode: 'light' } });
interface Props {
    recipe: Recipe;
}
export const MyRecipe: React.FC<Props> = ({recipe}) => {
    const [likes,setLikes] = useState(recipe.likes_count);
    const [liked,setLiked] = useState(recipe.liked);

    const handleLike = () => { 
        const addition = liked ? -1 : 1;
        setLikes(likes + addition);
        setLiked(!liked);
    }

    function renderTitle(){
        if(recipe.title.length > 22){
            return recipe.title.substring(0,22) + '...'
        }
        return recipe.title;
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
            <ThemeProvider theme={lightTheme}>
                <Box
                sx={{
                    p: 1,
                    bgcolor: 'background.default',
                    display: 'grid',
                    gridTemplateColumns: { md: '1fr' },
                    gap: 2,

                }}
                >
                
                <Item elevation={12}>
                <div className="d-flex justify-content-between mb-3">
                    <div className='row p-2'>
                        <h1 className='tileInMyRecipe' onClick={()=>{window.location.href='/editRecipe/'+recipe.id}}>
                            {renderTitle()+' ↗️'}
                        </h1>
                        <IconButton onClick={handleLike} className='buttonIcon'>
                            <span className='numbersInMyRecipe align-text-bottom'>
                                {likes}
                            </span>
                            <ThumbUpIcon sx={{color: liked ? '#387780':'gray'}}/>
                        </IconButton>
                        
                        {/* <IconButton className='buttonIcon'>
                            <span className='numbersInMyRecipe align-text-bottom'>
                                {recipe.likes_count}
                            </span>
                            <VisibilityIcon sx={{color: '#E83151'}}/>
                        </IconButton> */}
                    </div>
                    
                    <CardMedia
                        component="img"
                        height="140px"
                        image={recipe.thumbnail_url}
                        alt="dish"
                        sx={{borderRadius:3}}
                        className='p-2 align-middle'
                        onClick={()=>{window.location.href='/recipe/'+recipe.id}}
                    />
                    
                </div>
                </Item>
                </Box>
            </ThemeProvider>
            </Grid>
        </Grid>
    );
}
