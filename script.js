/* LOADER */
window.addEventListener('load',()=>{document.getElementById('page-loader').classList.add('done')});

/* CURSOR */
const dot=document.getElementById('cursor-dot'),ring=document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});
(function loop(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop)})();
document.querySelectorAll('a,button,.proj-card,.skill-block,.cert-card,.edu-card,.bento-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{dot.classList.add('h');ring.classList.add('h')});
  el.addEventListener('mouseleave',()=>{dot.classList.remove('h');ring.classList.remove('h')});
});

/* THEME */
const html=document.documentElement,tb=document.getElementById('theme-btn');
html.dataset.theme=localStorage.getItem('theme')||'dark';
tb.onclick=()=>{const t=html.dataset.theme==='dark'?'light':'dark';html.dataset.theme=t;localStorage.setItem('theme',t)};

/* HAM */
const ham=document.getElementById('ham'),nl=document.getElementById('nav-list');
ham.onclick=()=>nl.classList.toggle('open');
nl.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nl.classList.remove('open')));

/* ACTIVE NAV */
document.querySelectorAll('section[id]').forEach(s=>{
  new IntersectionObserver(([e])=>{
    if(e.isIntersecting){
      document.querySelectorAll('#nav-list a').forEach(a=>a.classList.remove('active'));
      const a=document.querySelector(`#nav-list a[href="#${s.id}"]`);
      if(a)a.classList.add('active');
    }
  },{rootMargin:'-40% 0px -55% 0px'}).observe(s);
});

/* REVEAL */
const revObs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revObs.observe(el));

/* TYPEWRITER */
const words=['AI / ML Enthusiast ✦','Web Developer ⚡','Python Dev 🐍','Problem Solver 💡','CSE Student 🎓'];
let wi=0,ci=0,del=false;
const tw=document.getElementById('tw');
(function type(){
  const w=words[wi];tw.textContent=del?w.slice(0,ci--):w.slice(0,ci++);
  let s=del?45:95;
  if(!del&&ci>w.length){s=2000;del=true}
  else if(del&&ci<0){del=false;wi=(wi+1)%words.length;ci=0;s=400}
  setTimeout(type,s);
})();

/* COUNTER ANIM */
document.querySelectorAll('.hs-n[data-target]').forEach(el=>{
  const tgt=parseFloat(el.dataset.target),isFloat=tgt%1!==0;
  let cur=0;const step=tgt/60;
  const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){io.disconnect();const iv=setInterval(()=>{cur+=step;if(cur>=tgt){cur=tgt;clearInterval(iv)}el.textContent=isFloat?cur.toFixed(2):Math.floor(cur)},16)}});
  io.observe(el);
});

/* BACK TO TOP */
const btt=document.getElementById('btt');
window.addEventListener('scroll',()=>btt.classList.toggle('show',scrollY>400));
btt.onclick=()=>scrollTo({top:0,behavior:'smooth'});

/* GITHUB PROJECTS */
const COLORS={Python:'#3572A5',JavaScript:'#f1e05a',Java:'#b07219',HTML:'#e34c26',CSS:'#563d7c','Jupyter Notebook':'#DA5B0B',TypeScript:'#3178c6',Shell:'#89e051'};

function timeAgo(d){const s=Math.floor((Date.now()-new Date(d))/1e3);if(s<60)return'just now';if(s<3600)return Math.floor(s/60)+'m';if(s<86400)return Math.floor(s/3600)+'h';if(s<2592e3)return Math.floor(s/86400)+'d';return Math.floor(s/2592e3)+'mo'}

async function fetchRepos(){
  const g=document.getElementById('proj-grid'),c=document.getElementById('proj-count');
  try{
    let all=[],page=1;
    while(true){
      const r=await fetch(`https://api.github.com/users/gokulcs-nkl/repos?sort=updated&per_page=100&page=${page}`);
      if(!r.ok)break;const b=await r.json();if(!b.length)break;all=all.concat(b);if(b.length<100)break;page++;
    }
    const repos=[...all.filter(r=>!r.fork && r.name.toLowerCase()!=='portfolio'),...all.filter(r=>r.fork && r.name.toLowerCase()!=='portfolio')];
    g.innerHTML='';if(c)c.textContent=repos.length+' repos';
    if(!repos.length){g.innerHTML='<p style="grid-column:1/-1;text-align:center;color:var(--text2)">No repos found. <a href="https://github.com/gokulcs-nkl" target="_blank" style="color:var(--accent)">Visit GitHub</a></p>';return}
    repos.forEach((r,i)=>{
      const col=COLORS[r.language]||'var(--accent)';
      const lang=r.language?`<span class="pc-lang"><span class="lang-dot" style="background:${col}"></span>${r.language}</span>`:'';
      const d=document.createElement('div');d.className='proj-card reveal';d.style.setProperty('--d',Math.min(i*50,400)+'ms');
      d.innerHTML=`<div class="pc-head"><span class="pc-ico"><i class="fas fa-folder-open"></i></span><div class="pc-links"><a href="${r.html_url}" target="_blank" class="pc-link" title="GitHub"><i class="fab fa-github"></i></a>${r.homepage?`<a href="${r.homepage}" target="_blank" class="pc-link" title="Live"><i class="fas fa-external-link-alt"></i></a>`:''}</div></div><div class="pc-name">${r.name.replace(/[-_]/g,' ')}</div><div class="pc-desc">${r.description||'No description.'}</div><div class="pc-foot">${lang}<span><i class="fas fa-star" style="color:var(--accent2);margin-right:3px"></i>${r.stargazers_count} · ${timeAgo(r.updated_at)}</span></div>`;
      g.appendChild(d);revObs.observe(d);
    });
  }catch(e){g.innerHTML='<p style="grid-column:1/-1;text-align:center;color:var(--text2)">Could not load. <a href="https://github.com/gokulcs-nkl" target="_blank" style="color:var(--accent)">View on GitHub</a></p>'}
}
fetchRepos();

/* CONTACT */
const form=document.getElementById('contact-form'),st=document.getElementById('cf-status');
form.onsubmit=e=>{
  e.preventDefault();
  const n=document.getElementById('cf-name').value.trim(),em=document.getElementById('cf-email').value.trim(),m=document.getElementById('cf-message').value.trim();
  if(!n||!em||!m){st.textContent='Please fill all fields.';st.style.color='#f87171';return}
  const msgs=JSON.parse(localStorage.getItem('msgs')||'[]');msgs.push({n,em,m,t:new Date().toISOString()});localStorage.setItem('msgs',JSON.stringify(msgs));
  const sub=encodeURIComponent('Portfolio message from '+n),body=encodeURIComponent(`Name: ${n}\nEmail: ${em}\n\n${m}`);
  setTimeout(()=>{location.href=`mailto:csgokulnkl@gmail.com?subject=${sub}&body=${body}`;st.textContent='✅ Saved! Email client opening.';st.style.color='#34d399';form.reset()},600);
};

/* PHOTO FALLBACK */
['hero-img'].forEach(id=>{const el=document.getElementById(id);if(el)el.onerror=function(){this.style.display='none';const f=document.createElement('div');f.style.cssText='width:100%;height:100%;border-radius:50%;background:linear-gradient(135deg,#a78bfa,#f59e0b);display:flex;align-items:center;justify-content:center;font-size:3.5rem;color:#fff;font-weight:800;font-family:Outfit';f.textContent='GCS';this.parentElement.insertBefore(f,this)}});
