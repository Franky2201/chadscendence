import { Card, Button, IconButton } from "../ui";
import { useModal } from "../../contexts/ModalContext";
import { withIntra, withGithub } from "../../services/auth";
import { useTranslation } from "react-i18next";

export function Identification({ className = "" }: { className?: string }) {
    const { t } = useTranslation();
    const { openModal } = useModal();

    return (
        <Card
            className={className}
            contentClassName="flex flex-col gap-3 justify-center"
            title={t("home.identification.title")}
        >
            <Button className="w-full" onClick={() => openModal("LOGIN")}>
                {t("home.identification.login.title")}
            </Button>
            <Button className="w-full" onClick={() => openModal("REGISTER")}>
                {t("home.identification.register.title")}
            </Button>
            <hr className="w-full border-t mb-1" />
            <div className="flex gap-3 justify-center items-center">
                <IconButton
                    className="w-full h-10 bg-[var(--color-github)]"
                    img="github_logo.svg"
                    imgClassName="w-full h-full bg-white"
                    onClick={withGithub}
                ></IconButton>
                <IconButton
                    className="w-full h-10 bg-[var(--color-github)]"
                    img="42_logo.svg"
                    imgClassName="w-full h-full translate-x-[-1px] bg-white"
                    onClick={withIntra}
                ></IconButton>
            </div>
        </Card>
    );
}
