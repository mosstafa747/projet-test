import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

const WEBHOOK_URL = "https://mussdev777.app.n8n.cloud/webhook/chat";

export default function Chatbot() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Bonjour ! Je suis le Concierge Beldi. Comment puis-je vous aider aujourd'hui ?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const user = useAuthStore((s) => s.user);
    const { items, total } = useCartStore();

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
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Header with Red/Green Abstract Style */}
            <header className="bg-gradient-to-r from-[#E62E04] to-[#00A854] text-white p-10 relative overflow-hidden shrink-0">
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
                <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-black tracking-tighter mb-2">CONCIERGE BELDI</h1>
                        <p className="text-white/80 font-bold uppercase tracking-widest text-xs">VOTRE ASSISTANT PERSONNEL ARTISANAL</p>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col min-h-0">
                <div className="flex-1 bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto p-8 space-y-6">
                        {messages.map((m, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] px-6 py-4 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${
                                    m.role === 'user' 
                                    ? 'bg-[#E62E04] text-white rounded-tr-none' 
                                    : 'bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100'
                                }`}>
                                    {m.content}
                                </div>
                            </motion.div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-50 px-6 py-4 rounded-3xl rounded-tl-none flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>

                    <form onSubmit={sendMessage} className="p-6 bg-gray-50/50 border-t border-gray-100">
                        <div className="relative flex items-center gap-2">
                            <input
                                type="text"
                                className="flex-1 bg-white border-2 border-transparent focus:border-[#00A854] rounded-full px-6 py-4 text-sm outline-none shadow-inner transition-all"
                                placeholder="Posez votre question ici..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-14 h-14 bg-[#E62E04] text-white rounded-full flex items-center justify-center shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 transition-all text-xl"
                            >
                                <span className="material-symbols-outlined">send</span>
                            </button>
                        </div>
                    </form>
                </div>
                
                <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-6">
                    Beldi Express Concierge — Simple & Efficace
                </p>
            </main>
        </div>
    );
}