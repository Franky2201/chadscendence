import { Card } from "../ui";
import { Header } from "../Header";

export function GameInterRound() {
    return (
        <>
            <Header />
            <Card className="mt-10 max-w-3xl mx-auto text-center p-16">
                <h1 className="text-5xl font-black mb-6 uppercase text-blue-500">
                    Round Terminé
                </h1>
                <p className="text-2xl text-gray-500 animate-pulse">
                    Préparez-vous pour la suite...
                </p>
            </Card>
        </>
    );
}
