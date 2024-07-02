import { addDoc, collection, getDocs } from 'firebase/firestore';
import React, { useState, useEffect } from 'react'
import { db, imgDb, auth } from '../../services/firebase.config';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {v4} from 'uuid'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalImg from './modalImg';


const ModalEdit = (props) => {

    const token = auth.currentUser.uid
    const collectionRefMarque = collection(db, "Marque")

    const [marque, setMarque] = useState([])
    const [model, setModel] = useState([])

    const [modalShow, setModalShow] = useState(false);
    const [newCar, setCar] = useState({
        title:null,
        description:null,
        price:null,
        kilometers:null,
        chevaux:null,
        capacityR:null,
        dispo: null,
        etat:null,
        energie:null,
        puissance: null, 
        automatique:true,
        nbPorte:null,
        nbPlace: null,
        couleurInt:null,
        couleurExt: null,
        matSiege: null,
        marque:null,
        model:null,
        date: null,
        reference:null,
    });

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
        getMarque();
    }, [])


    const collectionRef = collection(db, "Voitures" )

    const changeHandler = e => {
        setCar({...newCar,[e.target.name]: e.target.value})
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
            const finalArray = newArrayImg.filter((urlI) => urlI.original != value.original )
            setArrayImg(finalArray)
            const imgVoitureRef = ref(imgDb,value.url)             
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
            if(newCar.title !== null && newCar.price !== null && newCar.description !== null && newCar.kilometers !== null && newCar.chevaux !== null &&
            newCar.marque !== null && newCar.model !== null && newCar.date !== null && newCar.reference !== null && newCar.capacityR !== null && 
            newCar.etat !== null && newCar.energie !== null && newCar.puissance !== null && newCar.nbPorte !== null && newCar.nbPlace !== null &&
            newCar.couleurInt !== null && newCar.couleurExt !== null && newCar.matSiege !== null && newArrayImg.length > 0){
                await addDoc(collectionRef, {
                                    title: newCar.title,
                                    price: Number(newCar.price),
                                    description: newCar.description,
                                    kilometers: Number(newCar.kilometers), 
                                    chevaux: Number(newCar.chevaux), 
                                    marque: newCar.marque, 
                                    model: newCar.model, 
                                    date: newCar.date, 
                                    reference: newCar.reference,
                                    img: newArrayImg, 
                                    capacityR: Number(newCar.capacityR),
                                    dispo: newCar.dispo,
                                    etat:newCar.etat,
                                    energie:newCar.energie,
                                    puissance:  Number(newCar.puissance), 
                                    automatique:newCar.automatique,
                                    nbPorte:Number(newCar.nbPorte),
                                    nbPlace: Number(newCar.nbPlace),
                                    couleurInt:newCar.couleurInt,
                                    couleurExt: newCar.couleurExt,
                                    matSiege: newCar.matSiege
                                },{
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                    }})
 
                
                toastNotification("Enregistrer", 'success');
                setTimeout(() => {
                    window.location.reload()
                }, 1500);
                
            }      
            else{
                console.log(newCar)
                toastNotification('Tout les champs doivent être rempli', 'error')
               
            }
            
            
        }catch (err){
             console.log(err)
        }
    }



    const getByName = titreM => {
        let modelList = marque.find(({ marque }) => marque === titreM.target.value)
        setModel(modelList.model)
        console.log(model)
    }


  return (
    <div>
        <Modal scrollable
        {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Créer une annonce
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <div>
                        <form>
                            <div className="form-group mb-2">
                                <label htmlFor="title">Titre de l'annonce</label>
                                <input type="text" required className="form-control" id="title" name="title" placeholder="Titre de l'annonce" onChange={changeHandler}/>
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="desc">Option</label>
                                <textarea id="desc" required name="description" rows="5" cols="33" className="form-control" placeholder="Option de l'annonce" onChange={changeHandler}/>
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="price">Prix</label>
                                <input type="number" required className="form-control" id="price" name="price" placeholder="Prix de l'annonce" onChange={changeHandler}/>
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="kilo">Kilomètres</label>
                                <input type="number" required className="form-control" id="kilo" name="kilometers" placeholder="Kilométrage de la voiture" onChange={changeHandler}/>
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="chevaux">Nombre de chevaux</label>
                                <input type="number" required className="form-control" id="chevaux" name='chevaux' placeholder="Nombre de chevaux" onChange={changeHandler}/>
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="capacityR">Capacité reservoir (en litre)</label>
                                <input type="number" required className="form-control" id="capacityR" name='capacityR' placeholder="Capacité du reservoir" onChange={changeHandler}/>
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="puissance">Puissance moteur (en Nw)</label>
                                <input type="number" required className="form-control" id="puissance" name='puissance' placeholder="Puissance moteur" onChange={changeHandler}/>
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="nbPorte">Nombre de porte</label>
                                <input type="number" required className="form-control" id="nbPorte" name='nbPorte' placeholder="Nombre de porte" onChange={changeHandler}/>
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="nbPlace">Nombre de place</label>
                                <input type="number" required className="form-control" id="nbPlace" name='nbPlace' placeholder="Nombre de place" onChange={changeHandler}/>
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="couleurExt">Couleur extérieur</label>
                                <input type="text" required className="form-control" id="couleurExt" name="couleurExt" placeholder="Couleur extérieur" onChange={changeHandler}/>
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="couleurInt">Couleur intérieur</label>
                                <input type="text" required className="form-control" id="couleurInt" name="couleurInt" placeholder="Couleur intérieur" onChange={changeHandler}/>
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="matSiege">Matière sièges</label>
                                <input type="text" required className="form-control" id="matSiege" name="matSiege" placeholder="Matière des sièges" onChange={changeHandler}/>
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="dispo">Disponibilité</label>
                                <select required className="form-select" aria-label="Disponibilité" name="dispo" id="dispo" onChange={changeHandler}>
                                    <option value={null}>Disponibilité</option>
                                    <option value={'Disponible'}>Disponible</option>
                                    <option value={'Disponible sur commande'}>Disponible sur commande</option>
                                    <option value={'Vendu'}>Vendu</option>
                                </select>
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="etat">Etat de la voiture</label>
                                <select required className="form-select" aria-label="Etat de la voiture" name="etat" id="etat" onChange={changeHandler}>
                                    <option value={null}>Etat</option>
                                    <option value={'Occasion'}>Occasion</option>
                                    <option value={'Neuf'}>Neuf</option>
                                </select>
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="energie">Ressource énergie</label>
                                <select required className="form-select" aria-label="Type d'énérgie" name="energie" id="energie" onChange={changeHandler}>
                                    <option value={null}>Ressource énergie</option>
                                    <option value={'Essence'}>Essence</option>
                                    <option value={'Diesel'}>Diesel</option>
                                    <option value={'Eléctrique'}>Eléctrique</option>
                                    <option value={'Hybride'}>Hybride</option>
                                </select>
                            </div>
                            <div className="form-group mb-2">
                                <label htmlFor="automatique">Automatique/Manuel</label>
                                <div className="form-check form-switch">
                                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Automatique</label>
                                    <input className="form-check-input" name='automatique' type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={changeHandler}/>   
                                </div>
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="marque">Marque</label>
                                <select required className="form-select" aria-label="Marque" name="marque" id="marque" onChange={(e) => {changeHandler(e); getByName(e)}}>
                                    <option value={null}>Marque</option>
                                    {
                                        marque.map(v => 
                                            <option value={v.marque}>{v.marque}</option>
                                        )
                                    }
                                    
                                </select>
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="model">Modèle</label>
                                <select required className="form-select" aria-label="Modèle" name="model" id="model" onChange={changeHandler}>
                                    <option value={null}>Modèle</option>
                                    {
                                     
                                        model.map(v => 
                                            <option value={v}>{v}</option>
                                        )
                                    }
                                </select>

                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="date">Date de la voiture</label>
                                <input required type="month" className="form-control" id="date" name="date" placeholder="Date" onChange={changeHandler}/>
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="reference">Référence</label>
                                <input required type="text" className="form-control" id="reference" name="reference" placeholder="Référence" onChange={changeHandler}/>
                            </div>

                            <div className="form-group mb-3">
                                <label>Photos</label>

                                <div className='input-group'>
                                    <input type="file" accept="image/*" className="form-control" onChange={(e) => setImg(e.target.files[0])}/>                           
                                    <button className="btn btn-primary" type="button" onClick={handleUpload}>
                                        Ajouter
                                    </button>
                               </div>

                            </div>  
                                                    
                                {                         
                                    newArrayImg.map(v => (
                                        <div key={v.id} className='d-inline'>
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
                        </form>

                    </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="btn-success" type='submit' onClick={() => {submitVoiture()}}>Enregistrer</Button>
                        <Button className="btn-danger" onClick={props.onHide}>Fermer</Button>
                    </Modal.Footer>
        </Modal>
        
    </div>

  )
}

export default ModalEdit