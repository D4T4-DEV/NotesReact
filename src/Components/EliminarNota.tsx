import React, { useContext } from "react";
import { ContainerContext } from "../Contexts/AppContext";
import ConfirmationModal from "./ModalConfirmar";

interface DeleteItemProps {
    id: string;
    containerId: string;
    onClose: () => void;
}

const DeleteItem: React.FC<DeleteItemProps> = ({ id, containerId, onClose }) => {
    const context = useContext(ContainerContext);

    if (!context) {
        console.error("El contexto ContainerContext es null");
        return null;
    }

    const { dispatch } = context;

    const handleDelete = () => {
        if (!id || !containerId) return;

        dispatch({
            type: 'REMOVE_ITEM',
            payload: {
                containerId,
                itemId: id,
            },
        });

        onClose(); // Cierra el modal
    };

    return (
        <ConfirmationModal
            open={true}
            onClose={onClose}
            onConfirm={handleDelete}
            description="¿Estas seguro de eliminar esta nota?, una vez borrada, no se puede recuperar 📝"
        />
    );
};

export default DeleteItem;
