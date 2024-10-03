import React, { useState, useCallback } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import generateUUID from '../Functions/Identificadores/generarUUID';
import getColorNoteRamdon from '../Functions/Aleatorios/getColorNote';
import { useContainerContext } from '../Contexts/AppContext';
import ConfirmationModal from './ModalConfirmar';

interface AddItemProps {
  containerId: string;
}

const maxLength: number = 50; // Limite de caracteres para el título

const AddItem: React.FC<AddItemProps> = ({ containerId }) => {
  const { dispatch } = useContainerContext();
  const [formData, setFormData] = useState({ title: '', message: '' });

  // Estado para controlar el modal de formulario
  const [openForm, setOpenForm] = useState(false);
  // Estado para controlar el modal de confirmación
  const [openConfirmation, setOpenConfirmation] = useState(false);

  // Manejo del cambio de inputs con límite de caracteres en el título
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === 'title' && value.length > maxLength) return; // Limitar el título a maxLength caracteres

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  }, []);

  const handleAddItem = () => {
    const newItem = {
      id: generateUUID(),
      title: formData.title || '',  // Si el título está vacío, asigna ''
      message: formData.message || '', // Si el mensaje está vacío, asigna ''
      color: getColorNoteRamdon(),
    };

    // Ejecuta el aniadir item ('nota')
    dispatch({ type: 'ADD_ITEM', payload: { containerId, item: newItem } });
    setFormData({ title: '', message: '' }); // Limpiar los campos
    setOpenForm(false); // Cerrar el modal de formulario
    setOpenConfirmation(false); // Cerrar el modal de confirmación
  };

  const handleOpenForm = () => {
    setOpenForm(true); // Abrir el modal de formulario
  };

  const handleCloseForm = () => {
    setOpenForm(false); // Cerrar el modal de formulario
    setFormData({ title: '', message: '' }); // Limpiar los campos
  };

  const handleOpenConfirmation = () => {
    setOpenConfirmation(true); // Abrir el modal de confirmación
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false); // Cerrar el modal de confirmación
  };


  return (
    <>
      {/* Boton que despliega el modal */}
      <Button
        onClick={handleOpenForm}
        variant="outlined"
        size="small"
        sx={{
          margin: '20px',
          borderRadius: '10px',
          fontFamily: 'Noto Sans, sans-serif',
          fontStyle: 'normal',
          bgcolor: '#C7C8CC',
          border: 'none',
        }}
        title='Crear nota'
      >
        <span className="material-symbols-outlined" style={{}}>add_notes</span>
        <span style={{ marginLeft: '8px', fontFamily: 'Noto Sans, sans-serif', fontStyle: 'normal', }}>Crear notas</span>
      </Button>

      {/* Modal de formulario */}
      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle sx={{ fontFamily: 'Noto Sans, sans-serif', fontStyle: 'normal', textAlign: 'center' }}>Añadir una nueva nota</DialogTitle>
        <DialogContent>
          <TextField
            title='Titulo de la nota'
            sx={{
              '& .MuiInputBase-root': {
                fontFamily: 'Noto Sans, sans-serif',
                fontStyle: 'normal',
              },
              '& .MuiFormLabel-root': {
                fontFamily: 'Noto Sans, sans-serif',
                fontStyle: 'normal',
              },
              '& .MuiFormHelperText-root': {
                fontFamily: 'Noto Sans, sans-serif',
                fontStyle: 'normal',
              },
            }}
            autoFocus
            margin="dense"
            id="title"
            label="Título de la nota"
            type="text"
            fullWidth
            value={formData.title}
            onChange={handleChange}
            helperText={`${formData.title.length}/${maxLength} caracteres`}
          />
          <TextField
            sx={{
              '& .MuiInputBase-input': {
                fontFamily: 'Noto Sans, sans-serif',
                fontStyle: 'normal',
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#888',
                  borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: '#555',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'transparent',
                },
              },
              '& .MuiFormLabel-root': {
                fontFamily: 'Noto Sans, sans-serif',
                fontStyle: 'normal',
              },
              '& .MuiFormHelperText-root': {
                fontFamily: 'Noto Sans, sans-serif',
                fontStyle: 'normal',
              },
            }}
            margin="dense"
            id="message"
            label="Mensaje de la nota"
            type="text"
            multiline
            rows={4}
            fullWidth
            value={formData.message}
            onChange={handleChange}
            helperText={`${formData.message.length} caracteres`}
            title='Mensaje de la nota'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOpenConfirmation} color="primary" sx={{ marginBottom: 1, fontFamily: 'Noto Sans, sans-serif', fontStyle: 'normal', }} title='Añadir nota'>
            Añadir nota
          </Button>
          <Button onClick={handleCloseForm} color="primary" sx={{ marginBottom: 1, marginRight: 2, fontFamily: 'Noto Sans, sans-serif', fontStyle: 'normal', }} title='No añadir nota'>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmación */}
      <ConfirmationModal
        open={openConfirmation}
        onClose={handleCloseConfirmation}
        onConfirm={handleAddItem}
        title=""
        description="¿Estás seguro de que deseas añadir esta nota?"
      />
    </>
  );
};

export default AddItem;
