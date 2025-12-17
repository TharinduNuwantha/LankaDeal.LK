import { Modal } from '@mui/material'
import React, { useImperativeHandle, useState, forwardRef } from 'react'

const ModalPayment = forwardRef((props, ref) => {
    const[open,setOpen] = useState(false);
    // const handleOpen = ()=> setOpen(true);
    const handleClose = ()=> setOpen(false);

    useImperativeHandle(ref,()=>({
        handleOpen:()=> setOpen(true)
    }))
  return (
    <Modal
    open={open}
    onClose={handleClose}
    className='flex flex-col items-center justify-center'
    >
        <div>Tharindu</div>

    </Modal>
  )
})

ModalPayment.displayName = 'ModalPayment';

export default ModalPayment
