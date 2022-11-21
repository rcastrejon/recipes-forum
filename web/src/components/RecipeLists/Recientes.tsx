import { useEffect, useState } from "react"
import * as appService from '../../services/services';
import { FetchRecipes, Recipe } from "../../interfaces/Recipe";
import Grid from '@mui/material/Unstable_Grid2';
import { RecipePreview } from "../Ui/RecipePreview";

export const Recientes= () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(()=>{
        getMostRecentRecipes();
    },[])

    const getMostRecentRecipes = async() => {
        await appService.getRecipes({sorting:'created_at',page:1,limit:20}).then((res:FetchRecipes) => {
            let response:FetchRecipes = res as any;
            setRecipes(response.data);
          })
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