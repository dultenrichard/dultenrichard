/* In Good Company: native navigation, a single photographic relationship,
   gentle entrance feedback, no scroll capture, no graphical dependency. */
(() => {
  'use strict';
  const $ = (s,r=document) => r.querySelector(s);
  const header=$('.site-header');
  const progress=$('.reading-track span');
  const portrait=$('.portrait-mat');
  const menu=$('.menu-toggle');
  const menuPanel=$('.mobile-nav');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let lastFocus=null, pending=false;
  const update=()=>{
    pending=false;
    const total=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const y=Math.max(0,scrollY);
    header?.classList.toggle('scrolled',y>28);
    if(progress)progress.style.width=(Math.min(1,y/total)*100).toFixed(2)+'%';
    // The portrait remains one unmodified rectangle. This subtle translation
    // accompanies its naturally sticky handover from the name to the profile.
    if(portrait && !reduced.matches && innerWidth>900){
      const presence=$('.presence');
      if(presence){
        const rect=presence.getBoundingClientRect();
        const movement=Math.max(0,Math.min(18,-rect.top*.023));
        portrait.style.setProperty('--portrait-offset',movement.toFixed(2)+'px');
      }
    }else portrait?.style.setProperty('--portrait-offset','0px');
  };
  const requestUpdate=()=>{if(!pending){pending=true;requestAnimationFrame(update);}};
  addEventListener('scroll',requestUpdate,{passive:true});
  addEventListener('resize',requestUpdate,{passive:true});
  reduced.addEventListener?.('change',requestUpdate);
  update();

  const openMenu=()=>{
    if(!menu||!menuPanel)return;
    lastFocus=document.activeElement;
    menu.setAttribute('aria-expanded','true');
    menu.setAttribute('aria-label','Close navigation');
    menuPanel.inert=false;
    menuPanel.classList.add('is-open');
    document.body.style.overflow='hidden';
    $('.mobile-nav a')?.focus();
  };
  const closeMenu=(returnFocus=false)=>{
    if(!menu||!menuPanel)return;
    menu.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-label','Open navigation');
    menuPanel.classList.remove('is-open');
    menuPanel.inert=true;
    document.body.style.overflow='';
    if(returnFocus)lastFocus?.focus?.();
  };
  menu?.addEventListener('click',()=>menu.getAttribute('aria-expanded')==='true'?closeMenu(true):openMenu());
  menuPanel?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeMenu()));
  document.addEventListener('keydown',event=>{
    if(menu?.getAttribute('aria-expanded')!=='true')return;
    if(event.key==='Escape'){event.preventDefault();closeMenu(true);return;}
    if(event.key==='Tab'){
      const items=[menu,...menuPanel.querySelectorAll('a')];
      const index=items.indexOf(document.activeElement);
      if(event.shiftKey&&index===0){event.preventDefault();items[items.length-1].focus();}
      else if(!event.shiftKey&&index===items.length-1){event.preventDefault();items[0].focus();}
    }
  });
  addEventListener('resize',()=>{if(innerWidth>900)closeMenu(false)},{passive:true});

  if('IntersectionObserver' in window && !reduced.matches){
    const io=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(!entry.isIntersecting)continue;
        io.unobserve(entry.target);
        entry.target.animate([
          {opacity:.7,transform:'translateY(16px)'},
          {opacity:1,transform:'translateY(0)'}
        ],{duration:660,easing:'cubic-bezier(.23,1,.32,1)',fill:'none'});
      }
    },{threshold:.16,rootMargin:'0px 0px -5% 0px'});
    [
      '.profile-story h2','.profile-copy','.practice-lead h2',
      '.practice-aside','.participation-caption','.hours',
      '.perspective h2','.perspective-copy','.closing-quote',
      '.invitation-bottom'
    ].forEach(selector=>{const el=$(selector);if(el)io.observe(el);});
  }
})();
