import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, Window } from "../components/ui";
// import { useTheme } from "../contexts/ThemeContext";

const PrivacyPolicy: React.FC = () => {
    // const { theme } = useTheme();
    const { isLoading } = useAuth();
    const navigate = useNavigate();

    if (isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-black">
                Loading ...
            </div>
        );

    return (
        <Window className="relative min-h-screen w-full overflow-hidden bg-cover bg-center">
            <Card
                className="relative max-w-250 mx-auto p-6"
                title="Privacy Policy"
                description="Back"
                size="large"
                onClick={() => navigate("/")}
            >
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            Last Updated
                        </h2>
                        <p className="text-sm mt-2">June 2026</p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            Who We Are
                        </h2>
                        <p className="text-sm mt-2 leading-relaxed">
                            Who's the Chad ? is a gaming platform developed as part
                            of the 42 Belgium curriculum. This Privacy Policy
                            explains how we collect, use and protect personal
                            information.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            Information We Collect
                        </h2>

                        <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                            <li>Email address</li>
                            <li>Username</li>
                            <li>
                                Password (hashed and never stored in plain text)
                            </li>
                            <li>Profile picture (optional)</li>
                            <li>GitHub or 42 OAuth identifiers</li>
                            <li>Game statistics and rankings</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            How We Use Your Data
                        </h2>

                        <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                            <li>Create and manage accounts</li>
                            <li>Authenticate users</li>
                            <li>Display rankings and statistics</li>
                            <li>Provide multiplayer features</li>
                            <li>Maintain platform security</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            Cookies
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            We use essential cookies exclusively for
                            authentication, session management and security. We
                            do not use advertising cookies or analytics cookies.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            Public Information
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            Usernames, profile pictures, rankings, achievements
                            and game statistics may be visible to other users of
                            the platform.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            OAuth Providers
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            Users may authenticate using GitHub or 42.
                            Authentication through these providers is subject to
                            their own privacy policies and terms.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            GDPR Rights
                        </h2>

                        <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                            <li>Access your data</li>
                            <li>Correct inaccurate information</li>
                            <li>Request deletion</li>
                            <li>Restrict processing</li>
                            <li>Request data portability</li>
                            <li>Lodge a complaint with the Belgian Data Protection Authority (APD/GBA)</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            Exercising Your Rights
                        </h2>
                        <p className="text-sm mt-2 leading-relaxed">
                            To exercise any of the rights listed above, including
                            requesting deletion of your account and data, please contact
                            us using the email address below or use the account deletion
                            option in your profile settings, if available.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            Legal Basis for Processing
                        </h2>
                        <p className="text-sm mt-2 leading-relaxed">
                            We process your personal data on the basis of contract
                            performance (to provide you with access to the platform and
                            its features) and legitimate interest (to maintain security,
                            prevent abuse and improve the service).
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            Data Retention
                        </h2>
                        <p className="text-sm mt-2 leading-relaxed">
                            We retain your personal data for as long as your account
                            remains active. If you request account deletion, your
                            personal data is permanently deleted within 30 days, except
                            where retention is required to comply with legal obligations.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            Age Requirement
                        </h2>
                        <p className="text-sm mt-2 leading-relaxed">
                            This platform is intended for users aged 16 and above, or the
                            minimum age of digital consent in your country of residence.
                            We do not knowingly collect personal data from individuals
                            below this age.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            Contact
                        </h2>

                        <p className="text-sm mt-2">
                            juhanse@student.42belgium.be
                        </p>
                    </div>
                </div>
            </Card>
        </Window>
    );
};

export default PrivacyPolicy;
