import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scale, ArrowRight, ChevronRight, Shield,
  UploadCloud, Scan, FileCheck2, History, FileText,
  CheckCircle2, Package, MapPin, Hash, Eye
} from 'lucide-react';

/* ─── Design tokens ─── */
const C = {
  bg:     '#F7F6F3',
  surface:'#FFFFFF',
  border: '#E2E0DC',
  borderS:'#C8C5BF',
  text:   '#1C1C1A',
  muted:  '#5C5A56',
  accent: '#2C6E49',
  accentH:'#245C3D',
  navy:   '#1B2A3B',
};

const eyebrow = { fontSize:'10.5px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:C.accent, marginBottom:'12px' };
const h2style = { fontSize:'30px', fontWeight:700, letterSpacing:'-0.02em', color:C.navy, margin:0, lineHeight:1.2 };
const bodyText = { fontSize:'13.5px', color:C.muted, lineHeight:1.75, margin:0 };

const BtnPrimary = ({ children, onClick, large }) => (
  <button onClick={onClick} style={{
    display:'inline-flex', alignItems:'center', gap:'8px',
    backgroundColor:C.accent, color:'#fff', border:'none',
    fontSize: large ? '14px' : '12.5px', fontWeight:600,
    padding: large ? '12px 26px' : '9px 18px',
    borderRadius:'7px', cursor:'pointer', whiteSpace:'nowrap',
    transition:'background-color 0.12s ease',
  }}
    onMouseEnter={e=>{ e.currentTarget.style.backgroundColor=C.accentH; }}
    onMouseLeave={e=>{ e.currentTarget.style.backgroundColor=C.accent; }}>
    {children}
  </button>
);

const BtnSecondary = ({ children, onClick }) => (
  <button onClick={onClick} style={{
    display:'inline-flex', alignItems:'center', gap:'8px',
    backgroundColor:C.surface, color:C.text,
    border:`1.5px solid ${C.border}`, borderRadius:'7px',
    fontSize:'12.5px', fontWeight:600, padding:'9px 18px',
    cursor:'pointer', whiteSpace:'nowrap',
    transition:'border-color 0.12s ease',
  }}
    onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.borderS; }}
    onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; }}>
    {children}
  </button>
);

