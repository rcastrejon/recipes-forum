import * as React from 'react';
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

export const CutsomCard: React.FC<RecipeReviewCardProps> = ({recipe}) => {
  const [expanded, setExpanded] = React.useState(false);
  const [likes,setLikes] = React.useState(recipe.likes_count);
  
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
    saveAs(recipe.thumbnail_url, `${recipe.title}.jpg`) // Put your image url here.
  }

  const handleLike = () => { 
    setLikes(likes + 1);
  }

  return (
    <Card sx={{ maxWidth: 270 }}>
      <CardHeader
        onClick={()=>{window.location.href='/recipe/'+recipe.id}}
        title={recipe.title}
        subheader={'@'+recipe.created_by.username + ' - ' + timeSince(recipe.created_at) + ' días'}
      />
      <CardMedia
        component="img"
        height="194"
        image={recipe.thumbnail_url}
        alt="Paella dish"
        sx={{borderRadius:3}}
        onClick={()=>{window.location.href='/recipe/'+recipe.id}}
      />
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" onClick={handleLike}>
          <span style={{fontSize:'15px',marginTop:'5px'}} className='align-text-bottom'>
            {likes}
          </span>
          <ThumbUpIcon/>
        </IconButton>
        
        <IconButton aria-label="share" onClick={downloadImage}>
          <DownloadIcon/>
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
