import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send, Bot, User, Loader2 } from 'lucide-react';

function ChatAi({ problem }) {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Set initial AI message when problem changes
    useEffect(() => {
        if (problem?._id) {
            setMessages([{
                role: 'model',
                parts: [{ 
                    text: `Hello! I'm your DSA tutor. How can I help you with *${problem.title}* today?\n\n` +
                          `I can help with:\n` +
                          `• Understanding the problem\n` +
                          `• Providing hints & explanations\n` +
                          `• Debugging your code\n` +
                          `• Explaining optimal solutions\n` +
                          `• Analyzing time/space complexity` 
                }]
            }]);
        }
    }, [problem]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Handle form submission
    const onSubmit = async (data) => {
        if (isLoading) return;
        
        const userMessage = data.message.trim();
        if (!userMessage) return;
        
        // Add user message immediately
        setMessages(prev => [...prev, { role: 'user', parts: [{ text: userMessage }] }]);
        reset();
        setIsLoading(true);

        try {
            const response = await axiosClient.post("/ai/chat", {
                messages: [...messages, { role: 'user', parts: [{ text: userMessage }] }],
                title: problem.title,
                description: problem.description,
                testCases: problem.visibleTestCases,
                startCode: problem.startCode
            });

            // Add AI response
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts: [{ text: response.data.response }] 
            }]);
        } catch (error) {
            console.error("API Error:", error);
            
            // More user-friendly error messages
            let errorMessage = "⚠️ Failed to get response. Please try again.";
            
            if (error.response) {
                // Server responded with non-2xx status
                errorMessage = error.response.data?.error || 
                               `Server error (${error.response.status})`;
            } else if (error.request) {
                // No response received
                errorMessage = "Network error. Check your connection.";
            }
            
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts: [{ text: errorMessage }]
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle pressing Enter to submit
    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    }, [handleSubmit, onSubmit]);

    return (
        <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px]">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <Bot className="mr-2" size={20} />
                        <span>Start a conversation with your DSA tutor</span>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div 
                            key={index} 
                            className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                        >
                            <div 
                                className={`chat-bubble ${
                                    msg.role === "user" 
                                        ? "bg-blue-500 text-white" 
                                        : "bg-base-200 text-base-content"
                                }`}
                            >
                                <div className="flex items-center mb-1">
                                    {msg.role === "user" ? (
                                        <User size={16} className="mr-2" />
                                    ) : (
                                        <Bot size={16} className="mr-2" />
                                    )}
                                    <span className="font-semibold">
                                        {msg.role === "user" ? "You" : "DSA Tutor"}
                                    </span>
                                </div>
                                <div className="whitespace-pre-wrap">
                                    {msg.parts[0].text}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                
                {isLoading && (
                    <div className="chat chat-start">
                        <div className="chat-bubble bg-base-200 text-base-content">
                            <div className="flex items-center">
                                <Loader2 className="animate-spin mr-2" size={16} />
                                <span>Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="sticky bottom-0 p-4 bg-base-100 border-t"
            >
                <div className="flex items-center">
                    <input 
                        placeholder={isLoading ? "Waiting for response..." : "Ask about the problem..."} 
                        className="input input-bordered flex-1" 
                        {...register("message", { 
                            required: "Message is required", 
                            minLength: { value: 2, message: "Message too short" }
                        })}
                        onKeyDown={handleKeyPress}
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        className={`btn ml-2 ${isLoading ? 'btn-disabled' : 'btn-primary'}`}
                        disabled={errors.message || isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <Send size={20} />
                        )}
                    </button>
                </div>
                
                {errors.message && (
                    <div className="text-error text-sm mt-1 ml-1">
                        {errors.message.message}
                    </div>
                )}
            </form>
        </div>
    );
}

export default ChatAi;