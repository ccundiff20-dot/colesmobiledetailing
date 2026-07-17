"use client";

import Image from "next/image";
import Lenis from "lenis";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

const services = [
  { id: "01", name: "Signature Interior", price: "From $199", image: "/images/enhanced/interior detail.webp", copy: "A complete cabin reset with deep cleaning, fabric and leather care, glass, and careful attention to every touchpoint." },
  { id: "02", name: "Full Transformation", price: "From $299", image: "/images/enhanced/zi6 corvette.webp", copy: "Interior and exterior refinement, decontamination, gloss enhancement, and lasting protection in one complete service." },
  { id: "03", name: "Paint Correction", price: "From $500", image: "/images/enhanced/black corvette.webp", copy: "Precision polishing that reduces swirls, haze, and defects while restoring depth, clarity, and reflection." },
  { id: "04", name: "Ceramic Protection", price: "From $399", image: "/media-v27/images/foam-supercar-front.webp", copy: "Hydrophobic protection, richer color, easier maintenance, and a finish designed to stay visually alive." },
];

const reviews = [
  { name: "Jack Melotte", vehicle: "Porsche Detail", text: "Cole did an excellent job on my Porsche. Very professional, on time, and the result was amazing." },
  { name: "Luke Cassel", vehicle: "Interior + Exterior", text: "Cole is punctual, professional, talented, and quick. The car looks showroom ready." },
  { name: "Joe Vollman", vehicle: "Truck Detail", text: "Cole went above and beyond to ensure my truck was thoroughly cleaned. I will definitely be a repeat customer." },
];

function useSmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);
}

function CursorGlow() {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 85, damping: 22 });
  const sy = useSpring(y, { stiffness: 85, damping: 22 });
  useEffect(() => {
    const move = (event: MouseEvent) => { x.set(event.clientX - 240); y.set(event.clientY - 240); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);
  return <motion.div className="cursor-glow" style={{ x: sx, y: sy }} aria-hidden="true" />;
}


function CinematicVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setReady(true);
        observer.disconnect();
      }
    }, { rootMargin: "240px" });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !ready) return;
    const play = () => video.play().catch(() => undefined);
    play();
  }, [ready]);

  return <video
    ref={videoRef}
    className="v4-cinematic-video"
    poster={poster}
    muted
    loop
    playsInline
    preload="none"
    aria-label={label}
  >
    {ready && <source src={src} type="video/mp4" />}
  </video>;
}

