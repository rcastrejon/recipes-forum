import { useEffect, useState } from "react"
import { mostVotedCards } from "../../placeHolders/DashboardCards";
import { Recipe } from "../../interfaces/Recipe";
import Grid from '@mui/material/Unstable_Grid2';
import {MyRecipe} from "../Ui/MyRecipe";
import Button from '@mui/material/Button';
import '../../styles/customRules.css';

const likedRecipes = mostVotedCards.filter((item=>{return item.liked == true}))
export const MisRecetas = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(()=>{
        fetchMostVoted();
    })

    function fetchMostVoted(){
        setRecipes(mostVotedCards);
    }

    return (
        <>
            <h1>Mis recetas 👀</h1>
            <div className="myButtonContainer">
                <Button variant="contained" id="buttonAdd" onClick={()=>{window.location.href='/editRecipe/'}}>+ Nueva Receta</Button>
            </div>
            
            <Grid container rowSpacing={4} columnSpacing={{ xs: 3, sm: 3, md: 3 }} alignItems='start' justifyContent="center" >
                {
                    recipes.map(
                        ( _item, _index ) => (
                            <Grid justifySelf={'flex-start'} key={_index}>
                                <MyRecipe recipe={_item} />
                            </Grid>
                        ) 
                    )
                }
            </Grid>
        </>
    )
}