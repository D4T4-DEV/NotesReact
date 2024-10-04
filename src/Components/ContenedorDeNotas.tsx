import React, { useEffect, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { horizontalListSortingStrategy, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
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
  nameContainer?: string;

}

interface CardProps {
  id: string;
  title: string;
  message: string;
  type: 'item' | 'container';
  colorItem?: string;
  containerId: string;
  isColapsedContainer?: boolean;
}

const maxLength: number = 28; // Limite de caracteres para el título

const Container: React.FC<ContainerProps> = ({ id, items, type, children, isActive, nameContainer }) => {
  const { setNodeRef } = useDroppable({
    id,
    data: { type },
  });

  const { dispatch } = useContainerContext();

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isOneItemOpen, setIsOneItem] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);


  // Nuevo estado para manejar el nombre o renombre del contenedor
  const [containerName, setContainerName] = useState(nameContainer || '');
  const [copyDataContName, setCopyDataContName] = useState('');
  const [isEditing, setIsEditing] = useState(false);


  // Modal de confirmacion de querer editar
  const [isEditConfirmOpen, setIsEditConfirmOpen] = useState(false);

  // Contenido para detectar el tamaño de la pantalla 
  const [isMobile, setIsMobile] = useState(false);

  // Checamos que sea movil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Definir como móvil si el ancho de la pantalla es menor a 768px
    };

    handleResize(); // Ejecutar al montar el componente
    window.addEventListener('resize', handleResize); // Añadir un listener para actualizar cuando cambie el tamaño

    return () => {
      window.removeEventListener('resize', handleResize); // Limpiar el listener cuando el componente se desmonte
    };
  }, []);

    // Aspectos para la edición del nombre del contenedor
    const handleBlur = () => {
      if (copyDataContName !== containerName) {
        openEditConfirm(); // Abre el modal si el nombre ha cambiado
      } else {
        setIsEditing(false);
      }
    };

    const confirmEditContainer = () => {
      setIsEditConfirmOpen(false); // Cierra el modal
      setIsEditing(false); // Finaliza el modo de edición
      setCopyDataContName(containerName); // Actualiza el nombre copiado solo después de confirmar
    };

    const cancelEditContainer = () => {
      setIsEditConfirmOpen(false); // Cierra el modal
      setIsEditing(false); // Finaliza el modo de edición
      setContainerName(copyDataContName);
    };

    const openEditConfirm = () => {
      setIsEditConfirmOpen(true); // Abre el modal de confirmación para editar
    };
    const handleDoubleClick = () => {
      setIsEditing(true);
    };

    const handleChange = (e: { target: { id: string; value: string; }; }) => {
      const { id, value } = e.target;
      if (id === 'title-container' && value.length > maxLength) return; // Limitar el título a maxLength caracteres
      setContainerName(
        value
      );
    };

    // Aspectos para la eliminacion del contenedor

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
      setIsOneItem(!isOneItemOpen);
    };

    useEffect(() => {
      if (items.length === 1) {
        setIsCollapsed(false);
        setIsOneItem(true);
      } else {

        if (items.length === 1) {
          setIsOneItem(true);
        }
        setIsOneItem(false);
        setIsCollapsed(true);
      }
    }, [items.length]);

    const sortingStrategy = isMobile ? verticalListSortingStrategy : horizontalListSortingStrategy ;

    // Medio para poder agregar el estado de 'isModalOpen' existente en el componente Card
    const childrenArray = React.Children.map(children, (child) =>
      React.isValidElement<CardProps>(child) ? React.cloneElement(child, { isColapsedContainer: isOneItemOpen }) : child
    );

    // Estilos del contenedor padre de la aplicacion
    const fatherContainerStyle: React.CSSProperties = {
      border: isActive ? '2px dashed blue' : 'none',
      backgroundColor: isActive ? 'rgba(135, 206, 235, 0.5)' : 'transparent',
      padding: '20px',
      margin: '15px',
      width: '96.5%',
      height: 'auto',
      position: 'relative',
      display: 'flex',
      justifyContent: items.length === 0 ? 'center' : '',
      flexDirection: 'row',
      flexWrap: 'wrap',
    };

    // Estilos de los otros contenedores de la aplicacion
    const defaultContainerStyle: React.CSSProperties = {
      border: isActive ? '2px dashed blue' : '2px dashed gray',
      padding: '20px',
      margin: '20px',
      backgroundColor: isActive ? 'rgba(135, 206, 235, 0.7)' : 'transparent',
      width: !isCollapsed && items.length > 1 ? '96.5%' : '300px',
      height: !isCollapsed ? 'auto' : '300px',
      display: 'flex',
      flexDirection: items.length >= 0 ? 'column' : 'row',
      flexWrap: items.length >= 0 ? 'nowrap' : 'wrap',
      borderRadius: 25,
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
      <div ref={setNodeRef} style={containerStyle}>
        {id !== 'father-items-god' && (
          <>

            {/* Botones de accion  */}
            <div style={{ display: 'flex', alignItems: 'center', }}>
              {/* Input para renombrar el contenedor */}
              <div style={{ marginRight: 5, }}>
                {isEditing ? (
                  <input
                    type="text"
                    id="title-container"
                    value={containerName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleBlur();
                    }}
                    style={{ fontSize: '16px', padding: '5px', width: '200px' }}
                  />
                ) : (
                  <span
                    onDoubleClick={handleDoubleClick}
                    style={{ fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
                    title='Dame doble click para poder renombrarme aquí'
                  >
                    {containerName || 'Renombrame'}
                  </span>
                )}
              </div>
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
                  marginRight: 1
                }}
                title={isCollapsed ? "Abrir contenedor de notas" : "Cerrar contenedor de notas"}
                disabled={items.length <= 1 && id !== 'father-items-god'}
              >
                {isCollapsed || items.length === 1 ? (
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
                title="Borrar contenedor"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#000" }}>
                  delete
                </span>
              </Button>
            </div>

            {/* Modal de confirmación de eliminacion del contenedor */}
            <ConfirmationModal
              open={isDeleteConfirmOpen}
              onClose={cancelRemoveContainer}
              onConfirm={confirmRemoveContainer}
              description="¿Estás seguro de que deseas eliminar este contenedor? Esta acción no se 
            puede deshacer y todos los elementos dentro del contenedor también serán eliminados 
            (si es que se encuentra alguna nota en este)."
            />

            {/* Modal de confirmación de edicion */}
            <ConfirmationModal
              open={isEditConfirmOpen}
              onClose={cancelEditContainer}
              onConfirm={confirmEditContainer}
              description="¿Estás seguro de querer renombrar el contenedor?"
            />
          </>
        )}

        <SortableContext items={items.map((item) => item.id)} strategy={sortingStrategy}>
          <div className="card-list" style={{
            position: 'relative',
            display: 'flex',
            flexWrap: 'wrap'
          }}
          >

            {id === 'father-items-god' && items.length === 0 &&
              <div className="empty"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  fontSize: '40px',
                  color: 'gray',
                  fontFamily: 'Noto Sans, sans-serif',
                  textAlign: 'center',
                  cursor: 'default'
                }}
                title='Aqui se verán las notas'
              >
                ESTE ES REACT NOTES ❤️</div>
            }

            {items.length === 0 && id !== 'father-items-god' ? (
              <div
                className="empty"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '240px',
                  width: '100%',
                  fontSize: '18px',
                  color: 'gray',
                  fontFamily: 'Noto Sans, sans-serif',
                  textAlign: 'center',
                }}
              >
                Suelta los items aquí
              </div>

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