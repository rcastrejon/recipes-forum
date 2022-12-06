import { Link } from "react-router-dom"
import { UserContext } from "../auth"
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import { Box, Button, List, ListItem, ListItemButton, ListItemIcon, SwipeableDrawer } from "@mui/material";
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import StarIcon from '@mui/icons-material/Star';
import '../styles/navbar.css';


export const Navbar = () => {
    const [isShown, setIsShown] = useState(false);
    const routes:string[] = ['/perfil','/mis-recetas','/favoritos'];

    const toggleDrawer =
    (isOpen: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event && event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setIsShown(isOpen);
    };

    const list = (anchor:string) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(true)}
        >
          <List>
            {['Ver Perfil', 'Mis Recetas', 'Favoritos'].map((text, index) => (
              <div className='drawerLinks' key={index}>
                <ListItem key={text} disablePadding onClick={()=>{window.location.href=routes[index]}}>
                    <ListItemButton >
                        <ListItemIcon >
                            {index == 0 && <AccountCircleIcon />}
                            {index == 1 && <AccountBalanceWalletIcon />}
                            {index == 2 && <StarIcon />}
                        </ListItemIcon>
                    <ListItemText primary={text}/>
                    </ListItemButton>
                </ListItem>
              </div>
            ))}
          </List>
          <Divider />
            <List>
                {['Cerrar sesión'].map((text, index) => (
                <div className='drawerLinks' key={index}>
                    <ListItem key={text} disablePadding onClick={()=>{
                        localStorage.setItem('security-token','');
                        window.location.href = '/login'}}>
                        <ListItemButton>
                            <ListItemIcon>
                                {index == 0 && <LogoutIcon/> }
                            </ListItemIcon>
                            <ListItemText primary={text}/>
                        </ListItemButton>
                    </ListItem>
                </div>
                ))}
            </List>
        </Box>
    );
    
    return (
        <UserContext.Consumer>
            {
                dataUser => (
                    <div className="d-flex justify-content-between mw-100" style={{boxShadow:'0 2px 4px 0 rgba(0,0,0,.2)',padding:'5pt'}} id='NavBarContainer'>
                        <div>
                            <Link to="/" className="logo flex items-center" style={{padding:0,marginRight:'5pt'}}>
                                <svg width="38pt" height="49pt" viewBox="0 0 90 117" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M45 0.473663C22.5 0.473663 0 41.2855 0 71.3947C0 96.3461 20.1214 116.526 45 116.526C69.8786 116.526 90 96.3461 90 71.3947C90 41.2855 67.5 0.473663 45 0.473663ZM51.4286 97.1842C32.1429 97.1842 19.2857 84.354 19.2857 64.9474C19.2857 61.4013 22.1786 58.5 25.7143 58.5C29.25 58.5 32.1429 61.4013 32.1429 64.9474C32.1429 83.7737 47.7 84.2895 51.4286 84.2895C54.9643 84.2895 57.8571 87.1908 57.8571 90.7368C57.8571 94.2829 54.9643 97.1842 51.4286 97.1842Z" fill="#FFDE0A"/>
                                </svg>
                            </Link>

                            <span className="titulo">
                                RECETARIO FORANEO
                            </span>
                        </div>
                        <div className="d-flex align-items-center justify-content-center">
                            <Button onClick={()=>setIsShown(true)} style={{color:'black'}}><MenuIcon fontSize="large" /></Button> 
                        </div>

                        <SwipeableDrawer
                            anchor={'bottom'}
                            open={isShown}
                            onClose={toggleDrawer(false)}
                            onOpen={toggleDrawer(true)}
                            >
                            {list('bottom')}
                        </SwipeableDrawer>
                    </div>
                )
            }
        </UserContext.Consumer>
    )
}