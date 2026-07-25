'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Load Razorpay script dynamically
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Types
type SectionType = 'Personal' | 'Summary' | 'Experience' | 'Education' | 'Skills' | 'Projects' | 'Certifications' | 'Languages' | 'Custom';

interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  content: any;
}

export default function ResumeEnhancerPage() {
  const { locale } = useAppStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [zoom, setZoom] = useState(75);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'content' | 'templates' | 'ai'>('content');
  const [activeSectionId, setActiveSectionId] = useState<string | null>('sec-personal');
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  // Custom Section Modal State
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customSectionName, setCustomSectionName] = useState('');
  const [customSectionContent, setCustomSectionContent] = useState('');

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

  // Global Styling State
  const [themeColor, setThemeColor] = useState('#2A4365');
  const [fontFamily, setFontFamily] = useState('Inter, sans-serif');
  const [spacing, setSpacing] = useState('normal');

  // Resume State — realistic, full-page content
  const [sections, setSections] = useState<ResumeSection[]>([
    {
      id: 'sec-personal',
      type: 'Personal',
      title: 'Personal Details',
      visible: true,
      content: {
        fullName: 'Rahul Sharma',
        email: 'rahul.sharma@developer.in',
        phone: '+91 98765 43210',
        role: 'Senior Full Stack Developer',
        address: 'Bengaluru, Karnataka, India',
        linkedin: 'linkedin.com/in/rahul-sharma-dev',
        github: 'github.com/rahulsharma',
        website: 'rahulsharma.dev',
      },
    },
    {
      id: 'sec-summary',
      type: 'Summary',
      title: 'Professional Summary',
      visible: true,
      content: {
        text: 'Results-driven Senior Full Stack Developer with 6+ years of experience building scalable web applications using React, Next.js, and Node.js. Proven track record of reducing page load times by 40%, mentoring cross-functional teams, and delivering enterprise-grade products used by 2M+ users. Passionate about clean architecture, test-driven development, and DevOps best practices.',
      },
    },
    {
      id: 'sec-exp',
      type: 'Experience',
      title: 'Work Experience',
      visible: true,
      content: {
        items: [
          {
            id: 'exp-1',
            title: 'Senior Full Stack Developer',
            company: 'Infosys Ltd.',
            date: 'Jan 2022 – Present',
            desc: '• Architected a React/Next.js SaaS platform serving 500K+ daily active users, reducing LCP by 42% and TTI by 35%.\n• Led a team of 8 engineers in Agile sprints; introduced CI/CD pipelines using GitHub Actions and Docker, cutting deploy times by 60%.\n• Built RESTful and GraphQL APIs in Node.js/Express, integrated Redis caching to handle 10K+ req/sec.\n• Reduced AWS infrastructure costs by ₹18L/year via serverless migrations and S3 optimization.',
          },
          {
            id: 'exp-2',
            title: 'Frontend Developer',
            company: 'Wipro Technologies',
            date: 'Jun 2019 – Dec 2021',
            desc: '• Developed reusable React component library adopted across 3 internal products, saving 200+ dev hours/quarter.\n• Implemented SSR with Next.js improving SEO scores from 62 to 97 on Lighthouse.\n• Collaborated with UX team to redesign the checkout flow, increasing conversion rate by 18%.',
          },
        ],
      },
    },
    {
      id: 'sec-edu',
      type: 'Education',
      title: 'Education',
      visible: true,
      content: {
        items: [
          {
            id: 'edu-1',
            degree: 'B.Tech in Computer Science & Engineering',
            school: 'National Institute of Technology, Surathkal',
            date: '2015 – 2019',
            grade: 'CGPA: 8.7 / 10',
          },
        ],
      },
    },
    {
      id: 'sec-skills',
      type: 'Skills',
      title: 'Technical Skills',
      visible: true,
      content: {
        text: 'JavaScript (ES2023), TypeScript, React.js, Next.js 14, Node.js, Express.js, GraphQL, REST APIs, PostgreSQL, MongoDB, Redis, Docker, Kubernetes, AWS (EC2/S3/Lambda/RDS), CI/CD (GitHub Actions), Jest, Cypress, Tailwind CSS, Git, Agile/Scrum',
      },
    },
    {
      id: 'sec-projects',
      type: 'Projects',
      title: 'Key Projects',
      visible: true,
      content: {
        items: [
          {
            id: 'proj-1',
            title: 'ShopFlow — E-commerce Platform',
            company: 'Personal Project',
            date: '2023',
            desc: '• Built a full-stack e-commerce platform (Next.js + Node.js + PostgreSQL) with Stripe payments, real-time inventory tracking, and an admin dashboard. Handles 50K monthly transactions.',
          },
          {
            id: 'proj-2',
            title: 'AI Resume Parser',
            company: 'Open Source',
            date: '2022',
            desc: '• Developed an NLP-based resume parser using Python and spaCy that extracts key information with 94% accuracy. 3.2K+ GitHub stars.',
          },
        ],
      },
    },
    {
      id: 'sec-certs',
      type: 'Certifications',
      title: 'Certifications',
      visible: true,
      content: {
        text: '• AWS Certified Solutions Architect – Associate (2023)\n• Google Cloud Professional Data Engineer (2022)\n• Meta Front-End Developer Professional Certificate (2021)',
      },
    },
    {
      id: 'sec-langs',
      type: 'Languages',
      title: 'Languages',
      visible: true,
      content: {
        text: 'English (Professional), Hindi (Native), Kannada (Conversational)',
      },
    },
  ]);

  // ATS Scoring Logic
  const getATSScore = () => {
    let score = 30;
    if (appliedKeywords) score += 20;
    if (appliedMetrics) score += 20;
    if (appliedSummary) score += 20;
    if (appliedContact) score += 10;
    const summary = sections.find(s => s.type === 'Summary')?.content.text || '';
    if (summary.split(' ').length > 25) score += 5;
    const skills = sections.find(s => s.type === 'Skills')?.content.text || '';
    if (skills.split(',').length > 5) score += 5;
    return Math.min(100, score);
  };

  const atsScore = getATSScore();

  // ----- Section Helpers -----
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

  // ----- Custom Section -----
  const handleAddCustomSection = () => {
    if (!customSectionName.trim()) return;
    const newSection: ResumeSection = {
      id: `sec-custom-${Date.now()}`,
      type: 'Custom',
      title: customSectionName.trim(),
      visible: true,
      content: { text: customSectionContent.trim() || 'Add your content here...' },
    };
    setSections(prev => [...prev, newSection]);
    setActiveSectionId(newSection.id);
    setCustomSectionName('');
    setCustomSectionContent('');
    setShowCustomModal(false);
  };

  // ----- AI Handlers -----
  const handleInsertKeywords = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const skillsSec = sections.find(s => s.type === 'Skills');
      if (skillsSec) {
        const addedKeywords = 'TypeScript, React Native, CI/CD Pipelines, System Architecture, AWS (S3/EC2/Lambda), GraphQL, Docker, Microservices, Jest, Cypress, Redis, Kubernetes';
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
        const enhancedDesc = `• Spearheaded frontend migration to Next.js 14, reducing LCP by 45% and improving Core Web Vitals scores from 61 to 98.\n• Designed scalable micro-frontend architecture serving 2M+ active monthly users, increasing engagement by 28%.\n• Mentored 8 junior engineers, introduced Jest + Cypress testing framework—coverage grew from 12% to 88%.\n• Reduced annual AWS cloud costs by ₹18L ($22K) through serverless API migrations and route-level code splitting.`;
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
        const premiumSummary = `Metrics-driven Senior Full Stack Developer with 6+ years crafting high-performance React/Next.js systems at scale. Recognized for reducing infrastructure costs by ₹18L/year, improving Core Web Vitals scores from 61→98, and growing test coverage from 12%→88%. Expert in cloud-native microservices, CI/CD automation, and leading agile engineering teams to ship production-grade code 60% faster.`;
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
          email: 'rahul.sharma@developer.in',
          phone: '+91 98765 43210',
          address: 'Bengaluru, Karnataka, India',
          linkedin: 'linkedin.com/in/rahul-sharma-dev',
          github: 'github.com/rahulsharma',
          website: 'rahulsharma.dev',
        });
      }
      setAppliedContact(true);
      setIsAiGenerating(false);
    }, 1000);
  };

  const handleAnalyzeRole = () => {
    if (!targetRoleInput.trim()) return;
    setAnalyzingRole(true);
    setTimeout(() => {
      const role = targetRoleInput.toLowerCase();
      let suggestionsList = [
        'Include technical keywords such as CI/CD, Jest, Docker, and Webpack.',
        'Emphasize scalable architectural layouts in work descriptions.',
        'Highlight collaborative engineering practices like Agile sprints and code reviews.',
      ];
      if (role.includes('data') || role.includes('machine') || role.includes('ai')) {
        suggestionsList = [
          'Integrate high-value keywords: Python, Pandas, Scikit-Learn, PyTorch, SQL, BigQuery.',
          'Add ML pipeline metrics (e.g., "achieved 94% accuracy, reduced inference time by 40%").',
          'Highlight projects dealing with large-scale data and cloud architectures (AWS/GCP).',
        ];
      } else if (role.includes('front') || role.includes('react') || role.includes('ui')) {
        suggestionsList = [
          'Embed UX/performance keywords: Next.js, TypeScript, Tailwind CSS, Core Web Vitals, SSR.',
          'Showcase responsiveness and user interaction improvements with quantifiable KPIs.',
          'Detail modular UI architectures and custom reusable React hooks library creation.',
        ];
      } else if (role.includes('back') || role.includes('node') || role.includes('api')) {
        suggestionsList = [
          'Integrate backend keywords: Node.js, Express, PostgreSQL, Redis, Microservices, gRPC.',
          'Add latency and query efficiency achievements (e.g., "reduced API response time by 40%").',
          'Emphasize robust authentication protocols (JWT, OAuth) and database optimization.',
        ];
      }
      setRecommendations(suggestionsList);
      setAnalyzingRole(false);
    }, 1200);
  };

  const handleApplyRoleImprovements = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const role = targetRoleInput || 'Data Scientist';
      const personalSec = sections.find(s => s.type === 'Personal');
      if (personalSec) updateSectionContent(personalSec.id, { role: `Senior ${role}` });
      const skillsSec = sections.find(s => s.type === 'Skills');
      if (skillsSec) {
        let keywordString = 'Scrum, CI/CD, Git, System Design';
        if (role.toLowerCase().includes('data') || role.toLowerCase().includes('machine')) {
          keywordString = 'Python, SQL, PyTorch, Pandas, Scikit-Learn, Big Data, AWS SageMaker, Spark, Airflow';
        } else if (role.toLowerCase().includes('front') || role.toLowerCase().includes('react')) {
          keywordString = 'TypeScript, React, Next.js 14, Redux Toolkit, Webpack, Tailwind CSS, Cypress, Storybook';
        } else {
          keywordString = 'Node.js, Express, PostgreSQL, Redis, Docker, Kubernetes, AWS, REST APIs, gRPC';
        }
        updateSectionContent(skillsSec.id, { text: keywordString });
      }
      const sumSec = sections.find(s => s.type === 'Summary');
      if (sumSec) {
        updateSectionContent(sumSec.id, {
          text: `Accomplished Senior ${role} with a proven record of designing scalable, high-impact systems. Adept at leveraging state-of-the-art architectures to drive business growth, optimize performance, and lead agile teams to success. Specialized in modern development frameworks, data-driven decision making, and technical problem-solving.`,
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

  const handleGenerateImpacts = () => {
    if (!aiPrompt) return;
    setIsAiGenerating(true);
    setTimeout(() => {
      const expSection = sections.find(s => s.type === 'Experience');
      if (expSection && expSection.content.items.length > 0) {
        const firstId = expSection.content.items[0].id;
        const newDesc = `• Spearheaded the development of ${aiPrompt}, achieving a 40% improvement in overall system performance.\n• Designed scalable microservice architecture reducing server costs by 15% ($12K annual savings).\n• Collaborated with 3 cross-functional teams to deliver the project 2 weeks ahead of schedule.\n• Implemented automated testing suite boosting code coverage from 30% to 90%.`;
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
        const newSummary = `Dynamic and results-oriented ${aiTargetRole} with a proven track record of delivering high-quality, scalable solutions. Adept at leveraging modern technologies to drive business growth, optimize processes, and lead cross-functional teams to success. Strong analytical skills combined with a passion for continuous learning, clean code, and measurable impact.`;
        updateSectionContent(sumSection.id, { text: newSummary });
        setActiveSectionId(sumSection.id);
        setActiveSidebarTab('content');
      }
      setIsAiGenerating(false);
      setAiTargetRole('');
    }, 1500);
  };

  // ----- PDF Export with ₹50 Payment -----
  const doGeneratePDF = async () => {
    const element = document.getElementById('resume-canvas');
    if (!element) return;
    setIsProcessing(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (_doc: Document, el: HTMLElement) => {
          if (el.parentElement) {
            el.parentElement.style.transform = 'none';
          }
          const clonedDoc = el.ownerDocument;
          clonedDoc.querySelectorAll('style').forEach(styleEl => {
            if (styleEl.textContent) {
              styleEl.textContent = styleEl.textContent
                .replace(/oklch\([^)]+\)/g, 'rgb(100,100,100)')
                .replace(/lab\([^)]+\)/g, 'rgb(100,100,100)');
            }
          });
          el.style.background = '#ffffff';
          el.style.color = '#111827';
        },
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      if (!imgData || imgData === 'data:,') {
        throw new Error('Canvas render produced empty image data');
      }

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfPageWidth = pdf.internal.pageSize.getWidth(); // 210 mm
      const pdfPageHeight = pdf.internal.pageSize.getHeight(); // 297 mm

      const imgWidth = pdfPageWidth;
      const imgHeight = (canvas.height * pdfPageWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfPageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfPageHeight;
      }

      // Validate generated PDF before saving
      const pdfArrayBuffer = pdf.output('arraybuffer');
      const headerBytes = new Uint8Array(pdfArrayBuffer.slice(0, 4));
      const pdfHeader = String.fromCharCode(...headerBytes);
      if (pdfHeader !== '%PDF') {
        throw new Error('Corrupted PDF header generated');
      }

      pdf.save('Resume_Export.pdf');
    } catch (err) {
      console.error('PDF generation bug error:', err);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const generatePDF = async () => {
    if (isPaid) {
      await doGeneratePDF();
      return;
    }

    setIsPaying(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) throw new Error('Razorpay SDK failed to load.');

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: 'Premium Resume PDF Export',
          amount: 5000, // 5000 paise = ₹50
        }),
      });
      const { orderId, amount, currency, keyId, error } = await res.json();
      if (error) throw new Error(error);

      const options = {
        key: keyId,
        amount,
        currency,
        name: 'ShivanshStudio',
        description: 'Premium Resume PDF Export',
        order_id: orderId,
        handler: async function () {
          setIsPaid(true);
          setIsPaying(false);
          alert('Payment successful! Generating your PDF...');
          await doGeneratePDF();
        },
        prefill: { name: '', email: '', contact: '' },
        theme: { color: '#6366f1' },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
            alert('Payment was canceled.');
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment initiation failed', err);
      alert('Failed to start payment process.');
      setIsPaying(false);
    }
  };

  // ----- Drag & Drop -----
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
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

  const handleDragEnd = () => setDraggedIdx(null);

  const activeSection = sections.find(s => s.id === activeSectionId);

  // Spacing map
  const paddingMap = { compact: '10mm', normal: '14mm', relaxed: '20mm' };
  const pad = paddingMap[spacing as keyof typeof paddingMap] || '14mm';

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-surface overflow-hidden">

      {/* Custom Section Modal */}
      <AnimatePresence>
        {showCustomModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCustomModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-surface-lighter border border-border rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl"
            >
              <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                ➕ Add Custom Section
              </h3>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-1.5">Section Name *</label>
                <input
                  autoFocus
                  type="text"
                  placeholder="e.g. Volunteer Work, Awards, Publications..."
                  value={customSectionName}
                  onChange={e => setCustomSectionName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddCustomSection()}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-border text-text-primary focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider block mb-1.5">Initial Content (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Add content for this section..."
                  value={customSectionContent}
                  onChange={e => setCustomSectionContent(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-surface border border-border text-text-primary focus:border-primary focus:outline-none resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 py-2 text-sm font-bold border border-border rounded-lg hover:bg-surface transition-colors text-text-muted"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCustomSection}
                  disabled={!customSectionName.trim()}
                  className="flex-1 py-2 text-sm font-bold gradient-primary text-white rounded-lg disabled:opacity-50 transition-opacity"
                >
                  Add Section
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP TOOLBAR */}
      <div className="h-14 bg-surface-lighter border-b border-border flex items-center justify-between px-4 flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Zoom</span>
            <input
              type="range" min="50" max="120" value={zoom}
              onChange={e => setZoom(+e.target.value)}
              className="w-20 h-1 bg-surface rounded-full appearance-none accent-primary"
            />
            <span className="text-xs font-mono text-primary-light w-8">{zoom}%</span>
          </div>
          <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-full border border-border">
            <span className="text-xs font-bold">ATS</span>
            <div className={`text-xs font-black px-1.5 py-0.5 rounded ${atsScore >= 80 ? 'bg-green-500/20 text-green-500' : atsScore >= 50 ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'}`}>
              {atsScore}%
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">
            ✓ ATS Friendly
          </div>
          <button
            onClick={generatePDF}
            disabled={isProcessing || isPaying}
            className="px-5 py-1.5 text-xs font-bold gradient-primary text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            {isProcessing ? (
              <><span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> Generating PDF...</>
            ) : isPaying ? (
              <><span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> Redirecting...</>
            ) : (
              <> 📄 Export PDF (₹50)</>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <div className="w-68 bg-surface-lighter border-r border-border flex flex-col flex-shrink-0 z-10" style={{ width: '272px' }}>
          <div className="flex text-xs font-bold border-b border-border">
            <button onClick={() => setActiveSidebarTab('content')} className={`flex-1 py-2.5 ${activeSidebarTab === 'content' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-text-muted hover:bg-surface'}`}>Content</button>
            <button onClick={() => setActiveSidebarTab('templates')} className={`flex-1 py-2.5 ${activeSidebarTab === 'templates' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-text-muted hover:bg-surface'}`}>Templates</button>
            <button onClick={() => setActiveSidebarTab('ai')} className={`flex-1 py-2.5 flex items-center justify-center gap-1 ${activeSidebarTab === 'ai' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-text-muted hover:bg-surface'}`}>✨ AI</button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {/* CONTENT TAB */}
            {activeSidebarTab === 'content' && (
              <>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Resume Sections</p>
                {sections.map((sec, i) => (
                  <div
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    draggable
                    onDragStart={e => handleDragStart(e, i)}
                    onDragEnter={e => handleDragEnter(e, i)}
                    onDragEnd={handleDragEnd}
                    onDragOver={e => e.preventDefault()}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${activeSectionId === sec.id ? 'border-primary bg-primary/10' : 'border-border bg-surface hover:border-primary/50'} ${draggedIdx === i ? 'opacity-50 scale-95' : 'opacity-100'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-text-muted cursor-grab text-xs">⣿</span>
                      <span className="text-xs font-semibold text-text-primary truncate max-w-[130px]">{sec.title}</span>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); setSections(p => p.map(s => s.id === sec.id ? { ...s, visible: !s.visible } : s)); }}
                      className={`text-xs flex-shrink-0 ${sec.visible ? 'text-primary' : 'text-text-muted'}`}
                    >
                      {sec.visible ? '👁️' : '🚫'}
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setShowCustomModal(true)}
                  className="w-full py-2.5 mt-3 border-2 border-dashed border-border rounded-xl text-text-muted hover:text-primary hover:border-primary/50 transition-colors text-xs font-bold flex items-center justify-center gap-2"
                >
                  <span>➕</span> Add Custom Section
                </button>
              </>
            )}

            {/* TEMPLATES TAB */}
            {activeSidebarTab === 'templates' && (
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">Resume Templates</p>
                {[
                  { name: 'Modern Classic', color: '#2A4365', font: 'Inter, sans-serif', spacing: 'normal', preview: 'bg-blue-900' },
                  { name: 'Minimal Emerald', color: '#047857', font: 'Outfit, sans-serif', spacing: 'compact', preview: 'bg-emerald-800' },
                  { name: 'Executive Ruby', color: '#9f1239', font: 'Merriweather, serif', spacing: 'relaxed', preview: 'bg-rose-900' },
                  { name: 'Dark Steel', color: '#1e293b', font: 'Roboto Mono, monospace', spacing: 'normal', preview: 'bg-slate-800' },
                  { name: 'Ocean Blue', color: '#1e40af', font: 'Inter, sans-serif', spacing: 'compact', preview: 'bg-blue-800' },
                ].map(tmpl => (
                  <div
                    key={tmpl.name}
                    onClick={() => { setThemeColor(tmpl.color); setFontFamily(tmpl.font); setSpacing(tmpl.spacing); }}
                    className="p-3 rounded-xl border border-border cursor-pointer hover:border-primary transition-colors bg-surface flex flex-col gap-2"
                  >
                    <div className={`h-16 ${tmpl.preview} rounded-lg flex flex-col p-2 gap-1.5 overflow-hidden opacity-90`}>
                      <div className="h-2.5 w-1/2 bg-white/80 rounded-full mx-auto" />
                      <div className="h-1 w-full bg-white/30 rounded-full" />
                      <div className="h-1 w-3/4 bg-white/30 rounded-full" />
                      <div className="h-1 w-full bg-white/20 rounded-full" />
                    </div>
                    <span className="text-xs font-bold text-text-primary text-center">{tmpl.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* AI TAB */}
            {activeSidebarTab === 'ai' && (
              <div className="space-y-4">
                {/* ATS Gauge */}
                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex flex-col items-center">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2">ATS Score</span>
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.05)" strokeWidth="7" fill="transparent" />
                      <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="7" fill="transparent"
                        className={atsScore >= 80 ? 'text-green-500' : atsScore >= 60 ? 'text-amber-500' : 'text-red-500'}
                        strokeDasharray={201}
                        strokeDashoffset={201 - (201 * atsScore) / 100}
                        style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                      />
                    </svg>
                    <span className="absolute text-lg font-black">{atsScore}%</span>
                  </div>
                  <span className="text-[10px] text-text-muted mt-1.5 text-center">
                    {atsScore >= 90 ? '🎉 Excellent! Ready for submission.' : atsScore >= 70 ? '👍 Great! Polish a bit more.' : '⚠️ Optimize to bypass ATS filters.'}
                  </span>
                </div>

                {/* AI Checklist */}
                <div className="p-3 rounded-xl border border-border bg-surface-lighter space-y-2.5 relative overflow-hidden">
                  {isAiGenerating && (
                    <div className="absolute inset-0 bg-surface/85 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] text-primary font-bold uppercase tracking-wider">AI Enhancing...</span>
                    </div>
                  )}
                  <h4 className="text-[10px] font-black uppercase text-text-primary tracking-wider border-b border-border pb-1">AI Improvement Checklist</h4>

                  {[
                    { label: 'Role-Targeted Keywords', desc: 'Inject high-value ATS terms (TypeScript, CI/CD, Docker).', applied: appliedKeywords, handler: handleInsertKeywords, bonus: '+20%' },
                    { label: 'Quantifiable Metrics', desc: 'Auto-rewrite bullets with impact numbers and revenue.', applied: appliedMetrics, handler: handleInjectMetrics, bonus: '+20%' },
                    { label: 'Executive Summary', desc: 'Rewrite summary to look highly technical and polished.', applied: appliedSummary, handler: handleEnhanceSummary, bonus: '+20%' },
                    { label: 'Profile Completeness', desc: 'Fill LinkedIn, GitHub, and contact details.', applied: appliedContact, handler: handleCompleteProfile, bonus: '+10%' },
                  ].map(item => (
                    <div key={item.label} className="flex flex-col gap-1 p-2 rounded-lg bg-surface border border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold flex items-center gap-1">
                          {item.applied ? '✅' : '❌'} {item.label}
                        </span>
                        <span className="text-[9px] font-mono text-green-500 font-bold">{item.bonus} ATS</span>
                      </div>
                      <p className="text-[9px] text-text-muted">{item.desc}</p>
                      {!item.applied && (
                        <button onClick={item.handler} className="w-full mt-0.5 py-1 text-[9px] font-bold bg-primary/15 hover:bg-primary/20 text-primary border border-primary/30 rounded transition-colors">
                          ✨ Apply
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* AI Role Analyzer */}
                <div className="p-3 rounded-xl border border-primary/30 bg-primary/5 relative overflow-hidden space-y-2.5">
                  {analyzingRole && (
                    <div className="absolute inset-0 bg-surface/85 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] text-primary font-bold uppercase tracking-wider">AI Scanning Role...</span>
                    </div>
                  )}
                  <h4 className="text-xs font-bold text-primary flex items-center gap-1">💡 Target Role Analyzer</h4>
                  <p className="text-[10px] text-text-muted">Enter your target job to get custom AI suggestions.</p>
                  <input
                    type="text"
                    value={targetRoleInput}
                    onChange={e => setTargetRoleInput(e.target.value)}
                    placeholder="e.g. Data Scientist, React Dev..."
                    className="w-full text-xs p-2 rounded-lg bg-surface border border-border text-text-primary focus:border-primary focus:outline-none"
                  />
                  <button
                    onClick={handleAnalyzeRole}
                    disabled={!targetRoleInput.trim() || analyzingRole}
                    className="w-full py-1.5 text-xs font-bold bg-primary hover:bg-primary/95 text-white rounded-lg disabled:opacity-50 transition-colors"
                  >
                    Analyze & Suggest
                  </button>
                  {recommendations && (
                    <div className="pt-2 border-t border-border/50 space-y-2">
                      <div className="bg-surface p-2 rounded border border-primary/20 space-y-1">
                        <span className="text-[9px] font-black uppercase text-primary tracking-wider">AI Suggestions:</span>
                        <ul className="list-disc pl-3 space-y-1">
                          {recommendations.map((rec, i) => (
                            <li key={i} className="text-[9px] text-text-muted leading-relaxed">{rec}</li>
                          ))}
                        </ul>
                      </div>
                      <button onClick={handleApplyRoleImprovements} className="w-full py-1.5 text-xs font-bold gradient-primary text-white rounded-lg shadow transition-transform active:scale-95 flex items-center justify-center gap-1">
                        🚀 Apply Changes
                      </button>
                    </div>
                  )}

                  <div className="border-t border-border/50 pt-2 space-y-2">
                    <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Generate Content</h4>
                    <input type="text" value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="Describe your achievement..." className="w-full text-[10px] p-2 rounded bg-surface border border-border text-text-primary focus:border-primary focus:outline-none" />
                    <button onClick={handleGenerateImpacts} disabled={!aiPrompt || isAiGenerating} className="w-full py-1 text-[10px] font-bold bg-primary/10 text-primary border border-primary/30 rounded hover:bg-primary/20 disabled:opacity-50 transition-colors">
                      ✨ Generate Impact Bullets
                    </button>
                    <input type="text" value={aiTargetRole} onChange={e => setAiTargetRole(e.target.value)} placeholder="Role for summary (e.g. PM)..." className="w-full text-[10px] p-2 rounded bg-surface border border-border text-text-primary focus:border-primary focus:outline-none" />
                    <button onClick={handleWriteSummary} disabled={!aiTargetRole || isAiGenerating} className="w-full py-1 text-[10px] font-bold bg-primary/10 text-primary border border-primary/30 rounded hover:bg-primary/20 disabled:opacity-50 transition-colors">
                      ✨ Write Summary
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CENTER: LIVE A4 CANVAS */}
        <div
          className="flex-1 bg-surface overflow-auto relative custom-scrollbar flex justify-center py-8"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.04) 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        >
          {/* Outer wrapper controls zoom but maintains scroll area */}
          <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center', width: '210mm', flexShrink: 0 }}>
            <div
              id="resume-canvas"
              ref={canvasRef}
              className="bg-white shadow-2xl"
              style={{
                width: '210mm',
                minHeight: '297mm',
                color: '#111827',
                fontFamily,
                padding: pad,
                boxSizing: 'border-box',
              }}
            >
              {sections.filter(s => s.visible).map(sec => (
                <div
                  key={sec.id}
                  className="group hover:outline hover:outline-2 hover:outline-primary/20 hover:outline-offset-2 cursor-text"
                  onClick={() => setActiveSectionId(sec.id)}
                >
                  {/* Personal Header */}
                  {sec.type === 'Personal' && (
                    <div className="text-center pb-3 mb-3" style={{ borderBottom: `2.5px solid ${themeColor}` }}>
                      <h1 className="text-3xl font-black tracking-tight leading-tight" style={{ color: themeColor }}>{sec.content.fullName}</h1>
                      <h2 className="text-sm font-semibold text-gray-500 mt-0.5 uppercase tracking-wider">{sec.content.role}</h2>
                      <div className="text-[10px] text-gray-500 mt-2 flex flex-wrap justify-center gap-x-3 gap-y-0.5">
                        {sec.content.email && <span>✉ {sec.content.email}</span>}
                        {sec.content.phone && <span>📱 {sec.content.phone}</span>}
                        {sec.content.address && <span>📍 {sec.content.address}</span>}
                        {sec.content.linkedin && <span>🔗 {sec.content.linkedin}</span>}
                        {sec.content.github && <span>💻 {sec.content.github}</span>}
                      </div>
                    </div>
                  )}

                  {/* Summary — no heading, just text */}
                  {sec.type === 'Summary' && (
                    <div className="mb-3">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.15em] mb-1 pb-0.5" style={{ color: themeColor, borderBottom: `1px solid ${themeColor}` }}>
                        Professional Summary
                      </h3>
                      <p className="text-[10.5px] leading-relaxed text-gray-700">{sec.content.text}</p>
                    </div>
                  )}

                  {/* Experience / Projects */}
                  {(sec.type === 'Experience' || sec.type === 'Projects') && (
                    <div className="mb-3">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.15em] mb-2 pb-0.5" style={{ color: themeColor, borderBottom: `1px solid ${themeColor}` }}>
                        {sec.title}
                      </h3>
                      <div className="space-y-2.5">
                        {sec.content.items?.map((item: any) => (
                          <div key={item.id}>
                            <div className="flex justify-between items-baseline">
                              <h4 className="text-[11px] font-bold text-gray-900">{item.title || item.degree}</h4>
                              <span className="text-[9px] font-bold flex-shrink-0 ml-2" style={{ color: themeColor }}>{item.date}</span>
                            </div>
                            <div className="text-[10px] font-semibold text-gray-500">{item.company || item.school}</div>
                            {item.desc && (
                              <div className="text-[9.5px] leading-relaxed text-gray-700 mt-1 whitespace-pre-line">{item.desc}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {sec.type === 'Education' && (
                    <div className="mb-3">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.15em] mb-2 pb-0.5" style={{ color: themeColor, borderBottom: `1px solid ${themeColor}` }}>
                        {sec.title}
                      </h3>
                      <div className="space-y-2">
                        {sec.content.items?.map((item: any) => (
                          <div key={item.id}>
                            <div className="flex justify-between items-baseline">
                              <h4 className="text-[11px] font-bold text-gray-900">{item.degree}</h4>
                              <span className="text-[9px] font-bold flex-shrink-0 ml-2" style={{ color: themeColor }}>{item.date}</span>
                            </div>
                            <div className="text-[10px] font-semibold text-gray-500">{item.school} {item.grade && <span className="text-gray-400">• {item.grade}</span>}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {sec.type === 'Skills' && (
                    <div className="mb-3">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.15em] mb-1.5 pb-0.5" style={{ color: themeColor, borderBottom: `1px solid ${themeColor}` }}>
                        {sec.title}
                      </h3>
                      <p className="text-[10px] leading-relaxed text-gray-700">{sec.content.text}</p>
                    </div>
                  )}

                  {/* Certifications / Languages / Custom — text block */}
                  {(sec.type === 'Certifications' || sec.type === 'Languages' || sec.type === 'Custom') && (
                    <div className="mb-3">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.15em] mb-1.5 pb-0.5" style={{ color: themeColor, borderBottom: `1px solid ${themeColor}` }}>
                        {sec.title}
                      </h3>
                      <p className="text-[10px] leading-relaxed text-gray-700 whitespace-pre-line">{sec.content.text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: Properties */}
        <div className="w-72 bg-surface-lighter border-l border-border flex flex-col flex-shrink-0 z-10 overflow-y-auto">
          {/* Global Styles */}
          <div className="p-4 border-b border-border">
            <h3 className="text-xs font-bold text-text-primary mb-3 flex items-center gap-2">🎨 Global Styling</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-text-muted block mb-1.5 font-bold uppercase tracking-wider">Theme Color</label>
                <div className="flex gap-1.5 flex-wrap">
                  {['#2A4365', '#047857', '#9f1239', '#1e3a8a', '#d97706', '#4338ca', '#000000', '#0f766e'].map(color => (
                    <button key={color} onClick={() => setThemeColor(color)} className={`w-6 h-6 rounded-full border-2 ${themeColor === color ? 'border-primary scale-110' : 'border-transparent'} transition-transform`} style={{ backgroundColor: color }} />
                  ))}
                  <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer bg-surface border border-border" />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-text-muted block mb-1.5 font-bold uppercase tracking-wider">Typography</label>
                <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} className="w-full p-2 text-xs rounded-lg bg-surface border border-border text-text-primary focus:border-primary">
                  <option value="Inter, sans-serif">Inter (Modern)</option>
                  <option value="Merriweather, serif">Merriweather (Classic)</option>
                  <option value="'Roboto Mono', monospace">Roboto Mono (Tech)</option>
                  <option value="Outfit, sans-serif">Outfit (Geometric)</option>
                  <option value="Georgia, serif">Georgia (Traditional)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-text-muted block mb-1.5 font-bold uppercase tracking-wider">Layout Density</label>
                <div className="flex bg-surface rounded-lg border border-border overflow-hidden">
                  {(['compact', 'normal', 'relaxed'] as const).map(sp => (
                    <button key={sp} onClick={() => setSpacing(sp)} className={`flex-1 py-1.5 text-[10px] font-bold capitalize ${spacing === sp ? 'bg-primary text-white' : 'text-text-muted hover:bg-surface-lighter'}`}>
                      {sp}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Active Section Editor */}
          <div className="p-4 flex-1">
            {activeSection ? (
              <div key={activeSection.id} className="space-y-3">
                <div className="flex items-center gap-2 mb-3 border-b border-border pb-2">
                  <span className="text-lg">✏️</span>
                  <h3 className="text-xs font-bold text-primary">Edit: {activeSection.title}</h3>
                </div>

                {activeSection.type === 'Personal' && (
                  <div className="space-y-2.5">
                    {['fullName', 'role', 'email', 'phone', 'address', 'linkedin', 'github', 'website'].map(field => (
                      <div key={field}>
                        <label className="text-[9px] uppercase font-bold text-text-muted block mb-1">{field}</label>
                        <input
                          value={activeSection.content[field] || ''}
                          onChange={e => updateSectionContent(activeSection.id, { [field]: e.target.value })}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-surface border border-border text-text-primary focus:border-primary focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {(activeSection.type === 'Summary' || activeSection.type === 'Skills' || activeSection.type === 'Certifications' || activeSection.type === 'Languages' || activeSection.type === 'Custom') && (
                  <div>
                    <label className="text-[9px] uppercase font-bold text-text-muted block mb-1">Content</label>
                    <textarea
                      rows={10}
                      value={activeSection.content.text}
                      onChange={e => updateSectionContent(activeSection.id, { text: e.target.value })}
                      className="w-full px-2.5 py-2 text-xs rounded-lg bg-surface border border-border text-text-primary focus:border-primary focus:outline-none resize-none leading-relaxed"
                    />
                  </div>
                )}

                {(activeSection.type === 'Experience' || activeSection.type === 'Education' || activeSection.type === 'Projects') && (
                  <div className="space-y-3">
                    {activeSection.content.items?.map((item: any) => (
                      <div key={item.id} className="p-3 rounded-xl border border-border bg-surface relative group space-y-2">
                        <button
                          onClick={() => removeArrayItem(activeSection.id, item.id)}
                          className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                        >✕</button>
                        <input
                          placeholder="Title / Degree"
                          value={item.title || item.degree || ''}
                          onChange={e => updateArrayItem(activeSection.id, item.id, activeSection.type === 'Education' ? 'degree' : 'title', e.target.value)}
                          className="w-full px-2 py-1.5 text-xs font-bold rounded bg-surface-lighter border border-border focus:border-primary focus:outline-none"
                        />
                        <input
                          placeholder="Company / School"
                          value={item.company || item.school || ''}
                          onChange={e => updateArrayItem(activeSection.id, item.id, activeSection.type === 'Education' ? 'school' : 'company', e.target.value)}
                          className="w-full px-2 py-1.5 text-xs rounded bg-surface-lighter border border-border focus:border-primary focus:outline-none"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            placeholder="Duration"
                            value={item.date || ''}
                            onChange={e => updateArrayItem(activeSection.id, item.id, 'date', e.target.value)}
                            className="w-full px-2 py-1.5 text-xs rounded bg-surface-lighter border border-border focus:border-primary focus:outline-none"
                          />
                          {activeSection.type === 'Education' && (
                            <input
                              placeholder="Grade/GPA"
                              value={item.grade || ''}
                              onChange={e => updateArrayItem(activeSection.id, item.id, 'grade', e.target.value)}
                              className="w-full px-2 py-1.5 text-xs rounded bg-surface-lighter border border-border focus:border-primary focus:outline-none"
                            />
                          )}
                        </div>
                        {(activeSection.type === 'Experience' || activeSection.type === 'Projects') && (
                          <textarea
                            placeholder="Description / Achievements (use • for bullets)"
                            rows={5}
                            value={item.desc || ''}
                            onChange={e => updateArrayItem(activeSection.id, item.id, 'desc', e.target.value)}
                            className="w-full px-2 py-1.5 text-xs rounded bg-surface-lighter border border-border focus:border-primary focus:outline-none resize-none"
                          />
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem(activeSection.id, activeSection.type === 'Education'
                        ? { degree: '', school: '', date: '', grade: '' }
                        : { title: '', company: '', date: '', desc: '' }
                      )}
                      className="w-full py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg border border-primary/20 hover:bg-primary/20 transition-colors"
                    >
                      + Add Item
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <span className="text-3xl mb-2">👈</span>
                <p className="text-xs text-text-muted">Select a section from the left or click on the canvas to edit.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
