import React, { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

/* ── Intersection observer hook ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Contact Form Modal ── */
function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", question: "" });
  const [sent, setSent] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(78,75,73,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl p-8"
        style={{ background: "var(--sand)", boxShadow: "0 25px 60px rgba(78,75,73,0.2)" }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full"
          style={{ background: "rgba(152,160,111,0.15)", color: "var(--text)" }}
        >
          <Icon name="X" size={16} />
        </button>
        {!sent ? (
          <>
            <h3 className="section-title text-3xl mb-2">Написать Екатерине</h3>
            <p className="text-sm mb-6" style={{ color: "rgba(78,75,73,0.6)" }}>
              Оставьте вопрос или запросите предварительную консультацию
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input className="organic-input" placeholder="Ваше имя" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              <input className="organic-input" placeholder="Телефон или Telegram" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
              <textarea className="organic-input resize-none" placeholder="Ваш вопрос или что вас беспокоит..." rows={4} value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} />
              <button type="submit" className="btn-primary rounded-2xl py-4 text-base font-medium mt-2">Отправить</button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🌿</div>
            <h3 className="section-title text-3xl mb-3">Спасибо!</h3>
            <p style={{ color: "rgba(78,75,73,0.7)" }}>Екатерина получит ваше сообщение и свяжется с вами в ближайшее время.</p>
            <button onClick={onClose} className="btn-primary rounded-2xl py-3 px-8 mt-6 inline-block">Закрыть</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── FAQ Item ── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b cursor-pointer" style={{ borderColor: "rgba(200,200,174,0.6)" }} onClick={() => setOpen(!open)}>
      <div className="flex justify-between items-center py-5 gap-4">
        <span className="font-medium text-base" style={{ color: "var(--text)" }}>{q}</span>
        <div
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
          style={{ background: open ? "var(--sage)" : "rgba(152,160,111,0.15)", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          <Icon name="Plus" size={14} style={{ color: open ? "var(--sand)" : "var(--sage)" } as React.CSSProperties} />
        </div>
      </div>
      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: open ? "300px" : "0", opacity: open ? 1 : 0 }}>
        <p className="pb-5 text-sm leading-relaxed" style={{ color: "rgba(78,75,73,0.75)" }}>{a}</p>
      </div>
    </div>
  );
}

/* ── Inline form ── */
function ContactInlineForm() {
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [sent, setSent] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };
  if (sent) return (
    <div className="text-center py-6">
      <div className="text-4xl mb-3">🌿</div>
      <p className="section-title text-2xl mb-2">Спасибо!</p>
      <p className="text-sm" style={{ color: "rgba(78,75,73,0.65)" }}>Екатерина свяжется с вами в ближайшее время.</p>
    </div>
  );
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input className="organic-input" placeholder="Ваше имя" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
      <input className="organic-input" placeholder="Телефон или Telegram" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} required />
      <textarea className="organic-input resize-none" placeholder="Ваш вопрос..." rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
      <button type="submit" className="btn-primary rounded-2xl py-4 text-sm font-medium">Отправить вопрос</button>
    </form>
  );
}

const faqs = [
  { q: "Как проходят встречи?", a: "Онлайн, через видеосвязь. Длительность каждой встречи — 60 минут. После каждой сессии вы получаете материалы и практики." },
  { q: "Мне нужна именно терапия? У меня не клинический случай.", a: "Программа не является психотерапией в медицинском смысле. Это сопровождение для людей, которые чувствуют усталость, потерю себя и хотят вернуть контакт с собой." },
  { q: "Что если я не смогу выполнять задания?", a: "Всё строится в вашем темпе. Нет жёстких требований — только мягкая поддержка и пространство для вашего прогресса." },
  { q: "Можно ли начать с 5 недель и потом продолжить?", a: "Да, это возможно. После завершения 5-недельной программы мы обсудим, хотите ли вы продолжить более глубокую работу." },
  { q: "Есть ли рассрочка?", a: "Да, можно обсудить удобный для вас вариант оплаты — напишите мне, и мы найдём решение." },
];

