import { useState } from "react";

export const PermissionProvider = ({children, permissions} : {children: React.ReactNode, permissions: string[]}) => {

    const [actions,_] = useState<string[]>(()=>{
        const perSeri = localStorage.getItem('permissions');
        if(perSeri){
            return JSON.parse(perSeri);
        }
        return [];
    });

    return actions.some((code) => permissions.includes(code)) ? children : (
        window.location.href = '/login'
    );
}