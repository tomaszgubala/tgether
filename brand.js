// TGether brand book — interactions
(function(){
  document.documentElement.classList.add('js');

  // Resolve mark symbols to explicit-stroke inline paths so they survive
  // html-to-image capture / PPTX export (currentColor through <use> is not).
  const BROKEN = 'M60 30 C56 20.2,44 12,32 12 C19 12,10 20.2,10 30 C10 39.8,19 48,32 48 C41 48,49 43.1,52 36.6 L40 36.6 M60 30 C64 39.8,76 48,88 48 C101 48,110 39.8,110 30 C110 20.2,101 12,88 12 C80 12,72 16.1,67 22.6';
  const MK = { syg: BROKEN, sygG: BROKEN };
  const NS='http://www.w3.org/2000/svg';
  document.querySelectorAll('svg use').forEach(u=>{
    const id=(u.getAttribute('href')||u.getAttribute('xlink:href')||'').replace('#','');
    const d=MK[id]; if(!d) return;
    const svg=u.ownerSVGElement;
    const col=getComputedStyle(svg).color || '#A96540';
    const p=document.createElementNS(NS,'path');
    p.setAttribute('d',d); p.setAttribute('fill','none');
    p.setAttribute('stroke',col);
    p.setAttribute('stroke-width','9');
    p.setAttribute('stroke-linecap','round'); p.setAttribute('stroke-linejoin','round');
    svg.replaceChild(p,u);
  });

  // Reveal on scroll
  const reveals = [...document.querySelectorAll('.reveal')];
  const show = el => el.classList.add('in');
  const io = new IntersectionObserver((es)=>{
    es.forEach(e=>{ if(e.isIntersecting){ show(e.target); io.unobserve(e.target); } });
  },{threshold:.12, rootMargin:'0px 0px -8% 0px'});
  reveals.forEach(el=>io.observe(el));
  // Safety net: never leave content hidden if IO is throttled/unsupported
  setTimeout(()=>reveals.forEach(show), 2200);

  // Nav theme: dark while over a .on-dark section
  const nav = document.querySelector('.nav');
  if(nav){
    const darks = [...document.querySelectorAll('.on-dark')];
    function tick(){
      const y = window.scrollY + 36;
      let over = false;
      for(const s of darks){
        const top = s.offsetTop, bot = top + s.offsetHeight;
        if(y>=top && y<bot){ over = true; break; }
      }
      nav.classList.toggle('dark', over);
    }
    window.addEventListener('scroll', tick, {passive:true});
    window.addEventListener('resize', tick);
    tick();
  }

  // Direction tabs
  document.querySelectorAll('[data-tabs]').forEach(group=>{
    const tabs = group.querySelectorAll('.dir-tab');
    const panels = group.querySelectorAll('.dir-panel');
    tabs.forEach(t=>t.addEventListener('click', ()=>{
      tabs.forEach(x=>x.classList.remove('active'));
      panels.forEach(x=>x.classList.remove('active'));
      t.classList.add('active');
      group.querySelector('#'+t.dataset.target).classList.add('active');
    }));
  });
})();
