require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Brand = require('./models/Brand');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Banner = require('./models/Banner');
const Offer = require('./models/Offer');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Brand.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Banner.deleteMany({}),
      Offer.deleteMany({}),
    ]);

    console.log('Creating admin and users...');
    const admin = await User.create({
      name: 'Diksha',
      email: 'Diksha@gmail.com',
      mobile: '1234567890',
      password: 'Diksha123',
      role: 'admin',
    });

    const users = await User.create([
      { name: 'Nazrul', email: 'Nazrul@gmail.com', mobile: '1234567890', password: 'user123' },
      { name: 'Rohit', email: 'Rohit@gmail.com', mobile: '1234567890', password: 'user123' },
      { name: 'Mohit', email: 'Mohit@gmail.com', mobile: '1234567890', password: 'user123' },
    ]);

    console.log('Creating brands...');
    const brands = await Brand.insertMany([
      { name: 'Haldiram', logo: '/brand_haldiram.png', isActive: true },
      { name: 'Bikano', logo: '/brand_bikano.png', isActive: true },
      { name: 'Ghasitaram', logo: '/brand_ghasitaram.png', isActive: true },
      { name: 'Sweet Bengal', logo: '/brand_sweetbengal.png', isActive: true },
    ]);

    console.log('Creating categories...');
    const categories = await Category.insertMany([
      { name: 'Mithai', description: 'Traditional Indian sweets', image: '/category_mithai.png', isActive: true },
      { name: 'Cakes', description: 'Fresh baked cakes', image: '/category_cakes.png', isActive: true },
      { name: 'Chocolates', description: 'Premium chocolates', image: '/category_chocolates.png', isActive: true },
      { name: 'Dry Fruit Sweets', description: 'Sweets with dry fruits', image: '/category_dryfruits.png', isActive: true },
      { name: 'Festival Sweets', description: 'Special festival collection', image: '/category_festival.png', isActive: true },
    ]);

    console.log('Creating products...');
    const products = await Product.insertMany([
      {
        name: 'Kaju Katli',
        image: '/kaju_katli.png',
        brand: brands[0]._id,
        category: categories[0]._id,
        price: 850,
        discountPrice: 765,
        weight: '500g',
        stock: 50,
        description: 'Premium cashew fudge made with finest kaju. A classic Indian mithai perfect for celebrations.',
        ingredients: 'Cashew, Sugar, Ghee, Cardamom',
        shelfLife: '15 days',
        isAvailable: true,
        isPopular: true,
        isLatest: true,
      },
      {
        name: 'Rasgulla',
        image: '/rasgulla.png',
        brand: brands[3]._id,
        category: categories[0]._id,
        price: 320,
        discountPrice: 0,
        weight: '1kg',
        stock: 30,
        description: 'Soft spongy Bengali rasgulla soaked in light sugar syrup.',
        ingredients: 'Chenna, Sugar, Water, Rose Water',
        shelfLife: '7 days',
        isAvailable: true,
        isPopular: true,
        isLatest: false,
      },
      {
        name: 'Chocolate Truffle Cake',
        image: '/product_chocotruffle.png',
        brand: brands[2]._id,
        category: categories[1]._id,
        price: 1200,
        discountPrice: 999,
        weight: '1kg',
        stock: 15,
        description: 'Rich dark chocolate truffle cake with ganache frosting.',
        ingredients: 'Flour, Cocoa, Cream, Sugar, Eggs',
        shelfLife: '3 days',
        isAvailable: true,
        isPopular: true,
        isLatest: true,
      },
      {
        name: 'Dark Chocolate Box',
        image: '/product_darkchocobox.png',
        brand: brands[1]._id,
        category: categories[2]._id,
        price: 650,
        discountPrice: 520,
        weight: '250g',
        stock: 40,
        description: 'Assorted premium dark chocolates in elegant packaging.',
        ingredients: 'Cocoa, Sugar, Milk Solids, Emulsifier',
        shelfLife: '6 months',
        isAvailable: true,
        isPopular: false,
        isLatest: true,
      },
      {
        name: 'Anjeer Barfi',
        image: '/anjeer_barfi.png',
        brand: brands[0]._id,
        category: categories[3]._id,
        price: 950,
        discountPrice: 850,
        weight: '500g',
        stock: 25,
        description: 'Delicious fig barfi loaded with dry fruits and nuts.',
        ingredients: 'Fig, Almond, Pistachio, Sugar, Ghee',
        shelfLife: '20 days',
        isAvailable: true,
        isPopular: true,
        isLatest: false,
      },
      {
        name: 'Gulab Jamun',
        image: '/category_mithai.png',
        brand: brands[1]._id,
        category: categories[0]._id,
        price: 450,
        discountPrice: 0,
        weight: '1kg',
        stock: 8,
        description: 'Soft khoya dumplings in rose-flavored sugar syrup.',
        ingredients: 'Khoya, Flour, Sugar, Cardamom, Rose Water',
        shelfLife: '10 days',
        isAvailable: true,
        isPopular: true,
        isLatest: false,
        lowStockThreshold: 10,
      },
      {
        name: 'Diwali Special Ladoo Box',
        image: '/premium_mithai_box.png',
        brand: brands[2]._id,
        category: categories[4]._id,
        price: 1100,
        discountPrice: 880,
        weight: '1kg',
        stock: 20,
        description: 'Festive assortment of motichoor, besan and coconut ladoos.',
        ingredients: 'Besan, Sugar, Ghee, Coconut, Nuts',
        shelfLife: '15 days',
        isAvailable: true,
        isPopular: false,
        isLatest: true,
      },
      {
        name: 'Milk Cake',
        image: '/milk_cake.png',
        brand: brands[3]._id,
        category: categories[0]._id,
        price: 580,
        discountPrice: 499,
        weight: '500g',
        stock: 35,
        description: 'Traditional milk cake with caramelized edges and soft center.',
        ingredients: 'Milk, Sugar, Ghee, Cardamom',
        shelfLife: '12 days',
        isAvailable: true,
        isPopular: false,
        isLatest: true,
      },
    ]);

    console.log('Creating banners...');
    await Banner.insertMany([
      {
        title: 'Festive Sweet Collection',
        subtitle: 'Up to 30% off on festival specials',
        image: '/category_festival.png',
        link: '/products',
        isActive: true,
        order: 1,
      },
      {
        title: 'Premium Mithai Box',
        subtitle: 'Handcrafted sweets delivered fresh',
        image: '/premium_mithai_box.png',
        link: '/products?category=' + categories[0]._id,
        isActive: true,
        order: 2,
      },
      {
        title: 'Chocolate Delights',
        subtitle: 'Indulge in premium chocolates',
        image: '/product_darkchocobox.png',
        link: '/products?category=' + categories[2]._id,
        isActive: true,
        order: 3,
      },
    ]);

    console.log('Creating offers...');
    await Offer.insertMany([
      {
        title: 'Kaju Katli Special',
        description: '10% off on Kaju Katli',
        discountPercent: 10,
        product: products[0]._id,
        isFestivalOffer: false,
        isActive: true,
      },
      {
        title: 'Diwali Festival Offer',
        description: '20% off on festival sweets',
        discountPercent: 20,
        category: categories[4]._id,
        isFestivalOffer: true,
        isActive: true,
      },
    ]);

    console.log('\n========== SEED COMPLETED ==========');
    console.log('Admin Login: Diksha@gmail.com / Diksha123');
    console.log('User Login: Nazrul@gmail.com / user123');
    console.log(`Created: ${brands.length} brands, ${categories.length} categories, ${products.length} products`);
    console.log(`Created: ${users.length} users, 1 admin, 3 banners, 2 offers`);
    console.log('====================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedData();