export function LuxuryExperience() {
  useSmoothScroll();
  const [active, setActive] = useState(0);
  const [menu, setMenu] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.13]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -85]);
  const selected = services[active];
  const nav = useMemo(() => [
    ["Services", "/services"], ["Ceramic", "/ceramic-coatings"], ["Gallery", "/gallery"], ["About", "/about"], ["Book", "/book"],
  ], []);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu]);

  return <main className="v4-home">
    <CursorGlow />
    <motion.div className="scroll-progress" style={{ scaleX: useScroll().scrollYProgress }} />

    <header className="nav-shell v4-nav">
      <a className="brand" href="#top"><Image className="brand-badge" src="/images/brand/coles-mobile-detailing-badge-small.webp" alt="" width={42} height={42} /><span>COLE&apos;S</span><small>MOBILE DETAILING</small></a>
      <nav className="desktop-nav">{nav.slice(0, 4).map(([label, href]) => <a key={label} href={href}>{label}</a>)}</nav>
      <a className="book-pill" href="sms:+18126295544">Book a Detail</a>
      <button className="menu-button" onClick={() => setMenu(true)} aria-label="Open navigation">Menu</button>
    </header>

    <AnimatePresence>{menu && <motion.div className="v4-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="v4-menu-image"><Image src="/media-v27/images/porsche-rear.webp" alt="" fill sizes="100vw" /></div>
      <button onClick={() => setMenu(false)}>Close</button>
      <nav>{nav.map(([label, href], i) => <motion.a key={label} href={href} onClick={() => setMenu(false)} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 * i }}><small>0{i + 1}</small>{label}</motion.a>)}</nav>
    </motion.div>}</AnimatePresence>

    <section id="top" ref={heroRef} className="v4-hero">
      <motion.div className="v4-hero-media" style={{ y: imageY, scale: imageScale }}><Image src="/media-v27/images/porsche-rear.webp" alt="Porsche with a high-gloss detailed finish" fill priority sizes="100vw" /></motion.div>
      <div className="v4-hero-overlay" /><div className="v4-hero-grid" /><div className="v4-scan" />
      <motion.div className="v4-hero-copy" style={{ y: copyY }}>
        <div className="v4-hero-kicker"><motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }}>NEWBURGH · EVANSVILLE · SOUTHERN INDIANA</motion.p><span>EST. 2022</span></div>
        <div className="v4-display" aria-label="Crafted, not cleaned">
          <div className="v4-line"><motion.span initial={{ y: "115%" }} animate={{ y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>CRAFTED.</motion.span></div>
          <div className="v4-line second"><motion.span className="stroke" initial={{ y: "115%" }} animate={{ y: 0 }} transition={{ duration: 1, delay: .14, ease: [0.16, 1, 0.3, 1] }}>NOT CLEANED.</motion.span></div>
        </div>
        <motion.div className="v4-hero-bottom" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .82 }}>
          <div className="v4-hero-summary"><span>01</span><p>Premium mobile detailing, paint correction, and ceramic protection—built around deeper gloss, sharper reflections, and lasting protection.</p></div>
          <div className="v4-hero-actions"><a href="sms:+18126295544">Book your detail</a><a href="/gallery">Explore the work <span>↗</span></a></div>
        </motion.div>
      </motion.div>
      <div className="v4-hero-proof"><span>5.0</span><div><b>★★★★★</b><small>80+ GOOGLE REVIEWS</small></div></div>
      <div className="v4-scroll-cue"><span>SCROLL TO DISCOVER</span><i /></div>
    </section>

    <section className="v4-cinema v4-cinema-portrait v4-cinema-night" aria-label="Cinematic automotive presentation">
      <div className="v4-cinema-copy">
        <p className="eyebrow">THE NIGHT SHIFT</p>
        <h2>Nightfall gloss.<br/>Built to be noticed.</h2>
        <p>A cinematic finish is not only about shine. It is about depth, clean reflections, protected surfaces, and a vehicle that looks intentional from every angle.</p>
        <div className="v4-cinema-facts" aria-label="Service highlights">
          <span><b>01</b> Mobile convenience</span>
          <span><b>02</b> Owner-operated care</span>
          <span><b>03</b> Protection-first process</span>
        </div>
        <a href="/book">Reserve your appointment <span>↗</span></a>
      </div>
      <div className="v4-cinema-media">
        <video className="v4-cinema-backdrop" aria-hidden="true" muted loop autoPlay playsInline preload="metadata" poster="/media/cinematic/corvette-night-v1-poster.webp">
          <source src="/media/cinematic/corvette-night-v1.mp4?v=47" type="video/mp4" />
        </video>
        <div className="v4-cinema-portrait-shell">
          <CinematicVideo src="/media/cinematic/corvette-night-v1.mp4?v=47" poster="/media/cinematic/corvette-night-v1-poster.webp" label="White Corvette arriving through fog at night" />
          <div className="v4-cinema-frame" aria-hidden="true"><span>NIGHT / 01</span><i /></div>
          <div className="v4-cinema-badge" aria-hidden="true"><span>30 FPS</span><strong>CINEMATIC</strong></div>
        </div>
      </div>
      <div className="v4-cinema-shade" />
    </section>

    <section className="v4-benefits" aria-label="Benefits of mobile detailing">
      <div className="v4-benefits-head">
        <p className="eyebrow">WHY MOBILE DETAILING</p>
        <h2>Premium results without losing your day.</h2>
      </div>
      <div className="v4-benefit-grid">
        <article><span>01</span><h3>We come to you</h3><p>Home or workplace service across Newburgh, Evansville, and surrounding Southern Indiana.</p></article>
        <article><span>02</span><h3>Owner-operated</h3><p>Your vehicle is handled directly by Cole—not passed through a rushed production line.</p></article>
        <article><span>03</span><h3>Results that last</h3><p>Professional products and a protection-first process designed for deeper gloss, easier upkeep, and longer-lasting results.</p></article>
      </div>
      <a href="/book">See availability <span>↗</span></a>
    </section>

    <section className="v4-feature" aria-labelledby="feature-title">
      <div className="v4-feature-media"><Image src="/media-v27/images/black-camaro.webp" alt="Black Camaro after paint refinement" fill sizes="(max-width: 900px) 100vw, 58vw" /></div>
      <div className="v4-feature-copy"><p className="eyebrow">FEATURED TRANSFORMATION</p><span className="v4-project-number">01 / 03</span><h2 id="feature-title">Black paint.<br/>Reintroduced.</h2><p>A measured wash, decontamination, and machine polish rebuilt the visual depth of this classic Camaro. The finish now reads darker, sharper, and more deliberate from every angle.</p><div className="v4-feature-meta"><span><b>Vehicle</b>Classic Camaro</span><span><b>Treatment</b>Paint enhancement</span><span><b>Result</b>Deeper gloss</span></div><a href="/gallery">Explore the full gallery</a></div>
    </section>

    <section className="v4-services" id="services">
      <div className="v4-section-head"><p className="eyebrow">CURATED TREATMENTS</p><h2>Choose your finish.</h2><p>Four focused services. One uncompromising standard.</p></div>
      <div className="v4-service-layout">
        <div className="v4-service-list">{services.map((service, index) => <button key={service.id} className={active === index ? "active" : ""} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}><span>{service.id}</span><strong>{service.name}</strong><em>{service.price}</em></button>)}</div>
        <div className="v4-service-stage"><AnimatePresence mode="wait"><motion.div key={selected.id} className="v4-service-image" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .55 }}><Image src={selected.image} alt={selected.name} fill sizes="(max-width: 900px) 100vw, 48vw" /></motion.div></AnimatePresence><div className="v4-service-copy"><span>{selected.id}</span><h3>{selected.name}</h3><p>{selected.copy}</p><a href="/services">View service details</a></div></div>
      </div>
    </section>

    <section className="v4-gallery-preview">
      <div className="v4-section-head"><p className="eyebrow">SELECTED WORK</p><h2>Proof in every reflection.</h2></div>
      <div className="v4-gallery-grid">
        <figure className="wide"><Image src="/media-v27/images/porsche-rear.webp" alt="Glossy sports car finish" fill sizes="(max-width: 900px) 100vw, 65vw" /><figcaption><span>01</span>Performance finish study</figcaption></figure>
        <figure><Image src="/media-v27/images/tesla-interior.webp" alt="Detailed Tesla interior" fill sizes="(max-width: 900px) 100vw, 35vw" /><figcaption><span>02</span>Interior precision</figcaption></figure>
        <figure><Image src="/media-v27/images/porsche-wheel.webp" alt="Detailed performance wheel and bodywork" fill sizes="(max-width: 900px) 100vw, 35vw" /><figcaption><span>03</span>Exterior precision</figcaption></figure>
      </div>
      <a className="v4-gallery-link" href="/gallery">View all projects <span>↗</span></a>
    </section>

    <section className="v4-reviews">
      <div className="v4-review-intro"><p className="eyebrow">CLIENT WORDS</p><h2>Trusted with the cars people care about.</h2><div className="v4-rating"><strong>5.0</strong><span>★★★★★<small>80+ GOOGLE REVIEWS</small></span></div></div>
      <div className="v4-review-list">{reviews.map((review, index) => <motion.article key={review.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .35 }} transition={{ delay: index * .08 }}><span>0{index + 1}</span><blockquote>“{review.text}”</blockquote><div><b>{review.name}</b><small>{review.vehicle}</small></div></motion.article>)}</div>
    </section>

    <section className="v4-final">
      <div className="v4-final-media"><Image src="/media-v27/images/porsche-wheel.webp" alt="Detailed performance car wheel and bodywork" fill sizes="100vw" /></div><div className="v4-final-overlay" />
      <div className="v4-final-copy"><p>YOUR VEHICLE. ELEVATED.</p><h2>Make every reflection count.</h2><div><a href="sms:+18126295544">Text to book</a><a href="tel:+18126295544">Call 812-629-5544</a></div></div>
    </section>

    <footer className="v4-footer"><a className="brand footer-brand" href="#top"><Image className="brand-badge" src="/images/brand/coles-mobile-detailing-badge.webp" alt="Cole's Mobile Detailing badge" width={76} height={76} /><span>COLE&apos;S</span><small>MOBILE DETAILING</small></a><nav>{nav.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</nav><div><a href="mailto:ccundiff20@gmail.com">ccundiff20@gmail.com</a><a href="tel:+18126295544">812-629-5544</a><p>© 2026 Cole&apos;s Mobile Detailing</p></div></footer>
  </main>;
}
