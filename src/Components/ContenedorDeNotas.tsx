import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useContainerContext } from '../Contexts/AppContext';

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

  const fatherContainerStyle: React.CSSProperties = {
    border: isActive ? '2px solid blue' : 'none',
    padding: '20px',
    margin: '15px',
    maxWidth: 2000,
    width: '100%',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  };

  const defaultContainerStyle: React.CSSProperties = {
    border: isActive ? '2px solid blue' : 'none',
    padding: '10px',
    margin: '10px',
    backgroundColor: isActive ? 'rgba(173, 216, 230, 0.3)' : 'transparent',
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
    <div ref={setNodeRef} style={containerStyle} className="container">
      {id !== 'father-items-god' && (
        <>
          <button onClick={openModal}>Mostrar en Modal</button>
          <button onClick={openDeleteConfirm}>Eliminar contenedor</button>

          <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="md">
            <DialogTitle>Bienvenido a tu contenedor de notas!</DialogTitle>
            <DialogContent>
              <button onClick={toggleSortingStrategy}>
                Cambiar a {isHorizontal ? 'Reordenamiento vertical' : 'Reordenamiento horizontal'}
              </button>
              {items.length === 0 ? (
                <div>No hay ítems, arrastra unos o borra esto 👻📝</div>
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

          <Dialog open={isDeleteConfirmOpen} onClose={cancelRemoveContainer} fullWidth maxWidth="xs">
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogContent>
              <p>
                ¿Estás seguro de que deseas eliminar este contenedor? Esta acción no se puede deshacer y
                todos los elementos dentro del contenedor también serán eliminados.
              </p>
            </DialogContent>
            <DialogActions>
              <Button onClick={confirmRemoveContainer} color="error" variant="contained">
                Eliminar
              </Button>
              <Button onClick={cancelRemoveContainer} color="primary">
                Cancelar
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      <SortableContext items={items.map((item) => item.id)} strategy={sortingStrategy}>
        <div className="card-list" style={{ position: 'relative', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px' }}>
          {id === 'father-items-god' && items.length === 0 && <div className="empty">Aquí se mostrarán los items principales</div>}
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
