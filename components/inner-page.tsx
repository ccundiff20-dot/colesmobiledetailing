import Image from "next/image";
import Link from "next/link";

export function InnerNav() {
  return (
    <header className="inner-nav">
      <Link href="/" className="inner-brand">COLE&apos;S <span>MOBILE DETAILING</span></Link>
      <nav>
        <Link href="/services">Services</Link>
        <Link href="/ceramic-coatings">Ceramic</Link>
        <Link href="/paint-correction">Correction</Link>
        <Link href="/gallery">Gallery</Link>
        <Link href="/about">About</Link>
        <Link href="/book">Book</Link>
      </nav>
    </header>
  );
}

export function InnerFooter() {
  return (
    <footer className="inner-footer">
      <div>
        <strong>COLE&apos;S MOBILE DETAILING</strong>
        <p>Owner-operated mobile detailing across Southern Indiana.</p>
        <small>© 2026 Cole&apos;s Mobile Detailing</small>
      </div>
      <div>
        <Link href="/services">Services</Link>
        <Link href="/rv-marine">RV &amp; Marine</Link>
        <Link href="/fleet">Fleet</Link>
        <a href="tel:+18126295544">812-629-5544</a>
        <a href="mailto:ccundiff20@gmail.com">ccundiff20@gmail.com</a>
        <a href="https://digitalforgeweb.com" target="_blank" rel="noreferrer">Website by Digital Forge</a>
      </div>
      <div className="inner-footer-legal">
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms &amp; Conditions</Link>
        <Link href="/ai-disclosure">AI Disclosure</Link>
        <Link href="/sms-alerts">SMS Alerts &amp; Consent</Link>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, copy, image }: { eyebrow:string; title:string; copy:string; image:string }) {
  return <section className="page-hero"><Image src={image} alt="" fill priority sizes="100vw" /><div className="page-hero-shade"/><div className="page-hero-copy"><p>{eyebrow}</p><h1>{title}</h1><span>{copy}</span></div></section>;
}
