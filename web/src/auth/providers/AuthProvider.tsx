import { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { User } from '../types/User';
import { AuthContext, UserContext } from '../context/AuthContext';
import * as appService from '../../services/services';
import { CustomSnackbar } from '../../components/Ui/CustomSnackbar';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const cookies = new Cookies();
    const [inputText, setInputText] = useState('Por favor incia sesión 💡');

    // Token de la aplicacion
    const [token, setToken] = useState(localStorage.getItem("security-token") || 'holder');

    // Informacion del usuario logueado
    const [duser, setUser] = useState<User>(() => {
        const duserSer = JSON.stringify({email: '', name: '', lastname: '', role: '', id: 0});
        return duserSer ? Object.assign(new User(), JSON.parse(duserSer)) : new User();
    });


    useEffect(() => {
        if(cookies.get('isRegisterSuccessful') == 'true') setInputText('Registro exitoso 🎉');
        appService.hasValidToken()
                .then(async (resp) => {
                    return (resp.ok);
                });
    }, [token]);

    return (
        <AuthContext.Provider value={token}>
            {children}
            {(token === 'holder') &&
                <CustomSnackbar inputText={inputText}/>}
        </AuthContext.Provider>
    )
}