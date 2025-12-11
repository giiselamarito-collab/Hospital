import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, ShieldCheck, Stethoscope, Calendar, CreditCard, LayoutDashboard, Database } from 'lucide-react';
import { AgentType, DbState, Message } from './types';
import { INITIAL_DB_STATE } from './constants';
import { sendMessageToGemini } from './services/geminiService';
import { DataView } from './components/DataTables';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'system',
      content: 'System initialized. AIS Core Online.',
      timestamp: new Date()
    },
    {
      id: 'init-2',
      role: 'model',
      content: 'Hello. I am the Hospital System Coordinator. I can assist you with Patient Management, Appointments, Medical Records (RME), or Billing. How can I help you today?',
      timestamp: new Date(),
      agent: AgentType.COORDINATOR
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<AgentType>(AgentType.COORDINATOR);
  const [dbState, setDbState] = useState<DbState>(INITIAL_DB_STATE);
  const [activeFilter, setActiveFilter] = useState<string>(''); // For filtering data view by RM or Name

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    // Prepare context for Gemini (Simulating AIS data feed)
    const contextSummary = `
      Patients: ${dbState.patients.map(p => `${p.nama_lengkap} (${p.nomor_rekam_medis})`).join(', ')}
      Appointments: ${dbState.appointments.length} active.
    `;

    try {
      const response = await sendMessageToGemini(userMsg.content, contextSummary);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response.text,
        timestamp: new Date(),
        agent: response.detectedAgent
      };

      setMessages(prev => [...prev, botMsg]);
      
      // Update System State based on Gemini's "Brain"
      setCurrentAgent(response.detectedAgent);
      
      if (response.entityId) {
        setActiveFilter(response.entityId);
      } else if (response.action === 'NONE') {
        // If generalized question, maybe clear filter or keep generic
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'system',
        content: 'Error communicating with AI Agent.',
        timestamp: new Date()
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // UI Helpers
  const getAgentColor = (agent: AgentType) => {
    switch(agent) {
      case AgentType.PATIENT_MANAGEMENT: return 'bg-blue-600';
      case AgentType.MEDICAL_RECORDS: return 'bg-red-600';
      case AgentType.BILLING: return 'bg-emerald-600';
      case AgentType.APPOINTMENT_SCHEDULING: return 'bg-purple-600';
      default: return 'bg-slate-700';
    }
  };

  const getAgentIcon = (agent: AgentType) => {
    switch(agent) {
      case AgentType.PATIENT_MANAGEMENT: return <UserIcon className="w-4 h-4" />;
      case AgentType.MEDICAL_RECORDS: return <Stethoscope className="w-4 h-4" />;
      case AgentType.BILLING: return <CreditCard className="w-4 h-4" />;
      case AgentType.APPOINTMENT_SCHEDULING: return <Calendar className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      
      {/* Sidebar / Navigation */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 transition-all duration-300">
        <div className="p-4 lg:p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-slate-700">
          <ShieldCheck className="w-8 h-8 text-blue-400" />
          <span className="hidden lg:block font-bold text-lg tracking-tight">AIS Hospital</span>
        </div>

        <nav className="flex-1 py-6 px-2 lg:px-4 space-y-2">
          {[
            { id: AgentType.COORDINATOR, label: 'Coordinator', icon: LayoutDashboard },
            { id: AgentType.PATIENT_MANAGEMENT, label: 'Patient Mgmt', icon: UserIcon },
            { id: AgentType.APPOINTMENT_SCHEDULING, label: 'Scheduling', icon: Calendar },
            { id: AgentType.MEDICAL_RECORDS, label: 'Medical RME', icon: Stethoscope },
            { id: AgentType.BILLING, label: 'Billing & Finance', icon: CreditCard },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentAgent(item.id);
                setActiveFilter(''); // Clear filter when manually switching
              }}
              className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all ${
                currentAgent === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="hidden lg:block text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="bg-slate-800 rounded-lg p-3">
             <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
               <Database className="w-3 h-3" /> SQL Status
             </div>
             <div className="flex items-center gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-xs font-mono text-slate-200">CONNECTED</span>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Chat Interface (Left Half) */}
        <section className="flex-1 flex flex-col bg-white border-r border-slate-200 min-w-[320px] max-w-xl z-10 shadow-xl">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="font-semibold text-slate-800">System Chat</h2>
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Gemini 2.5 Flash</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scrollbar-hide">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : msg.role === 'system'
                      ? 'bg-slate-200 text-slate-600 text-xs font-mono w-full text-center'
                      : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                  }`}
                >
                  {msg.agent && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10 opacity-80">
                      <div className={`p-1 rounded bg-slate-800 text-white`}>
                        {getAgentIcon(msg.agent)}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {msg.agent.replace('_', ' ')}
                      </span>
                    </div>
                  )}
                  {msg.content}
                  <div className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'} text-right`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isThinking && (
               <div className="flex w-full justify-start">
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 rounded-tl-none flex items-center gap-2">
                     <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                     <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                     <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about patients, bills, or schedules..."
                className="flex-1 bg-slate-100 border-0 text-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!input.trim() || isThinking}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mt-2">
                 <p className="text-[10px] text-slate-400">AI can make mistakes. Verify critical medical data.</p>
            </div>
          </div>
        </section>

        {/* Dynamic Data View (Right Half) */}
        <section className="flex-1 bg-slate-100 flex flex-col h-full overflow-hidden">
          <header className={`h-16 px-6 flex items-center justify-between bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10`}>
             <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg text-white shadow-md ${getAgentColor(currentAgent)}`}>
                   {getAgentIcon(currentAgent)}
                </div>
                <div>
                   <h1 className="text-lg font-bold text-slate-800">{currentAgent.replace(/_/g, ' ')}</h1>
                   <p className="text-xs text-slate-500">Live Data View</p>
                </div>
             </div>
             {activeFilter && (
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-100 flex items-center gap-2">
                   Filter: {activeFilter}
                   <button onClick={() => setActiveFilter('')} className="hover:text-blue-900 font-bold">&times;</button>
                </div>
             )}
          </header>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            <div className="max-w-4xl mx-auto">
              {currentAgent === AgentType.COORDINATOR ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                       <h3 className="font-bold text-slate-700 mb-2">Welcome, Professor.</h3>
                       <p className="text-slate-500 text-sm mb-4">
                         The AIS Hospital Agent System is ready. The architecture distributes logic across specialized agents while maintaining a central data foundation.
                       </p>
                       <div className="text-xs bg-slate-100 p-3 rounded font-mono text-slate-600">
                         System Status: OPERATIONAL<br/>
                         Database: SQL Schema Loaded<br/>
                         Protocol: FHIR R4 Ready
                       </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl shadow-lg text-white">
                       <h3 className="font-bold mb-2">Quick Actions</h3>
                       <ul className="space-y-2 text-sm text-blue-100">
                         <li>• "Show me invoice for Budi"</li>
                         <li>• "Check medical history for RM-2024-001"</li>
                         <li>• "Schedule appointment for Dr. Hartono"</li>
                       </ul>
                    </div>
                 </div>
              ) : (
                <DataView type={currentAgent} data={dbState} filterId={activeFilter} />
              )}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default App;
