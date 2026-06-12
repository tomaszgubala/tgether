/* TGether — interakcje produkcyjne (menu mobilne, cookies, formularz) */
(function(){
  /* ---------- Menu mobilne ---------- */
  var burger = document.querySelector('.nav-burger');
  var body = document.body;
  function closeMenu(){ body.classList.remove('menu-open'); if(burger) burger.setAttribute('aria-expanded','false'); }
  if(burger){
    burger.addEventListener('click', function(){
      var open = body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.mobile-menu a').forEach(function(a){ a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Oznaczenie aktywnej pozycji nawigacji ---------- */
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(function(a){
    if(a.getAttribute('data-nav') === path){ a.classList.add('active'); }
  });

  /* ---------- Cookie banner (consent) ---------- */
  var KEY = 'tg_cookie_consent';
  var banner = document.querySelector('.cookie');
  if(banner){
    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch(e){}
    if(!stored){ setTimeout(function(){ banner.classList.add('show'); }, 700); }
    banner.querySelectorAll('[data-consent]').forEach(function(btn){
      btn.addEventListener('click', function(){
        try { localStorage.setItem(KEY, btn.getAttribute('data-consent')); } catch(e){}
        banner.classList.remove('show');
      });
    });
  }

  /* ---------- Formularz kontaktowy ---------- */
  var form = document.querySelector('form[data-contact]');
  if(form){
    var status = form.querySelector('.form-status');
    function setStatus(type, msg){
      if(!status) return;
      status.className = 'form-status show ' + type;
      status.textContent = msg;
    }
    form.addEventListener('submit', function(e){
      e.preventDefault();
      // honeypot
      var hp = form.querySelector('input[name="_gotcha"]');
      if(hp && hp.value){ return; }
      // walidacja podstawowa
      var ok = true;
      form.querySelectorAll('[required]').forEach(function(field){
        var wrap = field.closest('.ds-field');
        var valid = field.type === 'checkbox' ? field.checked : field.value.trim() !== '';
        if(field.type === 'email'){ valid = valid && /.+@.+\..+/.test(field.value); }
        if(wrap){ wrap.classList.toggle('error', !valid); }
        if(!valid) ok = false;
      });
      if(!ok){ setStatus('err', 'Uzupełnij wymagane pola, zanim wyślesz wiadomość.'); return; }

      var action = form.getAttribute('action') || '';
      var btn = form.querySelector('button[type="submit"]');
      if(btn){ btn.disabled = true; }
      setStatus('ok', 'Wysyłam…');

      // Brak skonfigurowanego endpointu Formspree → fallback do maila
      if(action.indexOf('TWOJ_ID') !== -1 || action === ''){
        var name = (form.querySelector('[name="name"]')||{}).value || '';
        var msg = (form.querySelector('[name="message"]')||{}).value || '';
        var mailto = 'mailto:tomasz@tgether.pl?subject=' + encodeURIComponent('Zapytanie ze strony — ' + name) +
                     '&body=' + encodeURIComponent(msg);
        setStatus('ok', 'Otwieram Twój program pocztowy… Jeśli nic się nie stało, napisz na tomasz@tgether.pl.');
        window.location.href = mailto;
        if(btn){ btn.disabled = false; }
        return;
      }

      fetch(action, {
        method:'POST',
        body:new FormData(form),
        headers:{ 'Accept':'application/json' }
      }).then(function(r){
        if(r.ok){
          form.reset();
          setStatus('ok', 'Dziękuję — wiadomość dotarła. Odpiszę osobiście, zwykle w 24 h.');
        } else {
          setStatus('err', 'Coś poszło nie tak. Napisz proszę bezpośrednio na tomasz@tgether.pl.');
        }
      }).catch(function(){
        setStatus('err', 'Brak połączenia. Napisz proszę bezpośrednio na tomasz@tgether.pl.');
      }).finally(function(){ if(btn){ btn.disabled = false; } });
    });

    // toggle dla .ds-check (zgoda)
    form.querySelectorAll('.ds-check input[type="checkbox"]').forEach(function(cb){
      function sync(){ cb.closest('.ds-check').classList.toggle('on', cb.checked); }
      cb.addEventListener('change', sync); sync();
    });
  }
})();
