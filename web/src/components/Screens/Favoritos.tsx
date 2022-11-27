import { useEffect, useState } from "react";
import * as appService from '../../services/services';
import { FetchRecipes, Recipe,Cursor } from "../../interfaces/Recipe";
import {RecipePreview} from "../Ui/RecipePreview";
import Grid from '@mui/material/Unstable_Grid2';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

export const Favoritos = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [page, setPage] = useState(1);
    const [cursor, setCursor] = useState<Cursor>({next_page:null,previous_page:null});

    useEffect(()=>{
        getUserLikes();
    },[])

    const getUserLikes = async() => {
        await appService.getProfileLikes({page:1,limit:6}).then((res:FetchRecipes) => {
            let response:FetchRecipes = res as any;
            setRecipes(response.data);
            setCursor(response.cursor);
          })
    }

    const changePage = async (pageIncrement:number) => {
        await appService.getProfileLikes({page:page+pageIncrement,limit:6}).then((res:FetchRecipes) => {
            let response:FetchRecipes = res as any;
            setRecipes(response.data);
            setCursor(response.cursor);
            setPage(page+pageIncrement);
            })
    }

    return (
        <>
            <h1>Favoritos 🔥</h1>
            <Grid container rowSpacing={4} columnSpacing={{ xs: 3, sm: 3, md: 3 }} alignItems='start' justifyContent="center" >
                {
                    recipes.map(
                        ( _item, _index ) => (
                            <Grid justifySelf={'flex-start'} key={_index}>
                                <RecipePreview recipe={_item} key={_index}/>
                            </Grid>
                        ) 
                    )
                }
            </Grid>
            <div style={{margin:'auto',paddingTop:'15px',marginTop:'5pt'}}>
                <span onClick={()=>cursor.previous_page !=null && changePage(-1)}>
                    <ArrowCircleLeftIcon fontSize="large" sx={{color: cursor.previous_page !=null ? '#507DBC': "gray"}}/>
                </span>
                <span onClick={()=>cursor.next_page !=null && changePage(1)}>
                    <ArrowCircleRightIcon fontSize="large" sx={{color: cursor.next_page !=null ? '#507DBC': "gray"}}/>
                </span>
            </div>
        </>
    )
}