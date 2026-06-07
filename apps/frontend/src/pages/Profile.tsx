import { Window } from "../components/ui";
import * as pannel from "../components/profile";

export default function ProfilePage() {
    return (
        <Window className="relative min-h-screen w-full overflow-hidden bg-cover bg-center">
            <div
                className={`grid w-full max-w-300 justify-self-center grid-cols-1 
                    md:grid-cols-2 lg:grid-cols-2 gap-3`}
            >
                <pannel.Summary></pannel.Summary>
                <pannel.History></pannel.History>
                <pannel.Achievements></pannel.Achievements>
            </div>
        </Window>
    );
}
