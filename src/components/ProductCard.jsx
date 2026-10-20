import { useNavigate } from 'react-router-dom';
import { useShop } from '../shop/ShopContext';
import { discountPercent, formatPrice, tagClassName } from '../shop/format';

/**
 * Product tile used in every grid: image, badges, wishlist heart, price, add-to-cart.
 *
 * >>> <ProductCard product={PRODUCTS[0]} />
 */
export default function ProductCard({ product: p }) {
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useShop();
  const wished = wishlist.has(p.id);
  const discount = discountPercent(p);
  const open = () => navigate(`/product/${p.id}`);

  return (
    <div className="product-card">
      <div className="product-media" onClick={open}>
        <img src={p.img} alt={p.name} loading="lazy" />
        {discount > 0 && <span className="discount-badge">{discount}% OFF</span>}
        <button
          className={`wish-btn${wished ? ' active' : ''}`}
          onClick={e => { e.stopPropagation(); toggleWishlist(p.id); }}
          aria-label={`Save ${p.name}`}
        >{wished ? '♥' : '♡'}</button>
        {p.reel && <a className="reel-badge" href={p.reel} target="_blank" rel="noopener" onClick={e => e.stopPropagation()}>▶ Watch Reel</a>}
      </div>
      <div className="product-body">
        {p.tag && <span className={`tag ${tagClassName(p.tag)}`}>{p.tag}</span>}
        <span className="product-name" onClick={open}>{p.name}</span>
        <div className="price-row">
          <span className="price">{formatPrice(p.price)}</span>
          {p.originalPrice && <span className="price-strike">{formatPrice(p.originalPrice)}</span>}
        </div>
        <div className="add-row">
          <button className="btn btn-charcoal" disabled={p.soldOut} onClick={() => addToCart(p.id)}>
            {p.soldOut ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
