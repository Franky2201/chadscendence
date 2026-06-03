import { useState, useRef, useEffect } from "react";
import { useChat } from "../../contexts/ChatContext";
import { useAuth } from "../../contexts/AuthContext";

export default function ChatPanel() {
    const { user } = useAuth();
    const {
        isOpen,
        activeChat,
        messages,
        closeChat,
        sendMessage,
        loadMore,
        isLoading,
    } = useChat();
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        if (
            target.scrollTop <
            -target.scrollHeight + target.clientHeight + 100
        ) {
            loadMore();
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        const content = inputValue;
        setInputValue("");
        await sendMessage(content);
    };

    if (!isOpen || !activeChat || !user) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={closeChat}
            />

            <div
                className="fixed top-0 right-0 z-50 h-full w-[400px] flex flex-col shadow-[-8px_0_32px_0_rgba(0,0,0,0.3)] transition-transform duration-300"
                style={{
                    background:
                        "linear-gradient(135deg, rgba(30, 30, 35, 0.95) 0%, rgba(20, 20, 25, 0.98) 100%)",
                    backdropFilter: "blur(40px)",
                    WebkitBackdropFilter: "blur(40px)",
                    borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
                    fontFamily: "'Lexend', sans-serif",
                }}
            >
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <img
                            src={activeChat.avatarUrl}
                            alt={activeChat.username}
                            className="w-12 h-12 rounded-full object-cover border border-white/20"
                        />
                        <span className="text-white text-xl font-medium">
                            {activeChat.username}
                        </span>
                    </div>
                    <button
                        onClick={closeChat}
                        className="text-white/60 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div
                    className="flex-1 overflow-y-auto p-5 flex flex-col-reverse gap-4"
                    onScroll={handleScroll}
                >
                    <div ref={messagesEndRef} />
                    {messages.map((msg) => {
                        const isMe = msg.sender.id === user.id;
                        return (
                            <div
                                key={msg.id}
                                className={`flex flex-col max-w-[80%] ${isMe ? "self-end items-end" : "self-start items-start"}`}
                            >
                                <div
                                    className={`px-4 py-2 rounded-2xl ${
                                        isMe
                                            ? "bg-pink-600 text-white rounded-br-sm"
                                            : "bg-white/10 text-white/90 rounded-bl-sm border border-white/5"
                                    }`}
                                    style={{ wordBreak: "break-word" }}
                                >
                                    {msg.content}
                                </div>
                                <span className="text-white/40 text-[11px] mt-1 px-1">
                                    {new Date(msg.createdAt).toLocaleTimeString(
                                        [],
                                        { hour: "2-digit", minute: "2-digit" },
                                    )}
                                </span>
                            </div>
                        );
                    })}
                    {isLoading && (
                        <p className="text-center text-white/40 text-sm py-4">
                            Chargement...
                        </p>
                    )}
                </div>

                <form
                    onSubmit={handleSend}
                    className="p-4 border-t border-white/10 bg-black/20"
                >
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Votre message..."
                            className="flex-1 bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all placeholder:text-white/40"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="bg-pink-600 disabled:bg-pink-600/50 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                        >
                            Envoyer
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
