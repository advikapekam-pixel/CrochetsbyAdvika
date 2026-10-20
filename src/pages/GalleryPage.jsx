import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { CATEGORIES, PRODUCTS } from '../data/catalog';

const SORTERS = {
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'name-asc': (a, b) => a.name.localeCompare(b.name),
};

/**
 * Products matching the gallery's category, search text and stock filter, sorted.
 *
 * >>> findGalleryProducts({ category: 'hats', search: '', inStockOnly: false, sort: 'featured' }).map(p => p.name)
 * ['Colourful Beanie']
 */
function findGalleryProducts({ category, search, inStockOnly, sort }) {
  const term = search.toLowerCase().trim();
  const list = PRODUCTS.filter(p =>
    (category === 'all' || p.category === category) &&
    (!term || [p.name, p.desc, p.tag].some(text => text && text.toLowerCase().includes(term))) &&
    (!inStockOnly || !p.soldOut)
  );
  return SORTERS[sort] ? list.sort(SORTERS[sort]) : list;
}

/**
 * Full catalog with search, category pills (?cat= in the URL), sort and in-stock toggle.
 *
 * >>> <Route path="/gallery" element={<GalleryPage />} />
 */
export default function GalleryPage() {
  const [params, setParams] = useSearchParams();
  const category = params.get('cat') || 'all';
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const setCategory = cat => setParams(cat === 'all' ? {} : { cat });
  const resetFilters = () => { setSearch(''); setInStockOnly(false); setCategory('all'); };
  const products = findGalleryProducts({ category, search, inStockOnly, sort });

  return (
    <section className="page active">
      <div className="wrap page-header" style={{ paddingTop: 40 }}>
        <div className="eyebrow"><span className="dot"></span> The Full Collection</div>
        <h1 style={{ marginTop: 10 }}>Gallery</h1>
        <p style={{ color: 'var(--charcoal-soft)', fontSize: 15, marginTop: 10 }}>Every piece is made to order, one stitch at a time. Search, filter by category, or sort by price.</p>
      </div>
      <div className="wrap">
        {/* ── Search, sort, stock toggle, category pills ── */}
        <div className="gallery-toolbar">
          <div className="search-bar-row">
            <div className="search-input-wrap">
              <svg className="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sunflowers, headbands, plushies, charms..." />
            </div>
            <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical (A–Z)</option>
            </select>
            <label className="stock-toggle-label">
              <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} />
              <span>In Stock Only</span>
            </label>
          </div>
          <div className="filter-row">
            {CATEGORIES.map(c => (
              <button key={c} className={`filter-pill${c === category ? ' active' : ''}`} onClick={() => setCategory(c)}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ── Results ── */}
        <div className="product-grid" style={{ marginBottom: 70 }}>
          {products.length > 0 ? products.map(p => <ProductCard key={p.id} product={p} />) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px 0', color: 'var(--charcoal-soft)' }}>
              <p>No crochet pieces matched your search.</p>
              <button className="btn btn-outline btn-sm" onClick={resetFilters}>Reset Filters</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
