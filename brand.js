// TGether brand book — interactions
(function(){
  document.documentElement.classList.add('js');

  // Znaki marki renderują się natywnie przez <use> + currentColor (zawsze
  // w kolorze z CSS). Nie przerysowujemy ich w JS — wcześniejszy kod czytał
  // kolor przez getComputedStyle w trakcie ładowania i przy wyścigu z CSS
  // potrafił "wypalić" czarny obrys (niewidoczny na ciemnym tle).

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
