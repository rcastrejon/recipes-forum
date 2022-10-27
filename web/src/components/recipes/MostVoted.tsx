import { useEffect, useState } from "react"
import { mostVotedCards } from "../../placeHolders/DashboardCards";
import { Recipe } from "../../interfaces/Recipe";
import {RecipeReviewCard} from "./CustomCard";
import Grid from '@mui/material/Unstable_Grid2';

export const MostVoted= () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(()=>{
        fetchMostVoted();
    })

    function fetchMostVoted(){
        setRecipes(mostVotedCards);
    }
    

    return(
        <Grid container rowSpacing={4} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {
                recipes.map(
                    ( _item, _index ) => ( // Note: single line expression, so impilicit;y return our ItemComponent
                    <Grid >
                        <RecipeReviewCard recipe={_item} key={_index}/>
                    </Grid>
                ) )
            }
        </Grid>
    )
}