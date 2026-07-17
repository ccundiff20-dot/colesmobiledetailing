import Image from "next/image";
import Link from "next/link";

export function InnerNav() {
  return <header className="inner-nav"><Link href="/" className="inner-brand">COLE&apos;S <span>MOBILE DETAILING</span></Link><nav><Link href="/services">Services</Link><Link href="/ceramic-coatings">Ceramic</Link><Link href="/paint-correction">Correction</Link><Link href="/gallery">Gallery</Link><Link href="/about">About</Link><Link href="/book">Book</Link></nav></header>;
}

export function InnerFooter() {
  return <footer className="inner-footer"><div><strong>COLE&apos;S MOBILE DETAILING</strong><p>Premium mobile detailing across Southern Indiana.</p></div><div><Link href="/services">Services</Link><Link href="/rv-marine">RV & Marine</Link><Link href="/fleet">Fleet</Link><a href="tel:+18126295544">812-629-5544</a><a href="mailto:ccundiff20@gmail.com">ccundiff20@gmail.com</a></div></footer>;
}

export function PageHero({ eyebrow, title, copy, image }: { eyebrow:string; title:string; copy:string; image:string }) {
  return <section className="page-hero"><Image src={image} alt="" fill priority sizes="100vw" /><div className="page-hero-shade"/><div className="page-hero-copy"><p>{eyebrow}</p><h1>{title}</h1><span>{copy}</span></div></section>;
}
