import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import AppBarComponent from './Components/AppBarComponent'
import { useContainerContext } from './Contexts/AppContext';
import { useState } from 'react';
import AddItem from './Components/AddItem';
import Container from './Components/ContenedorDeNotas';
import Card from './Components/Nota';
import AddContainer from './Components/AñadirContenedor';
import generateUUID from './Functions/Identificadores/generarUUID';
import ConfirmationModal from './Components/ModalConfirmar';


interface Item {
  id: string;
  title: string;
  message: string;
  color?: string;
}

function App() {

  // Uso de un estado para saber el contenedor que se esta movimiento un item
  const [activeContainerId, setActiveContainerId] = useState<string | null>(null);

  // Item a mover
  const [itemToMove, setItemToMove] = useState<Item | null>(null);

  // Almacena el contenedor original
  const [sourceContainerId, setSourceContainerId] = useState<string | null>(null);

  const [sourceIndex, setSourceIndex] = useState<number | null>(null); // Índice del contenedor de origen
  const [destinationIndex, setDestinationIndex] = useState<number | null>(null); // Índice del contenedor destino

  // Utilizado para abrir el modal
  const [openModal, setOpenModal] = useState(false);

  // Utilizado para definir el movimiento
  const [moveType, setMoveType] = useState<string | null>(null);

  // Uso del contexto
  const { containers, dispatch } = useContainerContext();


  // Codigo afin a dnd-kit

  const sensors = useSensors( // Sensor para habilitar la entrada por teclado y manejar su comportamiento
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Funcion para detectar cunado se termina de arrastrar un item hacia algun lado
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    setActiveContainerId(null);

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    // Lógica para mover un ítem entre contenedores existentes
    if (activeType === 'item' && overType === 'container') {
      const sourceIndex = containers.findIndex((container) =>
        container.items.some(item => item.id === active.id)
      );
      const destinationIndex = containers.findIndex(container => container.id === over.id);

      if (sourceIndex !== -1 && destinationIndex !== -1 && sourceIndex !== destinationIndex) {
        const item = containers[sourceIndex].items.find(item => item.id === active.id);

        if (item) {
          // Almacenar información del movimiento y abrir modal de confirmación
          setItemToMove(item);
          setSourceIndex(sourceIndex);
          setDestinationIndex(destinationIndex);
          setOpenModal(true); // Abrir el modal para confirmar el movimiento
          setMoveType('between');
        }
      }
    }

    // Lógica para mover un ítem dentro del mismo contenedor
    if (activeType === 'item' && overType === 'item') {
      const containerIndex = containers.findIndex(container =>
        container.items.some(item => item.id === active.id)
      );

      if (containerIndex !== -1) {
        const activeIndex = containers[containerIndex].items.findIndex(item => item.id === active.id);
        const overIndex = containers[containerIndex].items.findIndex(item => item.id === over.id);

        if (activeIndex !== overIndex) {
          dispatch({
            type: 'MOVE_ITEM_WITHIN_CONTAINER',
            payload: { containerIndex, activeIndex, overIndex },
          });
        }
      }
    }

    // Lógica para mover un ítem a un nuevo contenedor creado en AddContainer
    if (activeType === 'item' && overType === 'add-container') {
      const sourceContainer = containers.find((container) =>
        container.items.some(item => item.id === active.id)
      );

      if (sourceContainer) {
        const movedItem = sourceContainer.items.find(item => item.id === active.id);

        if (movedItem) {
          // Almacena el ítem y el contenedor original, y abre  el modal y se setea el valor 
          setMoveType('new');
          setItemToMove(movedItem);
          setSourceContainerId(sourceContainer.id);
          setOpenModal(true);
        }
      }
    }
  };

  // Función que se ejecuta si el usuario confirma la acción
  const handleConfirmMove = () => {

    if (itemToMove && sourceIndex !== null && destinationIndex !== null) {
      console.log('Estamos aqui ')
      dispatch({
        type: 'MOVE_ITEM_BETWEEN_CONTAINERS',
        payload: { sourceIndex, destinationIndex, itemId: itemToMove.id },
      });

      // Limpiar el estado y cerrar el modal
      setItemToMove(null);
      setSourceIndex(null);
      setDestinationIndex(null);
      setOpenModal(false);
    }


    if (itemToMove && sourceContainerId) {
      // Crear nuevo contenedor
      const newContainer = {
        id: generateUUID(),
        items: [itemToMove], // Agregar el ítem al nuevo contenedor
      };

      dispatch({
        type: 'ADD_CONTAINER',
        payload: newContainer,
      });

      // Remover el ítem del contenedor original
      dispatch({
        type: 'REMOVE_ITEM',
        payload: { containerId: sourceContainerId, itemId: itemToMove.id },
      });

      // Cerrar el modal y limpiar estados
      setOpenModal(false);
      setItemToMove(null);
      setSourceContainerId(null);
    }
  };

  // Función que se ejecuta si el usuario cancela la acción esto viniendo de añadir un nuevo contenedor
  const handleCancelMove = () => {
    setOpenModal(false); // Cierra el modal sin mover el ítem
    setItemToMove(null); // Limpia el ítem a mover
    setSourceContainerId(null); // Limpia el contenedor de origen
  };

  // Funcion para saber el tipo de item que se tiene cuando se suelta otro
  const handleDragOver = (event: any) => {
    const { over } = event;
    if (over && over.data.current?.type === 'container') {
      setActiveContainerId(over.id);
    } else {
      setActiveContainerId(null);
    }
  };

  return (
    <div>

      {/* Componente de AppBar */}
      <AppBarComponent />

      {/* Componente de dnd-kit, el cual usa su propio contexto */}
      <DndContext
        // Componentes 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className='app'>
          {/* Componente encargado de agregar notas al contenedor padre */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <AddItem containerId={'father-items-god'} />
          </div>

          <AddContainer /> {/* Añadir el componente de añadir contenedores */}

          {containers.map((container) => (
            <Container
              key={container.id}
              id={container.id}
              items={container.items}
              isActive={container.id === activeContainerId}
              type="container"
            >
              {container.items.map((item) => (
                <Card
                  key={item.id}
                  id={item.id}
                  type="item"
                  title={item.title}
                  message={item.message}
                  colorItem={item.color}
                  containerId={container.id}
                />
              ))}
            </Container>
          ))}
        </div>
      </DndContext>

      {/* Modal de confirmación de crear un nuevo contenedor y mover un item entre contenedores */}
      <ConfirmationModal
        open={openModal}
        onClose={handleCancelMove}
        onConfirm={handleConfirmMove}
        description={
          moveType === 'between'
            ? "¿Estás seguro de mover este ítem a otro contenedor?"
            : "¿Estás seguro de mover este ítem a un nuevo contenedor? Esta acción creará un nuevo contenedor."
        }
      />
    </div>
  )
}

export default App