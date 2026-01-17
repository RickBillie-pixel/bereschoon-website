import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Check, Minus, Plus,
  ChevronLeft, ChevronRight, Play, Truck, Shield, Clock,
  Loader2, ArrowLeft, Star
} from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import { useCartStore } from '../../stores/cartStore';
import SEO from '../../components/SEO';
import { generateProductSchema } from '../../utils/structuredData';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/rest/v1/products?slug=eq.${encodeURIComponent(slug)}&active=eq.true&select=*`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error fetching product');
      }

      const data = await response.json();
      if (!data || data.length === 0) throw new Error('Product niet gevonden');

      setProduct(data[0]);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  const handleQuickAdd = () => {
    if (product) {
      addItem(product, 1);
    }
  };

  const discountPercentage = product?.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null;

  if (loading) {
    return (
      <PageTransition className="pt-24">
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PageTransition>
    );
  }

  if (error || !product) {
    return (
      <PageTransition className="pt-24">
        <div className="min-h-screen flex flex-col items-center justify-center">
          <p className="text-xl text-gray-500 mb-4">{error || 'Product niet gevonden'}</p>
          <Link to="/winkel" className="text-primary hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Terug naar shop
          </Link>
        </div>
      </PageTransition>
    );
  }

  const images = product.images || [];
  const features = product.features || [];
  const structuredData = generateProductSchema(product);
  const breadcrumbs = [
    { name: 'Home', url: 'https://bereschoon.nl' },
    { name: 'Webshop', url: 'https://bereschoon.nl/winkel' },
    { name: product.name, url: `https://bereschoon.nl/winkel/product/${product.slug}` }
  ];

  return (
    <PageTransition className="pt-24">
      <SEO
        title={product.name}
        description={product.short_description || product.description?.substring(0, 160)}
        image={images[0]}
        type="product"
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          {/* Back link - Top Left */}
          <div className="mb-6">
            <Link
              to="/winkel"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Terug naar shop
            </Link>
          </div>

          {/* Mobile Title - Single Line, Top */}
          <div className="md:hidden mb-4">
            <h1 className="text-xl font-bold text-gray-900 truncate tracking-tight">
              {product.name}
            </h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column: Image/Video */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm">
                <AnimatePresence mode="wait">
                  {showVideo && product.video_url ? (
                    <motion.video
                      key="video"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      autoPlay
                      loop
                      muted
                      playsInline
                      controls
                      className="w-full h-full object-cover"
                    >
                      <source src={product.video_url} type="video/mp4" />
                    </motion.video>
                  ) : images.length > 0 ? (
                    <motion.img
                      key={selectedImageIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      src={images[selectedImageIndex]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <ShoppingBag className="w-20 h-20 text-gray-300" />
                    </div>
                  )}
                </AnimatePresence>

                {/* Navigation Arrows */}
                {images.length > 1 && !showVideo && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(i => i > 0 ? i - 1 : images.length - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(i => i < images.length - 1 ? i + 1 : 0)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.featured && (
                    <span className="bg-primary text-white text-sm font-bold px-4 py-1.5 rounded-full">
                      Nieuw
                    </span>
                  )}
                  {discountPercentage && (
                    <span className="bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                      -{discountPercentage}%
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {(images.length > 1 || product.video_url) && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedImageIndex(index);
                        setShowVideo(false);
                      }}
                      className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${selectedImageIndex === index && !showVideo
                        ? 'border-primary'
                        : 'border-transparent hover:border-gray-300'
                        }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {product.video_url && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all bg-gray-900 flex items-center justify-center ${showVideo ? 'border-primary' : 'border-transparent hover:border-gray-300'
                        }`}
                    >
                      <Play className="w-8 h-8 text-white" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Info & Actions */}
            <div className="space-y-6">

              {/* Desktop Header (Title & Category) */}
              <div className="hidden md:block">
                {product.category && (
                  <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                    {product.category}
                  </p>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
              </div>

              {/* Mobile: Price + Quick Add Row */}
              <div className="flex md:hidden items-center justify-between mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">
                    €{product.price?.toFixed(2) || '0.00'}
                  </span>
                  {product.compare_price && (
                    <span className="text-lg text-gray-400 line-through">
                      €{product.compare_price.toFixed(2)}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleQuickAdd}
                  className="bg-primary text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                >
                  <ShoppingBag className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile: Reviews */}
              <div className="flex md:hidden items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" strokeWidth={0} />)}
                </div>
                <span className="text-xs font-medium text-gray-500 underline">50+ Google reviews</span>
              </div>

              {/* Desktop: Price */}
              <div className="hidden md:flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold text-primary">
                  €{product.price?.toFixed(2) || '0.00'}
                </span>
                {product.compare_price && (
                  <span className="text-xl text-gray-400 line-through">
                    €{product.compare_price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              {product.short_description && (
                <p className="text-lg text-gray-600">
                  {product.short_description}
                </p>
              )}

              {/* Features List */}
              {features.length > 0 && (
                <div className="space-y-3 pt-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Mobile: USPs */}
              <div className="grid md:hidden grid-cols-3 gap-2 py-4 border-t border-b border-gray-100">
                <div className="text-center">
                  <Truck className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-[10px] text-gray-600">Gratis v.a. €50</p>
                </div>
                <div className="text-center">
                  <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-[10px] text-gray-600">1-3 werkdagen</p>
                </div>
                <div className="text-center">
                  <Shield className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-[10px] text-gray-600">Veilig betalen</p>
                </div>
              </div>

              {/* Desktop: Quantity & Add to Cart */}
              <div className="hidden md:block pt-6 border-t space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-medium">Aantal:</span>
                  <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                >
                  <ShoppingBag className="w-6 h-6" />
                  {product.stock === 0 ? 'Uitverkocht' : 'In Winkelmandje'}
                </motion.button>

                {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
                  <p className="text-center text-orange-500 text-sm">
                    ⚠️ Nog maar {product.stock} op voorraad
                  </p>
                )}
              </div>

              {/* Desktop: USPs */}
              <div className="hidden md:grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Gratis verzending vanaf €50</p>
                </div>
                <div className="text-center">
                  <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-gray-600">1-3 werkdagen</p>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Veilig betalen</p>
                </div>
              </div>
            </div>
          </div>

          {/* Full Description */}
          {product.description && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Productbeschrijving</h2>
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="prose prose-lg max-w-none whitespace-pre-line">
                  {product.description}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductDetail;
