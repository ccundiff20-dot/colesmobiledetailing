"use client";

import Image from "next/image";
import Lenis from "lenis";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useScroll } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

const PorscheExperience = dynamic(() => import("./porsche-experience").then(mod => mod.PorscheExperience), {
  ssr: false,
  loading: () => <section className="porsche-experience porsche-shell-loading" aria-label="Loading immersive vehicle experience"><div className="porsche-sticky"><div className="porsche-fallback" /><div className="porsche-vignette" /><div className="porsche-loading-copy"><span>IMMERSIVE FINISH STUDY</span><strong>Preparing the reveal.</strong></div></div></section>
});

const services = [
  { id: "01", name: "Signature Interior", kicker: "RESET THE CABIN", price: "From $199", image: "/images/enhanced/prosche.webp", copy: "Deep vacuuming, surface restoration, glass, leather and fabric care—finished with obsessive attention to touchpoints." },
  { id: "02", name: "Full Transformation", kicker: "INSIDE. OUTSIDE. REFINED.", price: "From $299", image: "/images/enhanced/zi6 corvette.webp", copy: "A complete interior and exterior reset with decontamination, gloss enhancement and four-month ceramic protection." },
  { id: "03", name: "Paint Correction", kicker: "RESTORE THE REFLECTION", price: "From $500", image: "/images/enhanced/black corvette.webp", copy: "Precision polishing engineered to reduce swirls, haze and defects while restoring depth, clarity and gloss." },
  { id: "04", name: "Ceramic Protection", kicker: "LOCK IN THE FINISH", price: "Custom quote", image: "/images/enhanced/ceramic caoted van.webp", copy: "Long-term hydrophobic protection with richer color, easier maintenance and a finish that stays visually alive." }
];


const films = [
  { src: "/videos/corvette-reveal.mp4", poster: "/video-posters/corvette-reveal.jpg", eyebrow: "PAINT DEPTH", title: "The finish comes alive.", copy: "A slow walkaround that lets the reflection speak for itself." },
  { src: "/videos/mercedes-finish.mp4", poster: "/video-posters/mercedes-finish.jpg", eyebrow: "FINAL REVEAL", title: "Clean lines. Clear gloss.", copy: "Premium exterior detailing presented through real client work." },
  { src: "/videos/rv-restoration.mp4", poster: "/video-posters/rv-restoration.jpg", eyebrow: "LARGE-FORMAT CARE", title: "From weathered to renewed.", copy: "A real RV transformation showing the value of patient restoration." }
];

const results = [
  { image: "/images/enhanced/black corvette.webp", label: "Mirror-finish Corvette" },
  { image: "/images/enhanced/blue mustang.webp", label: "Deep-gloss Mustang" },
  { image: "/images/enhanced/boat shine.webp", label: "Marine gloss restoration" },
  { image: "/images/enhanced/chrome rim.webp", label: "Precision wheel finish" }
];

function useSmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;
    const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    if (reduced || mobile || saveData) return;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);
}

function CursorGlow() {
  const x = useMotionValue(-200), y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 100, damping: 20 }), sy = useSpring(y, { stiffness: 100, damping: 20 });
  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX - 220); y.set(e.clientY - 220); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);
  return <motion.div className="cursor-glow" style={{ x: sx, y: sy }} aria-hidden="true" />;
}

function BeforeAfter() {
  const [position, setPosition] = useState(50);
  return <div className="before-after" style={{ "--split": `${position}%` } as React.CSSProperties}>
    <Image src="/images/enhanced/before and after.webp" alt="Vehicle interior before and after detailing" fill sizes="(max-width: 900px) 100vw, 70vw" className="ba-base" />
    <div className="ba-overlay"><Image src="/images/enhanced/before and after.webp" alt="Cleaned vehicle interior result" fill sizes="(max-width: 900px) 100vw, 70vw" /></div>
    <input aria-label="Compare before and after result" type="range" min="0" max="100" value={position} onChange={e => setPosition(Number(e.target.value))} />
    <div className="ba-line"><span aria-hidden="true" /></div>
    <span className="ba-label before">Before</span><span className="ba-label after">After</span>
  </div>;
}

