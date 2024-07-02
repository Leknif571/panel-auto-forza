import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { db } from '../../services/firebase.config';
import { collection, addDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModalMarque = (props) => {

    const collectionRefMarque = collection(db, "Marque"); 
    let [marque, setMarque] = useState('');

    let [model, setModel] = useState('');
    let [arrayModel, setArrayModel] = useState([]);

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

    let resetInput = () => {
        setMarque('')
        setArrayModel([])
        setModel('')
    }

    const submitMarque = async() => { 
        
        try{    
            
            if(marque !== null && arrayModel.length > 0){
                
                await addDoc(collectionRefMarque, {
                                            marque: marque,
                                            model: arrayModel
                                        }) 

                toastNotification("Enregistrer !", 'success');
                resetInput();

                setTimeout(() => {
                    window.location.reload()
                }, 2000);
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

 


  return (
    <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        scrollable
    >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        Ajouter une marque
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <div>
        <form>
            <div className="form-group mb-2">
                <label htmlFor="title">Marque</label>
                <input type="text" required className="form-control" id="title" name="title" placeholder="Entrer nom de la marque" onChange={(e)=>setMarque(e.target.value)}/>
            </div>

            <div className="form-group mb-2">
                <label htmlFor="title">Modèle</label>
                <div className='input-group'>
                    <input type="text" required className="form-control" id="title" name="title" placeholder="Entrer un modèle" onChange={(e) => setModel(e.target.value)} />
                    <button className="btn btn-primary" type="button" onClick={()=>{setArrayModel([
                                                                                            ...arrayModel,model 
                                                                                            ]); console.log(arrayModel)}}> 
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
                    {
                        arrayModel.map((mod) => {
                            return (
                            <tr>
                                <td key={mod}>{mod}</td>
                                <td><button className='btn btn-danger' type='button' onClick={() => handleDelete(mod)}>Supprimer</button></td>
                            </tr>)
                        })
                    }
                </tbody>
   
            </table>

        </form>
    </div>
    <ToastContainer />
    </Modal.Body>
    <Modal.Footer>
      <Button className='btn-success' onClick={()=>{submitMarque()}}>Enregister</Button>
      <Button className='btn-danger' onClick={()=>{resetInput(); props.onHide()}}>Fermer</Button>
    </Modal.Footer>
  </Modal>
  )
}

export default ModalMarque