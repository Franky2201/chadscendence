import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";
import { Card, Badge, Input, Button } from "../../components/ui";
import { useProfileForm } from "../../hooks/useProfileForm";

export function Summary() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const {
        user,
        leaderboardRank,
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
    } = useProfileForm();

    return (
        <Card
            title={t("profilePage.title")}
            href="/"
            description={t("profilePage.back")}
            size="large"
        >
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start w-full mt-4">
                <div className="flex flex-col items-center gap-4 md:w-1/3">
                    <div
                        className="relative group cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <img
                            src={user.avatarUrl}
                            alt="avatar"
                            className="w-40 h-40 rounded-xl object-cover border-4 border-white/20 shadow-xl transition-all group-hover:opacity-50"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-bold bg-black/60 px-3 py-1 rounded-lg">
                                {t("profilePage.modify")}
                            </span>
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />

                    <div className="flex flex-col items-center text-center gap-1 mt-2">
                        <h2 className="text-2xl font-black flex items-center gap-2">
                            #{leaderboardRank ?? "..."}
                            {user?.role?.name === "Admin" && (
                                <Badge color="black" className="text-xs">
                                    {t("profilePage.admin")}
                                </Badge>
                            )}
                        </h2>
                        <p className="text-sm font-medium text-white/50 mb-1">
                            {user.email}
                        </p>
                        <p className="text-lg font-bold text-white/80 mt-1">
                            {user.rank?.icon} {user.rank?.name}
                        </p>
                        <p className="text-xl font-black text-white">
                            {t("profilePage.rating")} : {user.score}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 flex-1 w-full mt-4 md:mt-0">
                    <div className="flex flex-col gap-1 items-start w-full">
                        <label className="text-sm font-bold text-white/70 ml-1">
                            {t("profilePage.username")}
                        </label>
                        <Input
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value)}
                            placeholder={t("profilePage.username")}
                            className="w-full !text-white text-left"
                            color="white"
                        />
                    </div>

                    <div className="flex flex-col gap-1 items-start w-full">
                        <label className="text-sm font-bold text-white/70 ml-1">
                            {t("profilePage.bio")}
                        </label>
                        <Input
                            value={editBio}
                            onChange={(e) => setEditBio(e.target.value)}
                            placeholder={t("profilePage.bioPlaceholder")}
                            className="w-full !text-white text-left"
                            color="white"
                        />
                    </div>

                    {!isSSO && (
                        <>
                            <hr className="border-white/10 my-2 w-full" />
                            <div className="flex flex-col gap-3 w-full relative">
                                <div className="flex justify-between items-center w-full">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsChangingPassword(
                                                !isChangingPassword,
                                            );
                                            if (isChangingPassword) {
                                                setOldPassword("");
                                                setNewPassword("");
                                            }
                                        }}
                                        className="text-sm font-bold text-white/70 hover:text-white transition-colors flex items-center gap-2"
                                    >
                                        {t("profilePage.changePassword")}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className={`transition-transform duration-300 ${isChangingPassword ? "rotate-180" : ""}`}
                                        >
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </button>

                                    {isChangingPassword && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1"
                                        >
                                            {showPassword ? (
                                                <>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                        <line
                                                            x1="1"
                                                            y1="1"
                                                            x2="23"
                                                            y2="23"
                                                        ></line>
                                                    </svg>
                                                    {t("profilePage.hide")}
                                                </>
                                            ) : (
                                                <>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                        <circle
                                                            cx="12"
                                                            cy="12"
                                                            r="3"
                                                        ></circle>
                                                    </svg>
                                                    {t("profilePage.show")}
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>

                                {isChangingPassword && (
                                    <div className="flex flex-col gap-3 mt-1 animate-in slide-in-from-top-2 fade-in duration-300">
                                        <Input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={oldPassword}
                                            onChange={(e) =>
                                                setOldPassword(e.target.value)
                                            }
                                            placeholder={t(
                                                "profilePage.oldPassword",
                                            )}
                                            className="w-full !text-white text-left"
                                            color="white"
                                        />
                                        <Input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={newPassword}
                                            onChange={(e) =>
                                                setNewPassword(e.target.value)
                                            }
                                            placeholder={t(
                                                "profilePage.newPassword",
                                            )}
                                            className="w-full !text-white text-left"
                                            color="white"
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <div className="flex justify-center mt-6 w-full">
                        <Button
                            onClick={handleSave}
                            disabled={!hasChanges || isSaving}
                            color={hasChanges ? theme : "grey"}
                            className="w-full"
                        >
                            {isSaving
                                ? t("profilePage.saving")
                                : t("profilePage.save")}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
