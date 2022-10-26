import { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { User } from '../types/User';
import { AuthContext, UserContext } from '../context/AuthContext';
import * as appService from '../../services/services';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const cookies = new Cookies();

    // Token de la suite
    const [dgtoken] = useState<string>(() => {
        console.log('hello');
        let temp: string = 'Bearer: ' + localStorage.getItem('security-token');
        return temp || '';
    });

    // Token de la aplicacion
    const [token, setToken] = useState(localStorage.getItem("security-token") || 'holder');

    // Informacion del usuario logueado
    const [duser, setUser] = useState<User>(() => {
        const duserSer = JSON.stringify({email: '', name: '', lastname: '', role: '', id: 0});
        return duserSer ? Object.assign(new User(), JSON.parse(duserSer)) : new User();
    });


    useEffect(() => {
        if (!Boolean(dgtoken)) { // si la suite no esta logueado
            localStorage.clear();
            if (import.meta.env.VITE_PRODUCTION === 'true') {
                window.location.href = '/login';
            }
            return;
        }

        return () => {
            // VALIDA TOKEN EN EL BACKEND
            // appService.hasValidToken()
            //     .then(async (resp) => {
            //         return (resp.ok);
            //     });
            
        }
    }, [token]);

    return (
        <AuthContext.Provider value={token}>
            {children}
        </AuthContext.Provider>
    )
}