import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Message, IncomeDetails } from './types';
import { itrForms, taxSavingOptions } from './data/itrForms';
import { Calculator, IndianRupee } from 'lucide-react';
import background from './back.jpg'; // Ensure back.jpg is in your src folder

const generateId = (() => {
  let counter = 0;
  return () => `msg-${Date.now()}-${counter++}`;
})();

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [incomeDetails, setIncomeDetails] = useState<IncomeDetails>({});
  const [currentStep, setCurrentStep] = useState<string>('intro');
  const [showIntro, setShowIntro] = useState(true);
  const [backgroundUrl] = useState(background);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Start chat after intro animation
    const timer = setTimeout(() => {
      setShowIntro(false);
      setCurrentStep('welcome');
      addBotMessage(
        'Hi! I\'m Tax Mate, your friendly tax filing assistant. I\'ll help you choose the right ITR form and discover the best tax-saving options. Ready to get started?',
        ['Yes, let\'s begin', 'Tell me more about ITR forms']
      );
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const addMessage = (message: Message) => {
    setMessages((prev) => [
      ...prev,
      { ...message, id: generateId(), likes: 0, dislikes: 0 },
    ]);
  };

  const addBotMessage = (content: string, options?: string[]) => {
    addMessage({ type: 'bot', content, options });
  };

  const handleUserInput = (input: string) => {
    addMessage({ type: 'user', content: input });
    processUserInput(input);
  };

  const handleOptionSelect = (option: string) => {
    addMessage({ type: 'user', content: option });
    processUserInput(option);
  };

  const handleLike = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, likes: (msg.likes || 0) + 1 }
          : msg
      )
    );
  };

  const handleDislike = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, dislikes: (msg.dislikes || 0) + 1 }
          : msg
      )
    );
  };

  const askForIncomeAmount = (type: string) => {
    const incomeTypes = {
      salary: 'annual salary',
      rental: 'annual rental income',
      business: 'business income',
      capitalgains: 'capital gains',
      interest: 'interest income',
    };

    addBotMessage(
      `Please enter your ${incomeTypes[type as keyof typeof incomeTypes]} amount:`,
      ['Less than ₹5L', '₹5L to ₹10L', '₹10L to ₹50L', 'Above ₹50L']
    );
    setCurrentStep(`${type}_amount`);
  };

  const processUserInput = (input: string) => {
    const currentStepBase = currentStep.split('_')[0];
    const isAmountStep = currentStep.endsWith('_amount');

    if (isAmountStep) {
      setIncomeDetails((prev) => ({
        ...prev,
        [currentStepBase]: input,
      }));
      addBotMessage(
        'Do you have any other sources of income?',
        ['Yes', 'No, proceed with recommendations']
      );
      setCurrentStep('add_more_income');
      return;
    }

