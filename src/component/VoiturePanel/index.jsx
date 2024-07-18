import React, {useEffect, useState} from 'react'
import {db, imgDb, auth} from '../../services/firebase.config'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import ModalEdit from '../modal';
import { deleteObject } from 'firebase/storage';
import './style.css'


const VoiturePanel = () => {


    const [modalShow, setModalShow] = React.useState(false);

    let [voitures, setVoitures] = useState([])
    let [voituresMem, setVoituresMem] = useState([])

    const collectionRef = collection(db, "Voitures" )

    useEffect(() => {
            const getVoitures = async () => {
                await getDocs(collectionRef).then((voiture) => {
                    let voituresData = voiture.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                    setVoitures(voituresData);
                    setVoituresMem(voituresData)
                })
            }
            getVoitures();
    }, [])


    const deleteVoiture = async(value) => {
        
            try{           
                for(let i=0; i<value.img.length; i++){
                    if(value.img[i].url !== undefined){
                        const imgVoitureRef = ref(imgDb,value.img[i].url)             
                        await deleteObject(imgVoitureRef)
                    }
                }
                const voitureRef = doc(db, "Voitures", value.id)
                await deleteDoc(voitureRef)    
                window.location.reload()

                }catch (err){
                    console.log(err)
            }

    }

    let [ref, setRef] = useState('');

    let handleClick = () => {
        
        let i = voitures.filter((v) => v.reference == ref)
        setVoituresMem(i)
    }

    let resetFilter = () => {
        setRef('')
        setVoituresMem(voitures)
    }


  return (

    <div>
        <div className='p-5 m-5'>
            <h1>Gestion des annonces</h1>

            <div>
                <div className="form-group mb-2">
                                <label htmlFor="desc">Rechercher par référence :</label>
                                <div className='input-group'>
                                    <input type='text' name="reference" className="form-control" value={ref} placeholder="Référence" onChange={(e) => setRef(e.target.value) }/>
                                    <button className="btn btn-primary" type="button" onClick={handleClick}>
                                            Rechercher
                                    </button>
                                    {
                                        ref &&
                                    <button className='btn btn-dark' onClick={resetFilter}>Reset</button> 
                                    } 
                                </div>
                                

                                
                </div>
            </div>
                
            <ModalEdit
                show={modalShow}
                onHide={() => setModalShow(false)}
            />

            <div className="d-flex" style={{flexWrap: "wrap"}}>
                
                {voituresMem.length > 0 ? voituresMem.map(v  => 
                <div className="card m-4" style={{width:'360px'}} key={v.id}>    
                    
                        {v?.img && <img className="card-img-top" src={v.img[0].original} alt="image de voiture"/>}
                    
                        <div className="card-body">
                            <h5 className="card-title">{v.title}</h5>
                            <p className="card-text">Prix : {v.price} € // Référence : {v.reference}</p>
                        
                            <div>
                                <a href={"/voiture-update/"+v.id} className="btn btn-success mx-2">Modifier</a>
                                <button type="button" className="btn btn-danger" onClick={()=>deleteVoiture(v)}>Supprimer</button>
                            </div>
        
                        </div>
                </div>

                ) 

                : <p className='mt-3'>Aucune voiture ne correspond a cette référence</p>

                }
            </div>
        </div>

        <div className="floating-container">
                <div style={{cursor:"pointer"}} className="floating-button" onClick={() => {setModalShow(true)}}>
                        +
                </div>
        </div>


    </div>
  )
}

export default VoiturePanel