/* ─── Hero card mockup ─── */
const InspectionCardMockup = () => (
  <div style={{ position:'relative', userSelect:'none' }}>
    <div style={{
      position:'absolute', top:'-14px', right:'-14px', zIndex:2,
      backgroundColor:C.surface, border:`1px solid ${C.border}`,
      borderRadius:'10px', padding:'9px 13px',
      boxShadow:'0 4px 16px rgba(28,28,26,0.10)',
      display:'flex', alignItems:'center', gap:'8px',
    }}>
      <div style={{ width:'26px', height:'26px', borderRadius:'6px', backgroundColor:'#EBF5EE', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <UploadCloud style={{ width:'13px', height:'13px', color:C.accent }} />
      </div>
      <div>
        <div style={{ fontSize:'11px', fontWeight:700, color:C.text, lineHeight:1.1 }}>3 Panels</div>
        <div style={{ fontSize:'9.5px', color:C.muted }}>Uploaded</div>
      </div>
    </div>

    <div style={{ backgroundColor:C.navy, borderRadius:'14px', overflow:'hidden', boxShadow:'0 20px 56px rgba(27,42,59,0.3)' }}>
      <div style={{ padding:'13px 18px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
          <div style={{ width:'7px', height:'7px', borderRadius:'50%', backgroundColor:'#4ade80' }} />
          <span style={{ fontSize:'10.5px', fontWeight:600, color:'rgba(255,255,255,0.6)', letterSpacing:'0.06em', textTransform:'uppercase' }}>Inspection Active</span>
        </div>
        <span style={{ fontSize:'10px', fontFamily:'monospace', color:'rgba(255,255,255,0.35)' }}>REF-2026-4421</span>
      </div>

      <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', gap:'12px' }}>
        <div style={{ width:'44px', height:'44px', borderRadius:'8px', backgroundColor:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.09)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Package style={{ width:'20px', height:'20px', color:'rgba(255,255,255,0.45)' }} />
        </div>
        <div>
          <div style={{ fontSize:'13px', fontWeight:700, color:'#fff', marginBottom:'3px' }}>Spice Blend 500g</div>
          <div style={{ fontSize:'10.5px', color:'rgba(255,255,255,0.4)' }}>Food Products · Delhi Enforcement Office</div>
        </div>
      </div>

      <div style={{ padding:'12px 18px', display:'flex', flexDirection:'column', gap:'7px' }}>
        <div style={{ fontSize:'9px', fontWeight:700, letterSpacing:'0.09em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)', marginBottom:'3px' }}>
          Compliance Checks
        </div>
        {[
          { label:"Manufacturer's Name",      status:'Detected',        ok:true },
          { label:'Net Quantity Declaration', status:'Detected',        ok:true },
          { label:'MRP & Date of Manufacture',status:'Review Required', ok:false },
          { label:'Numeral Height (Rule 7)',   status:'Pending',         ok:null },
        ].map((c,i)=>(
          <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.6)' }}>{c.label}</span>
            <span style={{
              fontSize:'9px', fontWeight:600, padding:'2px 7px', borderRadius:'3px',
              textTransform:'uppercase', letterSpacing:'0.04em',
              backgroundColor: c.ok===true?'rgba(74,222,128,0.12)':c.ok===false?'rgba(252,165,165,0.11)':'rgba(255,255,255,0.06)',
              color: c.ok===true?'#4ade80':c.ok===false?'#fca5a5':'rgba(255,255,255,0.32)',
              border:`1px solid ${c.ok===true?'rgba(74,222,128,0.2)':c.ok===false?'rgba(252,165,165,0.18)':'rgba(255,255,255,0.08)'}`,
            }}>{c.status}</span>
          </div>
        ))}
      </div>

      <div style={{ padding:'11px 18px', backgroundColor:'rgba(255,255,255,0.03)', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:'10.5px', color:'rgba(255,255,255,0.35)' }}>2 of 4 checks complete</span>
        <div style={{ display:'flex', gap:'3px' }}>
          {[true,true,false,false].map((d,i)=>(
            <div key={i} style={{ width:'24px', height:'3px', borderRadius:'2px', backgroundColor: d?C.accent:'rgba(255,255,255,0.09)' }} />
          ))}
        </div>
      </div>
    </div>

    <div style={{
      position:'absolute', bottom:'-12px', left:'-12px', zIndex:2,
      backgroundColor:C.surface, border:`1px solid ${C.border}`,
      borderRadius:'9px', padding:'9px 13px',
      boxShadow:'0 4px 16px rgba(28,28,26,0.09)',
      display:'flex', alignItems:'center', gap:'8px',
    }}>
      <div style={{ width:'7px', height:'7px', borderRadius:'50%', backgroundColor:'#F59E0B', flexShrink:0 }} />
      <div>
        <div style={{ fontSize:'11px', fontWeight:600, color:C.text, lineHeight:1.1 }}>Inspector Review</div>
        <div style={{ fontSize:'9.5px', color:C.muted }}>Requires attention</div>
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════════════════════════════════
   LANDING PAGE
════════════════════════════════════════════════════════════════ */
const Landing = () => {
  const navigate = useNavigate();

  const features = [
    { num:'01', icon:Scan,       title:'Image-Assisted Inspection', desc:'Upload package panels and organize inspection evidence in one structured workflow.',                        iconBg:'#EBF5EE', iconBorder:'#A8D5B5', iconColor:'#2C6E49' },
    { num:'02', icon:Package,    title:'Declaration Checks',         desc:'Review key packaged-commodity declarations against applicable Legal Metrology requirements.',             iconBg:'#EEF2FF', iconBorder:'#C7D2FE', iconColor:'#4F46E5' },
    { num:'03', icon:FileCheck2, title:'Structured Findings',        desc:'Turn inspection observations into clear, reviewable findings organized for inspector determination.',     iconBg:'#FFFBEB', iconBorder:'#FCD34D', iconColor:'#B45309' },
    { num:'04', icon:FileText,   title:'Enforcement Workflow',       desc:'Move from inspection to review and reporting without losing context or inspection evidence.',             iconBg:'#F0FDFB', iconBorder:'#99F6E4', iconColor:'#0F766E' },
  ];

  const steps = [
    { num:'01', label:'Upload',  desc:'Photograph and upload packaged commodity panels — front, back, side, and label.' },
    { num:'02', label:'Analyze', desc:'Run the AI-assisted product assessment workflow across all uploaded panels.' },
    { num:'03', label:'Review',  desc:'Inspect the structured findings and supporting compliance evidence.' },
    { num:'04', label:'Report',  desc:'Record and use the inspection output in the enforcement reporting workflow.' },
  ];

  const hubModules = [
    { icon:Eye,        title:'Enforcement Hub',   desc:'Summary dashboard with key inspection metrics and activity.',     path:'/hub' },
    { icon:Scan,       title:'New Inspection',    desc:'Start an AI-assisted packaged commodity compliance inspection.',  path:'/new-inspection' },
    { icon:History,    title:'Inspection Log',    desc:'Browse and search the complete inspection activity record.',       path:'/history' },
    { icon:FileCheck2, title:'Statutory Reports', desc:'Access generated inspection reports for enforcement records.',    path:'/reports' },
  ];

  return (
    <div style={{ fontFamily:"'Inter',system-ui,-apple-system,sans-serif", color:C.text, overflowX:'hidden', backgroundColor:C.bg }}>

      {/* ══ NAVBAR ══════════════════════════════════════════════════ */}
      <header style={{
        position:'sticky', top:0, zIndex:100,
        backgroundColor:C.surface, borderBottom:`1px solid ${C.border}`,
        padding:'0 40px', height:'58px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'30px', height:'30px', borderRadius:'6px', backgroundColor:C.accent, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Scale style={{ width:'15px', height:'15px', color:'#fff' }} />
          </div>
          <div>
            <div style={{ fontSize:'13.5px', fontWeight:700, letterSpacing:'-0.01em', lineHeight:1.15 }}>PackGuard</div>
            <div style={{ fontSize:'8.5px', fontWeight:600, letterSpacing:'0.07em', textTransform:'uppercase', color:C.muted }}>Legal Metrology Division</div>
          </div>
        </div>

        <nav style={{ display:'flex', alignItems:'center', gap:'26px' }}>
          {[
            {label:'Overview',     href:'#overview'},
            {label:'How It Works', href:'#how-it-works'},
            {label:'Capabilities', href:'#capabilities'},
          ].map(n=>(
            <a key={n.label} href={n.href} style={{ fontSize:'12.5px', fontWeight:500, color:C.muted, textDecoration:'none', transition:'color 0.1s' }}
              onMouseEnter={e=>{e.target.style.color=C.text;}} onMouseLeave={e=>{e.target.style.color=C.muted;}}>
              {n.label}
            </a>
          ))}
        </nav>

        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <BtnSecondary onClick={()=>navigate('/hub')}>Enforcement Hub</BtnSecondary>
          <BtnPrimary onClick={()=>navigate('/new-inspection')}>Start an Inspection</BtnPrimary>
        </div>
      </header>

      {/* ══ HERO ════════════════════════════════════════════════════ */}
      <section id="overview" style={{ maxWidth:'1180px', margin:'0 auto', padding:'64px 40px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'64px', alignItems:'center' }} className="pg-hero-grid">
        <div>
          <div style={{ ...eyebrow, display:'flex', alignItems:'center', gap:'6px' }}>
            <div style={{ width:'6px', height:'6px', borderRadius:'50%', backgroundColor:C.accent }} />
            Legal Metrology · Enforcement Intelligence
          </div>

          <h1 style={{ fontSize:'48px', fontWeight:800, lineHeight:1.08, letterSpacing:'-0.035em', color:C.navy, margin:'0 0 20px' }}>
            Smarter Inspections.<br />
            <span style={{ color:C.accent }}>Stronger Compliance.</span>
          </h1>

          <p style={{ ...bodyText, fontSize:'15px', maxWidth:'440px', marginBottom:'36px' }}>
            PackGuard helps Legal Metrology teams inspect packaged products faster, identify declaration issues, and keep every finding organized for review.
          </p>

          <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
            <BtnPrimary onClick={()=>navigate('/new-inspection')} large>
              Start an Inspection <ArrowRight style={{ width:'15px', height:'15px' }} />
            </BtnPrimary>
            <BtnSecondary onClick={()=>navigate('/hub')}>
              Explore Enforcement Hub
            </BtnSecondary>
          </div>
        </div>

        <div style={{ padding:'20px 20px 20px 6px' }}>
          <InspectionCardMockup />
        </div>
      </section>

      {/* ══ TRUST STRIP ═════════════════════════════════════════════ */}
      <div style={{ backgroundColor:C.surface, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:'18px 40px' }}>
        <div style={{ maxWidth:'960px', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center', gap:'32px', flexWrap:'wrap' }}>
          <span style={{ fontSize:'10.5px', fontWeight:600, color:C.muted, textTransform:'uppercase', letterSpacing:'0.07em' }}>
            Built for Legal Metrology Enforcement
          </span>
          <div style={{ width:'1px', height:'18px', backgroundColor:C.border }} />
          {['Department of Consumer Affairs', 'Legal Metrology Division', 'Legal Metrology Rules 2011'].map((item,i)=>(
            <React.Fragment key={i}>
              <span style={{ fontSize:'12px', fontWeight:600, color:C.navy }}>{item}</span>
              {i<2 && <div style={{ width:'4px', height:'4px', borderRadius:'50%', backgroundColor:C.border }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ══ HOW IT WORKS ════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ backgroundColor:C.surface, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:'64px 40px' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'48px' }}>
            <div style={eyebrow}>Workflow</div>
            <h2 style={h2style}>How It Works</h2>
            <p style={{ ...bodyText, maxWidth:'480px', margin:'12px auto 0', fontSize:'13px' }}>
              A structured four-step workflow from product image capture to enforcement reporting.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'0', position:'relative' }}>
            {steps.map((step,i)=>(
              <div key={step.num} style={{ textAlign:'center', padding:'0 28px', position:'relative' }}>
                {i < steps.length-1 && <div style={{ position:'absolute', top:'27px', right:0, width:'50%', height:'1px', backgroundColor:C.border, zIndex:0 }} />}
                {i > 0              && <div style={{ position:'absolute', top:'27px', left:0,  width:'50%', height:'1px', backgroundColor:C.border, zIndex:0 }} />}
                <div style={{ width:'54px', height:'54px', borderRadius:'50%', backgroundColor:C.navy, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', position:'relative', zIndex:1 }}>
                  <span style={{ fontSize:'13px', fontWeight:800, color:'#FFFFFF', fontFamily:'monospace', letterSpacing:'0.02em' }}>{step.num}</span>
                </div>
                <h3 style={{ fontSize:'14px', fontWeight:700, color:C.navy, margin:'0 0 8px', letterSpacing:'-0.01em' }}>{step.label}</h3>
                <p style={{ fontSize:'12.5px', color:'#4A4845', lineHeight:1.65, margin:0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CAPABILITIES ════════════════════════════════════════════ */}
      <section id="capabilities" style={{ padding:'64px 40px', maxWidth:'1180px', margin:'0 auto' }}>
        <div style={{ marginBottom:'40px' }}>
          <div style={eyebrow}>Capabilities</div>
          <h2 style={{ ...h2style, marginBottom:'12px' }}>Tools built for practical inspection work</h2>
          <p style={{ ...bodyText, maxWidth:'520px', fontSize:'13px' }}>
            Everything an enforcement team needs to move from package evidence to a structured compliance review.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'18px' }}>
          {features.map(f=>{
            const Icon = f.icon;
            return (
              <div key={f.num} style={{ backgroundColor:C.surface, border:`1px solid ${C.border}`, borderRadius:'10px', padding:'24px', boxShadow:'0 1px 3px rgba(28,28,26,0.06)', transition:'box-shadow 0.15s ease' }}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 4px 18px rgba(28,28,26,0.10)';}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow='0 1px 3px rgba(28,28,26,0.06)';}}>
                <div style={{ fontSize:'10.5px', fontWeight:700, color:C.accent, letterSpacing:'0.05em', marginBottom:'14px' }}>{f.num}</div>
                <div style={{ width:'36px', height:'36px', borderRadius:'8px', backgroundColor:f.iconBg||'#EBF5EE', border:`1px solid ${f.iconBorder||'#A8D5B5'}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'14px' }}>
                  <Icon style={{ width:'17px', height:'17px', color:f.iconColor||C.accent }} />
                </div>
                <h3 style={{ fontSize:'14px', fontWeight:700, color:C.navy, margin:'0 0 8px', letterSpacing:'-0.01em' }}>{f.title}</h3>
                <p style={{ fontSize:'12.5px', color:C.muted, lineHeight:1.65, margin:0 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ EDITORIAL / PRODUCT SECTION ═════════════════════════════ */}
      <section style={{ padding:'72px 40px', maxWidth:'1180px', margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'56px', alignItems:'center' }} className="pg-editorial-grid">
          <div style={{ backgroundColor:C.navy, borderRadius:'12px', padding:'24px', boxShadow:'0 12px 40px rgba(27,42,59,0.2)' }}>
            <div style={{ fontSize:'9px', fontWeight:700, letterSpacing:'0.09em', textTransform:'uppercase', color:'rgba(255,255,255,0.35)', marginBottom:'16px' }}>
              New Product Inspection
            </div>
            {[
              { label:'Product Category',    value:'Food Products',            Icon:Package },
              { label:'Inspection Reference',value:'REF-2026-8801',            Icon:Hash },
              { label:'Inspection Location', value:'Delhi Enforcement Office', Icon:MapPin },
            ].map((item,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 12px', marginBottom:'8px', backgroundColor:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'7px' }}>
                <item.Icon style={{ width:'13px', height:'13px', color:'rgba(255,255,255,0.3)', flexShrink:0 }} />
                <div>
                  <div style={{ fontSize:'9.5px', color:'rgba(255,255,255,0.33)', marginBottom:'2px' }}>{item.label}</div>
                  <div style={{ fontSize:'12px', fontWeight:600, color:'rgba(255,255,255,0.85)' }}>{item.value}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop:'12px', padding:'12px', backgroundColor:'rgba(44,110,73,0.15)', border:'1px solid rgba(44,110,73,0.25)', borderRadius:'7px' }}>
              <div style={{ fontSize:'9.5px', fontWeight:700, color:'#4ade80', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'5px' }}>Assessment Summary</div>
              <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.55)', lineHeight:1.55 }}>Structured findings prepared for inspector review and determination.</div>
            </div>
          </div>

          <div>
            <div style={eyebrow}>Inspection Workflow</div>
            <h2 style={{ ...h2style, fontSize:'28px', marginBottom:'18px' }}>
              Turn visual evidence into a structured inspection record.
            </h2>
            <p style={{ ...bodyText, marginBottom:'28px' }}>
              PackGuard captures product images, extracts mandatory declaration information, and organizes findings into a structured inspection workflow — supporting inspector-led compliance review under Legal Metrology Rules 2011.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:'11px' }}>
              {[
                'Structured capture of product category, reference, and location',
                'AI-assisted extraction of mandatory package declarations',
                'Inspector-reviewed compliance assessment and evidence',
                'Organized reporting for enforcement logs and records',
              ].map((p,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'10px' }}>
                  <div style={{ width:'18px', height:'18px', borderRadius:'4px', backgroundColor:'#EBF5EE', border:'1px solid #A8D5B5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'2px' }}>
                    <CheckCircle2 style={{ width:'10px', height:'10px', color:C.accent }} />
                  </div>
                  <span style={{ fontSize:'13px', color:C.muted, lineHeight:1.65 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ ENFORCEMENT HUB ═════════════════════════════════════════ */}
      <section style={{ backgroundColor:C.surface, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:'72px 40px' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'40px', flexWrap:'wrap', gap:'16px' }}>
            <div>
              <div style={eyebrow}>Enforcement Platform</div>
              <h2 style={h2style}>One workspace for enforcement teams.</h2>
            </div>
            <button onClick={()=>navigate('/hub')} style={{ display:'inline-flex', alignItems:'center', gap:'8px', backgroundColor:C.navy, color:'#fff', fontSize:'12.5px', fontWeight:600, padding:'10px 20px', borderRadius:'7px', border:'none', cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, transition:'background-color 0.12s ease' }}
              onMouseEnter={e=>{e.currentTarget.style.backgroundColor='#243444';}} onMouseLeave={e=>{e.currentTarget.style.backgroundColor=C.navy;}}>
              Open Enforcement Hub <ChevronRight style={{ width:'14px', height:'14px' }} />
            </button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'16px' }}>
            {hubModules.map(mod=>{
              const Icon = mod.icon;
              return (
                <div key={mod.title} onClick={()=>navigate(mod.path)}
                  style={{ backgroundColor:C.bg, border:`1px solid ${C.border}`, borderRadius:'10px', padding:'22px', cursor:'pointer', transition:'border-color 0.12s ease,box-shadow 0.12s ease' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.borderS; e.currentTarget.style.boxShadow='0 4px 16px rgba(28,28,26,0.08)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow='none'; }}>
                  <div style={{ width:'36px', height:'36px', borderRadius:'8px', backgroundColor:'#EBF5EE', border:'1px solid #A8D5B5', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'14px' }}>
                    <Icon style={{ width:'17px', height:'17px', color:C.accent }} />
                  </div>
                  <h3 style={{ fontSize:'13.5px', fontWeight:700, color:C.navy, margin:'0 0 6px', letterSpacing:'-0.01em' }}>{mod.title}</h3>
                  <p style={{ fontSize:'12px', color:C.muted, margin:0, lineHeight:1.6 }}>{mod.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ RESPONSIBLE AI ══════════════════════════════════════════ */}
      <section style={{ backgroundColor:C.navy, padding:'72px 40px' }}>
        <div style={{ maxWidth:'720px', margin:'0 auto', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', fontSize:'10.5px', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#4ade80', marginBottom:'20px' }}>
            <Shield style={{ width:'12px', height:'12px' }} />
            Responsible Use
          </div>
          <h2 style={{ fontSize:'32px', fontWeight:700, letterSpacing:'-0.025em', color:'#fff', margin:'0 0 18px', lineHeight:1.2 }}>
            AI-assisted. Inspector-led.
          </h2>
          <p style={{ fontSize:'15px', color:'rgba(255,255,255,0.65)', lineHeight:1.78, margin:0 }}>
            PackGuard is designed to support inspector review. AI-assisted assessments do not replace professional judgment or constitute a final legal determination. Every inspection output is structured for review by qualified Legal Metrology inspectors.
          </p>
        </div>
      </section>

      {/* ══ FINAL CTA ═══════════════════════════════════════════════ */}
      <section style={{ padding:'72px 40px', backgroundColor:C.bg }}>
        <div style={{ maxWidth:'560px', margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontSize:'28px', fontWeight:700, letterSpacing:'-0.02em', color:C.navy, margin:'0 0 12px' }}>
            Ready to begin an inspection?
          </h2>
          <p style={{ fontSize:'14px', color:C.muted, margin:'0 0 28px', lineHeight:1.65 }}>
            Start a structured product inspection with PackGuard.
          </p>
          <BtnPrimary onClick={()=>navigate('/new-inspection')} large>
            Start an Inspection <ArrowRight style={{ width:'15px', height:'15px' }} />
          </BtnPrimary>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════ */}
      <footer style={{ backgroundColor:'#161514', borderTop:'1px solid rgba(255,255,255,0.10)', padding:'44px 40px 28px' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr', gap:'32px', marginBottom:'32px' }} className="pg-footer-grid">

            {/* Brand */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
                <div style={{ width:'26px', height:'26px', borderRadius:'5px', backgroundColor:C.accent, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Scale style={{ width:'12px', height:'12px', color:'#fff' }} />
                </div>
                <div>
                  <div style={{ fontSize:'13px', fontWeight:700, color:'#FFFFFF', lineHeight:1.2 }}>PackGuard</div>
                  <div style={{ fontSize:'8.5px', fontWeight:600, letterSpacing:'0.07em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)' }}>Legal Metrology Division</div>
                </div>
              </div>
              <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.62)', lineHeight:1.72, maxWidth:'240px', margin:0 }}>
                Department of Consumer Affairs.<br />
                AI-assisted assessments support inspector review and do not constitute a final legal determination.
              </p>
            </div>

            {/* Application links */}
            <div>
              <div style={{ fontSize:'9.5px', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.65)', marginBottom:'14px' }}>Application</div>
              {[
                { label:'Overview',          path:'/' },
                { label:'How It Works',      path:'/#how-it-works' },
                { label:'Capabilities',      path:'/#capabilities' },
                { label:'Enforcement Hub',   path:'/hub' },
                { label:'New Inspection',    path:'/new-inspection' },
                { label:'Inspection Log',    path:'/history' },
                { label:'Statutory Reports', path:'/reports' },
              ].map(l=>(
                <div key={l.label} onClick={()=>navigate(l.path)}
                  style={{ fontSize:'12px', color:'rgba(255,255,255,0.65)', cursor:'pointer', marginBottom:'9px', transition:'color 0.1s' }}
                  onMouseEnter={e=>{e.currentTarget.style.color='#FFFFFF';}}
                  onMouseLeave={e=>{e.currentTarget.style.color='rgba(255,255,255,0.65)';}}>
                  {l.label}
                </div>
              ))}
            </div>

            {/* Authority */}
            <div>
              <div style={{ fontSize:'9.5px', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'rgba(255,255,255,0.65)', marginBottom:'14px' }}>Authority</div>
              <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.65)', lineHeight:2.0 }}>
                Department of Consumer Affairs<br />
                Legal Metrology Division<br />
                Legal Metrology Rules 2011<br />
                Government of India
              </div>
            </div>
          </div>

          <div style={{ borderTop:'1px solid rgba(255,255,255,0.10)', paddingTop:'18px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'10px' }}>
            <span style={{ fontSize:'11.5px', color:'rgba(255,255,255,0.50)' }}>PackGuard · Legal Metrology Enforcement Platform</span>
            <span style={{ fontSize:'11.5px', color:'rgba(255,255,255,0.50)' }}>AI-assisted assessment only. Final determinations by qualified inspectors.</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
