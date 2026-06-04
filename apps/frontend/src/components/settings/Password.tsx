import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Input, Card } from "../../components/ui";
import { updateMe } from "../../services/users";
import { toast } from "sonner";

export function Password() {
    const { user, isLoading, login } = useAuth();
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/");
        }
    }, [isLoading, user, navigate]);

    if (isLoading || !user)
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading ...
            </div>
        );

    const isSSO = !!(user.intraId || user.githubId);
    const hasChanges =
        oldPassword !== "" || newPassword !== "" || confirmPassword !== "";

    const handleSave = async () => {
        if (newPassword && newPassword !== confirmPassword) {
            toast.error("Les mots de passe sont differents.");
            return;
        }

        setLoading(true);
        try {
            const updated = await updateMe({
                oldPassword: newPassword ? oldPassword : undefined,
                password: newPassword || undefined,
            });

            login(updated);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            toast.success("Mot de passe mis à jour avec succès.");
        } catch (_error) {
            toast.error("Erreur lors de la mise à jour.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-300" title="Change Password">
            <div className="flex flex-col gap-2 w-full">
                {!isSSO && (
                    <>
                        <Input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Old password"
                            className="w-full"
                        />
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password"
                            className="w-full"
                        />
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="w-full"
                        />
                    </>
                )}
            </div>

            <div className="w-full">
                {hasChanges && (
                    <Button
                        className="mt-2"
                        color="green"
                        onClick={handleSave}
                        disabled={loading}
                        size="medium"
                    >
                        {loading ? "Loading..." : "Save"}
                    </Button>
                )}
            </div>
        </Card>
    );
}
