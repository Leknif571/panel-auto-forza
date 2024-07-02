import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHref, useParams } from 'react-router-dom';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase.config';
import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';;


const ModalMarqueUpdate = () => {

    const {id} = useParams()

    let [marque, setMarque] = useState('')
    let [arrayModel, setArrayModel] = useState([])
    let [model, setModel] = useState('')

    const marqueRef = doc(db, "Marque", id);

    useEffect(() => {
        let funcMarque = async() => { 
            try { 
                let marqueData = await getDoc(marqueRef); 
                setMarque(marqueData.data().marque)
                setArrayModel(marqueData.data().model)

                console.log(model)
                
            } catch (error) {
                console.log(error)
            }
           
        }
        funcMarque()
    }, [])

       
    let toastNotification = (textNotif, type) => {
        toast.error(textNotif, {
            position: "top-right",
            type: type,
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
    }



    const submitMarque = async() => { 
        // const marqueRef = doc(db, 'Marque',id)

        try{      
            if(marque !== '' && arrayModel.length > 0){   
                await updateDoc(marqueRef, {
                                            marque: marque,
                                            model: arrayModel
                                        }) 

                toastNotification("Enregistrer !", 'success');

                setTimeout(() => {
                    window.location.assign('/marque')
                }, 1500);
            }      
             else{
                toastNotification('Remplissez tout les champs !', 'error')
            }
        }catch (err){
             console.log(err)
        }
    }

    let handleDelete = (id) => {
        setArrayModel(arrayModel.filter((v) => v !== id))
        
    }

    let handleChange = (e) => {
        setMarque(e.target.value)
    }

 


  return (

    <div>

            <form>
            <div className="form-group mb-2">
                <label htmlFor="title">Marque</label>
                <input type="text" required className="form-control" id="title" name="title" value={marque} placeholder="Entrer nom de la marque" onChange={(e)=> handleChange(e)}/>
            </div>

            <div className="form-group mb-2">
                <label htmlFor="title">Modèle</label>
                <div className='input-group'>
                    <input type="text" required className="form-control" id="title" name="title" placeholder="Entrer un modèle" onChange={(e) => setModel(e.target.value)} />
                    <button className="btn btn-primary" type="button" onClick={()=>{setArrayModel([
                                                                                            ...arrayModel,model 
                                                                                            ]); console.log(marque)}}> 
                            Ajouter
                    </button>
                </div>
            </div>

        
            <table className="table table-striped">
                <thead>
                      <tr>
                          <th>Model</th>
                          <th>Action</th>
                      </tr>
                </thead>
                <tbody>
                    { arrayModel &&
                        arrayModel.map((mod) => {
                            return (
                            <tr>
                                <td key={mod}>{mod}</td>
                                <td><button className='btn btn-danger' type='button' onClick={() => handleDelete(mod)}>Supprimer</button></td>
                            </tr>
                            )
                        })
                    }
                </tbody>
   
            </table>

        </form>
        
            <Button className='btn-success' onClick={()=>{submitMarque()}}>Enregister</Button>
            <ToastContainer />
    </div>
    

  )
}

export default ModalMarqueUpdate