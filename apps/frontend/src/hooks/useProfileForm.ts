import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { updateMe, uploadAvatar } from "../services/users";

export const useProfileForm = () => {
    const { t } = useTranslation();
    const { user, isLoading, login } = useAuth();
    const navigate = useNavigate();

    const [editUsername, setEditUsername] = useState("");
    const [editBio, setEditBio] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/");
        }
    }, [isLoading, user, navigate]);

    useEffect(() => {
        if (user) {
            Promise.resolve().then(() => {
                setEditUsername(user.username);
                setEditBio(user.bio || "");
            });
        }
    }, [user]);

    const isSSO = !!(user?.intraId || user?.githubId);

    const hasChanges =
        editUsername !== user?.username ||
        editBio !== (user?.bio || "") ||
        (isChangingPassword && (oldPassword !== "" || newPassword !== ""));

    const handleSave = async () => {
        if (isChangingPassword && (!oldPassword || !newPassword)) {
            toast.error(t("profilePage.errorBothPasswords"));
            return;
        }

        setIsSaving(true);
        try {
            const updatedUser = await updateMe({
                username: editUsername,
                bio: editBio,
                oldPassword:
                    isChangingPassword && oldPassword ? oldPassword : undefined,
                password:
                    isChangingPassword && newPassword ? newPassword : undefined,
            });
            login(updatedUser);
            setOldPassword("");
            setNewPassword("");
            setIsChangingPassword(false);
            toast.success(t("profilePage.successProfile"));
        } catch (err) {
            const error = err as { response?: { status?: number } };
            if (error.response?.status === 409) {
                toast.error(t("profilePage.conflictUsername"));
            } else {
                toast.error(t("profilePage.errorProfile"));
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsSaving(true);
            try {
                const updatedUser = await uploadAvatar(file);
                login(updatedUser);
                toast.success(t("profilePage.successAvatar"));
            } catch {
                toast.error(t("profilePage.errorAvatar"));
            } finally {
                setIsSaving(false);
            }
        }
    };

    return {
        user,
        editUsername,
        setEditUsername,
        editBio,
        setEditBio,
        oldPassword,
        setOldPassword,
        newPassword,
        setNewPassword,
        isChangingPassword,
        setIsChangingPassword,
        showPassword,
        setShowPassword,
        isSaving,
        fileInputRef,
        isSSO,
        hasChanges,
        handleSave,
        handleAvatarChange,
    };
};
