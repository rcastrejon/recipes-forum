import { Key } from 'react';
import { get, post, put } from './base-services';


/**
 * Valida si el token de aplicacion es valido
 * @returns 
 */
export const hasValidToken = (): Promise<Response> => get('is_authenticated')