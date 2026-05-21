'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t } from '@/lib/i18n';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

  // ATS Scoring Logic
  const getATSScore = () => {
    let score = 0;
    const summary = sections.find(s => s.type === 'Summary')?.content.text || '';
    if (summary.split(' ').length > 15) score += 20;
    const exp = sections.find(s => s.type === 'Experience')?.content.items || [];
    if (exp.length > 0) score += 30;
    const skills = sections.find(s => s.type === 'Skills')?.content.text || '';
    if (skills.length > 10) score += 30;
    const edu = sections.find(s => s.type === 'Education')?.content.items || [];
    if (edu.length > 0) score += 20;
    return score;
  };

  const atsScore = getATSScore();

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

  const generatePDF = async () => {
    const element = document.getElementById('resume-canvas');
    if (!element) return;
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
          <button onClick={generatePDF} disabled={isProcessing} className="px-5 py-1.5 text-xs font-bold gradient-primary text-white rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50">
            {isProcessing ? 'Rendering...' : '📄 Export PDF'}
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

            {activeSidebarTab === 'ai' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
                  <h4 className="text-sm font-bold text-primary mb-1">✨ AI Bullet Point Generator</h4>
                  <p className="text-xs text-text-muted mb-3">Turn simple duties into powerful achievements.</p>
                  <textarea placeholder="e.g., Developed a web app using React..." className="w-full h-20 text-xs p-2 rounded-lg bg-surface border border-border mb-2 resize-none focus:border-primary focus:outline-none" />
                  <button className="w-full py-2 text-xs font-bold bg-primary text-white rounded-lg">Generate Impacts</button>
                </div>
                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
                  <h4 className="text-sm font-bold text-primary mb-1">✍️ AI Summary Writer</h4>
                  <p className="text-xs text-text-muted mb-3">Generate a professional summary based on your role.</p>
                  <input type="text" placeholder="Target Role (e.g., Data Scientist)" className="w-full text-xs p-2 rounded-lg bg-surface border border-border mb-2 focus:border-primary focus:outline-none" />
                  <button className="w-full py-2 text-xs font-bold bg-primary text-white rounded-lg">Write Summary</button>
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
