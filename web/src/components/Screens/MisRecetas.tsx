import { useEffect, useState } from "react";
import * as appService from '../../services/services';
import { mostVotedCards } from "../../placeHolders/DashboardCards";
import { Cursor, FetchRecipes, Recipe } from "../../interfaces/Recipe";
import Grid from '@mui/material/Unstable_Grid2';
import {MyRecipe} from "../Ui/MyRecipe";
import Button from '@mui/material/Button';
import '../../styles/customRules.css';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';

const likedRecipes = mostVotedCards.filter((item=>{return item.liked == true}))
export const MisRecetas = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [page, setPage] = useState(1);
    const [cursor, setCursor] = useState<Cursor>({next_page:null,previous_page:null});

    useEffect(()=>{
        getUserRecipes();
    },[])

    const getUserRecipes = async() => {
        await appService.getProfileRecipes({page:1,limit:4}).then((res:FetchRecipes) => {
            let response:Recipe[] = res.data as any;
            setRecipes(response);
        })
    }

    const changePage = async (pageIncrement:number) => {
        await appService.getProfileRecipes({page:page+pageIncrement,limit:4}).then((res:FetchRecipes) => {
            let response:FetchRecipes = res as any;
            setRecipes(response.data);
            setCursor(response.cursor);
            setPage(page+pageIncrement);
            })
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
                            <Grid justifySelf={'flex-start'} key={_index+page}>
                                <MyRecipe recipe={_item} />
                            </Grid>
                        ) 
                    )
                }
            </Grid>
            <div style={{margin:'auto',paddingTop:'20px'}}>
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