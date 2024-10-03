import { arrayMove } from '@dnd-kit/sortable';
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
// import getColorNoteRamdon from '../Funciones/Aleatorio/getColorNote';
// import generateUUID from '../Funciones/Identificadores/generarUUID';

// Definir los tipos de los items y los contenedores
interface Item {
  id: string;
  title: string;
  message: string;
  color?: string;
}

interface Container {
  id: string;
  nameContainer?: string;
  items: Item[];
}

// Tipos para el estado y las acciones del reducer
type ContainerState = Container[];

type Action =
  | { type: 'ADD_CONTAINER'; payload: Container }
  | { type: 'REMOVE_CONTAINER'; payload: { containerId: string } }
  | { type: 'ADD_ITEM'; payload: { containerId: string; item: Item } }
  | { type: 'EDIT_ITEM'; payload: { containerId: string; itemId: string; newTitle: string; newMessage: string } }
  | { type: 'REMOVE_ITEM'; payload: { containerId: string; itemId: string } }
  | { type: 'MOVE_ITEM_BETWEEN_CONTAINERS'; payload: { sourceIndex: number; destinationIndex: number; itemId: string } }
  | { type: 'EDIT_CONTAINER_NAME'; payload: { containerId: string; newName: string } }
  | { type: 'MOVE_ITEM_WITHIN_CONTAINER'; payload: { containerIndex: number; activeIndex: number; overIndex: number } };

// Estado inicial de los contenedores
const initialContainers: ContainerState = [
  {
    id: 'father-items-god',
    items: [],
  },
];

// Crear el contexto con los tipos definidos
interface ContainerContextProps {
  containers: ContainerState;
  dispatch: React.Dispatch<Action>;
}

// Creacion del contexto
export const ContainerContext = createContext<ContainerContextProps | undefined>(undefined);

// Definir el reducer (acciones que se daran en la aplicacion por el contexto)
const containerReducer = (state: ContainerState, action: Action): ContainerState => {
  switch (action.type) {

    case 'ADD_ITEM': {
      const { containerId, item } = action.payload;
      return state.map((container) =>
        container.id === containerId ? { ...container, items: [...container.items, item] } : container
      );
    }

    case 'EDIT_ITEM': { // Editar un item ('nota')
      const { containerId, itemId, newTitle, newMessage } = action.payload;
      return state.map((container) =>
        container.id === containerId
          ? {
              ...container,
              items: container.items.map((item) =>
                item.id === itemId
                  ? { ...item, title: newTitle, message: newMessage }
                  : item
              ),
            }
          : container
      );
    }

    case 'REMOVE_ITEM': {  // Eliminar un item ('nota')
      const { containerId, itemId } = action.payload;
      return state.map((container) =>
        container.id === containerId
          ? {
              ...container,
              items: container.items.filter((item) => item.id !== itemId),
            }
          : container
      );
    }

    case 'ADD_CONTAINER': { // Añadir un contenedor ('un contenedor de notas')
      return [...state, action.payload];
    }

    case 'EDIT_CONTAINER_NAME': {  // Modificar el nombre del contenedor
      const { containerId, newName } = action.payload;
      return state.map((container) =>
        container.id === containerId ? { ...container, name: newName } : container
      );
    }

    case 'REMOVE_CONTAINER': { // Eliminar un contenedor ('un contenedor de notas')
      return state.filter((container) => container.id !== action.payload.containerId);
    }

    case 'MOVE_ITEM_BETWEEN_CONTAINERS': { // Mover un item ('nota') hacia otro contenedor de notas
      const { sourceIndex, destinationIndex, itemId } = action.payload;
      const sourceContainer = state[sourceIndex];
      const destinationContainer = state[destinationIndex];
      const movedItem = sourceContainer.items.find((item) => item.id === itemId);

      if (!movedItem) return state;

      const updatedSourceItems = sourceContainer.items.filter((item) => item.id !== itemId);
      const updatedDestinationItems = [...destinationContainer.items, movedItem];

      return state.map((container, index) => {
        if (index === sourceIndex) {
          return { ...container, items: updatedSourceItems };
        }
        if (index === destinationIndex) {
          return { ...container, items: updatedDestinationItems };
        }
        return container;
      });
    }

    case 'MOVE_ITEM_WITHIN_CONTAINER': { // Mover un item ('nota') desde el mismo contenedor 
      const { containerIndex, activeIndex, overIndex } = action.payload;
      const container = state[containerIndex];
      const updatedItems = arrayMove(container.items, activeIndex, overIndex);

      return state.map((c, index) => (index === containerIndex ? { ...c, items: updatedItems } : c));
    }

    default:
      return state;
  }
};

// Hook para usar el contexto en la aplicacion
export const useContainerContext = (): ContainerContextProps => {
  const context = useContext(ContainerContext);
  if (!context) {
    throw new Error('useContainerContext debe usarse dentro de ContainerProvider');
  }
  return context;
};

// Proveedor del contexto
interface ContainerProviderProps {
  children: ReactNode;
}

// Utilizacion del contexto mediante el provider 
export const ContainerProvider: React.FC<ContainerProviderProps> = ({ children }) => {
  const [containers, dispatch] = useReducer(containerReducer, initialContainers);

  return (
    <ContainerContext.Provider value={{ containers, dispatch }}>
      {children}
    </ContainerContext.Provider>
  );
};
