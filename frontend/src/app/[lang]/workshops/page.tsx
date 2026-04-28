'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  Calendar,
  Presentation,
  FileIcon,
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';

interface WorkshopDoc {
  id: number;
  title: string;
  filename: string;
  type: string;
  category: string;
  date: string;
  thumbnail?: string;
}

const workshopDocs: WorkshopDoc[] = [
  {
    id: 9,
    title: "TREPP 2026 PRESENTATION - Dr Ali Alkassoum (SE-AFERA)",
    filename: "TREPP-2026-PRESENTATION-Dr-Ali-Alkassoum.pptx",
    type: "PPTX",
    category: "Case Study",
    date: "April 2026"
  },
  {
    id: 1,
    title: "ARMFA 22nd AGM Liberia - Namibia Case Study",
    filename: "ARMFA-22nd-AGM-Liberia-17-21-Nov-2025-Sophia-Tekie-Namibia.pptx",
    type: "PPTX",
    category: "Annual General Meeting",
    date: "Nov 2025"
  },
  {
    id: 2,
    title: "Cost Estimation for Roadworks in Kenya",
    filename: "ARMFA-PPT-COST-ESTIMATION-FOR-ROADWORKS-IN-KENYA-19TH-NOV.pptx",
    type: "PPTX",
    category: "Technical Workshop",
    date: "Nov 2025"
  },
  {
    id: 3,
    title: "ASAFG Presentation V2",
    filename: "ASAFG-Presentation-V2.pptx",
    type: "PPTX",
    category: "Strategic Planning",
    date: "Sept 2025"
  },
  {
    id: 4,
    title: "AFERA Innov Centre Academy Vision",
    filename: "Centre-Academy-AFERA-Innov.pptx",
    type: "PPTX",
    category: "Institutional",
    date: "Sept 2025"
  },
  {
    id: 5,
    title: "Gouvernance des FER - Maurice Niaty Mouamba",
    filename: "La-Gouvernance-des-FER-Maurice-Niaty-Mouamba.pptx",
    type: "PPTX",
    category: "Governance",
    date: "Oct 2025"
  },
  {
    id: 6,
    title: "Modèle de Financement Péage FER SA Guinée",
    filename: "MODELE-DE-FINANCEMENT-PEAGE-FER-SA-GUINEE.pptx",
    type: "PPTX",
    category: "Finance",
    date: "Nov 2025"
  },
  {
    id: 7,
    title: "AFERA Vision, Engagement et Projets",
    filename: "PRESENTATION-1-PRESIDENT-Nouvelle-Dynamique-AFERA-_-Vision-Engagement-et-Projets-2.pptx",
    type: "PPTX",
    category: "Leadership",
    date: "Nov 2025"
  },
  {
    id: 8,
    title: "Road Fund Performance & Capacity Building",
    filename: "PRESENTATION-3-PROF-ANGELO-PRES-SCIENTIFIC-COMMITTEE-ARMFA-Mission_-PrAngelo-Road-Fund-Performance-and-Capacity-Building.pptx",
    type: "PPTX",
    category: "Academic",
    date: "Nov 2025"
  }
];

import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { useNotification } from '@/lib/NotificationContext';

