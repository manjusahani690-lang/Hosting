'use client';

import React, { useState } from 'react';
import { Newspaper, Calendar, Clock, ArrowRight, User, Tag, ChevronRight } from 'lucide-react';

interface BlogViewProps {
  setActivePage: (page: string) => void;
}

const blogs = [
  {
    title: 'How NVMe Solid Hard SSD Arrays Impact Database Query Performance',
    desc: 'Unpack the technical advantages of solid state storage pipelines compared with traditional layouts, including dynamic testing indexes.',
    author: 'Chief Architect, Liam Thorne',
    date: 'May 28, 2026',
    readTime: '6 min read',
    tag: 'Web Speed'
  },
  {
    title: 'DNS Propagation Decoded: Reducing Root Mapping Intervals',
    desc: 'Why some web systems take 48 hours to resolve names while others update in minutes. Learn configuring dynamic DNS records.',
    author: 'Support Lead, Marcus Vance',
    date: 'May 14, 2026',
    readTime: '4 min read',
    tag: 'Infrastructure'
  },
  {
    title: 'Prompt Modeling: Getting Better Layouts out of Gemini API',
    desc: 'A comprehensive engineering guide on configuring structured schema parameters to get clean responsive Tailwind codes instantly.',
    author: 'AI Evangelist, Sarah Jenkins',
    date: 'April 30, 2026',
    readTime: '9 min read',
    tag: 'AI Tools'
  },
  {
    title: 'Survival Strategies during extreme Flash Deal Black Friday Trafic Peaks',
    desc: 'A step-by-step checklist to configure database read/write allocations and LiteSpeed caching indices to handle heavy payload surge loads.',
    author: 'Platform Engineer, Alex Rivera',
    date: 'April 12, 2026',
    readTime: '11 min read',
    tag: 'Databases'
  }
];

export default function BlogView({ setActivePage }: BlogViewProps) {
  const [activeArticle, setActiveArticle] = useState<number | null>(null);

  return (
    <div className="font-sans text-slate-800 bg-slate-50 py-12 md:py-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-3xl md:text-5xl font-display font-black text-slate-900 tracking-tight">
            Our Technical Infrastructure Blog
          </h1>
          <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Written by our platform engineers. Get deep technical insights about cloud server setups, database safety, and prompt engineering parameters.
          </p>
        </div>

        {/* Blog layout */}
        {activeArticle === null ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((b, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-brand-purple bg-brand-purple/10 px-2.5 py-1 rounded">
                      {b.tag}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {b.readTime}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-slate-950 text-lg md:text-xl leading-normal hover:text-brand-purple transition-colors cursor-pointer" onClick={() => setActiveArticle(idx)}>
                    {b.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed min-h-[48px]">
                    {b.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-slate-150 rounded-full flex items-center justify-center text-slate-600 border border-slate-200">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[10.5px] font-bold text-slate-800">{b.author}</p>
                      <p className="text-[9px] text-slate-400 font-semibold">{b.date}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveArticle(idx)}
                    className="text-brand-purple hover:text-brand-purple/80 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Render full reading article */
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-lg max-w-3xl mx-auto space-y-8 text-left">
            
            <button 
              onClick={() => setActiveArticle(null)}
              className="text-slate-500 hover:text-brand-purple text-xs font-bold flex items-center gap-1 cursor-pointer mb-4"
            >
              <span>← Return to Blogs</span>
            </button>

            <div className="space-y-4">
              <span className="text-[10px] text-brand-purple uppercase bg-brand-purple/10 px-3 py-1 rounded font-mono font-bold">
                {blogs[activeArticle].tag}
              </span>
              <h1 className="text-2xl md:text-4xl font-display font-black text-slate-950 tracking-tight leading-tight">
                {blogs[activeArticle].title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-405 pb-6 border-b border-slate-100 pt-2">
                <span className="font-bold text-slate-800 flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-400" /> {blogs[activeArticle].author}</span>
                <span className="flex items-center gap-0.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {blogs[activeArticle].date}</span>
                <span className="flex items-center gap-0.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {blogs[activeArticle].readTime}</span>
              </div>
            </div>

            <div className="text-slate-655 text-sm sm:text-base leading-relaxed space-y-6">
              <p className="font-semibold text-slate-800">
                Performance remains the supreme competitive advantage in high-density SaaS scaling. As client portfolios grow, unoptimized database queries can bottleneck server throughput.
              </p>
              <p>
                In our lab audits, moving standard hosting caches directly into server RAM pipelines solved heavy concurrency queries. By using localized LiteSpeed mapping rules, we observed an immediate 400% acceleration on checkout workloads.
              </p>
              <p className="bg-slate-50 border-l-4 border-brand-purple p-4.5 rounded text-xs sm:text-sm font-mono italic">
                “Limit resource sharing, implement automated weekly database indexing, and map routing assets globally at the DNS boundary to guarantee continuous uptime.”
              </p>
              <p>
                Additionally, secure SSH authorization safeguards can block malicious intrusion routines, keeping enterprise catalogs intact. When writing PHP setups, ensure PHP memory metrics are configured to 512MB by default.
              </p>
            </div>

            <div className="pt-8 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold uppercase">CloudVibe Editorial Board</span>
              <button onClick={() => setActiveArticle(null)} className="font-bold text-brand-purple hover:underline">Returnto Blogs Index</button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
