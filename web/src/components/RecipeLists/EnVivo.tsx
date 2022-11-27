import { useEffect, useState } from "react"
import { Recipe } from "../../interfaces/Recipe";
import * as appService from '../../services/services';
import {RecipePreview} from "../Ui/RecipePreview";
import Grid from '@mui/material/Unstable_Grid2';

export const EnVivo= () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(()=>{
        getMostRecentRecipes();
    },[])

    const getMostRecentRecipes = async() => {
        await appService.getLiveRecipes().then((res:Recipe[]) => {
            let response:Recipe[] = res as any;
            setRecipes(response);
            //console.log('hello');
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
        </>
    )
}