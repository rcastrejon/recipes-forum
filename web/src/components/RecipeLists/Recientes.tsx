import { useEffect, useState } from "react"
import { mostVotedCards } from "../../placeHolders/DashboardCards";
import { Recipe } from "../../interfaces/Recipe";
import {RecipePreview} from "../Ui/RecipePreview";
import Grid from '@mui/material/Unstable_Grid2';

export const Recientes= () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(()=>{
        fetchMostVoted();
    })

    function fetchMostVoted(){
        setRecipes(mostVotedCards);
    }

    return(
        <Grid container rowSpacing={4} columnSpacing={{ xs: 3, sm: 3, md: 3 }} alignItems='start' justifyContent="center" >
            {
                recipes.map(
                    ( _item, _index ) => (
                        <Grid justifySelf={'flex-start'} key={_index}>
                            <RecipePreview recipe={_item } key={_index}/>
                        </Grid>
                    ) 
                )
            }
        </Grid>
    )
}