import { useEffect, useState } from "react"
import * as appService from '../../services/services';
import { FetchRecipes, Recipe } from "../../interfaces/Recipe";
import {RecipePreview} from "../Ui/RecipePreview";
import Grid from '@mui/material/Unstable_Grid2';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

export const MostVoted= () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(()=>{
        getMostVotedRecipes();
    },[])

    const getMostVotedRecipes = async() => {
        await appService.getRecipes({sorting:'likes_count',page:1,limit:20}).then((res:FetchRecipes) => {
            let response:FetchRecipes = res as any;
            setRecipes(response.data);
          })
    }

    return(
        <>
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
            <div style={{margin:'auto',paddingTop:'15px'}}>
            <ArrowCircleLeftIcon fontSize="large" sx={{color: false? '#507DBC': "gray"}}/>
            <ArrowCircleRightIcon fontSize="large" sx={{color: '#507DBC'}}/>
            </div>
        </>
    )
}