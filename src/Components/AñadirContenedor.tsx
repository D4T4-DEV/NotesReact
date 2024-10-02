import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';

const AddContainer: React.FC = () => {
    // Estado para manejar cuando un ítem está sobre el área dropeable
    const [isOver, setIsOver] = useState(false);

    // Definir un id único para el área dropeable
    const { setNodeRef, isOver: isDraggingOver } = useDroppable({
        id: 'droppable-area',
        data: { type: 'add-container' },
    });

    // Actualiza el estado cuando un ítem está sobre el área
    React.useEffect(() => {
        if (isDraggingOver) {
            setIsOver(true);
        } else {
            setIsOver(false);
        }
    }, [isDraggingOver]);

    return (
        <div
            ref={setNodeRef}
            style={{
                width: '250px',
                height: '250px',
                border: isOver ? '2px solid blue' : '2px dashed gray', // Cambia el borde cuando el ítem está sobre el área
                backgroundColor: isOver ? 'rgba(135, 206, 235, 0.3)' : 'transparent', // Cambia el fondo cuando el ítem está sobre el área
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '20px',
                transition: 'background-color 0.3s ease, border 0.3s ease',
            }}
        >
            <p style={{ textAlign: 'center' }}>Arrastra aquí para crear un nuevo contenedor</p>
        </div>
    );
};

export default AddContainer;
