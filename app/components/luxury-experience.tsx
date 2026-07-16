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
  { src: "/media-v27/videos/porsche-finish.mp4", poster: "/media-v27/posters/porsche-finish.webp", eyebrow: "LUXURY FINISH", title: "Paint that reads like glass.", copy: "A real Porsche finish study captured after careful polishing and refinement." },
  { src: "/media-v27/videos/camaro-reflection.mp4", poster: "/media-v27/posters/camaro-reflection.webp", eyebrow: "CLASSIC DEPTH", title: "Black paint, sharpened.", copy: "A classic Camaro with deeper reflections and cleaner visual depth." },
  { src: "/media-v27/videos/yellow-corvette-walkaround.mp4", poster: "/media-v27/posters/yellow-corvette-walkaround.webp", eyebrow: "CLASSIC PRESERVATION", title: "A shape worth protecting.", copy: "A full walkaround of a C3 Corvette after exterior refinement." },
  { src: "/media-v27/videos/boat-finish.mp4", poster: "/media-v27/posters/boat-finish.webp", eyebrow: "MARINE CARE", title: "Gloss beyond the driveway.", copy: "Large-format mobile detailing for boats and marine finishes." }
];

const featuredDetails = [
  { image: "/media-v27/images/porsche-rear.webp", vehicle: "Lotus Elise", service: "Exterior refinement + protection", note: "Lightweight sports-car bodywork presented with crisp reflections and a clean, uniform finish." },
  { image: "/media-v27/images/foam-supercar-side.webp", vehicle: "Lotus Elise", service: "Safe wash + foam preparation", note: "A careful first stage that loosens contamination without compromising the finish." },
  { image: "/media-v27/images/black-camaro.webp", vehicle: "Classic Camaro", service: "Paint enhancement", note: "Deep black paint refined for richer depth and crisp outdoor reflections." },
  { image: "/media-v27/images/tesla-exterior.webp", vehicle: "Tesla Model Y", service: "Premium full detail", note: "Modern daily-driver care with a cleaner, sharper, more uniform finish." }
];

const reviews = [
  { name: "Luke Cassel", detail: "Interior + Exterior Detail", text: "Cole is punctual, professional, talented, and quick. The car looks showroom ready." },
  { name: "Jack Melotte", detail: "Porsche Detail", text: "Cole did an excellent job on my Porsche. Very professional, on time, and the result was amazing." },
  { name: "Joe Vollman", detail: "Truck Detail", text: "Cole went above and beyond to ensure my truck was thoroughly cleaned. I will definitely be a repeat customer." },
  { name: "Christy Bailey", detail: "Mobile Detail", text: "My car feels like a new car. It was great being able to stay at work while Cole detailed it outside." },
  { name: "Mike Cates", detail: "Van Detail", text: "Cole made my van look brand new, like I had just bought it off the dealership lot." },
  { name: "Peyton Robinson", detail: "Pet Hair Removal", text: "Cole did an amazing job removing all the dog hair. I will definitely use him again." }
];

const processSteps = [
  { number: "01", title: "Inspect", text: "We assess the vehicle, its condition, and the finish you want before recommending the right service." },
  { number: "02", title: "Restore", text: "Interior surfaces and exterior paint are carefully cleaned, decontaminated, and refined using safe processes." },
  { number: "03", title: "Protect", text: "Sealant or ceramic protection is applied to preserve gloss and make future maintenance easier." },
  { number: "04", title: "Deliver", text: "A final inspection confirms the details are finished before your vehicle is returned." }
];

const faqs = [
  { q: "How far do you travel?", a: "Most appointments are within roughly 30 miles of Boonville. Travel outside the normal service area may include an additional fee." },
  { q: "How much notice is required?", a: "Appointments require at least 24 hours of notice and are not guaranteed until confirmed." },
  { q: "Do prices change based on condition?", a: "Yes. Final pricing may change for excessive dirt, staining, pet hair, mold, oxidation, or other conditions that require additional time." },
  { q: "Do you work on luxury, classic, and performance vehicles?", a: "Yes. Cole has worked on Porsche, Corvette, Tesla, Lexus, classic muscle cars, performance vehicles, daily drivers, trucks, RVs, and boats." },
  { q: "What ceramic coating options are available?", a: "One-year ceramic protection starts at $399, and seven-year ceramic coating packages start at $799. Paint preparation or correction may affect the final quote." }
];

