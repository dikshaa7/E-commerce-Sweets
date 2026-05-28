import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const filters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    weight: searchParams.get('weight') || '',
    available: searchParams.get('available') || '',
    sort: searchParams.get('sort') || '',
    page: searchParams.get('page') || '1',
  };

  useEffect(() => {
    API.get('/categories').then((r) => setCategories(r.data));
    API.get('/brands').then((r) => setBrands(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    API.get(`/products?${params}`)
      .then(({ data }) => {
        setProducts(data.products);
        setTotal(data.total);
        setPages(data.pages);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="section-title">Our Sweet Collection</h1>
        <p className="section-subtitle">Discover premium mithai, cakes, and chocolates</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <div className="card p-5 space-y-5 sticky top-24">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Search</label>
              <input type="text" value={filters.search} onChange={(e) => updateFilter('search', e.target.value)} className="input-field text-sm" placeholder="Product name..." />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
              <select value={filters.category} onChange={(e) => updateFilter('category', e.target.value)} className="input-field text-sm">
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Brand</label>
              <select value={filters.brand} onChange={(e) => updateFilter('brand', e.target.value)} className="input-field text-sm">
                <option value="">All Brands</option>
                {brands.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Min Price</label>
                <input type="number" value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} className="input-field text-sm" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Max Price</label>
                <input type="number" value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} className="input-field text-sm" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Weight</label>
              <select value={filters.weight} onChange={(e) => updateFilter('weight', e.target.value)} className="input-field text-sm">
                <option value="">All Weights</option>
                <option value="250g">250g</option>
                <option value="500g">500g</option>
                <option value="1kg">1kg</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Sort By</label>
              <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)} className="input-field text-sm">
                <option value="">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
            <button onClick={() => setSearchParams({})} className="w-full text-sm text-primary-600 hover:underline">Clear Filters</button>
          </div>
        </aside>

        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-4">{total} products found</p>
          {loading ? <Loader fullScreen={false} /> : products.length === 0 ? (
            <div className="text-center py-16 text-gray-500">No products found. Try adjusting filters.</div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => updateFilter('page', String(i + 1))}
                      className={`px-4 py-2 rounded-lg ${Number(filters.page) === i + 1 ? 'bg-primary-600 text-white' : 'bg-white border hover:bg-gray-50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
