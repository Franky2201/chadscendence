import { Card, Button, IconButton } from "../ui";
import { useModal } from "../../contexts/ModalContext";
import { withIntra, withGithub } from "../../services/auth";

export function Identification({ className = "" }: { className?: string }) {
    const { openModal } = useModal();

    return (
        <Card
            className={className}
            contentClassName="flex flex-col gap-3 justify-center"
            title="Identification"
        >
            <Button className="w-full" onClick={() => openModal("LOGIN")}>
                Login
            </Button>
            <Button className="w-full" onClick={() => openModal("REGISTER")}>
                Register
            </Button>
            <hr className="w-full border-t mb-1" />
            <div className="flex gap-3 justify-center items-center">
                <IconButton
                    className="w-full h-10"
                    img="github_logo.svg"
                    onClick={withIntra}
                ></IconButton>
                <IconButton
                    className="w-full h-10"
                    img="42_logo.svg"
                    imgClassName="translate-x-[-1px]"
                    onClick={withGithub}
                ></IconButton>
            </div>
        </Card>
    );
}
