import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button, Input, Window, Card, Badge } from "../components/ui";
import {
    updateMe,
    uploadAvatar,
    getMyLeaderboardRank,
} from "../services/users";

export default function ProfilePage() {
    const { user, isLoading, login } = useAuth();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [username, setUsername] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [bio, setBio] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [leaderboardRank, setLeaderboardRank] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/");
        }
    }, [isLoading, user, navigate]);

    useEffect(() => {
        if (user) {
            getMyLeaderboardRank()
                .then(setLeaderboardRank)
                .catch(() => {});
        }
    }, [user]);

    if (isLoading || !user)
        return (
            <div className="min-h-screen flex items-center justify-center">
                Chargement...
            </div>
        );

    const isSSO = !!(user.intraId || user.githubId);

    const handleEdit = () => {
        setUsername(user.username);
        setAvatarFile(null);
        setAvatarPreview(null);
        setBio(user.bio ?? "");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError(null);
        setEditing(true);
    };

    const handleAvatarClick = () => {
        if (editing && !isSSO) fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        if (newPassword && newPassword !== confirmPassword) {
            setError("Les deux mots de passe ne correspondent pas.");
            return;
        }

        setSaving(true);
        setError(null);
        try {
            let updated = await updateMe({
                username: username || undefined,
                bio: bio !== "" ? bio : null,
                oldPassword: newPassword ? oldPassword : undefined,
                password: newPassword || undefined,
            });

            if (avatarFile) {
                updated = await uploadAvatar(avatarFile);
            }

            login(updated);
            setEditing(false);
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

    const formatDate = (date: Date | string) =>
        new Date(date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

    return (
        <Window className="relative min-h-screen w-full overflow-hidden bg-cover bg-center">
            <header className="justify-self-center">
                <img
                    className="select-none w-auto drop-shadow-lg max-h-30 mb-8"
                    src="/game_banner.png"
                    alt="GameLogo"
                />
            </header>
            <Card
                className="relative max-w-250 mx-auto p-6"
                title="Profile"
                href="/"
                titleClassName="text-4xl"
                description="Back"
                size="large"
            >
                <div className="relative group">
                    <img
                        src={
                            editing
                                ? (avatarPreview ?? user.avatarUrl)
                                : user.avatarUrl
                        }
                        alt="avatar"
                        onClick={handleAvatarClick}
                        className={[
                            "w-36 h-36 rounded-xl justify-self-center mb-4 object-cover border-4 border-white/20 shadow-xl transition-opacity",
                            editing && !isSSO
                                ? "cursor-pointer group-hover:opacity-70"
                                : "",
                        ].join(" ")}
                    />
                    {editing && !isSSO && (
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            Changer
                        </span>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>

                {!editing ? (
                    <>
                        <div className="flex flex-col items-center gap-2 text-center">
                            <h1 className="text-4xl font-black">
                                {user.username}
                            </h1>
                            <p className="text-lg">{user.email}</p>
                            <p className="text-2xl mt-1">
                                {user.rank?.icon} {user.rank?.name}
                            </p>
                            <p className="text-3xl font-bold">
                                {user.score} pts{" "}
                                <span className="text-2xl font-semibold/70">
                                    #{leaderboardRank ?? "…"}
                                </span>
                            </p>
                            {user.bio && (
                                <p className="text-base text-center max-w-sm mt-1 italic">
                                    {user.bio}
                                </p>
                            )}
                            {user.role === "admin" && (
                                <Badge
                                    color="black"
                                    className="text-xs font-bold uppercase mt-1"
                                >
                                    Admin
                                </Badge>
                            )}
                            <div className="mt-3 flex flex-col gap-1 text-xs">
                                <span>
                                    Membre depuis le{" "}
                                    {formatDate(user.createdAt)}
                                </span>
                                <span>
                                    Profil mis à jour le{" "}
                                    {formatDate(user.updatedAt)}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-2 flex-wrap justify-center">
                            <Button onClick={handleEdit} size="medium">
                                Modifier le profil
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col gap-4 w-full">
                            <Input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Nom d'utilisateur"
                                className="w-full"
                            />
                            {isSSO && (
                                <p className="text-xs text-center">
                                    Avatar géré par{" "}
                                    {user.intraId ? "42 Intra" : "GitHub"}
                                </p>
                            )}
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Biographie (optionnelle)"
                                rows={3}
                                className="w-full rounded-2xl px-6 py-3 text-base font-bold bg-slate-950 text-slate-50 border border-slate-500 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 resize-none"
                            />

                            {!isSSO && (
                                <>
                                    <hr className="border-white/20" />
                                    <p className="text-sm">
                                        Changer le mot de passe (optionnel)
                                    </p>
                                    <Input
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) =>
                                            setOldPassword(e.target.value)
                                        }
                                        placeholder="Ancien mot de passe"
                                        className="w-full"
                                    />
                                    <Input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                        placeholder="Nouveau mot de passe"
                                        className="w-full"
                                    />
                                    <Input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        placeholder="Confirmer le nouveau mot de passe"
                                        className="w-full"
                                    />
                                </>
                            )}

                            {error && (
                                <p className="text-red-400 text-sm">{error}</p>
                            )}
                        </div>

                        <div className="flex gap-4 mt-2 flex-wrap justify-center">
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                size="medium"
                            >
                                {saving ? "Sauvegarde..." : "Sauvegarder"}
                            </Button>
                            <Button
                                onClick={() => {
                                    setAvatarFile(null);
                                    setAvatarPreview(null);
                                    setEditing(false);
                                }}
                                size="medium"
                            >
                                Annuler
                            </Button>
                        </div>
                    </>
                )}
            </Card>
        </Window>
    );
}
