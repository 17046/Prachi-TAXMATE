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

    switch (currentStep) {
      case 'welcome':
        if (input.toLowerCase().includes('tell me more')) {
          addBotMessage(
            'I can help you choose between:\n\n' +
              '• ITR-1 (Sahaj): For salaried individuals with simple income sources\n' +
              '• ITR-2: For those with capital gains or multiple properties\n' +
              '• ITR-3: For business owners and professionals\n\n' +
              'Shall we determine which form suits you best?',
            ['Yes, let\'s begin']
          );
        } else if (input.toLowerCase().includes('yes')) {
          setCurrentStep('income_source');
          addBotMessage(
            'Great! Let\'s start by understanding your income sources. What\'s your primary source of income?',
            ['Salary', 'Business/Profession', 'Capital Gains', 'Rental Income', 'Interest Income']
          );
        }
        break;

      case 'income_source':
        const incomeType = input.toLowerCase().replace(/[^a-z]/g, '');
        askForIncomeAmount(incomeType);
        break;

      case 'add_more_income':
        if (input.toLowerCase().includes('yes')) {
          setCurrentStep('income_source');
          addBotMessage(
            'What other source of income do you have?',
            ['Salary', 'Business/Profession', 'Capital Gains', 'Rental Income', 'Interest Income']
          );
        } else {
          recommendITRForm();
        }
        break;

      case 'tax_saving':
        if (input.toLowerCase().includes('no')) {
          addBotMessage(
            'Okay! Let me know if you need any assistance. Would you like to start over?',
            ['Yes, start over', 'No, thank you']
          );
        } else {
          showTaxSavingOptions();
        }
        break;

      default:
        if (input.toLowerCase().includes('start over')) {
          setMessages([]);
          setIncomeDetails({});
          setCurrentStep('welcome');
          addBotMessage(
            'Hi! I\'m Tax Mate, your friendly tax filing assistant. I\'ll help you choose the right ITR form and discover the best tax-saving options. Ready to get started?',
            ['Yes, let\'s begin', 'Tell me more about ITR forms']
          );
        }
    }
  };

  const recommendITRForm = () => {
    let recommendedForm = 'ITR1';

    if (incomeDetails.business) {
      recommendedForm = 'ITR3';
    } else if (
      incomeDetails.capitalgains ||
      (incomeDetails.rental && incomeDetails.salary)
    ) {
      recommendedForm = 'ITR2';
    }

    const form = itrForms[recommendedForm as keyof typeof itrForms];

    const incomeBreakdown = Object.entries(incomeDetails)
      .filter(([key]) => !['id', 'created_at'].includes(key))
      .map(
        ([source, amount]) =>
          `• ${source.charAt(0).toUpperCase() + source.slice(1)}: ${amount}`
      )
      .join('\n');

    addBotMessage(
      `Based on your income details:\n\n${incomeBreakdown}\n\nI recommend filing ${form.name}.\n\n${form.description}\n\nWould you like to explore tax-saving investment options?`,
      ['Yes, show tax-saving options', 'No, thank you']
    );
    setCurrentStep('tax_saving');
  };

  const showTaxSavingOptions = () => {
    const options = taxSavingOptions
      .map(
        (section) =>
          `${section.section}:\n${section.options
            .map(
              (opt) =>
                `• ${opt.name} (Up to ₹${(opt.maxLimit / 1000).toFixed(0)}K)`
            )
            .join('\n')}`
      )
      .join('\n\n');

    addBotMessage(
      `Here are some tax-saving investment options you can consider:\n\n${options}\n\nWould you like to start over and explore more options?`,
      ['Yes, start over', 'No, thank you']
    );
    setCurrentStep('welcome');
  };

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center animate-bounce">
              <IndianRupee className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 animate-slide-up">
            Tax Mate
          </h1>
          <p className="text-blue-200 text-lg animate-slide-up-delay">
            Your Smart Tax Filing Assistant
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50/90 via-white/90 to-indigo-50/90"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Full-width container */}
      <div className="w-full h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white/20 backdrop-blur-sm border-b px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full px-4 py-2">
              <IndianRupee className="w-6 h-6 text-white" />
              <h1 className="text-xl font-bold text-white">Tax Mate</h1>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <Calculator className="w-5 h-5" />
              <p className="text-sm font-medium">
                Your Smart Tax Filing Assistant
              </p>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <main className="flex-1 overflow-y-auto px-6 py-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onOptionSelect={handleOptionSelect}
              onLike={() => handleLike(message.id)}
              onDislike={() => handleDislike(message.id)}
            />
          ))}
          <div ref={messagesEndRef} />
        </main>

        {/* Chat Input */}
        <footer className="bg-white/20 backdrop-blur-sm px-6 py-4">
          <ChatInput
            onSend={handleUserInput}
            disabled={
              messages.length > 0 &&
              messages[messages.length - 1].options !== undefined
            }
          />
        </footer>
      </div>
    </div>
  );
}

export default App;
