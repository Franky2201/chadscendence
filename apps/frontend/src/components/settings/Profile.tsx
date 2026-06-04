import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Input, Card } from "../../components/ui";
import { updateMe, uploadAvatar } from "../../services/users";

export function Profile() {
    const { user, isLoading, login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState(user?.username ?? "");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [bio, setBio] = useState(user?.bio ?? "");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
        username !== (user.username ?? "") ||
        bio !== (user.bio ?? "") ||
        avatarFile !== null;

    const handleAvatarClick = () => {
        if (!isSSO) fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            let updated = await updateMe({
                username: username !== "" ? username : undefined,
                bio: bio !== "" ? bio : null,
            });

            if (avatarFile) {
                updated = await uploadAvatar(avatarFile);
            }

            login(updated);
            setUsername(updated.username ?? "");
            setBio(updated.bio ?? "");
            setAvatarFile(null);
            setAvatarPreview(null);
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
        <Card
            className="max-w-300 w-full"
            contentClassName="flex flex-col gap-2"
            title="Identity"
        >
            <Input
                onChange={(e) => setUsername(e.target.value)}
                placeholder={user?.username}
                className="w-full"
            />
            <div className="flex flex-row gap-2 grid-cols-1 md:grid-cols-2">
                <div className="relative group max-w-30">
                    <img
                        src={avatarPreview ?? user.avatarUrl}
                        alt="avatar"
                        onClick={handleAvatarClick}
                        className={[
                            "rounded-xl justify-self-center object-cover \
                            border-4 border-white/20 shadow-xl transition-opacity",
                            !isSSO
                                ? "cursor-pointer group-hover:opacity-70"
                                : "",
                        ].join(" ")}
                    />
                    <span
                        className="absolute inset-0 flex items-center justify-center 
                        text-xs font-bold opacity-0 group-hover:opacity-100 
                        transition-opacity pointer-events-none"
                    >
                        {isSSO
                            ? `Provided by ${user.intraId ? "42 Intra" : "GitHub"}`
                            : "Edit"}
                    </span>
                    {!isSSO && (
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    )}
                </div>

                <div className="w-full">
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Biography"
                        rows={3}
                        className="w-full h-full rounded-2xl px-6 py-3 text-base font-bold 
                        bg-slate-950 text-slate-50 border border-slate-500 
                        placeholder:text-slate-400 focus-visible:outline-none 
                        focus-visible:ring-2 focus-visible:ring-slate-400 resize-none"
                    />
                </div>
            </div>
            {error && (
                <p className="text-[color:var(--color-red)] text-sm text-center mt-2">
                    {error}
                </p>
            )}
            <div className="w-full">
                {hasChanges && (
                    <Button
                        className="mt-1"
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
