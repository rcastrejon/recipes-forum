import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import '../../styles/auth.css';

export const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      password: ''
    }
  });

  
  const onSubmit = (data:any) => {
    window.location.href = '/dashboard';
  };
  

  return (
    <div className="row d-flex justify-content-center">
      <div className="col-md-6">
        <svg width="90" height="117" viewBox="0 0 90 117" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M45 0.473663C22.5 0.473663 0 41.2855 0 71.3947C0 96.3461 20.1214 116.526 45 116.526C69.8786 116.526 90 96.3461 90 71.3947C90 41.2855 67.5 0.473663 45 0.473663ZM51.4286 97.1842C32.1429 97.1842 19.2857 84.354 19.2857 64.9474C19.2857 61.4013 22.1786 58.5 25.7143 58.5C29.25 58.5 32.1429 61.4013 32.1429 64.9474C32.1429 83.7737 47.7 84.2895 51.4286 84.2895C54.9643 84.2895 57.8571 87.1908 57.8571 90.7368C57.8571 94.2829 54.9643 97.1842 51.4286 97.1842Z" fill="#FFDE0A"/>
        </svg>

        <form onSubmit={handleSubmit(onSubmit)}>

          <h1>Recetario Foraneo</h1>
          
          <div style={{marginTop:'20pt'}}>
            <h3> Nombre de usuario </h3>
            <input defaultValue="test" {...register("name", { required: true })} autoComplete='off' className="form-control"/>

            <h3> Contraseña </h3>
            <input {...register("password", { required: true })} autoComplete='off' type={'password'} className="form-control"/>

            <br/>
            <input id='submit' type="submit" value="INGRESAR"/>

            
            <div style={{paddingTop:'8pt'}}>
              <a href="/register">Or register</a> 🎉
            </div>
          </div>
          
        </form>
      </div>
    </div>
  );
}