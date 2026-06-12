import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, Window } from "../components/ui";
// import { useTheme } from "../contexts/ThemeContext";

const TermsOfService: React.FC = () => {
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
                title="Terms of Service"
                description="Back"
                size="large"
                onClick={() => navigate(-1)}
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
                            Acceptance of Terms
                        </h2>
                        <p className="text-sm mt-2 leading-relaxed">
                            By creating an account or using Who's the Chad ?, you
                            agree to these Terms of Service.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            Eligibility
                        </h2>
                        <p className="text-sm mt-2 leading-relaxed">
                            Users are responsible for ensuring that their use of
                            the platform complies with applicable laws and
                            regulations.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            User Accounts
                        </h2>

                        <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                            <li>
                                You are responsible for your account
                                credentials.
                            </li>
                            <li>
                                You must not share your account with others.
                            </li>
                            <li>
                                You must provide accurate information when
                                registering.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            Acceptable Use
                        </h2>

                        <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                            <li>
                                Do not attempt unauthorized access to the
                                platform.
                            </li>
                            <li>Do not exploit bugs or vulnerabilities.</li>
                            <li>Do not interfere with platform operation.</li>
                            <li>Do not impersonate another user.</li>
                            <li>
                                Do not use automated systems to abuse the
                                service.
                            </li>
                            <li>
                                Do not upload unlawful or offensive content.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            Rankings and Statistics
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            Game results, rankings, achievements and statistics
                            may be displayed publicly to other users of the
                            platform.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            User Content
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            Users retain ownership of profile pictures and other
                            content they upload. By uploading content, users
                            grant Who's the Chad ? a non-exclusive license to
                            store, process and display such content for
                            operation of the platform.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            Intellectual Property
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            The platform, software, branding, design and related
                            materials remain the property of the Who's the Chad ?
                            team unless otherwise stated.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            Account Suspension
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            We reserve the right to suspend or terminate
                            accounts that violate these Terms or that threaten
                            the security or integrity of the platform.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            Disclaimer
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            The service is provided on an "as is" and "as
                            available" basis without warranties of any kind.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            Limitation of Liability
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            To the maximum extent permitted by law,
                            Who's the Chad ? shall not be liable for indirect,
                            incidental or consequential damages arising from use
                            of the platform.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            Governing Law
                        </h2>

                        <p className="text-sm mt-2 leading-relaxed">
                            These Terms shall be governed by and interpreted in
                            accordance with the laws of Belgium.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold uppercase tracking-widest">
                            Contact
                        </h2>

                        <p className="text-sm mt-2">juhanse@student.42belgium.be</p>
                    </div>
                </div>
            </Card>
        </Window>
    );
};

export default TermsOfService;