export function LuxuryExperience() {
  useSmoothScroll();
  const [active, setActive] = useState(0);
  const [menu, setMenu] = useState(false);
  const [intro, setIntro] = useState(true);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const carY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const carScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.18]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const selected = services[active];
  const nav = useMemo(() => [
    { label: "Treatments", href: "#treatments", note: "Interior · Full Detail · Correction" },
    { label: "Ceramic", href: "#ceramic", note: "Hydrophobic gloss protection" },
    { label: "Results", href: "#results", note: "Real transformations" },
    { label: "Marine & RV", href: "#marine-and-rv", note: "Large-format mobile care" },
    { label: "Book", href: "#book", note: "Reserve your finish" }
  ], []);

  useEffect(() => {
    const seen = sessionStorage.getItem("cmd-intro-seen");
    const delay = seen ? 220 : 1050;
    const timer = window.setTimeout(() => { setIntro(false); sessionStorage.setItem("cmd-intro-seen", "1"); }, delay);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", closeOnEscape); };
  }, [menu]);

  return <main>
    <AnimatePresence>{intro && <motion.div className="site-intro" initial={{ opacity: 1 }} exit={{ opacity: 0, y: "-100%" }} transition={{ duration: .75, ease: [0.76,0,0.24,1] }}><div className="intro-mark"><Image src="/images/brand/coles-mobile-detailing-badge-small.webp" alt="Cole's Mobile Detailing" width={160} height={160} priority /><span>COLE&apos;S MOBILE DETAILING</span><i /></div></motion.div>}</AnimatePresence>
    <CursorGlow />
    <motion.div className="scroll-progress" style={{ scaleX: useScroll().scrollYProgress }} />
    <header className="nav-shell">
      <a className="brand" href="#top"><Image className="brand-badge" src="/images/brand/coles-mobile-detailing-badge-small.webp" alt="" width={42} height={42} /><span>COLE&apos;S</span><small>MOBILE DETAILING</small></a>
      <nav className="desktop-nav">{nav.slice(0,4).map(item => <a key={item.label} href={item.href}>{item.label}</a>)}</nav>
      <a className="book-pill" href="tel:+18126295544">Book a Detail</a>
      <button className="menu-button" aria-label="Toggle navigation" onClick={() => setMenu(!menu)}>{menu ? "Close" : "Menu"}</button>
    </header>
    <AnimatePresence>{menu && <motion.div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Site navigation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .35 }}>
      <motion.div className="menu-visual" initial={{ scale: 1.08, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.04, opacity: 0 }} transition={{ duration: .8, ease: [0.16,1,0.3,1] }}><Image src="/images/enhanced/black corvette.webp" alt="" fill sizes="100vw" priority /><div /></motion.div>
      <div className="mobile-menu-top"><div className="mobile-menu-brand"><Image src="/images/brand/coles-mobile-detailing-badge-small.webp" alt="Cole's Mobile Detailing logo" width={54} height={54} /><span>COLE&apos;S / MOBILE DETAILING</span></div><button onClick={() => setMenu(false)} aria-label="Close navigation"><i /><i /><span>Close</span></button></div>
      <div className="menu-layout"><div className="menu-intro"><span>PRIVATE MOBILE DETAILING</span><strong>Choose your<br/>next chapter.</strong><p>Premium vehicle care delivered throughout Newburgh, Evansville and Southern Indiana.</p></div>
      <nav>{nav.map((item,index) => <motion.a initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .12 + index*.07, duration:.6, ease:[.16,1,.3,1] }} onClick={() => setMenu(false)} key={item.label} href={item.href}><small>0{index+1}</small><span><b>{item.label}</b><em>{item.note}</em></span><i aria-hidden="true" /></motion.a>)}</nav></div>
      <div className="mobile-menu-footer"><div className="mobile-menu-actions"><a href="tel:+18126295544">Call now</a><a href="sms:+18126295544">Text to book</a></div><p>5.0 Google rating · 80+ reviews · By appointment</p></div>
    </motion.div>}</AnimatePresence>

    <section id="top" ref={heroRef} className="hero">
      <motion.div className="hero-car" style={{ y: carY, scale: carScale }}>
        <Image src="/images/enhanced/zi6 corvette.webp" alt="Black Corvette detailed by Cole's Mobile Detailing" fill priority sizes="100vw" />
      </motion.div>
      <div className="hero-shade" /><div className="hero-noise" /><div className="light-sweep" />
      <motion.div className="hero-copy" style={{ y: titleY }}>
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35 }}>Newburgh · Evansville · Southern Indiana</motion.p>
        <div className="hero-title" aria-label="Crafted not cleaned"><motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: .15, ease: [0.16,1,0.3,1] }}>CRAFTED.</motion.span><motion.span className="outline" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: .28, ease: [0.16,1,0.3,1] }}>NOT CLEANED.</motion.span></div>
        <motion.div className="hero-bottom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          <p>Luxury mobile detailing, paint correction and ceramic protection—engineered to reveal deeper gloss, sharper reflections and lasting protection.</p>
          <a href="tel:+18126295544">Book the finish</a>
        </motion.div>
      </motion.div>
      <div className="hero-index"><span>01</span><div /><span>05</span></div>
    </section>

    <PorscheExperience />

    <section className="statement">
      <p className="eyebrow">THE STANDARD</p>
      <motion.h2 initial={{ opacity: .2 }} whileInView={{ opacity: 1 }} viewport={{ amount: .45 }} transition={{ duration: 1.1 }}>Your vehicle isn&apos;t transportation. It&apos;s a surface, a silhouette, a reflection—and every detail deserves intention.</motion.h2>
      <div className="statement-meta"><span>5.0 Google rating</span><span>80+ customer reviews</span><span>Fully mobile service</span></div>
    </section>

    <section className="film-story" aria-labelledby="film-story-title">
      <div className="film-story-head">
        <p className="eyebrow">REAL WORK. CINEMATICALLY PRESENTED.</p>
        <h2 id="film-story-title">See the finish move.</h2>
        <p>These are real vehicles, real transformations and real results from Cole&apos;s Mobile Detailing.</p>
      </div>
      <div className="film-grid">
        {films.map((film, index) => <motion.article className={`film-card film-card-${index+1}`} key={film.src} initial={{ opacity: 0, y: 70 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .22 }} transition={{ duration: .8, delay: index*.08, ease: [0.16,1,0.3,1] }}>
          <div className="film-frame">
            <video muted loop playsInline preload="none" poster={film.poster} onMouseEnter={event => event.currentTarget.play()} onMouseLeave={event => { event.currentTarget.pause(); event.currentTarget.currentTime = 0; }} onFocus={event => event.currentTarget.play()} onBlur={event => event.currentTarget.pause()} aria-label={film.title}>
              <source src={film.src} type="video/mp4" />
            </video>
            <button type="button" className="film-play" onClick={event => { const video = event.currentTarget.parentElement?.querySelector("video"); if (!video) return; video.paused ? video.play() : video.pause(); }} aria-label={`Play or pause ${film.title}`}><span /></button>
            <div className="film-shade" />
          </div>
          <div className="film-copy"><span>{film.eyebrow}</span><h3>{film.title}</h3><p>{film.copy}</p></div>
        </motion.article>)}
      </div>
    </section>

    <section id="treatments" className="treatments">
      <div className="section-head"><p className="eyebrow">CURATED TREATMENTS</p><h2>Choose the finish.</h2></div>
      <div className="treatment-grid">
        <div className="treatment-list">{services.map((service, i) => <button onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} className={active === i ? "active" : ""} key={service.id}><span>{service.id}</span><strong>{service.name}</strong><em>{service.price}</em></button>)}</div>
        <div className="treatment-stage">
          <AnimatePresence mode="wait"><motion.div key={selected.id} className="stage-image" initial={{ opacity: 0, scale: 1.06, clipPath: "inset(0 0 100% 0)" }} animate={{ opacity: 1, scale: 1, clipPath: "inset(0 0 0% 0)" }} exit={{ opacity: 0 }} transition={{ duration: .75, ease: [0.16,1,0.3,1] }}><Image src={selected.image} alt={selected.name} fill sizes="(max-width: 900px) 100vw, 55vw" /></motion.div></AnimatePresence>
          <div className="stage-copy"><p>{selected.kicker}</p><h3>{selected.name}</h3><span>{selected.copy}</span></div>
          <div className="stage-orbit" aria-hidden="true"><span>PAINT</span><span>LIGHT</span><span>DEPTH</span></div>
        </div>
      </div>
    </section>

    <section id="ceramic" className="coating-story">
      <div className="coating-copy"><p className="eyebrow">CERAMIC PROTECTION</p><h2>Protection you can see.</h2><p>Hydrophobic performance. Richer color. Easier maintenance. A glass-like barrier engineered to preserve the finish beneath it.</p><a href="tel:+18126295544">Request a coating consultation</a></div>
      <div className="droplet-field" aria-hidden="true">{Array.from({ length: 24 }).map((_, i) => <motion.i key={i} style={{ left: `${(i*37)%96}%`, top: `${(i*53)%85}%` }} animate={{ y: [0, 10, 0], scale: [1, 1.12, 1] }} transition={{ duration: 2.6 + (i%5)*.35, repeat: Infinity, delay: i*.07 }} />)}</div>
      <div className="coating-image"><Image src="/images/enhanced/boat shine.webp" alt="Water beading on a protected glossy surface" fill sizes="100vw" /></div>
      <div className="coating-rings" aria-hidden="true"><span /><span /><span /></div>
    </section>

    <section id="results" className="results">
      <div className="section-head"><p className="eyebrow">SELECTED RESULTS</p><h2>Proof in every reflection.</h2></div>
      <div className="result-track">{results.map((item, i) => <motion.figure key={item.image} initial={{ y: 70, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: .25 }} transition={{ delay: i*.08, duration: .8 }}><div><Image src={item.image} alt={item.label} fill sizes="(max-width: 700px) 86vw, 42vw" /></div><figcaption><span>0{i+1}</span>{item.label}</figcaption></motion.figure>)}</div>
    </section>

    <section className="transformation">
      <div className="transformation-head"><p className="eyebrow">THE TRANSFORMATION</p><h2>Drag across the result.</h2></div><BeforeAfter />
    </section>

    <section id="marine-and-rv" className="marine">
      <div className="marine-image"><Image src="/images/enhanced/rv before and after.webp" alt="RV exterior before and after restoration" fill sizes="100vw" /></div>
      <div className="marine-copy"><p className="eyebrow">RV & MARINE</p><h2>Large surfaces. Same obsession.</h2><p>Specialized mobile care for fiberglass, gel coat, vinyl, rubber roofing and marine finishes throughout Southern Indiana.</p><div className="price-lines"><span>RV wash <b>$10–12/ft</b></span><span>Wash + wax <b>$15–20/ft</b></span><span>Oxidation removal <b>$25–35/ft</b></span></div></div>
    </section>

    <section id="about" className="trust">
      <div><p className="eyebrow">WHY COLE&apos;S</p><h2>One detailer.<br/>One standard.<br/>No shortcuts.</h2></div>
      <div className="trust-copy"><p>Every appointment is handled with premium products, safe processes and direct communication from Cole Cundiff. Your vehicle receives focused, owner-level care—not an assembly line.</p><ul><li>By appointment only</li><li>24-hour booking notice</li><li>Mobile service at your location</li><li>Newburgh, Evansville and surrounding areas</li></ul></div>
    </section>

    <section id="book" className="final-cta">
      <div className="final-car"><Image src="/images/enhanced/black corvette.webp" alt="Glossy black Corvette at sunset" fill sizes="100vw" /></div><div className="final-shade" />
      <p>THE FINISH YOU REMEMBER.</p><h2>Make every reflection count.</h2><div className="cta-actions"><a href="tel:+18126295544">Call 812-629-5544</a><a href="sms:+18126295544">Text to book</a></div>
    </section>

    <footer><a className="brand footer-brand" href="#top"><Image className="brand-badge" src="/images/brand/coles-mobile-detailing-badge.webp" alt="Cole's Mobile Detailing badge" width={76} height={76} /><span>COLE&apos;S</span><small>MOBILE DETAILING</small></a><div><a href="mailto:ccundiff20@gmail.com">ccundiff20@gmail.com</a><a href="tel:+18126295544">812-629-5544</a></div><div className="footer-legal"><p>© 2026 Cole&apos;s Mobile Detailing · Newburgh, Indiana</p><a href="https://sketchfab.com/3d-models/free-porsche-911-carrera-4s-d01b254483794de3819786d93e0e1ebf" target="_blank" rel="noreferrer">Porsche 911 3D model by Karol Miklas / Lionsharp Studios · CC BY-SA 4.0</a></div></footer>
  </main>;
}
