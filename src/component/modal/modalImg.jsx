import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalImg = (props) => {
  return (
    <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
    >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        Image
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <div className='text-center'>
        <img style={{height: '480px', width:'auto'}} src={props.url} alt="" srcset="" />
    </div>
        
    
    </Modal.Body>
    <Modal.Footer>
      <Button className='btn-danger' onClick={props.onHide}>Fermer</Button>
    </Modal.Footer>
  </Modal>
  )
}

export default ModalImg