const results = [
  { image: "/media-v27/images/mercedes-front.webp", label: "Mercedes gloss restoration" },
  { image: "/media-v27/images/porsche-wheel.webp", label: "Lotus Elise wheel and paint finish" },
  { image: "/media-v27/images/grand-prix.webp", label: "Classic Grand Prix presentation" },
  { image: "/media-v27/images/charger.webp", label: "Performance sedan finish" }
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


function ViewportVideo({ src, poster, label, className = "" }: { src: string; poster: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [attached, setAttached] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const mobile = window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;

    const nearObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setAttached(true);
    }, { rootMargin: mobile ? "180px 0px" : "420px 0px", threshold: 0.01 });

    const playObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.58) {
        window.dispatchEvent(new CustomEvent("cmd-video-active", { detail: src }));
        video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    }, { threshold: [0, .35, .58, .85], rootMargin: "-6% 0px -6% 0px" });

    const stopOther = (event: Event) => {
      const activeSrc = (event as CustomEvent<string>).detail;
      if (activeSrc !== src) {
        video.pause();
        if (mobile && video.currentTime > 0) {
          video.removeAttribute("src");
          video.load();
          setAttached(false);
        }
      }
    };

    nearObserver.observe(video);
    playObserver.observe(video);
    window.addEventListener("cmd-video-active", stopOther);
    return () => {
      nearObserver.disconnect();
      playObserver.disconnect();
      window.removeEventListener("cmd-video-active", stopOther);
      video.pause();
    };
  }, [src]);

  return <video ref={ref} className={className} muted loop playsInline preload="none" poster={poster} aria-label={label} src={attached ? src : undefined} />;
}

function DeferredPorscheExperience() {
  const shellRef = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);
  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const activate = () => setMount(true);
      if ("requestIdleCallback" in window) {
        (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(activate, { timeout: 1400 });
      } else globalThis.setTimeout(activate, 700);
      observer.disconnect();
    }, { rootMargin: "120px 0px", threshold: 0.01 });
    observer.observe(shell);
    return () => observer.disconnect();
  }, []);
  return <div ref={shellRef}>{mount ? <PorscheExperience /> : <section className="porsche-experience porsche-shell-loading" aria-label="Immersive vehicle experience"><div className="porsche-sticky"><div className="porsche-fallback" /><div className="porsche-vignette" /><div className="porsche-loading-copy"><span>IMMERSIVE FINISH STUDY</span><strong>Scroll to begin the reveal.</strong></div></div></section>}</div>;
}

