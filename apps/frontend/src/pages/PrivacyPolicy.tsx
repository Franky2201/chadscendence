import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, Window } from "../components/ui";
import { useTranslation } from "react-i18next";

const PrivacyPolicy: React.FC = () => {
    const { t } = useTranslation();
    const { isLoading } = useAuth();
    const navigate = useNavigate();

    const informationItems = t(
        "privacyPolicy.informationWeCollect.items",
        { returnObjects: true }
    ) as string[];

    const usageItems = t(
        "privacyPolicy.howWeUseYourData.items",
        { returnObjects: true }
    ) as string[];

    const gdprItems = t(
        "privacyPolicy.gdprRights.items",
        { returnObjects: true }
    ) as string[];

    if (isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-black">
                {t("loading")}...
            </div>
        );

    return (
        <Window className="relative min-h-screen w-full overflow-hidden bg-cover bg-center">
            <Card
                className="relative max-w-250 mx-auto p-6"
                title={t("privacyPolicy.title")}
                description={t("privacyPolicy.back")}
                size="large"
                onClick={() => navigate("/")}
            >
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("privacyPolicy.lastUpdated.title")}
                        </h2>
                        <p className="text-sm mt-2">
                            {t("privacyPolicy.lastUpdated.date")}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("privacyPolicy.whoWeAre.title")}
                        </h2>
                        <p className="text-sm mt-2 leading-relaxed">
                            {t("privacyPolicy.whoWeAre.content")}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("privacyPolicy.informationWeCollect.title")}
                        </h2>

                        <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                            {informationItems.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("privacyPolicy.howWeUseYourData.title")}
                        </h2>

                        <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                            {usageItems.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("privacyPolicy.cookies.title")}
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            {t("privacyPolicy.cookies.content")}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("privacyPolicy.publicInformation.title")}
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            {t("privacyPolicy.publicInformation.content")}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("privacyPolicy.oauthProviders.title")}
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            {t("privacyPolicy.oauthProviders.content")}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("privacyPolicy.gdprRights.title")}
                        </h2>

                        <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                            {gdprItems.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("privacyPolicy.exercisingRights.title")}
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            {t("privacyPolicy.exercisingRights.content")}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("privacyPolicy.legalBasis.title")}
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            {t("privacyPolicy.legalBasis.content")}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("privacyPolicy.dataRetention.title")}
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            {t("privacyPolicy.dataRetention.content")}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("privacyPolicy.ageRequirement.title")}
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            {t("privacyPolicy.ageRequirement.content")}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("privacyPolicy.contact.title")}
                        </h2>

                        <p className="text-sm mt-2">
                            {t("privacyPolicy.contact.email")}
                        </p>
                    </div>
                </div>
            </Card>
        </Window>
    );
};

export default PrivacyPolicy;