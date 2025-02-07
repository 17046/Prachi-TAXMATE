import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t p-4 bg-white shadow-lg">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
        placeholder={disabled ? 'Please select an option above' : 'Type your message...'}
        className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="p-2 rounded-full bg-blue-500 text-white disabled:bg-gray-300 hover:bg-blue-600 transition-colors shadow-md disabled:shadow-none"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}
