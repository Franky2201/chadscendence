import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, Window } from "../components/ui";
import { useTranslation } from "react-i18next";

const TermsOfService: React.FC = () => {
    const { t } = useTranslation();
    const { isLoading } = useAuth();
    const navigate = useNavigate();

    const userAccountItems = t(
        "termsOfService.userAccounts.items",
        { returnObjects: true }
    ) as string[];

    const acceptableUseItems = t(
        "termsOfService.acceptableUse.items",
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
                title={t("termsOfService.title")}
                description={t("termsOfService.back")}
                size="large"
                onClick={() => navigate("/")}
            >
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("termsOfService.lastUpdated.title")}
                        </h2>
                        <p className="text-sm mt-2">
                            {t("termsOfService.lastUpdated.date")}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("termsOfService.acceptanceOfTerms.title")}
                        </h2>
                        <p className="text-sm mt-2 leading-relaxed">
                            {t("termsOfService.acceptanceOfTerms.content")}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("termsOfService.eligibility.title")}
                        </h2>
                        <p className="text-sm mt-2 leading-relaxed">
                            {t("termsOfService.eligibility.content")}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("termsOfService.ageRequirement.title")}
                        </h2>
                        <p className="text-sm mt-2 leading-relaxed">
                            {t("termsOfService.ageRequirement.content")}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("termsOfService.userAccounts.title")}
                        </h2>

                        <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                            {userAccountItems.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("termsOfService.acceptableUse.title")}
                        </h2>

                        <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                            {acceptableUseItems.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("termsOfService.rankingsAndStatistics.title")}
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            {t("termsOfService.rankingsAndStatistics.content")}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("termsOfService.userContent.title")}
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            {t("termsOfService.userContent.content")}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("termsOfService.intellectualProperty.title")}
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            {t("termsOfService.intellectualProperty.content")}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("termsOfService.accountSuspension.title")}
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            {t("termsOfService.accountSuspension.content")}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("termsOfService.disclaimer.title")}
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            {t("termsOfService.disclaimer.content")}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("termsOfService.limitationOfLiability.title")}
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            {t("termsOfService.limitationOfLiability.content")}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("termsOfService.changesToTerms.title")}
                        </h2>
                        <p className="text-sm mt-2 leading-relaxed">
                            {t("termsOfService.changesToTerms.content")}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("termsOfService.severability.title")}
                        </h2>
                        <p className="text-sm mt-2 leading-relaxed">
                            {t("termsOfService.severability.content")}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("termsOfService.governingLaw.title")}
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            {t("termsOfService.governingLaw.content")}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            {t("termsOfService.contact.title")}
                        </h2>

                        <p className="text-sm mt-2">
                            {t("termsOfService.contact.email")}
                        </p>
                    </div>
                </div>
            </Card>
        </Window>
    );
};

export default TermsOfService;