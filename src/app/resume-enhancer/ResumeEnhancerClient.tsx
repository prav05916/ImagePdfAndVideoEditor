'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

// Advanced Types
type SectionType = 'Personal' | 'Summary' | 'Experience' | 'Education' | 'Skills' | 'Projects' | 'Custom';
interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  content: any;
}

export default function ResumeEnhancerPage() {
  const { locale } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'content' | 'templates' | 'ai'>('content');
  const [activeSectionId, setActiveSectionId] = useState<string | null>('sec-personal');
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      alert('Payment successful! You can now export your resume.');
    }
    if (query.get('canceled')) {
      alert('Payment was canceled.');
    }
  }, []);

  // AI States
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTargetRole, setAiTargetRole] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // ATS Optimization States
  const [appliedKeywords, setAppliedKeywords] = useState(false);
  const [appliedMetrics, setAppliedMetrics] = useState(false);
  const [appliedSummary, setAppliedSummary] = useState(false);
  const [appliedContact, setAppliedContact] = useState(false);

  // Role Analyzer States
  const [targetRoleInput, setTargetRoleInput] = useState('');
  const [analyzingRole, setAnalyzingRole] = useState(false);
  const [recommendations, setRecommendations] = useState<string[] | null>(null);

  // Drag and Drop state
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  // Global Styling State
  const [themeColor, setThemeColor] = useState('#2A4365');
  const [fontFamily, setFontFamily] = useState('Inter, sans-serif');
  const [spacing, setSpacing] = useState('normal');

  // Resume State
  const [sections, setSections] = useState<ResumeSection[]>([
    { id: 'sec-personal', type: 'Personal', title: 'Personal Details', visible: true, content: { fullName: 'Shivansh Doe', email: 'shivansh@example.com', phone: '+91 9876543210', role: 'Senior Software Engineer', address: 'Mumbai, India', linkedin: 'linkedin.com/in/shivansh', github: 'github.com/shivansh' } },
    { id: 'sec-summary', type: 'Summary', title: 'Professional Summary', visible: true, content: { text: 'A highly motivated software engineer with experience in React and Next.js. Passionate about building excellent user interfaces and crafting scalable web applications.' } },
    { id: 'sec-exp', type: 'Experience', title: 'Work Experience', visible: true, content: { items: [{ id: 'exp-1', title: 'Senior Frontend Developer', company: 'Tech Solutions Inc.', date: '2021 - Present', desc: 'Led the frontend team to build a highly scalable SaaS platform using Next.js and Tailwind CSS. Improved performance by 40%.' }] } },
    { id: 'sec-edu', type: 'Education', title: 'Education', visible: true, content: { items: [{ id: 'edu-1', degree: 'B.Tech in Computer Science', school: 'National Institute of Technology', date: '2016 - 2020', grade: '8.5 CGPA' }] } },
    { id: 'sec-skills', type: 'Skills', title: 'Key Skills', visible: true, content: { text: 'JavaScript, TypeScript, React, Next.js, Node.js, Tailwind CSS, GraphQL, Git, AWS' } }
  ]);

  // ATS Scoring Logic - Dynamic & Upgradable
  const getATSScore = () => {
    let score = 30; // base score for standard content
    if (appliedKeywords) score += 20;
    if (appliedMetrics) score += 20;
    if (appliedSummary) score += 20;
    if (appliedContact) score += 10;

    // dynamic bonuses based on lengths
    const summary = sections.find(s => s.type === 'Summary')?.content.text || '';
    if (summary.split(' ').length > 25) score += 5;

    const skills = sections.find(s => s.type === 'Skills')?.content.text || '';
    if (skills.split(',').length > 5) score += 5;

    return Math.min(100, score);
  };

  const atsScore = getATSScore();

  // AI Implementation Handlers
  const handleInsertKeywords = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const skillsSec = sections.find(s => s.type === 'Skills');
      if (skillsSec) {
        const addedKeywords = "TypeScript, React Native, CI/CD Pipelines, System Architecture, AWS (S3/EC2/Lambda), GraphQL, Docker, Microservices, Jest, Cypress";
        const currentText = skillsSec.content.text || '';
        const separator = currentText ? ', ' : '';
        updateSectionContent(skillsSec.id, { text: currentText + separator + addedKeywords });
      }
      setAppliedKeywords(true);
      setIsAiGenerating(false);
    }, 1000);
  };

  const handleInjectMetrics = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const expSec = sections.find(s => s.type === 'Experience');
      if (expSec && expSec.content.items?.length > 0) {
        const firstItem = expSec.content.items[0];
        const enhancedDesc = `• Spearheaded frontend migration to Next.js, reducing LCP (Largest Contentful Paint) times by 38% and overall page bundle size by 45%.\n• Designed scalable micro-frontend architecture catering to 2M+ active monthly users, increasing user engagement by 22%.\n• Mentored 5 junior engineers and introduced automated testing (Jest/Cypress), boosting test coverage from 10% to 85%.\n• Reduced annual cloud infrastructure costs by 15% ($45k savings) through route optimizations and serverless API integration.`;
        updateArrayItem(expSec.id, firstItem.id, 'desc', enhancedDesc);
      }
      setAppliedMetrics(true);
      setIsAiGenerating(false);
    }, 1000);
  };

  const handleEnhanceSummary = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const sumSec = sections.find(s => s.type === 'Summary');
      if (sumSec) {
        const premiumSummary = `Metrics-driven Senior Software Engineer with 5+ years of experience architecting high-performance React/Next.js systems. Recognized expert in optimizing page performance, building robust component designs, and developing cloud-native microservices. Passionate about leading collaborative engineering teams and turning complex product visions into scalable, user-centric codebases.`;
        updateSectionContent(sumSec.id, { text: premiumSummary });
      }
      setAppliedSummary(true);
      setIsAiGenerating(false);
    }, 1000);
  };

  const handleCompleteProfile = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const personalSec = sections.find(s => s.type === 'Personal');
      if (personalSec) {
        updateSectionContent(personalSec.id, {
          email: 'shivansh.doe@developer.com',
          phone: '+91 99999 88888',
          address: 'Mumbai, Maharashtra, India',
          linkedin: 'linkedin.com/in/shivansh-dev',
          github: 'github.com/shivansh-codes'
        });
      }
      setAppliedContact(true);
      setIsAiGenerating(false);
    }, 1000);
  };

  // Role Analyzer Suggestion Logic
  const handleAnalyzeRole = () => {
    if (!targetRoleInput.trim()) return;
    setAnalyzingRole(true);
    setTimeout(() => {
      const role = targetRoleInput.toLowerCase();
      let suggestionsList = [
        "Include technical keywords such as CI/CD, Jest, Docker, and Webpack.",
        "Emphasize scalable architectural layouts in work descriptions.",
        "Highlight collaborative engineering practices like Agile sprints and code reviews."
      ];

      if (role.includes('data') || role.includes('machine') || role.includes('ai')) {
        suggestionsList = [
          "Integrate high-value keyword structures: Python, Pandas, Scikit-Learn, PyTorch, SQL.",
          "Add machine learning pipeline metrics (e.g., 'achieved 94% accuracy, optimized inference time').",
          "Highlight projects dealing with large data queries and cloud architectures (AWS/GCP)."
        ];
      } else if (role.includes('front') || role.includes('react') || role.includes('ui')) {
        suggestionsList = [
          "Embed UX/performance keywords: Next.js, TypeScript, Tailwind CSS, Core Web Vitals, SSR.",
          "Showcase responsiveness and user interaction improvements with quantifiable KPIs.",
          "Detail modular UI architectures and custom reusable React hooks library creation."
        ];
      } else if (role.includes('back') || role.includes('node') || role.includes('api')) {
        suggestionsList = [
          "Integrate backend keywords: Node.js, Express, PostgreSQL, Redis, Microservices, gRPC.",
          "Add latency and query efficiency achievements (e.g., 'reduced API response times by 40%').",
          "Emphasize robust authentication protocols (JWT, OAuth) and database optimization."
        ];
      }

      setRecommendations(suggestionsList);
      setAnalyzingRole(false);
    }, 1200);
  };

  const handleApplyRoleImprovements = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const role = targetRoleInput || "Data Scientist";
      const personalSec = sections.find(s => s.type === 'Personal');
      if (personalSec) {
        updateSectionContent(personalSec.id, { role: `Senior ${role}` });
      }

      // Add specialized keywords
      const skillsSec = sections.find(s => s.type === 'Skills');
      if (skillsSec) {
        let keywordString = "Scrum, CI/CD, Git, System Design";
        if (role.toLowerCase().includes('data') || role.toLowerCase().includes('machine')) {
          keywordString = "Python, SQL, PyTorch, Pandas, Scikit-Learn, Big Data, AWS SageMaker";
        } else if (role.toLowerCase().includes('front') || role.toLowerCase().includes('react')) {
          keywordString = "TypeScript, React, Next.js, Redux Toolkit, Webpack, Tailwind CSS, Cypress";
        } else {
          keywordString = "Node.js, Express, PostgreSQL, Redis, Docker, Kubernetes, AWS, REST APIs";
        }
        updateSectionContent(skillsSec.id, { text: keywordString });
      }

      // Add specialized summary
      const sumSec = sections.find(s => s.type === 'Summary');
      if (sumSec) {
        updateSectionContent(sumSec.id, {
          text: `Accomplished and results-oriented Senior ${role} with a proven record of designing scalable, high-impact systems. Adept at leveraging state-of-the-art architectures to drive business growth, optimize performance, and lead agile teams to success. Specialized in modern development frameworks and technical problem-solving.`
        });
      }

      setAppliedKeywords(true);
      setAppliedMetrics(true);
      setAppliedSummary(true);
      setIsAiGenerating(false);
      setRecommendations(null);
      setTargetRoleInput('');
    }, 1500);
  };

  const updateSectionContent = (id: string, payload: any) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, content: { ...s.content, ...payload } } : s));
  };

  const updateArrayItem = (secId: string, itemId: string, field: string, value: string) => {
    setSections(prev => prev.map(s => {
      if (s.id === secId) {
        return { ...s, content: { ...s.content, items: s.content.items.map((i: any) => i.id === itemId ? { ...i, [field]: value } : i) } };
      }
      return s;
    }));
  };

  const addArrayItem = (secId: string, defaultItem: any) => {
    setSections(prev => prev.map(s => {
      if (s.id === secId) {
        return { ...s, content: { ...s.content, items: [...s.content.items, { id: Date.now().toString(), ...defaultItem }] } };
      }
      return s;
    }));
  };

  const removeArrayItem = (secId: string, itemId: string) => {
    setSections(prev => prev.map(s => {
      if (s.id === secId) {
        return { ...s, content: { ...s.content, items: s.content.items.filter((i: any) => i.id !== itemId) } };
      }
      return s;
    }));
  };

  const handleGenerateImpacts = () => {
    if (!aiPrompt) return;
    setIsAiGenerating(true);
    setTimeout(() => {
      const expSection = sections.find(s => s.type === 'Experience');
      if (expSection && expSection.content.items.length > 0) {
        const firstId = expSection.content.items[0].id;
        const newDesc = `• Spearheaded the development of ${aiPrompt}, resulting in a 40% increase in performance.\n• Designed scalable architecture reducing server costs by 15%.\n• Collaborated with cross-functional teams to deliver the project 2 weeks ahead of schedule.`;
        updateArrayItem(expSection.id, firstId, 'desc', newDesc);
        setActiveSectionId(expSection.id);
        setActiveSidebarTab('content');
      }
      setIsAiGenerating(false);
      setAiPrompt('');
    }, 1500);
  };

  const handleWriteSummary = () => {
    if (!aiTargetRole) return;
    setIsAiGenerating(true);
    setTimeout(() => {
      const sumSection = sections.find(s => s.type === 'Summary');
      if (sumSection) {
        const newSummary = `Dynamic and results-oriented ${aiTargetRole} with a proven track record of delivering high-quality solutions. Adept at leveraging modern technologies to drive business growth, optimize processes, and lead cross-functional teams to success. Strong analytical skills combined with a passion for continuous learning and innovation.`;
        updateSectionContent(sumSection.id, { text: newSummary });
        setActiveSectionId(sumSection.id);
        setActiveSidebarTab('content');
      }
      setIsAiGenerating(false);
      setAiTargetRole('');
    }, 1500);
  };

  const generatePDF = async () => {
    const element = document.getElementById('resume-canvas');
    if (!element) return;
    
    const query = new URLSearchParams(window.location.search);
    if (!query.get('success')) {
      setIsPaying(true);
      try {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productName: 'Premium Resume PDF Export',
            amount: 5000,
            redirectUrl: window.location.pathname,
          }),
        });
        const { id, error } = await res.json();
        if (error) throw new Error(error);

        const stripe: any = await stripePromise;
        await stripe?.redirectToCheckout({ sessionId: id });
      } catch (err) {
        console.error('Payment initiation failed', err);
        alert('Failed to start payment process.');
      } finally {
        setIsPaying(false);
      }
      return;
    }

    setIsProcessing(true);
    try {
      const canvas = await html2canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Resume_Export.pdf`);
    } catch (err) {
      console.error(err);
      alert('Error generating PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    if (draggedIdx === null || draggedIdx === index) return;
    const newSections = [...sections];
    const draggedItem = newSections[draggedIdx];
    newSections.splice(draggedIdx, 1);
    newSections.splice(index, 0, draggedItem);
    setDraggedIdx(index);
    setSections(newSections);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  const activeSection = sections.find(s => s.id === activeSectionId);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-surface overflow-hidden">
      {/* TOP TOOLBAR */}
      <div className="h-14 bg-surface-lighter border-b border-border flex items-center justify-between px-6 flex-shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border-r border-border pr-4">
            <button className="p-1.5 hover:bg-surface rounded text-text-muted hover:text-text-primary transition-colors" title="Undo">↩️</button>
            <button className="p-1.5 hover:bg-surface rounded text-text-muted hover:text-text-primary transition-colors" title="Redo">↪️</button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Zoom</span>
            <input type="range" min="50" max="150" value={zoom} onChange={e => setZoom(+e.target.value)} className="w-24 h-1 bg-surface rounded-full appearance-none accent-primary" />
            <span className="text-xs font-mono text-primary-light">{zoom}%</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-full border border-border">
            <span className="text-xs font-bold">ATS Score</span>
            <div className={`text-xs font-black px-1.5 py-0.5 rounded ${atsScore >= 80 ? 'bg-green-500/20 text-green-500' : atsScore >= 50 ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'}`}>
              {atsScore}%
            </div>
          </div>
          <button className="px-4 py-1.5 text-xs font-bold bg-surface border border-border hover:border-primary text-text-primary rounded-lg transition-colors">
            ⬇️ DOCX
          </button>
          <button onClick={generatePDF} disabled={isProcessing || isPaying} className="px-5 py-1.5 text-xs font-bold gradient-primary text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50">
            {isProcessing ? 'Rendering...' : isPaying ? 'Redirecting...' : '📄 Export PDF (₹50)'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR: COMPONENTS & SECTIONS */}
        <div className="w-72 bg-surface-lighter border-r border-border flex flex-col flex-shrink-0 z-10">
          <div className="flex text-xs font-bold border-b border-border">
            <button onClick={() => setActiveSidebarTab('content')} className={`flex-1 py-3 ${activeSidebarTab === 'content' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-text-muted hover:bg-surface'}`}>Content</button>
            <button onClick={() => setActiveSidebarTab('templates')} className={`flex-1 py-3 ${activeSidebarTab === 'templates' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-text-muted hover:bg-surface'}`}>Templates</button>
            <button onClick={() => setActiveSidebarTab('ai')} className={`flex-1 py-3 flex items-center justify-center gap-1 ${activeSidebarTab === 'ai' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-text-muted hover:bg-surface'}`}>✨ AI Tools</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeSidebarTab === 'content' && (
              <>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Resume Sections</p>
                {sections.map((sec, i) => (
                  <div key={sec.id} 
                    onClick={() => setActiveSectionId(sec.id)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, i)}
                    onDragEnter={(e) => handleDragEnter(e, i)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${activeSectionId === sec.id ? 'border-primary bg-primary/10' : 'border-border bg-surface hover:border-primary/50'} ${draggedIdx === i ? 'opacity-50 scale-95' : 'opacity-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-text-muted cursor-grab hover:text-text-primary active:cursor-grabbing">⣿</span>
                      <span className="text-sm font-semibold text-text-primary">{sec.title}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSections(p => p.map(s => s.id === sec.id ? { ...s, visible: !s.visible } : s)); }}
                      className={`text-xs ${sec.visible ? 'text-primary' : 'text-text-muted'}`}
                    >
                      {sec.visible ? '👁️' : '🚫'}
                    </button>
                  </div>
                ))}
                <button className="w-full py-3 mt-4 border-2 border-dashed border-border rounded-xl text-text-muted hover:text-primary hover:border-primary/50 transition-colors text-sm font-bold flex items-center justify-center gap-2">
                  <span>➕ Add Custom Section</span>
                </button>
              </>
            )}

            {activeSidebarTab === 'templates' && (
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Resume Templates</p>
                <div onClick={() => { setThemeColor('#2A4365'); setFontFamily('Inter, sans-serif'); setSpacing('normal'); }} className="p-3 rounded-xl border border-border cursor-pointer hover:border-primary transition-colors bg-surface flex flex-col gap-2">
                  <div className="h-20 bg-gray-100 rounded-lg flex flex-col p-2 gap-1 overflow-hidden border border-gray-200">
                    <div className="h-3 w-1/3 bg-[#2A4365] rounded-full mx-auto" />
                    <div className="h-1 w-full bg-gray-300 rounded-full" />
                    <div className="h-1 w-2/3 bg-gray-300 rounded-full" />
                  </div>
                  <span className="text-sm font-bold text-text-primary text-center">Modern Classic</span>
                </div>
                <div onClick={() => { setThemeColor('#047857'); setFontFamily('Outfit, sans-serif'); setSpacing('compact'); }} className="p-3 rounded-xl border border-border cursor-pointer hover:border-primary transition-colors bg-surface flex flex-col gap-2">
                  <div className="h-20 bg-gray-100 rounded-lg flex flex-col p-2 gap-1 overflow-hidden border border-gray-200">
                    <div className="h-4 w-1/2 bg-[#047857] rounded-sm" />
                    <div className="h-1 w-full bg-gray-300 rounded-sm" />
                    <div className="h-1 w-full bg-gray-300 rounded-sm" />
                  </div>
                  <span className="text-sm font-bold text-text-primary text-center">Minimal Emerald</span>
                </div>
                <div onClick={() => { setThemeColor('#9f1239'); setFontFamily('Merriweather, serif'); setSpacing('relaxed'); }} className="p-3 rounded-xl border border-border cursor-pointer hover:border-primary transition-colors bg-surface flex flex-col gap-2">
                  <div className="h-20 bg-[#fafafa] rounded-lg flex flex-col p-2 gap-1 overflow-hidden border border-gray-300">
                    <div className="h-3 w-3/4 bg-[#9f1239] font-serif" />
                    <div className="h-px w-full bg-[#9f1239]/50" />
                    <div className="h-1 w-full bg-gray-400 mt-1" />
                  </div>
                  <span className="text-sm font-bold text-text-primary text-center">Executive Ruby</span>
                </div>
              </div>
            )}

            {activeSidebarTab === 'ai' && (
              <div className="space-y-4">
                {/* ATS Scoring Gauge */}
                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex flex-col items-center">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">ATS Optimization Score</span>
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="transparent" />
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                        className={atsScore >= 80 ? 'text-green-500' : atsScore >= 60 ? 'text-amber-500' : 'text-red-500'}
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - (251.2 * atsScore) / 100}
                        style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                      />
                    </svg>
                    <span className="absolute text-xl font-black">{atsScore}%</span>
                  </div>
                  <span className="text-xs text-text-muted mt-2 text-center">
                    {atsScore >= 90 ? '🎉 Excellent! Ready for submissions.' : atsScore >= 70 ? '👍 Great! Let\'s polish a bit more.' : '⚠️ Optimize content to bypass ATS filters.'}
                  </span>
                </div>

                {/* AI Optimization Checklist */}
                <div className="p-4 rounded-xl border border-border bg-surface-lighter space-y-3 relative overflow-hidden">
                  {isAiGenerating && (
                    <div className="absolute inset-0 bg-surface/85 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[10px] text-primary font-bold uppercase tracking-wider">AI Enhancing Resume...</span>
                    </div>
                  )}
                  <h4 className="text-xs font-black uppercase text-text-primary tracking-wider border-b border-border pb-1">AI Improvement Checklist</h4>
                  
                  {/* Task 1 */}
                  <div className="flex flex-col gap-1.5 p-2 rounded bg-surface border border-border text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        {appliedKeywords ? '✅' : '❌'}
                        Role-Targeted Keywords
                      </span>
                      <span className="text-[10px] font-mono text-green-500 font-bold">+20% ATS</span>
                    </div>
                    <p className="text-[10px] text-text-muted">Inject high-value ATS terms like TypeScript, Next.js, and CI/CD.</p>
                    {!appliedKeywords && (
                      <button onClick={handleInsertKeywords} className="w-full mt-1 py-1 text-[10px] font-bold bg-primary/15 hover:bg-primary/20 text-primary border border-primary/30 rounded transition-colors">
                        ✨ Insert Keywords
                      </button>
                    )}
                  </div>

                  {/* Task 2 */}
                  <div className="flex flex-col gap-1.5 p-2 rounded bg-surface border border-border text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        {appliedMetrics ? '✅' : '❌'}
                        Quantifiable Metrics
                      </span>
                      <span className="text-[10px] font-mono text-green-500 font-bold">+20% ATS</span>
                    </div>
                    <p className="text-[10px] text-text-muted">Auto-rewrite bullet points with high-impact numbers and revenue metrics.</p>
                    {!appliedMetrics && (
                      <button onClick={handleInjectMetrics} className="w-full mt-1 py-1 text-[10px] font-bold bg-primary/15 hover:bg-primary/20 text-primary border border-primary/30 rounded transition-colors">
                        ✨ Inject Metrics
                      </button>
                    )}
                  </div>

                  {/* Task 3 */}
                  <div className="flex flex-col gap-1.5 p-2 rounded bg-surface border border-border text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        {appliedSummary ? '✅' : '❌'}
                        Executive Summary Refinement
                      </span>
                      <span className="text-[10px] font-mono text-green-500 font-bold">+20% ATS</span>
                    </div>
                    <p className="text-[10px] text-text-muted">Rewrite professional summary to look highly technical and polished.</p>
                    {!appliedSummary && (
                      <button onClick={handleEnhanceSummary} className="w-full mt-1 py-1 text-[10px] font-bold bg-primary/15 hover:bg-primary/20 text-primary border border-primary/30 rounded transition-colors">
                        ✨ Refine Summary
                      </button>
                    )}
                  </div>

                  {/* Task 4 */}
                  <div className="flex flex-col gap-1.5 p-2 rounded bg-surface border border-border text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold flex items-center gap-1.5">
                        {appliedContact ? '✅' : '❌'}
                        Profile Completeness
                      </span>
                      <span className="text-[10px] font-mono text-green-500 font-bold">+10% ATS</span>
                    </div>
                    <p className="text-[10px] text-text-muted">Fill out LinkedIn, GitHub, and full mailing address placeholders.</p>
                    {!appliedContact && (
                      <button onClick={handleCompleteProfile} className="w-full mt-1 py-1 text-[10px] font-bold bg-primary/15 hover:bg-primary/20 text-primary border border-primary/30 rounded transition-colors">
                        ✨ Fill Profile Details
                      </button>
                    )}
                  </div>
                </div>

                {/* Target Role Custom Analyzer */}
                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 relative overflow-hidden text-left space-y-3">
                  {analyzingRole && (
                    <div className="absolute inset-0 bg-surface/85 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[10px] text-primary font-bold uppercase tracking-wider">AI Analyst Scanning...</span>
                    </div>
                  )}
                  <h4 className="text-sm font-bold text-primary flex items-center gap-1">
                    <span>💡</span> Target Role AI Analyst
                  </h4>
                  <p className="text-xs text-text-muted">Type in your target job role to generate custom ideas and implement improvements.</p>
                  
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      value={targetRoleInput} 
                      onChange={e => setTargetRoleInput(e.target.value)} 
                      placeholder="Target Role (e.g. Data Scientist)" 
                      className="w-full text-xs p-2 rounded-lg bg-surface border border-border text-text-primary focus:border-primary focus:outline-none"
                    />
                    <button 
                      onClick={handleAnalyzeRole} 
                      disabled={!targetRoleInput.trim() || analyzingRole} 
                      className="w-full py-2 text-xs font-bold bg-primary hover:bg-primary/95 text-white rounded-lg disabled:opacity-50 transition-colors"
                    >
                      Analyze & Suggest Ideas
                    </button>
                  </div>

                  {recommendations && (
                    <div className="pt-2 border-t border-border/50 space-y-3">
                      <div className="bg-surface p-2.5 rounded border border-primary/20 space-y-1.5">
                        <span className="text-[10px] font-black uppercase text-primary tracking-wider">AI Suggestions:</span>
                        <ul className="list-disc pl-4 space-y-1">
                          {recommendations.map((rec, i) => (
                            <li key={i} className="text-[10px] text-text-muted leading-relaxed">{rec}</li>
                          ))}
                        </ul>
                      </div>
                      <button 
                        onClick={handleApplyRoleImprovements} 
                        className="w-full py-2 text-xs font-bold gradient-primary text-white rounded-lg shadow transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <span>🚀</span> Apply Tailored Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CENTER: LIVE CANVAS */}
        <div className="flex-1 bg-surface overflow-auto relative p-8 flex justify-center custom-scrollbar" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }}>
          <div 
            id="resume-canvas"
            className="bg-white shadow-2xl transition-transform duration-200 origin-top"
            style={{ width: '210mm', minHeight: '297mm', transform: `scale(${zoom / 100})`, color: '#111827', fontFamily, padding: spacing === 'compact' ? '12mm' : spacing === 'relaxed' ? '24mm' : '18mm' }}
          >
            {sections.filter(s => s.visible).map((sec) => (
              <div key={sec.id} className="mb-6 group hover:outline hover:outline-2 hover:outline-primary/20 hover:outline-offset-4 cursor-text" onClick={() => setActiveSectionId(sec.id)}>
                
                {sec.type === 'Personal' && (
                  <div className="text-center pb-4" style={{ borderBottom: `2px solid ${themeColor}` }}>
                    <h1 className="text-4xl font-black tracking-tight" style={{ color: themeColor }}>{sec.content.fullName}</h1>
                    <h2 className="text-lg font-medium text-gray-600 mt-1">{sec.content.role}</h2>
                    <div className="text-xs text-gray-500 mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
                      <span>{sec.content.email}</span>
                      <span>{sec.content.phone}</span>
                      <span>{sec.content.address}</span>
                      {sec.content.linkedin && <span>{sec.content.linkedin}</span>}
                    </div>
                  </div>
                )}

                {sec.type === 'Summary' && (
                  <div className="mt-4">
                    <p className="text-sm leading-relaxed text-gray-700">{sec.content.text}</p>
                  </div>
                )}

                {['Experience', 'Education', 'Projects'].includes(sec.type) && (
                  <div className="mt-4">
                    <h3 className="text-lg font-bold uppercase tracking-widest mb-3 pb-1" style={{ color: themeColor, borderBottom: '1px solid #e5e7eb' }}>{sec.title}</h3>
                    <div className="space-y-4">
                      {sec.content.items?.map((item: any) => (
                        <div key={item.id}>
                          <div className="flex justify-between items-baseline mb-1">
                            <h4 className="font-bold text-gray-900">{item.title || item.degree}</h4>
                            <span className="text-xs font-semibold" style={{ color: themeColor }}>{item.date}</span>
                          </div>
                          <div className="text-sm font-semibold text-gray-600 mb-1">{item.company || item.school} {item.grade && ` • ${item.grade}`}</div>
                          {item.desc && <p className="text-xs leading-relaxed text-gray-700 mt-1">{item.desc}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {sec.type === 'Skills' && (
                  <div className="mt-4">
                    <h3 className="text-lg font-bold uppercase tracking-widest mb-3 pb-1" style={{ color: themeColor, borderBottom: '1px solid #e5e7eb' }}>{sec.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-700">{sec.content.text}</p>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDEBAR: PROPERTIES / STYLING */}
        <div className="w-80 bg-surface-lighter border-l border-border flex flex-col flex-shrink-0 z-10 overflow-y-auto">
          {/* Global Styles */}
          <div className="p-5 border-b border-border">
            <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">🎨 Global Styling</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-muted block mb-2">Theme Color</label>
                <div className="flex gap-2">
                  {['#2A4365', '#047857', '#9f1239', '#1e3a8a', '#d97706', '#4338ca', '#000000'].map(color => (
                    <button key={color} onClick={() => setThemeColor(color)} className={`w-6 h-6 rounded-full border-2 ${themeColor === color ? 'border-primary' : 'border-transparent'}`} style={{ backgroundColor: color }} />
                  ))}
                  <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-surface border border-border" />
                </div>
              </div>

              <div>
                <label className="text-xs text-text-muted block mb-2">Typography</label>
                <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="w-full p-2 text-xs rounded-lg bg-surface border border-border text-text-primary focus:border-primary">
                  <option value="Inter, sans-serif">Inter (Modern)</option>
                  <option value="Merriweather, serif">Merriweather (Classic)</option>
                  <option value="'Roboto Mono', monospace">Roboto Mono (Tech)</option>
                  <option value="Outfit, sans-serif">Outfit (Geometric)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-text-muted block mb-2">Layout Density</label>
                <div className="flex bg-surface rounded-lg border border-border overflow-hidden">
                  {(['compact', 'normal', 'relaxed'] as const).map(sp => (
                    <button key={sp} onClick={() => setSpacing(sp)} className={`flex-1 py-1.5 text-xs font-bold capitalize ${spacing === sp ? 'bg-primary text-white' : 'text-text-muted hover:bg-surface-lighter'}`}>
                      {sp}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Active Section Editor */}
          <div className="p-5 flex-1 bg-surface-lighter">
            {activeSection ? (
              <div key={activeSection.id} className="space-y-4">
                <div className="flex items-center gap-2 mb-4 border-b border-border pb-2">
                  <span className="text-xl">✏️</span>
                  <h3 className="text-sm font-bold text-primary">Edit {activeSection.title}</h3>
                </div>

                {activeSection.type === 'Personal' && (
                  <div className="space-y-3">
                    {['fullName', 'role', 'email', 'phone', 'address', 'linkedin'].map(field => (
                      <div key={field}>
                        <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">{field}</label>
                        <input value={activeSection.content[field] || ''} onChange={e => updateSectionContent(activeSection.id, { [field]: e.target.value })} className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-border text-text-primary focus:border-primary focus:outline-none" />
                      </div>
                    ))}
                  </div>
                )}

                {(activeSection.type === 'Summary' || activeSection.type === 'Skills') && (
                  <div>
                    <label className="text-[10px] uppercase font-bold text-text-muted block mb-1">Content</label>
                    <textarea rows={8} value={activeSection.content.text} onChange={e => updateSectionContent(activeSection.id, { text: e.target.value })} className="w-full px-3 py-2 text-xs rounded-lg bg-surface border border-border text-text-primary focus:border-primary focus:outline-none resize-none leading-relaxed" />
                  </div>
                )}

                {['Experience', 'Education'].includes(activeSection.type) && (
                  <div className="space-y-4">
                    {activeSection.content.items?.map((item: any, idx: number) => (
                      <div key={item.id} className="p-3 rounded-xl border border-border bg-surface relative group space-y-2">
                        <button onClick={() => removeArrayItem(activeSection.id, item.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs">✕</button>
                        <input placeholder="Title / Degree" value={item.title || item.degree || ''} onChange={e => updateArrayItem(activeSection.id, item.id, activeSection.type === 'Education' ? 'degree' : 'title', e.target.value)} className="w-full px-2 py-1.5 text-xs font-bold rounded bg-surface-lighter border border-border focus:border-primary focus:outline-none" />
                        <input placeholder="Company / School" value={item.company || item.school || ''} onChange={e => updateArrayItem(activeSection.id, item.id, activeSection.type === 'Education' ? 'school' : 'company', e.target.value)} className="w-full px-2 py-1.5 text-xs rounded bg-surface-lighter border border-border focus:border-primary focus:outline-none" />
                        <div className="grid grid-cols-2 gap-2">
                          <input placeholder="Duration" value={item.date || ''} onChange={e => updateArrayItem(activeSection.id, item.id, 'date', e.target.value)} className="w-full px-2 py-1.5 text-xs rounded bg-surface-lighter border border-border focus:border-primary focus:outline-none" />
                          {activeSection.type === 'Education' && <input placeholder="Grade/GPA" value={item.grade || ''} onChange={e => updateArrayItem(activeSection.id, item.id, 'grade', e.target.value)} className="w-full px-2 py-1.5 text-xs rounded bg-surface-lighter border border-border focus:border-primary focus:outline-none" />}
                        </div>
                        {activeSection.type === 'Experience' && (
                          <textarea placeholder="Description / Achievements" rows={4} value={item.desc || ''} onChange={e => updateArrayItem(activeSection.id, item.id, 'desc', e.target.value)} className="w-full px-2 py-1.5 text-xs rounded bg-surface-lighter border border-border focus:border-primary focus:outline-none resize-none" />
                        )}
                      </div>
                    ))}
                    <button onClick={() => addArrayItem(activeSection.id, activeSection.type === 'Experience' ? { title: '', company: '', date: '', desc: '' } : { degree: '', school: '', date: '', grade: '' })} className="w-full py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors">
                      + Add Item
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <span className="text-3xl mb-2">👈</span>
                <p className="text-xs text-text-muted">Select a section from the left sidebar or click on the canvas to edit properties.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
