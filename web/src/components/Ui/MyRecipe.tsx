import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { Recipe } from '../../interfaces/Recipe';
import { CardMedia, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import React, { useEffect, useState } from 'react';
import * as appService from '../../services/services';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

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
    const [openConfirmation, setOpen] = React.useState(false);

    const handleLike = () => { 
        const addition = liked ? -1 : 1;
        setLikes(likes + addition);
        setLiked(!liked);
        updateLikes(!liked);
    }

    const deleteRecipe = async() => {
        await appService.deleteRecipe(recipe.id);
        setOpen(false);
        window.location.reload();
    }

    function renderTitle(){
        if(recipe.title.length > 12){
            return recipe.title.substring(0,12) + '...'
        }
        return recipe.title;
    }

    const updateLikes = async(isLiked:boolean) => {
        isLiked ? 
        await appService.likeRecipe(recipe.id) : 
        await appService.unlikeRecipe(recipe.id);
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={6} >
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

                        <IconButton sx={{marginTop:'5pt'}} onClick={()=>{setOpen(true)}} className='buttonIcon'>
                            <DeleteIcon sx={{color:'red'}}/>
                        </IconButton>
                    </div>
                    
                    <CardMedia
                        component="img"
                        height="140px"
                        image={recipe.thumbnail_url}
                        alt="dish"
                        sx={{borderRadius:3}}
                        className='p-2 align-middle ImageToPrint'
                        onClick={()=>{window.location.href='/recipe/'+recipe.id}}
                    />
                    
                </div>
                </Item>
                </Box>
            </ThemeProvider>
            </Grid>

            <Dialog
                open={openConfirmation}
                keepMounted
                onClose={()=>setOpen(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"¡Cuidado!"}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    ¿Seguro que deseas eliminar esta receta?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={()=>setOpen(false)}>Cancelar</Button>
                <Button onClick={deleteRecipe}>Aceptar</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}
