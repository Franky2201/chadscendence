import { Card, Button } from "../ui";
import { useModal } from "../../contexts/ModalContext";
import { withIntra, withGithub } from "../../services/auth";

export function Identification({ className = "" }: { className?: string }) {
    const { openModal } = useModal();

    return (
        <Card
            className={`w-full ${className}`}
            contentClassName="flex flex-col gap-3"
            title="Identification"
        >
            <Button className="w-full" onClick={() => openModal("LOGIN")}>
                Login
            </Button>
            <Button className="w-full" onClick={() => openModal("REGISTER")}>
                Register
            </Button>
            <div className="flex flex-row gap-2 w-full">
                <Button className="w-full" onClick={withIntra}>
                    42
                </Button>
                <Button className="w-full" onClick={withGithub}>
                    GitHub
                </Button>
            </div>
        </Card>
    );
}
