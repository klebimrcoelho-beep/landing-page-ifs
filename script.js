/* ==========================================================
   INSTITUTO FREUDIANO DE SALVADOR | script.js
   Comportamentos: navbar scroll, máscara de telefone, form submit
   ========================================================== */

/* ---------- NAVBAR SCROLL ---------- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ---------- SMOOTH SCROLL para âncoras ---------- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = navbar.offsetHeight + 16;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---------- MÁSCARA DE TELEFONE ---------- */
const wppInput = document.getElementById('whatsapp');
if (wppInput) {
  wppInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length <= 2)       v = v.replace(/^(\d{0,2})/, '($1');
    else if (v.length <= 7)  v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    else                     v = v.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    e.target.value = v;
  });
}

/* ---------- FORM SUBMIT ---------- */
function handleFormSubmit(e) {
  e.preventDefault();

  const form      = document.getElementById('lead-form');
  const btn       = document.getElementById('form-submit-btn');
  const nome      = document.getElementById('nome').value.trim();
  const email     = document.getElementById('email').value.trim();
  const whatsapp  = document.getElementById('whatsapp').value.trim();
  const horario   = document.getElementById('horario').value;

  /* Validação simples */
  if (!nome || !email || !whatsapp || !horario) {
    shakeForm();
    return;
  }

  /* Feedback visual de loading */
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  /* Monta a mensagem pré-formatada */
  const mensagem = `Olá! Quero garantir minha vaga na aula gratuita da Formação em Psicanálise.

Meus dados:
👤 Nome: ${nome}
✉️ E-mail: ${email}
📱 WhatsApp: ${whatsapp}
🗓️ Horário escolhido: ${formatHorario(horario)}`;

  const mensagemCodificada = encodeURIComponent(mensagem);
  const urlWhatsApp = `https://wa.me/557196457086?text=${mensagemCodificada}`;

  /* Disparo do evento Lead no Meta Pixel (descomente quando ativar o Pixel) */
  // if (typeof fbq !== 'undefined') {
  //   fbq('track', 'Lead', {
  //     content_name: 'Formação em Psicanálise - Aulas Gratuitas',
  //     content_category: 'Educação'
  //   });
  // }

  /* Abre o WhatsApp em nova aba e exibe a tela de sucesso */
  setTimeout(() => {
    window.open(urlWhatsApp, '_blank');
    showFormSuccess(nome);
    form.reset();
    btn.disabled = false;
    btn.textContent = '✦ Quero Minha Aula Gratuita';
  }, 800);
}

function showFormSuccess(nome) {
  const wrapper = document.querySelector('.lead-form-wrapper');
  wrapper.innerHTML = `
    <div class="form-success">
      <div class="form-success-icon">✓</div>
      <h3>Inscrição confirmada, ${nome.split(' ')[0]}!</h3>
      <p>
        Obrigado! Em breve você receberá as instruções de acesso.<br />
        Estamos te redirecionando ao WhatsApp para confirmar sua vaga. 💬
      </p>
    </div>
  `;
}

function formatHorario(val) {
  const map = {
    'matutino-09-09': '09/09 Matutino (09:00)',
    'noturno-09-09':  '09/09 Noturno (19:30)',
    'matutino-10-09': '10/09 Matutino (09:00)',
    'noturno-10-09':  '10/09 Noturno (19:30)',
  };
  return map[val] || val;
}

function shakeForm() {
  const form = document.getElementById('lead-form');
  form.style.animation = 'none';
  void form.offsetWidth; /* reflow */
  form.style.animation = 'shake 0.4s ease';
}

/* ---------- ANIMAÇÃO SHAKE ---------- */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX(8px); }
    60%      { transform: translateX(-5px); }
    80%      { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);

/* ---------- INTERSECTION OBSERVER — fade-in animações ---------- */
const fadeEls = document.querySelectorAll(
  '.diferencial-card, .tripe-card, .estrutura-stat-card, .bonus-card, .modulo-item'
);

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${(i % 6) * 0.06}s`;
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

/* Adiciona estilo inicial de animação de entrada */
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
  .diferencial-card,
  .tripe-card,
  .estrutura-stat-card,
  .bonus-card,
  .modulo-item {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity .55s ease, transform .55s ease, border-color .28s, box-shadow .28s, background .28s;
  }
  .diferencial-card.visible,
  .tripe-card.visible,
  .estrutura-stat-card.visible,
  .bonus-card.visible,
  .modulo-item.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(fadeStyle);
fadeEls.forEach(el => io.observe(el));

/* ---------- CONTADOR REGRESSIVO (urgência) ---------- */
// Data alvo: 09 de Setembro de 2026, 09:00
const targetDate = new Date('2026-09-09T09:00:00');

function updateCountdown() {
  const now  = new Date();
  const diff = targetDate - now;

  if (diff <= 0) return; // Evento passou

  const d  = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h  = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s  = Math.floor((diff % (1000 * 60)) / 1000);

  const el = document.getElementById('countdown');
  if (el) {
    el.textContent = `${String(d).padStart(2,'0')}d  ${String(h).padStart(2,'0')}h  ${String(m).padStart(2,'0')}m  ${String(s).padStart(2,'0')}s`;
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);
