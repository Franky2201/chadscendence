import { Card } from "../ui";

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6"
            onClick={onClose}
        >
            <Card
                title="Game modes"
                className="max-w-md w-full"
                contentClassName="flex flex-wrap justify-center gap-2"
            >
                <Card title="Party" className="w-48"></Card>
                <Card title="Solo" className="w-48"></Card>
                <Card title="Multi" className="w-48"></Card>
                <Card title="Custom" className="w-48"></Card>
                <Card title="Cup" className="w-48"></Card>
                <Card title="Online" className="w-48"></Card>
            </Card>
        </div>
    );
}
