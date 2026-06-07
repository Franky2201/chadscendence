import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Input, Card, Badge } from "../../components/ui";
import {
    updateMe,
    uploadAvatar,
    getMyLeaderboardRank,
} from "../../services/users";
import { useTheme } from "../../contexts/ThemeContext";

export function Summary() {
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
    const { theme } = useTheme();

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
                Loading ...
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
        <Card
            title="Profile"
            href={editing ? "" : "/"}
            description={editing ? "" : "Back"}
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
                    className={`w-36 h-36 rounded-xl justify-self-center mb-4 
                        object-cover border-4 border-white/20 shadow-xl transition-opacity"
                        ${
                            editing && !isSSO
                                ? "cursor-pointer group-hover:opacity-70"
                                : ""
                        }
                    `}
                />
                {editing && !isSSO && (
                    <span
                        className="absolute inset-0 flex items-center 
                        justify-center text-xs font-bold opacity-0 
                        group-hover:opacity-100 transition-opacity 
                        pointer-events-none"
                    >
                        Edti
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
                        <h1 className="text-4xl font-black">{user.username}</h1>
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
                            <p
                                className="text-base text-center 
                                max-w-sm mt-1 italic"
                            >
                                {user.bio}
                            </p>
                        )}
                        {user.role.name === "admin" && (
                            <Badge
                                color="black"
                                className="text-xs font-bold uppercase mt-1"
                            >
                                Admin
                            </Badge>
                        )}
                        <div className="mt-3 flex flex-col gap-1 text-xs">
                            <span>
                                Membre since {formatDate(user.createdAt)}
                            </span>
                            <span>
                                Last updated on {formatDate(user.updatedAt)}
                            </span>
                        </div>
                    </div>

                    <Button color={theme} className="mt-2" onClick={handleEdit}>
                        Edit profile
                    </Button>
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
                            placeholder="Biography"
                            rows={2}
                            className="items-center text-start p-3
                                rounded-xl font-bold text-center
                                focus-visible:outline-none
                                disabled:cursor-not-allowed focus-visible:ring-2 
                                translate-y-[-2px] active:scale-95 
                                transition-all duration-100 ease-in-out 
                                select-none hover:ring-1 
                                bg-[color:var(--color-grey)]/50 
                                ring-[color:var(--color-grey)]"
                        />

                        {!isSSO && (
                            <>
                                <hr className="border-white/20" />
                                <p className="text-sm">Change password</p>
                                <Input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) =>
                                        setOldPassword(e.target.value)
                                    }
                                    placeholder="Old Password"
                                    className="w-full"
                                />
                                <Input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    placeholder="New password"
                                    className="w-full"
                                />
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    placeholder="Confirm new password"
                                    className="w-full"
                                />
                            </>
                        )}

                        {error && (
                            <p className="text-red-400 text-sm">{error}</p>
                        )}
                    </div>

                    <div
                        className="grid w-full justify-self-center grid-cols-1 
                            md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4 flex-wrap 
                            justify-center"
                    >
                        <Button
                            className="w-full"
                            onClick={handleSave}
                            disabled={saving}
                            size="medium"
                            color="green"
                        >
                            {saving ? "Saving ..." : "Save"}
                        </Button>
                        <Button
                            onClick={() => {
                                setAvatarFile(null);
                                setAvatarPreview(null);
                                setEditing(false);
                            }}
                            color="red"
                        >
                            Cancel
                        </Button>
                    </div>
                </>
            )}
        </Card>
    );
}