export default function WorkshopsPage() {
  const { lang } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  React.useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      const res = await api.get('/workshops');
      // Map API fields to UI fields if necessary, or just use them
      const apiDocs = res.data.map((w: any) => ({
        id: w.id,
        title: w.title_en,
        filename: w.file_url,
        type: w.type || 'PPTX',
        category: w.category,
        date: new Date(w.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        thumbnail: w.image_url
      }));
      
      // Combine with static ones for now or just replace
      setWorkshops([...apiDocs, ...workshopDocs]);
    } catch (err) {
      setWorkshops(workshopDocs);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = workshops.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openViewer = (doc: any) => {
    setSelectedDoc(doc);
  };

  const closeViewer = () => {
    setSelectedDoc(null);
  };

  const getViewerUrl = (filename: string) => {
    if (typeof window === 'undefined') return '';
    const fileUrl = `${window.location.origin}/${filename}`;
    // Microsoft Office Online Viewer for PPTX
    return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`;
  };

  return (
    <main className="pt-24 min-h-screen bg-gray-50/50 pb-20">
      
      {/* Header */}
      <section className="bg-primary pt-20 pb-40 text-white relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-accent/20 text-accent border border-accent/30 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest mb-6"
          >
            Academic Resources
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-8 leading-tight"
          >
            Thematic Workshops & <br /> Resource Library
          </motion.h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Access our comprehensive collection of technical presentations, strategic research, and workshop outcomes.
          </p>
          
          <div className="max-w-2xl mx-auto mt-12 relative">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
             <input 
               type="text" 
               placeholder="Search documents, topics or presenters..."
               className="w-full bg-white text-primary rounded-2xl py-5 pl-14 pr-6 shadow-2xl focus:ring-4 focus:ring-accent/20 outline-none transition-all"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-[-20deg] translate-x-1/4"></div>
      </section>

      {/* Grid Section */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDocs.map((doc, i) => (
              <motion.div 
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[32px] p-0 shadow-sm hover:shadow-xl transition-all border border-gray-100 group flex flex-col overflow-hidden"
              >
                 {/* Thumbnail / Icon Header */}
                 <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {doc.thumbnail ? (
                       <img 
                         src={doc.thumbnail} 
                         alt={doc.title} 
                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                       />
                    ) : (
                       <div className="w-full h-full bg-gray-50 flex items-center justify-center p-12">
                          <img 
                            src={doc.type === 'PPTX' ? '/pptx-icon.png' : '/pdf-icon.png'} 
                            alt={doc.type} 
                            className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" 
                          />
                       </div>
                    )}
                    <div className="absolute top-4 left-4">
                       <div className="w-10 h-10 bg-white/90 backdrop-blur shadow-sm rounded-xl flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-all">
                          {doc.type === 'PPTX' ? <Presentation size={18} /> : <FileText size={18} />}
                       </div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-primary/80 backdrop-blur text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                       {doc.date}
                    </div>
                 </div>
                 
                 <div className="p-8 flex-1 flex flex-col">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2 block">{doc.category}</span>
                    <h3 className="text-lg font-bold text-primary mb-4 leading-snug group-hover:text-accent transition-colors line-clamp-2">
                      {doc.title}
                    </h3>
                    <div className="mt-auto">
                       <p className="text-xs text-gray-400 font-medium mb-6">
                          Format: <span className="text-gray-600">{doc.type} Presentation</span>
                       </p>

                       <div className="flex items-center space-x-3 pt-6 border-t border-gray-50">
                          <Button 
                            variant="primary" 
                            className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center"
                            onClick={() => openViewer(doc)}
                          >
                             <Eye size={14} className="mr-2" /> View Online
                          </Button>
                          <a href={`/${doc.filename}`} download className="p-3 bg-gray-50 hover:bg-primary hover:text-white rounded-xl transition-all text-gray-400">
                             <Download size={18} />
                          </a>
                       </div>
                    </div>
                 </div>
              </motion.div>
            ))}
         </div>
          {/* Grid Section End */}
          
          {/* Training Sessions Gallery */}
          <section className="mt-32">
             <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-accent font-bold uppercase tracking-widest text-[10px] bg-accent/10 px-3 py-1 rounded-full">Gallery</span>
                <h2 className="text-3xl md:text-4xl font-bold text-primary dark:text-white mt-4">Training Sessions Held During Workshops</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Highlights of practical training, collaboration, and certificate ceremonies across various modules.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { src: '/workshops/media__1777354078456.jpg', title: 'Interactive Lecture on Strategic Funding' },
                  { src: '/workshops/media__1777354078606.jpg', title: 'Policy Harmonization Roundtable' },
                  { src: '/workshops/media__1777354078663.jpg', title: 'Awarding Academic Diplomas' },
                  { src: '/workshops/media__1777354078760.jpg', title: 'Participant Attestation Ceremony' },
                  { src: '/workshops/media__1777354078788.jpg', title: 'Graduation Certification Handover' },
                ].map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative rounded-[32px] overflow-hidden group shadow-premium hover:shadow-2xl transition-all"
                  >
                    <img 
                      src={img.src} 
                      alt={img.title} 
                      className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent flex items-end p-8">
                      <p className="text-white font-bold text-lg leading-tight">{img.title}</p>
                    </div>
                  </motion.div>
                ))}
             </div>
          </section>
      </section>

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-primary/60 backdrop-blur-md"
               onClick={closeViewer}
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 30 }}
               className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
             >
                {/* Modal Header */}
                <div className="p-6 md:px-10 border-b border-gray-100 flex items-center justify-between">
                   <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                         <Presentation size={20} />
                      </div>
                      <div>
                         <h4 className="font-bold text-primary leading-none mb-1">{selectedDoc.title}</h4>
                         <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Document Viewer • {selectedDoc.type}</p>
                      </div>
                   </div>
                   <div className="flex items-center space-x-3">
                      <a 
                        href={`/${selectedDoc.filename}`} 
                        download 
                        className="p-3 bg-gray-50 hover:bg-primary hover:text-white rounded-xl transition-all text-gray-500 hidden sm:flex items-center text-xs font-bold"
                      >
                         <Download size={16} className="mr-2" /> Download Original
                      </a>
                      <button 
                        onClick={closeViewer}
                        className="p-3 bg-gray-50 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all text-gray-500"
                      >
                         <X size={20} />
                      </button>
                   </div>
                </div>

                {/* Viewer Frame */}
                <div className="flex-1 bg-gray-100 relative">
                   <iframe 
                     src={getViewerUrl(selectedDoc.filename)} 
                     className="w-full h-full border-none"
                     title="Document Viewer"
                   />
                   {/* Loader Placeholder */}
                   <div className="absolute inset-0 z-[-1] flex items-center justify-center flex-col text-center p-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Initializing Secure Document Viewer...</p>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}
