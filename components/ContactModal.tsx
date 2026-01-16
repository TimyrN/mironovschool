import React, { useState } from 'react';
import { X, Send, Phone, User, HelpCircle, Loader2, CheckCircle2 } from 'lucide-react';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        question: '',
        website: '' // Honeypot field
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [startTime] = useState(Date.now());

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Anti-spam checks
        if (formData.website) {
            // Honeypot filled - silent success
            setStatus('success');
            setTimeout(() => { onClose(); setStatus('idle'); setFormData({ name: '', phone: '', question: '', website: '' }); }, 3000);
            return;
        }

        if (Date.now() - startTime < 2000) {
            // Too fast - likely bot
            return;
        }

        setStatus('loading');
        setErrorMessage('');

        try {
            // Try Vercel Serverless Function first
            let response = await fetch('/api/send-contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            // Fallback to PHP if 404/405 (Not deployed as Node/Vercel)
            if (!response.ok && (response.status === 404 || response.status === 405)) {
                response = await fetch('/send-contact.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            }

            if (!response.ok) {
                throw new Error('Failed to send request');
            }

            const data = await response.json();
            if (data.success) {
                setStatus('success');
                setTimeout(() => {
                    onClose();
                    setStatus('idle');
                    setFormData({ name: '', phone: '', question: '', website: '' });
                }, 3000);
            } else {
                throw new Error(data.message || 'Error sending message');
            }

        } catch (error) {
            console.error("Submission error:", error);
            setStatus('error');
            setErrorMessage('Ошибка отправки. Попробуйте позже.');
        } finally {
            if (status !== 'success') {
                // Reset loading state if not successful immediately (or let error persist)
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div
                className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden scale-100 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center text-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Связаться со мной
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {status === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Заявка отправлена!</h3>
                            <p className="text-slate-500">Я свяжусь с вами в ближайшее время.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* HONEYPOT - Hidden from humans */}
                            <div className="hidden absolute left-[-9999px]" aria-hidden="true">
                                <input
                                    type="text"
                                    name="website"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 ml-1" htmlFor="name">
                                    Ваше имя
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                        placeholder="Иван Иванов"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 ml-1" htmlFor="phone">
                                    Номер телефона
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="tel"
                                        id="phone"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                        placeholder="+7 999 000-00-00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 ml-1" htmlFor="question">
                                    Ваш вопрос
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 flex items-start pointer-events-none text-slate-400">
                                        <HelpCircle className="w-5 h-5" />
                                    </div>
                                    <textarea
                                        id="question"
                                        rows={3}
                                        value={formData.question}
                                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                        className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                                        placeholder="Хочу записаться на занятия..."
                                    />
                                </div>
                            </div>

                            {status === 'error' && (
                                <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                                    {errorMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-2"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Отправка...
                                    </>
                                ) : (
                                    <>
                                        Отправить заявку
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactModal;
