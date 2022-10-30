import { Input } from "@mui/material";
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { editRecipe } from "../../placeHolders/DashboardCards";

//Componente que genera la vista de una receta en particular
export const EditRecipe: React.FC = () => {
    const { id } = useParams();
    const fileInput = useRef() as React.MutableRefObject<HTMLInputElement>;
    const [fileName, setFileName] = useState("Nada ha sido seleccionado");

    const onFilechange = ( e:React.ChangeEvent<HTMLInputElement> ) => {
        /*Selected files data can be collected here.*/
        const input = (e.target as HTMLInputElement).files![0];
        setFileName( input? input.name : "Nada ha sido seleccionado" );
    }
    const onBtnClick = () => {
        /*Collecting node-element and performing click*/
        fileInput.current.click();
    }

    useEffect(() => {
        
        if(id){
            setValue('titulo', editRecipe.titulo);
            setValue('tiempo', editRecipe.tiempo);
            setValue('costo', editRecipe.costo);
            setValue('ingredientes', editRecipe.ingredientes);
            setValue('pasos', editRecipe.pasos);
        }

    }, []);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors,isDirty }
      } = useForm({
        defaultValues: {
            titulo: '',
            tiempo: 0,
            costo: 0,
            ingredientes: '',
            pasos: '',
            imagen: ''
        },
      });
    
    function justNumber(e:React.KeyboardEvent<HTMLInputElement>){
        const key = e.key;

        if (key === 'e' || key === '+' || key === '-' || key === '.' ||
            key === ' ' || key == 'Shift') {
            e.preventDefault();
        }
    }

    const onSubmit = (data:any) => {
        //window.location.href = '/mis-recetas';
        console.log(data);
        
    };

    return (
        <div style={{maxWidth:700,margin:'auto'}}>
            <form onSubmit={handleSubmit(onSubmit)}>

                <h1>{id? 'Editar Receta*' : 'Nueva Receta*'}</h1>

                <div style={{marginTop:'20pt'}}>
                <h3> Título* </h3>
                <input {...register("titulo", { required: true })} autoComplete='off' className="form-control"/>

                <div className="d-flex justify-content-between">
                    <div>
                        <h3 style={{textAlign:'start'}}> Tiempo* </h3>
                        <div className="d-flex">
                            <input {...register("tiempo", { required: true, min:0, valueAsNumber: true})}
                            min={0}
                            onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Solo se permiten numeros positvos, sin caracteres :)')}
                            onKeyDown={(e) => justNumber(e)}

                            autoComplete='off' type={'number'} className="form-control smallInput"/>
                            <p className="smallTagForInput">mins</p>
                        </div>
                    </div>
                    
                    <div>
                        <h3 style={{textAlign:'start'}}> Costo* </h3>
                        <div className="d-flex">
                            <p className="smallTagForInput">$</p>
                            <input {...register("costo", { required: true, min:0, valueAsNumber: true})}
                            min={0}

                            onInvalid={e => (e.target as HTMLInputElement).setCustomValidity('Solo se permiten numeros positvos, sin caracteres :)')}
                            onKeyDown={(e) => justNumber(e)}

                            autoComplete='off' type={'number'} className="form-control smallInput"/>
                            <p className="smallTagForInput">MXN</p>
                        </div>
                    </div>
                    
                </div>

                <h3> Ingredientes* </h3>
                <textarea {...register("ingredientes", { required: true })} 
                
                autoComplete='off' className="form-control textArea" rows={5}/>

                <h3> Instrucciones* </h3>
                <textarea {...register("pasos", { required: true })} 
                autoComplete='off' className="form-control textArea" rows={15}/>

                
                <h3> Imagen* </h3>
                <div className="d-flex justify-content-center">
                    <input type="file" data-buttontext="hello" accept="image/*" 
                    {...register("imagen", { required: true })} 
                    onChange={(e)=>onFilechange(e)}
                    className='form-control' style={{width:'250px',display:'none'}}
                    ref={fileInput}
                    />
                    <button className='form-control' onClick={onBtnClick} style={{width:'170px'}}>Sube una imagen</button>
                    <label className="labelForFile">{fileName}</label>
                </div>

                <br/>

                <Input id='buttonAdd' type="submit" value="Enviar" disabled={!isDirty} style={{width:'80px'}}/>
                </div>

            </form>
        </div>
    )
}