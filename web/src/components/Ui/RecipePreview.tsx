import * as React from 'react';
import * as appService from '../../services/services';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Recipe } from '../../interfaces/Recipe';
import Typography from '@mui/material/Typography';
import DownloadIcon from '@mui/icons-material/Download';
// @ts-ignore
import { saveAs } from 'file-saver';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface RecipeReviewCardProps {
  recipe: Recipe;
}

export const RecipePreview: React.FC<RecipeReviewCardProps> = ({recipe}) => {
  const [expanded, setExpanded] = React.useState(false);
  const [likes,setLikes] = React.useState(recipe.likes_count);
  const [liked,setLiked] = React.useState(recipe.liked);

  React.useEffect(()=>{
    setLikes(recipe.likes_count);
    setLiked(recipe.liked);
  },[]);

  const handleLike = () => { 
    const addition = liked ? -1 : 1;
    setLikes(likes + addition);
    setLiked(!liked);
    updateLikes(!liked);
  }
  
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  
  function timeSince(dateString: string) {
    let date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    const interval =  Math.floor(seconds / 86400);
    return interval;
  }  
  
  function padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  function uploadedAt(dateString: string) {
    let date = new Date(dateString);
    return [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
  } 

  const downloadImage = () => {
    var a = document.createElement('a');
    a.href = recipe.thumbnail_url;
    a.download = recipe.title;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function renderTitle(){
    if(recipe.title.length > 32){
        return recipe.title.substring(0,32) + '...'
    }
    if(recipe.title.length < 17){
      return recipe.title
    }
    return recipe.title;
  }

  const updateLikes = async(isLiked:boolean) => {
    isLiked ? 
    await appService.likeRecipe(recipe.id) : 
    await appService.unlikeRecipe(recipe.id);
  }

  return (
    <Card sx={{ maxWidth: 270,minHeight:370,maxHeight:370}}>
      <CardHeader
        onClick={()=>{window.location.href='/recipe/'+recipe.id}}
        title={renderTitle()}
        sx={{cursor:'pointer',whiteSpace: "break-spaces"}}
        subheader={(renderTitle().length <17 ? '\n':'')+'@'+recipe.created_by.username + ' - ' + timeSince(recipe.created_at) + ' días'}
      />
      
      <CardMedia
        component="img"
        height="194"
        image={recipe.thumbnail_url}
        alt="Dish"
        sx={{borderRadius:3, cursor:'pointer'}}
        onClick={()=>{window.location.href='/recipe/'+recipe.id}}
      />
      <CardActions disableSpacing>
        <IconButton onClick={handleLike}>
          <span style={{fontSize:'15px',marginTop:'5px',marginRight:'3px'}} className='align-text-bottom'>
            {likes}
          </span>
          <ThumbUpIcon sx={{color: liked ? '#387780':'gray'}}/>
        </IconButton>
        
        <IconButton onClick={downloadImage}>
          <DownloadIcon className='DownloadButton'/>
        </IconButton>

        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <Typography color={'gray'}>
          {uploadedAt(recipe.updated_at)}
        </Typography>
        </ExpandMore>
        
      </CardActions>
    </Card>
  );
}
