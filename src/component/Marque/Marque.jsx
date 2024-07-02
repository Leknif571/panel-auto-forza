import React, { useEffect, useState } from 'react'
import ModalMarque from '../modal/ModalMarque';
import { db } from '../../services/firebase.config';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';


const Marque = () => {
    const [modalShow, setModalShow] = React.useState(false);
    const collectionRefMarque = collection(db, "Marque");


    let [marques, setMarques] =  useState([])

    useEffect(() => {
        const getMarques = async () => {
            getDocs(collectionRefMarque).then((marque) => {
                let marquesData = marque.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                setMarques(marquesData);
            })
        }
        getMarques();
    }, [])

    const deleteMarque = async(value) => {
        try{              
            const marqueRef = doc(db, "Marque", value.id)
            await deleteDoc(marqueRef) 
            window.location.reload();  
            }catch (err){
                console.log(err)
        }
    }

    
    
  return (
    <div>
        <h1>Gestion des marques</h1>
            <ModalMarque   
                    show={modalShow}
                    onHide={() => setModalShow(false)}
            />

        
                <table className="table">
                <thead className="thead-dark">
                    <tr>
                    <th scope="col">Marque</th>
                    <th scope="col">Modèle</th>
                    <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        marques.map(v => { return (  
                        <tr>
                            <td>{v.marque}</td>
                            <td>
                                <ul className='list-group list-group-flush'>
                                { 
                                    v.model.map((v) => {
                                    return (
                                        <li className='list-group-item' key={v}>{v}</li>
                                    )
                                    }) 
                                        
                                }
                                </ul>
                            </td>
                            <td>
                                <button className='btn btn-danger' onClick={()=>deleteMarque(v)}>Supprimer</button>
                                <a href={'/marqueupdate/'+v.id} className='btn btn-success'>Editer</a>
                            </td>
                        </tr>)
                        })
                    }

                </tbody>
                </table>

        <div className="floating-container">
            <div style={{cursor:"pointer"}} className="floating-button" onClick={() => {setModalShow(true)}}>
                    +
            </div>
        </div>
    </div>
  )
}

export default Marque