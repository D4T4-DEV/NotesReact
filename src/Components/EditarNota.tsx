import { Button, Modal, Box, Typography, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useContainerContext } from "../Contexts/AppContext";
import ConfirmationModal from "./ModalConfirmar";


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
        xs: '70%',
        sm: '75%',
        md: '45%',
        lg: '400px',
    },
    bgcolor: 'background.paper',
    border: '2px solid #dde9ec',
    borderRadius: 2,
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

interface EditItemProps {
    id: string;
    onClose: () => void;
    containerId: string; // Asegúrate de tener el `containerId` como prop
}

const maxLength: number = 50; // Limite de caracteres para el título

const EditItem: React.FC<EditItemProps> = ({ id, onClose, containerId }) => {
    const { containers, dispatch } = useContainerContext();

    // Busca la nota dentro del contenedor usando el id
    const container = containers.find(c => c.id === containerId);
    const note = container?.items.find(item => item.id === id);

    // Inicializar estado del formulario con los valores del contexto
    const [formData, setFormData] = useState({
        title: note?.title || '',
        note: note?.message || '',
    });

    const [isEditing, setEdit] = useState(false);
    const [confirmEdit, setConfirmEdit] = useState(false); // Controlar el modal de confirmación

    useEffect(() => {
        if (note) {
            // Actualiza el formulario si los datos de la nota cambian
            setFormData({
                title: note.title,
                note: note.message
            });
        }
    }, [note]);

    const handleClose = () => {
        onClose();
    };

    const handleChange = (e: { target: { id: string; value: string; }; }) => {
        const { id, value } = e.target;
        if (id === 'title' && value.length > maxLength) return; // Limitar el título a maxLength caracteres
        setFormData((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    const handleActivateModify = () => {
        setEdit(true);
    };

    const handleConfirmClose = () => {
        setConfirmEdit(false);
    };

    const handleUpdate = () => {
        // Aquí usamos la nueva acción `EDIT_ITEM` para editar la nota
        dispatch({
            type: 'EDIT_ITEM',
            payload: { containerId, itemId: id, newTitle: formData.title, newMessage: formData.note }
        });
        handleConfirmClose(); // Cerrar modal de confirmación
        handleClose(); // Cerrar modal de edición
    };

    const handleOpenConfirmation = () => {
        setConfirmEdit(true); // Mostrar el modal de confirmación
    };

    return (
        <React.Fragment>
            <Modal
                open={true} // El modal empieza abierto para mostrar los inputs
                onClose={handleClose}
                aria-labelledby="edit-modal-title"
                aria-describedby="edit-modal-description"
                sx={{
                    fontFamily: 'Noto Sans, sans-serif',
                    fontStyle: 'normal'
                }}
            >
                <Box sx={style}>
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                        <Typography id="edit-modal-title" variant="h6" component="h2" sx={{ fontFamily: 'Noto Sans, sans-serif', fontStyle: 'normal' }}>
                            Editar Nota
                        </Typography>
                    </Box>

                    {/* Inputs del componente  */}
                    <Box sx={{ mb: 2 }}>
                        <TextField id="title"
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
                            label="Título"
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                            value={formData.title}
                            helperText={`${formData.title.length}/50 caracteres`}
                            disabled={!isEditing}
                            title="Título de la nota"
                        />
                    </Box>

                    <Box sx={{ mb: 2 }}>
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
                            fullWidth
                            id="note"
                            label="Nota"
                            multiline
                            rows={4}
                            onChange={handleChange}
                            value={formData.note}
                            helperText={`${formData.note.length} caracteres`}
                            disabled={!isEditing}
                            title="Mensaje de la nota"
                        />
                    </Box>

                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', fontFamily: 'Noto Sans, sans-serif', fontStyle: 'normal' }}>
                        {/* Al hacer clic en Guardar, se abre el modal de confirmación */}
                        <Button onClick={isEditing ? handleOpenConfirmation : handleActivateModify} style={{ fontFamily: 'Noto Sans, sans-serif', fontStyle: 'normal', borderRadius: 50 }} title={isEditing ? 'Guardar' : 'Modificar'}>
                            {isEditing ? (
                                <span className="material-symbols-outlined">
                                    save
                                </span>
                            ) :
                                (
                                    <span className="material-symbols-outlined">
                                        edit_note
                                    </span>
                                )
                            }
                        </Button>
                        <Button onClick={handleClose} style={{ fontFamily: 'Noto Sans, sans-serif', fontStyle: 'normal', borderRadius: 50 }} title="Volver">
                            <span className="material-symbols-outlined">
                                cancel
                            </span>
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Modal de confirmación */}
            <ConfirmationModal
                open={confirmEdit}
                onClose={handleConfirmClose}
                onConfirm={handleUpdate}
                description="¿Deseas guardar los cambios 📝?"
            />
        </React.Fragment>
    );
};

export default EditItem;