/* ── MAIN ── */
export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const openModal = () => setModalOpen(true);
  const navLinks = [
    { href: "#about-program", label: "О программе" },
    { href: "#about-me", label: "Обо мне" },
    { href: "#tariffs", label: "Тарифы" },
    { href: "#reviews", label: "Отзывы" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Контакты" },
  ];

  return (
    <div style={{ background: "var(--sand)", color: "var(--text)" }}>
      {/* NAVBAR */}
      <header
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(234,227,219,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 1px 20px rgba(78,75,73,0.08)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#" style={{ fontFamily: "Cormorant, serif", fontSize: "1.3rem", color: "var(--text)", fontWeight: 500 }}>Екатерина Довженко</a>
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map(l => <a key={l.href} href={l.href} className="nav-link">{l.label}</a>)}
          </nav>
          <button onClick={openModal} className="btn-primary hidden md:block rounded-2xl px-6 py-2.5 text-sm font-medium">Записаться</button>
          <button className="md:hidden" style={{ color: "var(--text)" }} onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4" style={{ background: "rgba(234,227,219,0.98)" }}>
            {navLinks.map(l => <a key={l.href} href={l.href} className="nav-link text-base" onClick={() => setMenuOpen(false)}>{l.label}</a>)}
            <button onClick={() => { openModal(); setMenuOpen(false); }} className="btn-primary rounded-2xl py-3 text-sm font-medium mt-2">Записаться</button>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ paddingTop: "100px", background: "radial-gradient(ellipse at 20% 20%, rgba(200,200,174,0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(201,217,232,0.3) 0%, transparent 50%), var(--sand)" }}>
        <div className="absolute blob-1 opacity-35" style={{ width: "420px", height: "420px", background: "var(--sage-light)", top: "-80px", right: "-100px" }} />
        <div className="absolute blob-2 opacity-20" style={{ width: "280px", height: "280px", background: "var(--sky)", bottom: "60px", left: "-60px" }} />
        <div className="absolute blob-3 opacity-15" style={{ width: "180px", height: "180px", background: "var(--gold)", bottom: "120px", right: "18%" }} />

        <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="inline-block text-xs font-medium tracking-widest uppercase mb-6 px-4 py-2 rounded-full" style={{ background: "rgba(152,160,111,0.15)", color: "var(--sage)" }}>
              Индивидуальная программа
            </div>
            <h1 className="section-title mb-6" style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", lineHeight: 1.1 }}>
              Из «надо» —<br />
              <em style={{ color: "var(--sage)", fontStyle: "italic" }}>в «хочу»</em>
            </h1>
            <p className="text-lg mb-4 leading-relaxed" style={{ color: "rgba(78,75,73,0.8)", maxWidth: "500px" }}>
              Перестать жить на автомате и снова почувствовать себя живым человеком
            </p>
            <p className="mb-10 leading-relaxed" style={{ color: "rgba(78,75,73,0.65)", maxWidth: "460px" }}>
              Когда внутри больше нет сил всё тянуть, терпеть и быть «удобной». Когда хочется не очередной мотивации, а наконец услышать себя — спокойно, без давления.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={openModal} className="btn-primary rounded-2xl px-8 py-4 text-base font-medium">Хочу участвовать</button>
              <a href="#about-program" className="btn-outline rounded-2xl px-8 py-4 text-base font-medium text-center">Узнать подробнее</a>
            </div>
          </div>

          <div className="relative hidden lg:flex justify-center">
            <div className="absolute blob-1 opacity-30" style={{ width: "380px", height: "420px", background: "var(--sage-light)", top: "-20px", left: "5px" }} />
            <div className="relative blob-2 overflow-hidden" style={{ width: "340px", height: "430px" }}>
              <img
                src="https://cdn.poehali.dev/files/af760ed5-9f14-4099-9237-38d5875acf07.jpg"
                alt="Екатерина — психолог"
                className="w-full h-full object-cover"
                style={{ objectPosition: "center top" }}
              />
            </div>
            <div className="absolute bottom-8 -left-8 rounded-2xl px-5 py-4 shadow-lg" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)", border: "1px solid rgba(200,200,174,0.5)" }}>
              <div className="text-2xl font-bold" style={{ fontFamily: "Cormorant, serif", color: "var(--sage)" }}>5–9</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(78,75,73,0.65)" }}>недель сопровождения</div>
            </div>
            <div className="absolute top-12 -right-6 rounded-2xl px-4 py-3 shadow-lg" style={{ background: "rgba(242,201,76,0.2)", border: "1px solid rgba(242,201,76,0.4)", backdropFilter: "blur(8px)" }}>
              <div className="text-sm font-medium" style={{ color: "var(--text)" }}>🌿 Бережно</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(78,75,73,0.6)" }}>без давления</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="text-xs tracking-widest uppercase" style={{ color: "var(--sage)", fontFamily: "Golos Text" }}>листай</div>
          <div className="w-0.5 h-10 rounded-full" style={{ background: "linear-gradient(to bottom, var(--sage), transparent)" }} />
        </div>
      </section>

      {/* FOR WHOM */}
      <section id="about-program" className="py-24 relative overflow-hidden">
        <div className="absolute blob-3 opacity-15" style={{ width: "300px", height: "300px", background: "var(--sky)", top: "40px", right: "-60px" }} />
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <div className="deco-line mx-auto mb-6" />
              <h2 className="section-title text-5xl mb-4">Вам подойдёт эта программа, если…</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "Shield", text: "Вы постоянно держите всё под контролем и устали быть «сильной»", bg: "rgba(255,255,255,0.5)" },
              { icon: "Cloud", text: "Внешне всё нормально, но внутри — тревога, напряжение и ощущение пустоты", bg: "rgba(201,217,232,0.3)" },
              { icon: "Heart", text: "Вы много делаете для других и почти не понимаете, чего хотите сами", bg: "rgba(152,160,111,0.12)" },
              { icon: "MessageCircle", text: "Сложно говорить «нет», обозначать границы и не чувствовать вину", bg: "rgba(255,255,255,0.5)" },
              { icon: "Brain", text: "Устали от бесконечного самоанализа, но легче не становится", bg: "rgba(201,217,232,0.3)" },
              { icon: "Sunrise", text: "Хочется спокойствия, опоры внутри и ощущения «я живу свою жизнь»", bg: "rgba(242,201,76,0.1)" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="card-hover rounded-3xl p-7 h-full" style={{ background: item.bg, border: "1px solid rgba(200,200,174,0.4)" }}>
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ background: "rgba(152,160,111,0.15)" }}>
                    <Icon name={item.icon} size={18} style={{ color: "var(--sage)" } as React.CSSProperties} />
                  </div>
                  <p className="leading-relaxed text-sm" style={{ color: "var(--text)" }}>{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-12 rounded-3xl p-8 md:p-10" style={{ background: "rgba(255,255,255,0.45)", border: "1px solid rgba(200,200,174,0.4)" }}>
              <p className="font-medium mb-5" style={{ fontFamily: "Cormorant, serif", fontSize: "1.6rem", color: "var(--text)" }}>Возможно, вы уже пробовали:</p>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {["читать психологические книги", "смотреть разборы и видео", "«взять себя в руки»", "подавлять эмоции и отвлекаться"].map((t, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: "rgba(200,200,174,0.5)", border: "1px solid var(--sage-light)" }} />
                    <span className="text-sm" style={{ color: "rgba(78,75,73,0.75)" }}>{t}</span>
                  </div>
                ))}
              </div>
              <p className="text-base leading-relaxed" style={{ color: "var(--text)" }}>
                Но проблема не уходит, потому что дело не в дисциплине.<br />
                <strong>А в потере контакта с собой.</strong>
              </p>
              <button onClick={openModal} className="btn-outline rounded-2xl px-7 py-3 text-sm font-medium mt-6 inline-block">Узнать подробнее →</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* RESULTS */}
      <section className="py-24 relative overflow-hidden" style={{ background: "rgba(201,217,232,0.18)" }}>
        <div className="absolute blob-1 opacity-12" style={{ width: "350px", height: "350px", background: "var(--sage)", bottom: "-80px", left: "-80px" }} />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <div className="deco-line mx-auto mb-6" />
              <h2 className="section-title text-5xl mb-4">Что изменится после программы</h2>
              <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(78,75,73,0.65)" }}>Вы не станете «идеальным человеком». Но многое внутри станет проще, спокойнее и понятнее.</p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto w-full">
            {[
              "Начнёте лучше понимать себя и свои настоящие желания",
              "Перестанете жить только через чувство долга и постоянное «надо»",
              "Научитесь замечать свои эмоции, а не подавлять их",
              "Почувствуете больше спокойствия в теле и голове",
              "Сможете мягко выстраивать границы без агрессии и чувства вины",
              "Станете увереннее проявляться и говорить о себе",
              "Начнёте опираться на себя, а не только на ожидания других",
            ].map((r, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="flex items-start gap-4 rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(200,200,174,0.35)" }}>
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5" style={{ background: "var(--sage)" }}>
                    <Icon name="Check" size={13} style={{ color: "var(--sand)" } as React.CSSProperties} />
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>{r}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <div className="text-center mt-12">
              <p className="text-2xl mb-6" style={{ fontFamily: "Cormorant, serif", fontStyle: "italic", color: "var(--sage)" }}>«со мной всё в порядке»</p>
              <button onClick={openModal} className="btn-primary rounded-2xl px-8 py-4 text-base font-medium">Хочу участвовать</button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute blob-2 opacity-12" style={{ width: "250px", height: "250px", background: "var(--gold)", top: "80px", right: "-40px" }} />
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <div className="deco-line mx-auto mb-6" />
              <h2 className="section-title text-5xl mb-4">Как проходит программа</h2>
              <p className="text-base max-w-lg mx-auto" style={{ color: "rgba(78,75,73,0.65)" }}>Это не курс в записи. Это индивидуальное сопровождение — бережно, глубоко и в вашем темпе.</p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-8 mb-14">
            <Reveal>
              <div className="rounded-3xl p-8 h-full" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(200,200,174,0.4)" }}>
                <h3 className="section-title text-2xl mb-5">Формат работы</h3>
                <div className="flex flex-col gap-3">
                  {[
                    { icon: "Video", text: "Личные онлайн-встречи" },
                    { icon: "Feather", text: "Практики между сессиями" },
                    { icon: "MessageSquare", text: "Поддержка в процессе" },
                    { icon: "Palette", text: "Арт-терапия" },
                    { icon: "Layers", text: "Метафорические карты" },
                    { icon: "Wind", text: "Упражнения на контакт с телом" },
                    { icon: "BookOpen", text: "Домашние задания без перегруза" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(152,160,111,0.15)" }}>
                        <Icon name={item.icon} size={15} style={{ color: "var(--sage)" } as React.CSSProperties} />
                      </div>
                      <span className="text-sm" style={{ color: "var(--text)" }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="flex flex-col gap-5 h-full">
                <div className="rounded-3xl p-7 flex-1" style={{ background: "rgba(152,160,111,0.12)", border: "1px solid rgba(152,160,111,0.25)" }}>
                  <div className="text-4xl font-bold mb-2" style={{ fontFamily: "Cormorant, serif", color: "var(--sage)" }}>5 недель</div>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(78,75,73,0.75)" }}>Мягкая перезагрузка и возвращение контакта с собой. Первые ощутимые изменения.</p>
                </div>
                <div className="rounded-3xl p-7 flex-1" style={{ background: "rgba(201,217,232,0.3)", border: "1px solid rgba(201,217,232,0.5)" }}>
                  <div className="text-4xl font-bold mb-2" style={{ fontFamily: "Cormorant, serif", color: "var(--text)" }}>9 недель</div>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(78,75,73,0.75)" }}>Глубокая работа и устойчивые внутренние изменения. Новое ощущение себя и своей жизни.</p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal><h3 className="section-title text-3xl text-center mb-8">Что входит в программу</h3></Reveal>

          {/* Weeks 1–5 */}
          <div className="flex flex-wrap justify-center gap-5 mb-14">
            {[
              { num: "01", title: "Снятие напряжения", items: ["Работа с тревогой", "Контакт с телом", "Понимание своих состояний"] },
              { num: "02", title: "Контакт с собой", items: ["Исследование желаний", "Работа с запретом «хотеть»", "Поиск внутренних опор"] },
              { num: "03", title: "Границы и проявленность", items: ["Как говорить «нет»", "Перестать быть удобной", "Страх конфликтов и осуждения"] },
              { num: "04", title: "Эмоции", items: ["Проживание обид и вины", "Разрешение чувствовать", "Снижение самоконтроля"] },
              { num: "05", title: "Новое ощущение себя", items: ["Понимание желаний", "Новые привычки и состояния", "Закрепление изменений"] },
            ].map((m, i) => (
              <Reveal key={i} delay={i * 0.07} className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]">
                <div className="card-hover rounded-3xl p-6 h-full" style={{ background: "rgba(255,255,255,0.45)", border: "1px solid rgba(200,200,174,0.4)" }}>
                  <div className="text-xs font-bold tracking-widest mb-3" style={{ color: "var(--sage-light)" }}>{m.num}</div>
                  <h4 className="section-title text-xl mb-3">{m.title}</h4>
                  <ul className="flex flex-col gap-1.5">
                    {m.items.map((it, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm" style={{ color: "rgba(78,75,73,0.75)" }}>
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--sage)" }} />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Weeks 6–9 deep block */}
          <Reveal>
            <div className="rounded-3xl px-8 py-6 mb-8 text-center" style={{ background: "rgba(152,160,111,0.12)", border: "1px solid rgba(152,160,111,0.3)" }}>
              <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "var(--sage)" }}>Только в тарифе 9 недель</div>
              <h3 className="section-title text-2xl">Дополнительный блок — глубокое сопровождение</h3>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                num: "06",
                title: "Работа с тревогой и гиперконтролем",
                theme: "",
                topics: ["Понимание причин постоянного внутреннего напряжения", "Снижение тревожности и эмоционального перегруза", "Формирование чувства внутренней безопасности и опоры"],
                practices: [],
                after: [],
              },
              {
                num: "07",
                title: "Проявленность и уверенность в себе",
                theme: "",
                topics: ["Работа со страхом осуждения и оценки", "Разрешение быть настоящей, а не «удобной»", "Развитие уверенности в самовыражении и общении"],
                practices: [],
                after: [],
              },
              {
                num: "08",
                title: "Выход из роли «удобного человека»",
                theme: "",
                topics: ["Осознание привычки жить для других", "Возвращение своих желаний и потребностей", "Формирование здоровых личных границ"],
                practices: [],
                after: [],
              },
              {
                num: "09",
                title: "Новая внутренняя опора и жизнь через «хочу»",
                theme: "",
                topics: ["Закрепление внутренних изменений и новых состояний", "Создание жизни с опорой на свои чувства и желания", "Интеграция состояния «я могу жить по-другому» в повседневность"],
                practices: [],
                after: [],
              },
            ].map((m, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="card-hover rounded-3xl p-6 h-full flex flex-col gap-4" style={{ background: "rgba(201,217,232,0.2)", border: "1px solid rgba(201,217,232,0.5)" }}>
                  <div>
                    <div className="text-xs font-bold tracking-widest mb-2" style={{ color: "var(--sage)" }}>{m.num} неделя</div>
                    <h4 className="section-title text-xl mb-3">{m.title}</h4>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {m.topics.map((t, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm leading-relaxed" style={{ color: "rgba(78,75,73,0.8)" }}>
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: "var(--sage)" }} />{t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT ME */}
      <section id="about-me" className="py-24 relative overflow-hidden" style={{ background: "rgba(200,200,174,0.15)" }}>
        <div className="absolute blob-1 opacity-20" style={{ width: "400px", height: "400px", background: "var(--sage-light)", top: "-80px", left: "-100px" }} />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="relative flex justify-center lg:justify-start">
                <div className="absolute blob-3 opacity-40" style={{ width: "360px", height: "420px", background: "var(--sage-light)", top: "-10px", left: "-10px" }} />
                <div className="relative blob-2 overflow-hidden" style={{ width: "310px", height: "390px" }}>
                  <img
                    src="https://cdn.poehali.dev/files/af760ed5-9f14-4099-9237-38d5875acf07.jpg"
                    alt="Екатерина — психолог, арт-терапевт"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center top" }}
                  />
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div>
                <div className="deco-line mb-6" />
                <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: "var(--sage)" }}>Почему со мной</p>
                <h2 className="section-title text-5xl mb-2">Екатерина Довженко</h2>
                <p className="text-base mb-6" style={{ color: "rgba(78,75,73,0.6)" }}>Психолог, арт-терапевт, игропрактик</p>
                <p className="leading-relaxed mb-6" style={{ color: "var(--text)" }}>
                  Работаю с людьми, которые устали жить через напряжение, контроль и постоянное «надо». В своей работе я соединяю несколько подходов, чтобы найти путь именно для вас.
                </p>
                <div className="flex flex-col gap-3 mb-8">
                  {[
                    { icon: "Brain", label: "Психология" },
                    { icon: "Palette", label: "Арт-терапия" },
                    { icon: "Layers", label: "Метафорические карты" },
                    { icon: "Wind", label: "Практики на контакт с телом" },
                    { icon: "Heart", label: "Мягкий подход без давления" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(152,160,111,0.15)" }}>
                        <Icon name={item.icon} size={15} style={{ color: "var(--sage)" } as React.CSSProperties} />
                      </div>
                      <span className="text-sm" style={{ color: "var(--text)" }}>{item.label}</span>
                    </div>
                  ))}
                </div>
                <blockquote className="rounded-2xl px-5 py-4 text-sm leading-relaxed italic mb-8" style={{ background: "rgba(242,201,76,0.12)", border: "1px solid rgba(242,201,76,0.3)", color: "var(--text)" }}>
                  «Мне важно, чтобы человек не "ломал себя", а постепенно возвращался к себе настоящему. Без осуждения. Без насилия над собой.»
                </blockquote>
                <button onClick={openModal} className="btn-primary rounded-2xl px-7 py-3.5 text-sm font-medium">Хочу участвовать</button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TARIFFS */}
      <section id="tariffs" className="py-24 relative overflow-hidden">
        <div className="absolute blob-3 opacity-18" style={{ width: "300px", height: "300px", background: "var(--sky)", bottom: "60px", right: "-60px" }} />
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <div className="deco-line mx-auto mb-6" />
              <h2 className="section-title text-5xl mb-4">Форматы участия</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-8">
            <Reveal>
              <div className="card-hover rounded-3xl p-8 h-full flex flex-col" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(200,200,174,0.5)" }}>
                <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "var(--sage)" }}>Тариф</div>
                <h3 className="section-title text-4xl mb-2">5 недель</h3>
                <p className="text-sm mb-6" style={{ color: "rgba(78,75,73,0.65)" }}>Для тех, кто хочет начать возвращать контакт с собой и почувствовать первые изменения</p>
                <div className="flex flex-col gap-2.5 mb-8 flex-1">
                  {["5 индивидуальных встреч", "Домашние задания и практики", "Арт-терапия и метафорические карты", "Поддержка между встречами", "Дополнительные материалы"].map((it, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(152,160,111,0.2)" }}>
                        <Icon name="Check" size={11} style={{ color: "var(--sage)" } as React.CSSProperties} />
                      </div>
                      <span className="text-sm" style={{ color: "var(--text)" }}>{it}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-6" style={{ borderColor: "rgba(200,200,174,0.4)" }}>
                  <div className="flex items-baseline gap-3 mb-1">
                    <div className="text-3xl font-bold" style={{ fontFamily: "Cormorant, serif", color: "var(--text)" }}>25 000 ₽</div>
                    <div className="text-base line-through" style={{ color: "rgba(78,75,73,0.4)" }}>35 000 ₽</div>
                  </div>
                  <div className="flex items-center gap-1.5 mb-4">
                    <div className="w-2 h-2 rounded-full" style={{ background: "var(--gold)" }} />
                    <span className="text-xs font-medium" style={{ color: "rgba(78,75,73,0.6)" }}>Количество мест ограничено</span>
                  </div>
                  <button onClick={openModal} className="btn-outline rounded-2xl py-3.5 w-full text-sm font-medium">Записаться</button>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="card-hover rounded-3xl p-8 h-full flex flex-col relative overflow-hidden" style={{ background: "var(--sage)" }}>
                <div className="absolute blob-1 opacity-15" style={{ width: "200px", height: "200px", background: "white", top: "-50px", right: "-50px" }} />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(234,227,219,0.75)" }}>Тариф</div>
                    <div className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: "rgba(242,201,76,0.3)", color: "var(--gold)" }}>Популярный</div>
                  </div>
                  <h3 className="section-title text-4xl mb-2" style={{ color: "var(--sand)" }}>9 недель</h3>
                  <p className="text-sm mb-6" style={{ color: "rgba(234,227,219,0.75)" }}>Для тех, кто хочет более глубокой и устойчивой трансформации</p>
                  <div className="flex flex-col gap-2.5 mb-8 flex-1">
                    {["9 недель сопровождения", "Глубокая работа с внутренними сценариями", "Дополнительные практики", "Поддержка и обратная связь", "Индивидуальные рекомендации", "Фиксация прогресса и результатов"].map((it, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>
                          <Icon name="Check" size={11} style={{ color: "var(--sand)" } as React.CSSProperties} />
                        </div>
                        <span className="text-sm" style={{ color: "rgba(234,227,219,0.9)" }}>{it}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-6" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
                    <div className="flex items-baseline gap-3 mb-1">
                      <div className="text-3xl font-bold" style={{ fontFamily: "Cormorant, serif", color: "var(--sand)" }}>45 000 ₽</div>
                      <div className="text-base line-through" style={{ color: "rgba(234,227,219,0.45)" }}>55 000 ₽</div>
                    </div>
                    <div className="flex items-center gap-1.5 mb-4">
                      <div className="w-2 h-2 rounded-full" style={{ background: "var(--gold)" }} />
                      <span className="text-xs font-medium" style={{ color: "rgba(234,227,219,0.7)" }}>Количество мест ограничено</span>
                    </div>
                    <button onClick={openModal} className="rounded-2xl py-3.5 w-full text-sm font-medium transition-all duration-300 hover:opacity-90" style={{ background: "var(--sand)", color: "var(--text)" }}>
                      Записаться
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="text-center text-sm mt-8" style={{ color: "rgba(78,75,73,0.55)" }}>
              Вопросы по оплате или нужна рассрочка?{" "}
              <button onClick={openModal} className="underline" style={{ color: "var(--sage)" }}>Напишите мне</button>
            </p>
          </Reveal>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 relative overflow-hidden" style={{ background: "rgba(201,217,232,0.18)" }}>
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <div className="deco-line mx-auto mb-6" />
              <h2 className="section-title text-5xl mb-4">Отзывы</h2>
              <p className="text-base" style={{ color: "rgba(78,75,73,0.6)" }}>Истории людей, которые уже прошли программу</p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Марина", weeks: "9 недель", text: "Я думала, что просто устала и надо отдохнуть. Но после работы с Екатериной поняла — я вообще не знала, чего хочу. Сейчас всё иначе." },
              { name: "Анна", weeks: "5 недель", text: "Впервые за долгое время сказала «нет» без чувства вины. Казалось бы мелочь — но это огромно. Спасибо за бережность." },
              { name: "Светлана", weeks: "9 недель", text: "Арт-терапия меня поначалу смущала, но именно через неё вышло многое, что я не могла даже назвать словами. Глубокая работа." },
            ].map((r, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="testimonial-card rounded-3xl p-7 h-full flex flex-col">
                  <div className="flex mb-4 gap-0.5">
                    {[...Array(5)].map((_, j) => <span key={j} style={{ color: "var(--gold)" }}>★</span>)}
                  </div>
                  <p className="text-sm leading-relaxed flex-1 mb-5 italic" style={{ color: "var(--text)" }}>«{r.text}»</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium" style={{ background: "var(--sage)", color: "var(--sand)" }}>{r.name[0]}</div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: "var(--text)" }}>{r.name}</div>
                      <div className="text-xs" style={{ color: "rgba(78,75,73,0.5)" }}>{r.weeks}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <div className="deco-line mx-auto mb-6" />
              <h2 className="section-title text-5xl mb-4">Частые вопросы</h2>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-3xl p-8" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(200,200,174,0.4)" }}>
              {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden" style={{ background: "rgba(152,160,111,0.08)" }}>
        <div className="absolute blob-1 opacity-22" style={{ width: "350px", height: "350px", background: "var(--sage-light)", top: "-80px", right: "-80px" }} />
        <div className="absolute blob-2 opacity-12" style={{ width: "250px", height: "250px", background: "var(--sky)", bottom: "-60px", left: "-40px" }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <Reveal>
            <div className="deco-line mx-auto mb-8" />
            <h2 className="section-title mb-6" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
              Возможно, вам не нужна ещё одна попытка «собраться»
            </h2>
            <p className="text-base leading-relaxed mb-4 mx-auto" style={{ color: "rgba(78,75,73,0.75)", maxWidth: "520px" }}>
              Эта программа — не про то, как стать «лучшей версией себя». Она про возвращение к себе настоящему(ей). Без спешки. Без давления. В контакте с собой.
            </p>
            <p className="text-base mb-10" style={{ color: "rgba(78,75,73,0.6)" }}>
              Если вы чувствуете, что больше не хотите жить только через «надо» — возможно, сейчас именно тот момент, чтобы начать.
            </p>
            <button onClick={openModal} className="btn-primary rounded-2xl px-10 py-4 text-base font-medium">Хочу участвовать</button>
          </Reveal>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contact" className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <Reveal>
              <div>
                <div className="deco-line mb-6" />
                <h2 className="section-title text-5xl mb-4">Написать Екатерине</h2>
                <p className="leading-relaxed mb-8" style={{ color: "rgba(78,75,73,0.65)" }}>
                  Оставьте вопрос или запрос на предварительную консультацию — без обязательств. Я отвечу лично.
                </p>
                <div className="flex flex-col gap-4">
                  <a href="https://t.me/" className="flex items-center gap-3 text-sm" style={{ color: "var(--text)" }}>
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "rgba(152,160,111,0.15)" }}>
                      <Icon name="Send" size={16} style={{ color: "var(--sage)" } as React.CSSProperties} />
                    </div>
                    Telegram
                  </a>
                  <a href="https://instagram.com/" className="flex items-center gap-3 text-sm" style={{ color: "var(--text)" }}>
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "rgba(152,160,111,0.15)" }}>
                      <Icon name="Instagram" size={16} style={{ color: "var(--sage)" } as React.CSSProperties} />
                    </div>
                    Instagram
                  </a>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="rounded-3xl p-8" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(200,200,174,0.4)" }}>
                <h3 className="section-title text-2xl mb-5">Задать вопрос</h3>
                <ContactInlineForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t" style={{ borderColor: "rgba(200,200,174,0.4)" }}>
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div style={{ fontFamily: "Cormorant, serif", fontSize: "1.2rem", color: "var(--text)", fontWeight: 500 }}>Екатерина</div>
          <p className="text-xs text-center" style={{ color: "rgba(78,75,73,0.45)" }}>Психолог · Арт-терапевт · Игропрактик · {new Date().getFullYear()}</p>
          <button onClick={openModal} className="text-xs underline" style={{ color: "var(--sage)" }}>Записаться на консультацию</button>
        </div>
      </footer>

      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}