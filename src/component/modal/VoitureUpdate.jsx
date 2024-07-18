import { updateDoc, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import React, { useState, useEffect } from 'react'
import { db, imgDb } from '../../services/firebase.config';
import Button from 'react-bootstrap/Button';
import {v4} from 'uuid'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalImg from './modalImg';
import { useParams } from 'react-router-dom';


const ModalUpdateVoitures = () => {

    const {id} = useParams()
    let [voiture, setVoiture] = useState([]);
    let [modalShow, setModalShow] = useState(false);

    const voitureRef = doc(db, "Voitures", id);

    const collectionRefMarque = collection(db, "Marque")

    const [marque, setMarque] = useState([])

    const [arrayModel,setArrayModel] = useState([])
    const [model, setModel] = useState([])

    let [newImg, setImg] = useState('');
    let [newArrayImg, setArrayImg] = useState([]);

    let [newUrl, setNewUrl] = useState('');


    useEffect(() => {        
        const getMarque = async () => {
            await getDocs(collectionRefMarque).then((marque) => {
                let marqueData = marque.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                setMarque(marqueData);
            })
        }
        let funcVoitures = async() => { 
            try { 
                let voitureData = await getDoc(voitureRef); 
                setVoiture(voitureData.data())
                setArrayImg(voitureData.data().img)
                
            } catch (error) {
                console.log(error)
            }
           
        }
        funcVoitures()
        getMarque();
    }, [])

    const changeHandler = e => {
        
        setVoiture({...voiture,[e.target.name]: e.target.value})
     }

     const changeHandlerCheck = e => {
        setVoiture({...voiture,[e.target.name]:e.target.checked})
     }
     


    function handleUpload(){
        const imgs = ref(imgDb, `Img/${v4()}`)
        uploadBytes(imgs, newImg).then(data => {
            getDownloadURL(data.ref).then(val => {
                setImg(val);
                const imageNew = [...newArrayImg,
                    { original: val }];
                setArrayImg(imageNew)
            })
            })
    }

    const deleteSingleImg = async(value) => {
        try{
            console.log(value)
            const finalArray = newArrayImg.filter((urlI) => urlI.original != value.original)
            console.log(finalArray)
            setArrayImg(finalArray)
            const imgVoitureRef = ref(imgDb, value.original)             
            await deleteObject(imgVoitureRef)
        }catch(err){
            console.log(err)
        }
    }


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

    const submitVoiture = async() => { 

        try{    
            if(voiture.title !== null && voiture.price !== null && voiture.description !== null && voiture.kilometers !== null && voiture.chevaux !== null &&
            voiture.marque !== null && voiture.model !== null && voiture.date !== null && voiture.reference !== null && voiture.capacityR !== null && 
            voiture.etat !== null && voiture.energie !== null && voiture.puissance !== null && voiture.nbPorte !== null && voiture.nbPlace !== null &&
            voiture.couleurInt !== null && voiture.couleurExt !== null && voiture.matSiege !== null && newArrayImg.length > 0){
                await updateDoc(voitureRef, {
                                    title: voiture.title,
                                    price: Number(voiture.price),
                                    description: voiture.description,
                                    kilometers: Number(voiture.kilometers), 
                                    chevaux: Number(voiture.chevaux), 
                                    marque: voiture.marque, 
                                    model: voiture.model, 
                                    date: voiture.date, 
                                    reference: voiture.reference,
                                    img: newArrayImg, 
                                    capacityR: Number(voiture.capacityR),
                                    dispo: voiture.dispo,
                                    etat:voiture.etat,
                                    energie:voiture.energie,
                                    puissance:  Number(voiture.puissance), 
                                    automatique:voiture.automatique,
                                    nbPorte:Number(voiture.nbPorte),
                                    nbPlace: Number(voiture.nbPlace),
                                    couleurInt:voiture.couleurInt,
                                    couleurExt: voiture.couleurExt,
                                    matSiege: voiture.matSiege
                                })
 
                
                toastNotification("Enregistrer", 'success');
                setTimeout(() => {
                    window.location.assign('/')
                }, 1500);
                
            }      
            else{
                toastNotification('Tout les champs doivent être rempli', 'error')
               
            }
            
            
        }catch (err){
             console.log(err)
        }
    }



    const getByName = titreM => {
        let modelList = marque.find(({ marque }) => marque === titreM.target.value)
        setModel(modelList.model)
    }


  return (
     
                <form className='w-full max-w-lg'>
                    <div className='flex flex-wrap -mx-3 mb-6'>
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label htmlFor="title">Titre de l'annonce</label>
                                <input type="text" required className="form-control" id="title" name="title" value={voiture.title} placeholder="Titre de l'annonce" onChange={changeHandler}/>
                            </div>

                            <div className="w-full md:w-1/2 px-3">
                                <label htmlFor="desc">Option</label>
                                <textarea id="desc" required name="description" rows="5" cols="33" className="form-control" value={voiture.description} placeholder="Option de l'annonce" onChange={changeHandler}/>
                            </div>
                    </div>
                    <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label htmlFor="price">Prix</label>
                                <input type="number" required className="form-control" id="price" name="price" value={voiture.price} placeholder="Prix de l'annonce" onChange={changeHandler}/>
                            </div>

                            <div className="w-full md:w-1/2 px-3">
                                <label htmlFor="kilo">Kilomètres</label>
                                <input type="number" required className="form-control" id="kilo" name="kilometers" value={voiture.kilometers} placeholder="Kilométrage de la voiture" onChange={changeHandler}/>
                            </div>
                    </div>

                            <div className=" mb-2">
                                <label className='text-left' htmlFor="chevaux">Nombre de chevaux</label>
                                <input type="number" required className="form-control" id="chevaux" name='chevaux' value={voiture.chevaux} placeholder="Nombre de chevaux" onChange={changeHandler}/>
                            </div>

                            <div className=" mb-2">
                                <label className='text-left' htmlFor="capacityR">Capacité reservoir (en litre)</label>
                                <input type="number" required className="form-control" id="capacityR" name='capacityR' value={voiture.capacityR} placeholder="Capacité du reservoir" onChange={changeHandler}/>
                            </div>

                            <div className=" mb-2">
                                <label className='text-left' htmlFor="puissance">Puissance moteur (en Nw)</label>
                                <input type="number" required className="form-control" id="puissance" name='puissance' value={voiture.puissance} placeholder="Puissance moteur" onChange={changeHandler}/>
                            </div>

                            <div className=" mb-2">
                                <label className='text-left' htmlFor="nbPorte">Nombre de porte</label>
                                <input type="number" required className="form-control" id="nbPorte" name='nbPorte' value={voiture.nbPorte} placeholder="Nombre de porte" onChange={changeHandler}/>
                            </div>

                            <div className=" mb-2">
                                <label className='text-left' htmlFor="nbPlace">Nombre de place</label>
                                <input type="number" required className="form-control" id="nbPlace" name='nbPlace' value={voiture.nbPlace} placeholder="Nombre de place" onChange={changeHandler}/>
                            </div>

                            <div className=" mb-2">
                                <label className='text-left' htmlFor="couleurExt">Couleur extérieur</label>
                                <input type="text" required className="form-control" id="couleurExt" name="couleurExt" value={voiture.couleurExt} placeholder="Couleur extérieur" onChange={changeHandler}/>
                            </div>

                            <div className=" mb-2">
                                <label className='text-left' htmlFor="couleurInt">Couleur intérieur</label>
                                <input type="text" required className="form-control" id="couleurInt" name="couleurInt" value={voiture.couleurInt} placeholder="Couleur intérieur" onChange={changeHandler}/>
                            </div>

                            <div className=" mb-2">
                                <label className='text-left' htmlFor="matSiege">Matière sièges</label>
                                <input type="text" required className="form-control" id="matSiege" name="matSiege" value={voiture.matSiege} placeholder="Matière des sièges" onChange={changeHandler}/>
                            </div>
                            <div className=" mb-2">
                                <label htmlFor="dispo">Disponibilité</label>
                                <select required className="form-select" aria-label="Disponibilité" value={voiture.dispo} name="dispo" id="dispo" onChange={changeHandler}>
                                    <option value={null}>Disponibilité</option>
                                    <option value={'Disponible'}>Disponible</option>
                                    <option value={'Disponible sur commande'}>Disponible sur commande</option>
                                    <option value={'Vendu'}>Vendu</option>
                                </select>
                            </div>

                            <div className=" mb-2">
                                <label className='text-left' htmlFor="etat">Etat de la voiture</label>
                                <select required className="form-select" aria-label="Etat de la voiture" value={voiture.etat} name="etat" id="etat" onChange={changeHandler}>
                                    <option value={null}>Etat</option>
                                    <option value={'Occasion'}>Occasion</option>
                                    <option value={'Neuf'}>Neuf</option>
                                </select>
                            </div>

                            <div className=" mb-2">
                                <label className='text-left' htmlFor="energie">Ressource énergie</label>
                                <select required className="form-select" aria-label="Type d'énérgie" name="energie" value={voiture.energie} id="energie" onChange={changeHandler}>
                                    <option value={null}>Ressource énergie</option>
                                    <option value={'Essence'}>Essence</option>
                                    <option value={'Diesel'}>Diesel</option>
                                    <option value={'Eléctrique'}>Eléctrique</option>
                                    <option value={'Hybride'}>Hybride</option>
                                </select>
                            </div>
                            <div className=" mb-2">
                                <label className='text-left' htmlFor="automatique">Automatique/Manuel</label>
                                <div className="form-check form-switch">
                                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Automatique</label>
                                    <input className="form-check-input" name='automatique' type="checkbox"  checked={voiture.automatique} role="switch" id="flexSwitchCheckDefault" onChange={changeHandlerCheck} />   
                                </div>
                            </div>

                            <div className=" mb-2">
                                <label className='text-left' htmlFor="marque">Marque</label>
                                <select required className="form-select" aria-label="Marque" checked={voiture.automatique} name="marque" id="marque" value={voiture.marque} onChange={(e) => {changeHandler(e); getByName(e)}}>
                                    <option value={null}>Marque</option>
                                    {
                                        marque.map(v => 
                                            <option value={v.marque}>{v.marque}</option>
                                        )
                                    }
                                    
                                </select>
                            </div>

                            <div className=" mb-2">
                                <label className='text-left' htmlFor="model">Modèle</label>
                                <select required className="form-select" aria-label="Modèle" name="model" value={voiture.model} id="model" onChange={changeHandler}>
                                    <option value={null}>Modèle</option>
                                    {
                                     
                                        model.map(v => 
                                            <option value={v}>{v}</option>
                                        )
                                    }
                                </select>

                            </div>

                            <div className=" mb-2">
                                <label className='text-left' htmlFor="date">Date de la voiture</label>
                                <input required type="month" className="form-control" id="date" name="date" value={voiture.date} placeholder="Date" onChange={changeHandler}/>
                            </div>

                            <div className=" mb-2">
                                <label className='text-left' htmlFor="reference">Référence</label>
                                <input required type="text" className="form-control" id="reference" name="reference" value={voiture.reference} placeholder="Référence" onChange={changeHandler}/>
                            </div>

                            <div className=" mb-3">
                                <label className='text-left'>Photos</label>

                                <div className='input-group'>
                                    <input type="file" accept="image/*" className="form-control" onChange={(e) => setImg(e.target.files[0])}/>                           
                                    <button className="btn btn-primary" type="button" onClick={handleUpload}>
                                        Ajouter
                                    </button>
                               </div>

                            </div>  
                                                    
                                {
                                newArrayImg &&                       
                                    newArrayImg.map(v => (
                                        <div key={v.original} className='d-inline'>
                                            <div>
                                                <img className="button mr-2 is-white" style={{height:"95px", width:'auto', cursor:'pointer'}} onClick={() => {setModalShow(true); setNewUrl(v.original)}} src={v.original}></img>
                                                <button onClick={()=>deleteSingleImg(v)} type='button' className='btn btn-sm btn-danger'>SUPPRIMER</button>
                                            </div>
                                        </div>
                                    ))     
                                }  

                                <ToastContainer />
                                <ModalImg
                                    show={modalShow}
                                    onHide={() => setModalShow(false)}
                                    url={newUrl} />      
                                
                                <Button className="btn-success" onClick={() => {submitVoiture()}}>Enregistrer</Button>                                                                   
                   
                </form>

           
  )
}

export default ModalUpdateVoitures