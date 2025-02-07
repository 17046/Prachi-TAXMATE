import React from 'react';
import { MessageCircle, Bot, ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  onOptionSelect?: (option: string) => void;
  onLike?: () => void;
  onDislike?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onOptionSelect, onLike, onDislike }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-2' : 'mr-2'}`}>
          {message.type === 'user' ? (
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
        <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
          <div
            className={`rounded-lg px-4 py-2 shadow-sm ${
              message.type === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-100 text-gray-800'
            }`}
          >
            <p className="text-sm whitespace-pre-line">{message.content}</p>
          </div>
          
          {/* Interaction buttons */}
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={onLike}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Like"
            >
              <ThumbsUp className="w-4 h-4 text-gray-500" />
              {message.likes > 0 && (
                <span className="text-xs text-gray-500 ml-1">{message.likes}</span>
              )}
            </button>
            <button
              onClick={onDislike}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Dislike"
            >
              <ThumbsDown className="w-4 h-4 text-gray-500" />
              {message.dislikes > 0 && (
                <span className="text-xs text-gray-500 ml-1">{message.dislikes}</span>
              )}
            </button>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title={copied ? "Copied!" : "Copy message"}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>

          {message.options && (
            <div className="mt-2 flex flex-wrap gap-2">
              {message.options.map((option) => (
                <button
                  key={option}
                  onClick={() => onOptionSelect?.(option)}
                  className="px-4 py-2 text-sm bg-white border border-blue-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors shadow-sm text-blue-600 font-medium"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
