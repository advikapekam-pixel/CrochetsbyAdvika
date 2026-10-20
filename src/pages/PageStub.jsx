/**
 * Temporary placeholder for a page not yet ported from the old site.
 * Removed once every route has its real page (see CURRENT.md build plan).
 *
 * >>> <PageStub title="Gallery" />
 */
export default function PageStub({ title }) {
  return (
    <section className="page active">
      <div className="wrap" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h1>{title}</h1>
        <p>Coming soon — this page is being moved over from the old site.</p>
      </div>
    </section>
  );
}
