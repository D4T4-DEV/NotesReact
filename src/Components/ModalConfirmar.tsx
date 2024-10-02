import { Box, Button, Modal, Typography } from "@mui/material";
import React from "react";

export interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '60%',
    sm: '75%',
    md: '45%',
    lg: '300px'
  },
  bgcolor: 'background.paper',
  border: '2px solid #dde9ec',
  borderRadius: 2,
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};


const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open, // Aspecto para mostrar el modal
  onClose, // Funcion que se ejecutara al decir no (estas controladas cuando se llama al componente)
  onConfirm, // Funcion que se ejecutara al decir si (estas controladas cuando se llama al componente)
  title,
  description = "¿Estas seguro de hacerlo 👻👻👻👻?"
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
      sx={{ fontFamily: '"Noto San", sans-serif', fontStyle: 'normal' }}
    >
      <Box sx={style}>
        <Typography sx={{ fontFamily: '"Noto San", sans-serif', fontStyle: 'normal' }} id="confirmation-modal-title" variant="h6" component="h2" >
          {title}
        </Typography>
        <Typography sx={{ mt: 2, fontFamily: '"Noto San", sans-serif', fontStyle: 'normal' }} id="confirmation-modal-description" >
          {description}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-around' }}>
          <Button sx={{ fontFamily: '"Noto San", sans-serif', fontStyle: 'normal' }} onClick={onConfirm} title="Confirmar acción">Si</Button>
          <Button sx={{ fontFamily: '"Noto San", sans-serif', fontStyle: 'normal' }} onClick={onClose} title="Cancelar acción">No</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;