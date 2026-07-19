export default function Loading() {
  return (
    <div className="site-loading" role="status" aria-live="polite" aria-label="Loading Cole's Mobile Detailing">
      <div className="site-loading__mark">
        <img src="/loader-icon.webp" alt="" width="118" height="118" />
        <span className="site-loading__ring" aria-hidden="true" />
      </div>
      <p>COLE&apos;S MOBILE DETAILING</p>
      <div className="site-loading__bar" aria-hidden="true"><span /></div>
      <small>PREMIUM MOBILE DETAILING</small>
    </div>
  );
}
