import * as React from 'react';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useForm } from "react-hook-form";
import * as appService from '../../services/services';
import RestoreIcon from '@mui/icons-material/Restore';
import { Cursor, Recipe } from '../../interfaces/Recipe';

interface Props {
  undoAction: () => Promise<void>;
  sorting: string;
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  setCursor: React.Dispatch<React.SetStateAction<Cursor>>;
}

export const SearchBar: React.FC<Props> = (props) => {
  const [isSearched, setIsSearched] = React.useState(false);

  React.useEffect(() => {
    document.getElementById("undoButton")!.onclick = 
    ()=> {
      props.undoAction();
      setValue('search','');
      setIsSearched(false);
    };
  }, []);
  
  const {
    register,
    handleSubmit,
    getValues,
    setValue
  } = useForm({
    defaultValues: {
      search: ''
    }
  });

  const search = async(data:any) => {
    await appService.searchRecipes({name:getValues('search'),sorting:props.sorting,page:1,limit:20}).then((res:any) => {
      props.setRecipes(res.data);
      props.setCursor({next_page:null,previous_page:null});
      setIsSearched(true);
    }
    ).catch((err:any) => {
      
    })
  }

  const onSubmit = (data:any) => {
    search(data);
  };
  
  return (
    <div style={{margin:'auto',padding:'auto',width:'100%'}} id='SearchBarContainer'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <OutlinedInput {...register("search", { required: true })} size='small' style={{width:'145px'}} placeholder="Buscar receta" autoComplete='off'/>
        <span style={{marginLeft:'5pt'}}>
            <Button variant="contained" type='submit'>Buscar</Button>
            <span id='undoButton'>
              {isSearched && <RestoreIcon  fontSize="medium" sx={{color: '#0B2027', cursor:'pointer'}} style={{marginLeft:'5pt'}}/>}
            </span>
        </span>
      </form>
    </div>
  );
}