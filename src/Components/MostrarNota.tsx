import { Button, Modal, Box, Typography } from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import { useContainerContext } from "../Contexts/AppContext";

export interface ShowNoteProps {
    open: boolean;
    identifyNote?: string;
    onClose: () => void;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
        xs: '70%',
        sm: '75%',
        md: '45%',
        lg: '500px'
    },
    height: {
        xs: '70%',
        sm: '75%',
        md: '45%',
        lg: '500px'
    },
    bgcolor: 'background.paper',
    borderRadius: 0,
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

export default function ShowNote({ open, onClose, identifyNote }: ShowNoteProps) {
    const [noteData, setNoteData] = useState({
        title: '',
        note: '',
        colorNote: '',
    });

    const { containers } = useContainerContext(); // Usamos el contexto de contenedores

    useEffect(() => {
        if (identifyNote) {
            // Buscar la nota dentro de los contenedores
            containers.forEach((container) => {
                const currentNote = container.items.find((note) => note.id === identifyNote);
                if (currentNote) {
                    setNoteData({
                        title: currentNote.title || 'Sin título',
                        note: currentNote.message || 'No tiene ningún mensaje',
                        colorNote: currentNote.color || '',
                    });
                }
            });
        }
    }, [identifyNote, containers]);

    // Manejo de cierre de modal
    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    return (
        <React.Fragment>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, backgroundColor: noteData.colorNote }}>
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontFamily: 'Noto Sans, sans-serif' }}>
                            Aqui esta tu nota ❤️
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{
                            fontFamily: 'Noto Sans, sans-serif',
                            wordBreak: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 5,
                            WebkitBoxOrient: 'vertical',
                            fontSize: 20,
                            fontWeight: 'bolder',
                            marginLeft: '25px'
                        }}
                        title='Título de la nota'
                        >
                            {noteData.title}
                        </Typography>
                    </Box>

                    <Box sx={{
                        wordBreak: 'break-word',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        mb: 2,
                        height: '325px',
                        maxHeight: "325px",
                        overflowY: "auto",
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
                    }}
                    title='Mensaje de la nota'
                    >
                        <Typography sx={{
                            fontFamily: 'Noto Sans, sans-serif',
                            marginLeft: '25px',
                            marginRight: '50px'
                        }}
                        >
                            {noteData.note}
                        </Typography>
                    </Box>

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button sx={{ fontFamily: 'Noto Sans, sans-serif', backgroundColor: '#FFF' }} onClick={handleClose} title="Cerrar mostrar nota">Cerrar</Button>
                    </Box>
                </Box>
            </Modal>
        </React.Fragment>
    );
}