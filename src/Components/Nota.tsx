import React, { useCallback, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card as MuiCard, CardContent, Typography, CardActions, Button } from '@mui/material';
import truncateText from '../Functions/Texto/truncarTexto';
import DeleteItem from './EliminarNota';
import EditItem from './EditarNota';
import ShowNote from './MostrarNota';

interface CardProps {
    id: string;
    title: string;
    message: string;
    type: 'item' | 'container';
    colorItem?: string;
    containerId: string;
    isModalOpen?: boolean;
}

const Card: React.FC<CardProps> = ({ id, title, message, type, colorItem, containerId, isModalOpen }) => {

    // Utilidades de dnd-kit para poder reordernar componentes
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id,
        data: { type }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 2 : 0,
        backgroundColor: colorItem,
    };

    // Over para los botones
    const [hover, setHover] = useState<boolean>(false);

    const handleMouseEnter = useCallback(() => {
        // Aplica hover si no está arrastrando, si el contenedor es el principal, 
        // o si el modal está abierto
        if (!isDragging && (containerId === 'father-items-god' || isModalOpen)) {
            setHover(true);
        }
    }, [isDragging, containerId, isModalOpen]);


    const handleMouseLeave = useCallback(() => setHover(false), []);

    // Estado para controlar el modal de editar
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const handleOpenEditModal = useCallback(() => setOpenEditModal(true), []);
    const handleCloseEditModal = useCallback(() => setOpenEditModal(false), []);

    // Estado para controlar el modal de eliminar
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
    const handleOpenDeleteModal = useCallback(() => setOpenDeleteModal(true), []);
    const handleCloseDeleteModal = useCallback(() => setOpenDeleteModal(false), []);

    // Estado para controlar el modal de mostrar nota
    const [openShowNoteModal, setOpenShowNoteModal] = useState<boolean>(false);
    const handleOpenShowNoteModal = useCallback(() => setOpenShowNoteModal(true), []);
    const handleCloseShowNoteModal = useCallback(() => setOpenShowNoteModal(false), []);


    return (
        <React.Fragment>
            <MuiCard
                ref={setNodeRef}
                sx={{
                    fontFamily: 'Noto Sans, sans-serif',
                    fontStyle: 'normal',
                    padding: '20px',
                    backgroundColor: colorItem || '#f0f0f0',
                    width: '150px',
                    height: '150px',
                    position: 'relative',
                    overflow: 'visible',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                    borderRadius: 0,
                    transition: 'box-shadow 0.3s ease-in-out',
                    '&:hover': {
                        boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.3)',
                    },
                    zIndex: isDragging ? 2 : 0,
                    margin: 2,
                    marginBottom: 5,
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onDoubleClick={handleOpenShowNoteModal}
                style={style}
                {...attributes}
                {...listeners}

            >
                <CardContent sx={{ cursor: 'grab' }}>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 'bold', fontFamily: 'Noto Sans, sans-serif', fontStyle: 'normal', fontSize: 12 }}
                    >
                        {truncateText(title, 15) || 'Sin titulo'}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: 'Noto Sans, sans-serif',
                            fontStyle: 'normal',
                            marginTop: '10px',
                            wordBreak: 'break-word',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 6,
                            WebkitBoxOrient: 'vertical',
                            fontSize: 10,
                        }}
                    >
                        {truncateText(message, 500) || 'No tiene ningun mensaje'}
                    </Typography>
                </CardContent>

                <CardActions
                    sx={{
                        fontFamily: 'Noto Sans, sans-serif',
                        fontStyle: 'normal',
                        position: 'absolute',
                        right: '-2px',
                        top: '-18px',
                        opacity: hover && !isDragging ? 1 : 0,
                        transition: 'opacity 0.3s ease-in-out',
                        visibility: hover && !isDragging ? 'visible' : 'hidden',
                    }}
                >
                    {/* Boton de editar */}
                    <Button
                        onClick={handleOpenEditModal}
                        size="small"
                        variant="contained"
                        sx={{
                            fontFamily: 'Noto Sans, sans-serif',
                            fontStyle: 'normal',
                            width: 18,
                            height: 18,
                            minWidth: 0,
                            borderRadius: '50%',
                            padding: 0,
                            backgroundColor: '#FFF',
                        }}
                        title='Edit note'
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#000' }}>
                            edit_note
                        </span>
                    </Button>

                    {/* Boton de borrar */}
                    <Button
                        onClick={handleOpenDeleteModal}
                        variant="contained"
                        size="small"
                        sx={{
                            fontFamily: 'Noto Sans, sans-serif',
                            fontStyle: 'normal',
                            width: 18,
                            height: 18,
                            minWidth: 0,
                            borderRadius: "50%",
                            padding: 0,
                            backgroundColor: "#FFF",
                        }}
                        title="Delete note"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#000" }}>
                            delete
                        </span>
                    </Button>
                </CardActions>
            </MuiCard>

            {/* Modal de edición */}
            {openEditModal && (
                <EditItem
                    id={id}
                    containerId={containerId}
                    onClose={handleCloseEditModal}
                />
            )}

            {/* Modal de borrado */}
            {openDeleteModal && (
                <DeleteItem
                    id={id} // Pasa el ID de la nota
                    containerId={containerId} // Pasa el containerId
                    onClose={handleCloseDeleteModal} // Función para cerrar el modal
                />
            )}

            {/* Modal para mostrar la nota al hacer doble clic */}
            {openShowNoteModal && (
                <ShowNote
                    open={openShowNoteModal}
                    identifyNote={id}
                    onClose={handleCloseShowNoteModal}
                />
            )}
        </React.Fragment>
    );
};

export default Card;