import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { getImageUrl } from '../utils/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Home = () => {
  const [data, setData] = useState(null);
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    Promise.all([
      API.get('/products/home'),
      API.get('/banners'),
    ]).then(([homeRes, bannerRes]) => {
      setData(homeRes.data);
      setBanners(bannerRes.data);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => setCurrentBanner((c) => (c + 1) % banners.length), 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (!data) return <Loader />;

  return (
    <div>
      {/* Hero Banner Slider */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        {banners.length > 0 ? (
          <>
            <img
              src={getImageUrl(banners[currentBanner]?.image)}
              alt={banners[currentBanner]?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="max-w-xl text-white">
                  <span className="inline-block bg-primary-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
                    Premium Quality
                  </span>
                  <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 leading-tight">
                    {banners[currentBanner]?.title}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-200 mb-8">
                    {banners[currentBanner]?.subtitle}
                  </p>
                  <div className="flex gap-4">
                    <Link to={banners[currentBanner]?.link || '/products'} className="btn-primary">
                      Shop Now
                    </Link>
                    <Link to="/contact" className="btn-outline">Contact Us</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentBanner(i)}
                  className={`w-3 h-3 rounded-full transition ${i === currentBanner ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="h-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white">
            <div className="text-center">
              <h1 className="text-5xl font-display font-bold mb-4">Indian Sweet Savories</h1>
              <p className="text-xl mb-8">Premium Indian Sweets Delivered Fresh</p>
              <Link to="/products" className="btn-outline">Explore Collection</Link>
            </div>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹999' },
            { icon: '✨', title: 'Fresh & Premium', desc: 'Handcrafted daily' },
            { icon: '💰', title: 'Cash on Delivery', desc: 'Pay when delivered' },
            { icon: '🎁', title: 'Gift Packaging', desc: 'Perfect for gifting' },
          ].map((f) => (
            <div key={f.title} className="text-center p-4">
              <span className="text-3xl mb-2 block">{f.icon}</span>
              <h3 className="font-semibold text-gray-900">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="section-title text-center">Shop by Category</h2>
        <p className="section-subtitle text-center">Explore our wide range of sweet categories</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {data.categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat._id}`}
              className="group relative rounded-xl overflow-hidden aspect-square shadow-md hover:shadow-xl transition"
            >
              <img src={getImageUrl(cat.image)} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <h3 className="text-white font-semibold text-lg">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Products */}
      <ProductSection title="Latest Arrivals" subtitle="Freshly added to our collection" products={data.latest} />

      {/* Popular Products */}
      <ProductSection title="Popular Sweets" subtitle="Customer favorites you'll love" products={data.popular} bg="bg-primary-50/50" />

      {/* Discounted */}
      <ProductSection title="Special Offers" subtitle="Great deals on premium sweets" products={data.discounted} />

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-700 to-primary-900">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Ready to Sweeten Your Day?</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Browse our complete collection of handcrafted mithai, cakes, and chocolates. Order now with cash on delivery.
          </p>
          <Link to="/products" className="inline-block bg-white text-primary-700 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition">
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
};

const ProductSection = ({ title, subtitle, products, bg = '' }) => {
  if (!products?.length) return null;
  return (
    <section className={`py-16 ${bg}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle mb-0">{subtitle}</p>
          </div>
          <Link to="/products" className="text-primary-600 font-medium hover:underline hidden sm:block">View All →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </section>
  );
};

export default Home;
