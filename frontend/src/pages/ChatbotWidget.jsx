import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

const WEBHOOK_URL = "https://mussdev777.app.n8n.cloud/webhook/chat";

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Besoin d'aide ? Je suis là !" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const user = useAuthStore((s) => s.user);
    const { total, items } = useCartStore();

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = { role: 'user', content: input };
        const updatedHistory = [...messages, userMsg];
        setMessages(updatedHistory);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    history: updatedHistory.map(m => ({ 
                        role: m.role, 
                        content: m.content 
                    })),
                    user: {
                        name: user?.fullName || user?.name || "Guest",
                        email: user?.email,
                        total_cart: total,
                        items_count: items.length
                    }
                }),
            });

            if (!response.ok) throw new Error("Webhook service unavailable");
            const data = await response.json();
            
            setMessages([...updatedHistory, { 
                role: 'assistant', 
                content: data.output || data.message || data.text || "Je suis là." 
            }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages([...updatedHistory, { 
                role: 'assistant', 
                content: "Désolé, j'ai une petite perturbation technique. Pouvez-vous réessayer ?" 
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[99999] font-sans">
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="w-16 h-16 bg-[#E62E04] text-white rounded-full flex items-center justify-center shadow-2xl shadow-red-500/40 hover:scale-110 active:scale-95 transition-all text-2xl"
                    >
                        <span className="material-symbols-outlined">chat_bubble</span>
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-[380px] h-[550px] bg-white rounded-[2rem] shadow-[-10px_20px_50px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col border border-gray-100"
                    >
                        {/* --- Widget Header Red/Green Modern! --- */}
                        <div className="bg-gradient-to-r from-[#E62E04] to-[#00A854] text-white p-6 shrink-0 relative overflow-hidden">
                            <div className="absolute top-[-50%] left-[-20%] w-48 h-48 bg-white/10 rounded-full blur-2xl" />
                            <div className="flex justify-between items-center relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                                        <span className="material-symbols-outlined text-xl">smart_toy</span>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-sm uppercase tracking-widest leading-none mb-1">Concierge Beldi</h3>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                            <span className="text-[10px] font-bold text-white/70 uppercase">Online Assistant</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-colors">
                                    <span className="material-symbols-outlined text-lg">close</span>
                                </button>
                            </div>
                        </div>

                        {/* --- Body --- */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                            {messages.map((m, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-[13px] font-bold leading-relaxed shadow-sm ${
                                        m.role === 'user' 
                                        ? 'bg-[#E62E04] text-white rounded-tr-none' 
                                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                    }`}>
                                        {m.content}
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 shadow-sm border border-gray-50">
                                        <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce" />
                                        <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>

                        {/* --- Footer --- */}
                        <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
                             <input
                                type="text"
                                className="flex-1 bg-gray-50 border-none rounded-full px-5 py-3 text-xs outline-none focus:ring-2 focus:ring-[#00A854]/20 transition-all font-bold placeholder:text-gray-300"
                                placeholder="Message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-10 h-10 bg-[#E62E04] text-white rounded-full flex items-center justify-center shadow-md shadow-red-500/10 hover:scale-105 active:scale-95 transition-all"
                            >
                                <span className="material-symbols-outlined text-lg">send</span>
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
