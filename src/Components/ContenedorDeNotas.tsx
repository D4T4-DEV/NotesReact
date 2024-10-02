import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useContainerContext } from '../Contexts/AppContext';
import ConfirmationModal from './ModalConfirmar';

interface Item {
  id: string;
  title: string;
  message: string;
}

interface ContainerProps {
  id: string;
  items: Item[];
  type: 'container';
  children: React.ReactNode;
  isActive: boolean;
}

interface CardProps {
  id: string;
  title: string;
  message: string;
  type: 'item' | 'container';
  colorItem?: string;
  containerId: string;
  isModalOpen?: boolean;
}

const Container: React.FC<ContainerProps> = ({ id, items, type, children, isActive }) => {
  const { setNodeRef } = useDroppable({
    id,
    data: { type },
  });

  const { dispatch } = useContainerContext();

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isHorizontal, setIsHorizontal] = useState(false); // Nuevo estado para alternar entre horizontal y vertical

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openDeleteConfirm = () => {
    setIsDeleteConfirmOpen(true);
  };

  const confirmRemoveContainer = () => {
    dispatch({ type: 'REMOVE_CONTAINER', payload: { containerId: id } });
    setIsDeleteConfirmOpen(false);
  };

  const cancelRemoveContainer = () => {
    setIsDeleteConfirmOpen(false);
  };

  // Alternar entre estrategias de reordenamiento
  const toggleSortingStrategy = () => {
    setIsHorizontal((prev) => !prev);
  };

  const sortingStrategy = isHorizontal ? horizontalListSortingStrategy : verticalListSortingStrategy;

  const childrenArray = React.Children.map(children, (child) =>
    React.isValidElement<CardProps>(child) ? React.cloneElement(child, { isModalOpen }) : child
  );

  // Estilos del contenedor padre de la aplicacion
  const fatherContainerStyle: React.CSSProperties = {
    border: isActive ? '2px dashed blue' : 'none',
    backgroundColor: isActive ? 'rgba(135, 206, 235, 0.5)' : 'transparent',
    padding: '20px',
    margin: '15px',
    width: '96.5%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  };

  // Estilos de los otros contenedores de la aplicacion
  const defaultContainerStyle: React.CSSProperties = {
    border: isActive ? '2px dashed blue' : 'none',
    padding: '10px',
    margin: '10px',
    backgroundColor: isActive ? 'rgba(135, 206, 235, 0.7)' : 'transparent',
    width: 350,
    height: 250,
    position: 'relative',
  };

  const containerStyle = id === 'father-items-god' ? fatherContainerStyle : defaultContainerStyle;

  const getRotationStyle = (index: number, length: number) => {
    if (length === 1) {
      return {
        transform: 'none',
        position: 'relative' as 'relative',
        marginBottom: '10px',
      };
    }

    const rotations = ['rotate(0deg)', 'rotate(0deg)', 'rotate(0deg)', 'rotate(0deg)', 'rotate(0deg)'];
    const rotation = rotations[index % rotations.length];
    return {
      transform: rotation,
      position: 'absolute' as 'absolute',
      top: `${index * 10}px`,
      left: `${index * 10}px`,
      zIndex: index,
    };
  };

  return (
    // Contenedor generado de manera dinamica
    <div ref={setNodeRef} style={containerStyle} className="container">
      {id !== 'father-items-god' && (
        <>
          <button onClick={openModal}>Mostrar las notas</button>
          <button onClick={openDeleteConfirm}>Eliminar contenedor</button>

          {/* Mensaje que muestra en el contenedor de notas y como se representa en este  */}
          <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="md">
            <DialogTitle>Bienvenido a tu contenedor de notas!</DialogTitle>
            <DialogContent>
              <button onClick={toggleSortingStrategy}>
                Cambiar a {isHorizontal ? 'Reordenamiento de notas de manera vertical' : 'Reordenamiento de manera horizontal'}
              </button>
              {items.length === 0 ? (
                <div>No hay ítems, arrastra las notas o borrame 👻📝</div>
              ) : (
                <SortableContext items={items.map((item) => item.id)} strategy={sortingStrategy}>
                  <div
                    style={{ display: 'flex', flexDirection: isHorizontal ? 'row' : 'column', gap: '10px', padding: '10px' }}
                  >
                    {childrenArray?.map((child, index) => (
                      <div key={index} style={{ marginBottom: '10px' }}>
                        {child}
                      </div>
                    ))}
                  </div>
                </SortableContext>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={closeModal} color="primary">
                Cerrar
              </Button>
            </DialogActions>
          </Dialog>

          {/* Modal para borrar el contenedor */}
          <ConfirmationModal
            open={isDeleteConfirmOpen}
            onClose={cancelRemoveContainer}
            onConfirm={confirmRemoveContainer}
            description="¿Estás seguro de que deseas eliminar este contenedor? Esta acción no se puede deshacer y todos los elementos dentro del contenedor también serán eliminados (si es que se encuentra ahí)."
          />
        </>
      )}

      <SortableContext items={items.map((item) => item.id)} strategy={sortingStrategy}>
        <div className="card-list" style={{ position: 'relative', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px' }}>
          {id === 'father-items-god' && items.length === 0 && <div className="empty">Aquí se mostrarán los items principales, tranquilo que me voy y vuelvo 👻🥸</div>}
          {items.length === 0 && id !== 'father-items-god' ? (
            <div className="empty">Suelta los items aquí</div>
          ) : id === 'father-items-god' ? (
            childrenArray?.map((child, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                {child}
              </div>
            ))
          ) : isCollapsed ? (
            childrenArray?.slice(0, 5).reverse().map((child, index) => (
              <div key={index} style={getRotationStyle(index, childrenArray.length)}>
                {child}
              </div>
            ))
          ) : (
            childrenArray?.map((child, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                {child}
              </div>
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default Container;
