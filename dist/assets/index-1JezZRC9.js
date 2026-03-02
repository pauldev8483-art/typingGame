(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const c of n)if(c.type==="childList")for(const i of c.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const c={};return n.integrity&&(c.integrity=n.integrity),n.referrerPolicy&&(c.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?c.credentials="include":n.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function r(n){if(n.ep)return;n.ep=!0;const c=a(n);fetch(n.href,c)}})();let m;function A(){return m||(m=new(window.AudioContext||window.webkitAudioContext)),m}function y({frequency:t,durationMs:e,type:a="sine",gain:r=.08,decayMs:n=80,detuneRangeCents:c=0}){const i=A(),d=i.createOscillator(),o=i.createGain();if(d.type=a,d.frequency.value=t,c){const h=(Math.random()*2-1)*c;d.detune.value=h}const u=i.currentTime,s=e/1e3,f=n/1e3;o.gain.setValueAtTime(r,u),o.gain.exponentialRampToValueAtTime(1e-4,u+s+f),d.connect(o).connect(i.destination),d.start(u),d.stop(u+s+f)}function M(){y({frequency:220+Math.random()*40,durationMs:55,decayMs:70,type:"triangle",gain:.05+Math.random()*.01,detuneRangeCents:15})}function q(){y({frequency:170,durationMs:150,type:"sine",gain:.06,detuneRangeCents:10})}function S(){y({frequency:480,durationMs:110,type:"triangle",gain:.06,detuneRangeCents:8}),setTimeout(()=>y({frequency:720,durationMs:110,type:"triangle",gain:.06,detuneRangeCents:8}),80)}function C(t,e){const a=Math.min(t.length,e.length);let r=0;for(let n=0;n<a;n+=1)e[n]===t[n]&&(r+=1);return r}function E(t,e){const a=Math.max(t.length,e.length);return a?C(t,e)/a*100:100}function I(t,e,a){return a?C(t,e)/5/a*60:0}function R(t,e=Date.now()){const a=t.startedAt?((t.endedAt??e)-t.startedAt)/1e3:0,r=E(t.targetText,t.typedText),n=I(t.targetText,t.typedText,a),c=t.targetText.length?Math.min(t.typedText.length/t.targetText.length,1):0;return{accuracy:r,wpm:n,progress:c,elapsedSeconds:a}}const w=["Accuracy beats speed until accuracy is automatic.","Small pauses to reset posture and wrist angle can prevent sloppy keystrokes.","Type with intent, not tension; smooth motion keeps errors low.","function sum(list) { return list.reduce((carry, value) => carry + value, 0); }","Clean habits compound: eyes on the screen, light touch on the keys.","Focus on breathing and steady rhythm; haste introduces noise.","Refactor your form like code: remove reaches, repeat the comfortable path.","const config = { retries: 3, timeoutMs: 800 };","Consistent accuracy builds confidence, and confidence brings speed."];function W(){const t=Math.floor(Math.random()*w.length);return w[t]}function k(t){return{targetText:t,typedText:"",startedAt:null,endedAt:null}}function F(t,e,a=Date.now()){const r=V(e,t.targetText.length),n={...t,typedText:r};!t.startedAt&&r.length>0&&(n.startedAt=a);const c=r.length>=t.targetText.length;return c&&!t.endedAt&&(n.endedAt=a),c||(n.endedAt=null),n}function V(t,e){return typeof t!="string"?"":t.slice(0,e)}function T(t){L(t,"flash")}function B(t){L(t,"shake")}function L(t,e){if(!t)return;t.classList.remove(e),t.offsetWidth,t.classList.add(e);const a=()=>{t.classList.remove(e),t.removeEventListener("animationend",a)};t.addEventListener("animationend",a)}function P({word:t,startIndex:e,endIndex:a,ui:r}){if(!r.floatLayer)return;const n=r.textDisplay.querySelector(`[data-idx="${e}"]`),c=r.textDisplay.querySelector(`[data-idx="${a}"]`),i=c||n;if(!i)return;const d=r.floatLayer.getBoundingClientRect(),o=(n==null?void 0:n.getBoundingClientRect())??i.getBoundingClientRect(),u=(c==null?void 0:c.getBoundingClientRect())??i.getBoundingClientRect(),s=document.createElement("div");s.className="float-word",s.textContent=t;const f=(o.left+u.right)/2-d.left,h=Math.min(o.top,u.top)-d.top;s.style.left=`${f}px`,s.style.top=`${h}px`,r.floatLayer.appendChild(s);const x=()=>s.remove();s.addEventListener("animationend",x),setTimeout(x,1200)}function D(t){return t.innerHTML=`
    <div class="page">
      <header class="top-bar">
        <div class="title-block">
          <p class="eyebrow">Accuracy-first trainer</p>
          <h1>Typing game</h1>
        </div>
        <div class="controls">
          <button type="button" data-new-text>New text</button>
        </div>
      </header>

      <div class="grid">
        <section class="text-panel" data-focus-surface>
          <div class="panel-heading">
            <span>Target text</span>
            <span class="focus-cta">Click to focus and start typing</span>
          </div>
          <div class="text-display" data-text-shell tabindex="0">
            <div class="text-layer" data-text-display></div>
            <div class="float-layer" data-float-layer></div>
          </div>
        </section>

        <section class="metrics">
          <div class="metric-card">
            <div class="metric-label">Accuracy</div>
            <div class="metric-value" data-accuracy>100%</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">WPM</div>
            <div class="metric-value" data-wpm>0.0</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Time</div>
            <div class="metric-value" data-time>0.0s</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Progress</div>
            <div class="progress-bar">
              <div class="progress-fill" data-progress></div>
            </div>
            <div class="status" data-status>Waiting to start</div>
          </div>
        </section>
      </div>

      <input
        class="hidden-input"
        data-hidden-input
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
      />
    </div>
  `,{textShell:t.querySelector("[data-text-shell]"),textDisplay:t.querySelector("[data-text-display]"),floatLayer:t.querySelector("[data-float-layer]"),hiddenInput:t.querySelector("[data-hidden-input]"),newTextButton:t.querySelector("[data-new-text]"),focusSurface:t.querySelector("[data-focus-surface]"),accuracyValue:t.querySelector("[data-accuracy]"),wpmValue:t.querySelector("[data-wpm]"),timeValue:t.querySelector("[data-time]"),progressFill:t.querySelector("[data-progress]"),status:t.querySelector("[data-status]")}}function O({session:t,metrics:e,ui:a}){$(t.targetText,t.typedText,a.textDisplay),a.accuracyValue.textContent=`${e.accuracy.toFixed(1)}%`,a.wpmValue.textContent=e.wpm.toFixed(1),a.timeValue.textContent=`${e.elapsedSeconds.toFixed(1)}s`;const r=Math.round(e.progress*1e3)/10;a.progressFill.style.width=`${r}%`,a.status.textContent=t.endedAt?"Complete":t.startedAt?"Keep typing":"Waiting to start",a.status.classList.toggle("complete",!!t.endedAt)}function $(t,e,a){a.innerHTML="";const r=document.createDocumentFragment();for(let n=0;n<t.length;n+=1){const c=t[n],i=e[n],d=document.createElement("span");d.classList.add("glyph"),d.dataset.idx=n,i===void 0?d.classList.add("pending"):i===c?d.classList.add("correct"):d.classList.add("wrong"),n===e.length&&d.classList.add("current"),d.textContent=c,r.appendChild(d)}if(e.length>=t.length){const n=document.createElement("span");n.classList.add("glyph","current"),n.textContent="|",r.appendChild(n)}a.appendChild(r)}const l=D(document.querySelector("#app"));let p=b();N();v(p);g();function N(){l.hiddenInput.addEventListener("input",t=>{const e=p;p=F(p,t.target.value),v(p),K(e,p)}),l.newTextButton.addEventListener("click",()=>{p=b(),v(p),g()}),l.focusSurface.addEventListener("click",()=>{g()}),window.addEventListener("keydown",t=>{t.metaKey||t.ctrlKey||document.activeElement!==l.hiddenInput&&g()})}function b(){const t=k(W());return l.hiddenInput.value="",l.hiddenInput.maxLength=t.targetText.length,t}function v(t){const e=R(t);O({session:t,metrics:e,ui:l})}function g(){l.hiddenInput.focus({preventScroll:!0})}function K(t,e){const a=e.typedText.length-t.typedText.length,r=z(t,e);if(r&&P({...r,ui:l}),a>0){const n=t.typedText.length;for(let c=0;c<a;c+=1){const i=n+c,d=e.typedText[i],o=e.targetText[i];d!==void 0&&(d===o?(T(l.textShell),M()):(B(l.textShell),q()))}}!t.endedAt&&e.endedAt&&(T(l.textShell),S())}function z(t,e){const a=t.typedText.length,r=e.typedText.length;if(r<=a)return null;const n=e.typedText.endsWith(" "),c=r===e.targetText.length;if(!n&&!c)return null;const i=r-1;if(n&&e.targetText[i]!==" ")return null;const d=n?i-1:i;if(d<0)return null;let o=d;for(;o>0&&e.targetText[o-1]!==" ";)o-=1;const u=e.typedText.slice(o,d+1),s=e.targetText.slice(o,d+1);return!u||u!==s?null:{word:u,startIndex:o,endIndex:d}}
