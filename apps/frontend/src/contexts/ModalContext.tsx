import { createContext, useContext, useState, type ReactNode } from "react";

export type ModalRegistry = {
    LOGIN: undefined;
    REGISTER: { prefilledEmail?: string };
    GAME: { gameMode?: string };
};

export type ModalType = keyof ModalRegistry;

type ModalProps = ModalRegistry[keyof ModalRegistry] | undefined;

interface ModalContextType {
    activeModal: ModalType | null;
    modalProps: ModalProps;
    openModal: <T extends ModalType>(type: T, props?: ModalRegistry[T]) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [activeModal, setActiveModal] = useState<ModalType | null>(null);
    const [modalProps, setModalProps] = useState<ModalProps>(undefined);

    const openModal = <T extends ModalType>(
        type: T,
        props?: ModalRegistry[T],
    ) => {
        setActiveModal(type);
        setModalProps(props);
    };

    const closeModal = () => {
        setActiveModal(null);
        setTimeout(() => setModalProps(undefined), 300);
    };

    return (
        <ModalContext.Provider
            value={{ activeModal, modalProps, openModal, closeModal }}
        >
            {children}
        </ModalContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context)
        throw new Error("useModal doit être utilisé dans un ModalProvider");
    return context;
};