function LancerTransformation() {
  return <section className="lancer-story" aria-labelledby="lancer-title">
    <div className="lancer-head"><p className="eyebrow">TWO-ANGLE REVEAL</p><h2 id="lancer-title">The same Mitsubishi Lancer, captured from both sides.</h2><p>These are two separate original clips—not a duplicated or reversed video. Together they show the completed finish from complementary angles.</p></div>
    <div className="lancer-films">
      <article><span>DRIVER SIDE</span><ViewportVideo src="/media-v27/videos/lancer-before.mp4" poster="/media-v27/posters/lancer-before.webp" label="Mitsubishi Lancer driver-side finish reveal" /></article>
      <article><span>PASSENGER SIDE</span><ViewportVideo src="/media-v27/videos/lancer-after.mp4" poster="/media-v27/posters/lancer-after.webp" label="Mitsubishi Lancer passenger-side finish reveal" /></article>
    </div>
  </section>;
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
  const [booking, setBooking] = useState({ vehicle: "Sedan", service: "Full Detail", date: "", name: "", phone: "" });
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const carY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const carScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.18]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const selected = services[active];
  const nav = useMemo(() => [
    { label: "Services", href: "/services", note: "Interior · Full Detail · Exterior" },
    { label: "Ceramic", href: "/ceramic-coatings", note: "1-year and 7-year protection" },
    { label: "Correction", href: "/paint-correction", note: "Restore clarity and depth" },
    { label: "Gallery", href: "/gallery", note: "Real photos and films" },
    { label: "RV + Marine", href: "/rv-marine", note: "Large-format mobile care" },
    { label: "Fleet", href: "/fleet", note: "Reliable recurring service" },
    { label: "About", href: "/about", note: "Owner-operated in Southern Indiana" },
    { label: "Book", href: "/book", note: "Request your appointment" }
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
      <motion.div className="menu-visual" initial={{ scale: 1.08, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.04, opacity: 0 }} transition={{ duration: .8, ease: [0.16,1,0.3,1] }}><Image src="/media-v27/images/porsche-rear.webp" alt="" fill sizes="100vw" priority /><div /></motion.div>
      <div className="mobile-menu-top"><div className="mobile-menu-brand"><Image src="/images/brand/coles-mobile-detailing-badge-small.webp" alt="Cole's Mobile Detailing logo" width={54} height={54} /><span>COLE&apos;S / MOBILE DETAILING</span></div><button onClick={() => setMenu(false)} aria-label="Close navigation"><i /><i /><span>Close</span></button></div>
      <div className="menu-layout"><div className="menu-intro"><span>PRIVATE MOBILE DETAILING</span><strong>Choose your<br/>next chapter.</strong><p>Premium vehicle care delivered throughout Newburgh, Evansville and Southern Indiana.</p></div>
      <nav>{nav.map((item,index) => <motion.a initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .12 + index*.07, duration:.6, ease:[.16,1,.3,1] }} onClick={() => setMenu(false)} key={item.label} href={item.href}><small>0{index+1}</small><span><b>{item.label}</b><em>{item.note}</em></span><i aria-hidden="true" /></motion.a>)}</nav></div>
      <div className="mobile-menu-footer"><div className="mobile-menu-actions"><a href="tel:+18126295544">Call now</a><a href="sms:+18126295544">Text to book</a></div><p>5.0 Google rating · 80+ reviews · By appointment</p></div>
    </motion.div>}</AnimatePresence>

    <section id="top" ref={heroRef} className="hero">
      <motion.div className="hero-car" style={{ y: carY, scale: carScale }}>
        <Image src="/media-v27/images/porsche-rear.webp" alt="Porsche detailed by Cole's Mobile Detailing" fill priority sizes="100vw" />
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

    <DeferredPorscheExperience />

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
            <ViewportVideo src={film.src} poster={film.poster} label={film.title} />
            <button type="button" className="film-play" onClick={event => { const video = event.currentTarget.parentElement?.querySelector("video"); if (!video) return; video.paused ? video.play() : video.pause(); }} aria-label={`Play or pause ${film.title}`}><span /></button>
            <div className="film-shade" />
          </div>
          <div className="film-copy"><span>{film.eyebrow}</span><h3>{film.title}</h3><p>{film.copy}</p></div>
        </motion.article>)}
      </div>
    </section>

    <LancerTransformation />

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
      <div className="coating-image"><Image src="/media-v27/images/foam-supercar-front.webp" alt="Performance car covered in foam during safe preparation" fill sizes="100vw" /></div>
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
      <div className="marine-image"><Image src="/images/boat shine.jpg" alt="Detailed boat finish with visible water beading" fill sizes="100vw" /></div>
      <div className="marine-copy"><p className="eyebrow">RV & MARINE</p><h2>Large surfaces. Same obsession.</h2><p>Specialized mobile care for fiberglass, gel coat, vinyl, rubber roofing and marine finishes throughout Southern Indiana.</p><div className="price-lines"><span>RV wash <b>$10–12/ft</b></span><span>Wash + wax <b>$15–20/ft</b></span><span>Oxidation removal <b>$25–35/ft</b></span></div></div>
    </section>

    <section className="featured-details" aria-labelledby="featured-title">
      <div className="featured-heading"><p className="eyebrow">FEATURED DETAILS</p><h2 id="featured-title">Every vehicle tells a different story.</h2><p>Classics, performance cars, luxury SUVs and daily drivers—each one receives a process tailored to the finish in front of us.</p></div>
      <div className="featured-grid">{featuredDetails.map((item,index)=><motion.article key={item.image} initial={{opacity:0,y:60}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:.75,delay:index*.08}}><div className="featured-image"><Image src={item.image} alt={`${item.vehicle} detailed by Cole's Mobile Detailing`} fill sizes="(max-width:900px) 100vw, 50vw" /></div><div className="featured-copy"><span>0{index+1}</span><div><p>{item.service}</p><h3>{item.vehicle}</h3><small>{item.note}</small></div></div></motion.article>)}</div>
    <a className="editorial-link" href="/gallery">Explore the full vehicle gallery</a></section>

    <section className="coating-packages">
      <div className="package-heading"><p className="eyebrow">CERAMIC COATING OPTIONS</p><h2>Choose how long you want the finish protected.</h2></div>
      <div className="package-grid">
        <article><span>01</span><p>ENTRY PROTECTION</p><h3>1-Year Coating</h3><strong>Starting at $399</strong><ul><li>Hydrophobic finish</li><li>Enhanced gloss</li><li>UV and environmental protection</li><li>Easier maintenance washing</li></ul><a href="#book">Request this package</a></article>
        <article className="featured-package"><span>02</span><p>LONG-TERM PROTECTION</p><h3>7-Year Coating</h3><strong>Starting at $799</strong><ul><li>Professional-grade coating</li><li>Maximum gloss and slickness</li><li>Improved chemical resistance</li><li>Long-term paint preservation</li></ul><a href="#book">Request this package</a></article>
      </div>
    </section>

    <section className="proof-section">
      <div className="proof-stats"><div><strong>80+</strong><span>Five-star reviews</span></div><div><strong>4+</strong><span>Years in business</span></div><div><strong>100%</strong><span>Mobile service</span></div></div>
      <div className="review-grid">{reviews.map((review,index)=><article key={index}><div>★★★★★</div><p>“{review.text}”</p><span>{review.name}</span><small>{review.detail}</small></article>)}</div>
    </section>

    <section className="process-section" aria-labelledby="process-title">
      <div className="process-heading"><p className="eyebrow">THE PROCESS</p><h2 id="process-title">Built on pride. Finished without shortcuts.</h2><p>Every appointment follows a deliberate process designed around the vehicle in front of us.</p></div>
      <div className="process-grid">{processSteps.map((step,index)=><motion.article key={step.number} initial={{opacity:0,y:34}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.35}} transition={{duration:.65,delay:index*.08}}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></motion.article>)}</div>
    </section>

    <section className="about-story" aria-labelledby="about-story-title">
      <div className="about-story-image"><Image src="/media-v27/images/black-camaro.webp" alt="Black classic Camaro detailed by Cole's Mobile Detailing" fill sizes="(max-width:900px) 100vw, 48vw" /></div>
      <div className="about-story-copy"><p className="eyebrow">THE STORY</p><h2 id="about-story-title">Started in high school. Built to become something more.</h2><p>Cole started detailing while he was still in high school because he wanted to earn more, work for himself, and build a business he could be proud of.</p><p>Today, he studies business while operating Cole&apos;s Mobile Detailing and Digital Forge. That same entrepreneurial mindset shows up in every appointment: direct communication, careful work, and a standard that never depends on whether the vehicle is a daily driver or an exotic.</p><div className="about-story-meta"><span>Owner-operated</span><span>Business student</span><span>Serving Southern Indiana</span></div></div>
    </section>

    <section className="faq-section" aria-labelledby="faq-title">
      <div className="faq-heading"><p className="eyebrow">BEFORE YOU BOOK</p><h2 id="faq-title">Questions, answered clearly.</h2></div>
      <div className="faq-list">{faqs.map((item,index)=><details key={item.q}><summary><span>0{index+1}</span>{item.q}<i aria-hidden="true" /></summary><p>{item.a}</p></details>)}</div>
    </section>

    <section id="booking-builder" className="booking-builder">
      <div className="booking-intro"><p className="eyebrow">REQUEST AN APPOINTMENT</p><h2>Build your detail request.</h2><p>Tell us the basics and we’ll prepare the right service recommendation before confirming your appointment.</p></div>
      <form onSubmit={(e)=>{e.preventDefault(); const message=`Hi Cole, I would like to request a ${booking.service} for my ${booking.vehicle}. Preferred date: ${booking.date || "Flexible"}. Name: ${booking.name}. Phone: ${booking.phone}.`; window.location.href=`sms:+18126295544?body=${encodeURIComponent(message)}`;}}>
        <label><span>Vehicle type</span><select value={booking.vehicle} onChange={e=>setBooking({...booking,vehicle:e.target.value})}><option>Sedan</option><option>Coupe / Sports Car</option><option>Small SUV</option><option>3-Row SUV / Van</option><option>Truck</option><option>RV</option><option>Boat</option></select></label>
        <label><span>Service</span><select value={booking.service} onChange={e=>setBooking({...booking,service:e.target.value})}><option>Interior Detail</option><option>Full Detail</option><option>Exterior Detail</option><option>Paint Correction</option><option>1-Year Ceramic Coating</option><option>7-Year Ceramic Coating</option><option>RV / Marine Detail</option></select></label>
        <label><span>Preferred date</span><input type="date" value={booking.date} onChange={e=>setBooking({...booking,date:e.target.value})}/></label>
        <label><span>Your name</span><input required value={booking.name} onChange={e=>setBooking({...booking,name:e.target.value})} placeholder="Full name"/></label>
        <label><span>Phone number</span><input required value={booking.phone} onChange={e=>setBooking({...booking,phone:e.target.value})} placeholder="812-000-0000"/></label>
        <button type="submit">Text my detail request</button>
      </form>
    </section>

    <section id="about" className="trust">
      <div><p className="eyebrow">WHY COLE&apos;S</p><h2>One detailer.<br/>One standard.<br/>No shortcuts.</h2></div>
      <div className="trust-copy"><p>Every appointment is handled with premium products, safe processes and direct communication from Cole Cundiff. Your vehicle receives focused, owner-level care—not an assembly line.</p><ul><li>By appointment only</li><li>24-hour booking notice</li><li>Mobile service at your location</li><li>Newburgh, Evansville and surrounding areas</li></ul></div>
    </section>

    <section id="book" className="final-cta">
      <div className="final-car"><Image src="/media-v27/images/porsche-rear.webp" alt="Glossy Lotus Elise after detailing" fill sizes="100vw" /></div><div className="final-shade" />
      <p>THE FINISH YOU REMEMBER.</p><h2>Make every reflection count.</h2><div className="cta-actions"><a href="tel:+18126295544">Call 812-629-5544</a><a href="sms:+18126295544">Text to book</a></div>
    </section>

    <footer><a className="brand footer-brand" href="#top"><Image className="brand-badge" src="/images/brand/coles-mobile-detailing-badge.webp" alt="Cole's Mobile Detailing badge" width={76} height={76} /><span>COLE&apos;S</span><small>MOBILE DETAILING</small></a><div><a href="/services">Services</a><a href="/ceramic-coatings">Ceramic coatings</a><a href="/paint-correction">Paint correction</a><a href="/rv-marine">RV & Marine</a><a href="/fleet">Fleet</a><a href="/gallery">Gallery</a><a href="/about">About</a><a href="/book">Book</a><a href="mailto:ccundiff20@gmail.com">ccundiff20@gmail.com</a><a href="tel:+18126295544">812-629-5544</a></div><div className="footer-legal"><p>© 2026 Cole&apos;s Mobile Detailing · Newburgh, Indiana</p><a href="https://sketchfab.com/3d-models/free-porsche-911-carrera-4s-d01b254483794de3819786d93e0e1ebf" target="_blank" rel="noreferrer">Porsche 911 3D model by Karol Miklas / Lionsharp Studios · CC BY-SA 4.0</a></div></footer>
  </main>;
}
