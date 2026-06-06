import { useModal } from "../../contexts/ModalContext";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import GameModal from "./GameModal";
import PlayModal from "./PlayModal";

export default function ModalRoot() {
    const { activeModal, modalProps, closeModal } = useModal();

    if (!activeModal) return null;

    return (
        <>
            {activeModal === "LOGIN" && (
                <LoginModal isOpen={true} onClose={closeModal} />
            )}
            {activeModal === "REGISTER" && (
                <RegisterModal
                    isOpen={true}
                    onClose={closeModal}
                    {...modalProps}
                />
            )}
            {activeModal === "GAME" && (
                <GameModal isOpen={true} onClose={closeModal} {...modalProps} />
            )}
            {activeModal === "PLAY" && (
                <PlayModal isOpen={true} onClose={closeModal} {...modalProps} />
            )}
        </>
    );
}
