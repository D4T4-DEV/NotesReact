import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { Button } from '@mui/material';
import { useContainerContext } from '../Contexts/AppContext';
import ConfirmationModal from './ModalConfirmar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

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

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setIsModalOpen(!isModalOpen);
  };

  const sortingStrategy = horizontalListSortingStrategy;


  // Medio para poder agregar el estado de 'isModalOpen' existente en el componente Card
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
    width: !isCollapsed ? '96.5%' : 350,
    height: 250,
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
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
          {/* Botones de accion  */}
          <div style={{ textAlign: 'center' }}>
            <Button
              onClick={toggleCollapse}
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
              title={isCollapsed ? "Abrir contenedor de notas" : "Cerrar contenedor de notas"}
            >
              {isCollapsed ? (
                <ExpandMoreIcon sx={{ fontSize: 18, color: "#000" }} />
              ) : (
                <ExpandLessIcon sx={{ fontSize: 18, color: "#000" }} />
              )}
            </Button>

            <Button
              onClick={openDeleteConfirm}
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
          </div>

          <ConfirmationModal
            open={isDeleteConfirmOpen}
            onClose={cancelRemoveContainer}
            onConfirm={confirmRemoveContainer}
            description="¿Estás seguro de que deseas eliminar este contenedor? Esta acción no se 
            puede deshacer y todos los elementos dentro del contenedor también serán eliminados 
            (si es que se encuentra alguna nota en este)."
          />
        </>
      )}

      <SortableContext items={items.map((item) => item.id)} strategy={sortingStrategy}>

        <div className="card-list" style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '5px'
        }}
        >

          {id === 'father-items-god' && items.length === 0 &&
            <div className="empty">Aquí se mostrarán los items principales, tranquilo que me voy y vuelvo 👻🥸</div>
          }

          {items.length === 0 && id !== 'father-items-god' ? (

            <div className="empty">Suelta los items aquí</div>

          ) : id === 'father-items-god' ? (
            childrenArray?.map((child, index) => (
              <div key={index} style={{ marginBottom: '5px' }}>
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
              <div key={index} style={{ marginBottom: '0' }}>
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