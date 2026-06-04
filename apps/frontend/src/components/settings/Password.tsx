import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Input, Card } from "../../components/ui";
import { updateMe } from "../../services/users";

export function Password() {
    const { user, isLoading, login } = useAuth();
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            setError("Passwords differ");
            return;
        }

        setSaving(true);
        setError(null);
        try {
            const updated = await updateMe({
                oldPassword: newPassword ? oldPassword : undefined,
                password: newPassword || undefined,
            });

            login(updated);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setError(null);
        } catch (err: unknown) {
            if (err && typeof err === "object" && "response" in err) {
                const res = (
                    err as { response: { data?: { message?: string } } }
                ).response;
                setError(res.data?.message ?? "Erreur lors de la mise à jour.");
            } else {
                setError("Erreur lors de la mise à jour.");
            }
        } finally {
            setSaving(false);
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

                {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>

            <div className="w-full">
                {hasChanges && (
                    <Button
                        className="mt-2"
                        color="green"
                        onClick={handleSave}
                        disabled={saving}
                        size="medium"
                    >
                        {saving ? "Saving ..." : "Save"}
                    </Button>
                )}
            </div>
        </Card>
    );
}
