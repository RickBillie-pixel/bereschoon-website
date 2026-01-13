import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, Truck, CheckCircle, Clock, Search, 
  AlertCircle, ExternalLink, ArrowLeft, MapPin, Home
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// Fallback product image - use logo as fallback
const FALLBACK_IMAGE = '/images/logo.png';

const TrackOrder = () => {
  const { trackingCode: urlTrackingCode } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [searchMethod, setSearchMethod] = useState(urlTrackingCode ? 'code' : 'order');
  const [trackingCode, setTrackingCode] = useState(urlTrackingCode || '');
  const [orderNumber, setOrderNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [trackingHistory, setTrackingHistory] = useState([]);

  // Auto-load order for logged-in users, or pre-fill tracking code for guests
  useEffect(() => {
    if (urlTrackingCode) {
      setSearchMethod('code');
      setTrackingCode(urlTrackingCode);
      
      // If user is logged in, try to auto-load the order (skip postal code)
      if (user) {
        loadOrderForLoggedInUser(urlTrackingCode);
      }
    }
  }, [urlTrackingCode, user]);

  // Load order automatically for logged-in users (verify ownership, skip postal code)
  const loadOrderForLoggedInUser = async (code) => {
    if (!code || !user) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch order by tracking code
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            product_name,
            product_slug,
            quantity,
            price_at_purchase,
            products:product_id (
              images
            )
          )
        `)
        .eq('tracking_code', code.trim().toUpperCase())
        .single();

      if (orderError || !orderData) {
        // Order not found - don't show error, let user search manually
        setLoading(false);
        return;
      }

      // Verify order belongs to logged-in user
      if (orderData.user_id !== user.id) {
        // Order belongs to different user - require postal code
        setLoading(false);
        return;
      }

      // Order belongs to this user - load it automatically
      const { data: historyData } = await supabase
        .from('order_tracking_history')
        .select('*')
        .eq('order_id', orderData.id)
        .order('created_at', { ascending: false });

      setOrder(orderData);
      setTrackingHistory(historyData || []);
    } catch (err) {
      // Silently fail - user can still search manually
      console.error('Auto-load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackByCode = async () => {
    if (!trackingCode.trim()) {
      setError('Voer een tracking code in');
      return;
    }

    // Only require postal code if user is not logged in
    if (!user && !postalCode.trim()) {
      setError('Voer ook je postcode in');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch order by tracking code with product details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            product_name,
            product_slug,
            quantity,
            price_at_purchase,
            products:product_id (
              images
            )
          )
        `)
        .eq('tracking_code', trackingCode.trim().toUpperCase())
        .single();

      if (orderError || !orderData) {
        throw new Error('Bestelling niet gevonden');
      }

      // Check if this is the user's own order
      const isOwnOrder = user && orderData.user_id === user.id;

      // Only verify postal code if not logged in or order doesn't belong to user
      if (!isOwnOrder) {
        if (!postalCode.trim()) {
          throw new Error('Voer je postcode in om deze bestelling te bekijken');
        }

        const orderPostalCode = orderData.shipping_address?.postalCode?.replace(/\s/g, '').toUpperCase();
        const inputPostalCode = postalCode.trim().replace(/\s/g, '').toUpperCase();

        if (orderPostalCode !== inputPostalCode) {
          throw new Error('Postcode komt niet overeen met deze bestelling');
        }
      }

      // Fetch tracking history
      const { data: historyData } = await supabase
        .from('order_tracking_history')
        .select('*')
        .eq('order_id', orderData.id)
        .order('created_at', { ascending: false });

      setOrder(orderData);
      setTrackingHistory(historyData || []);
      
      // Update URL with tracking code
      navigate(`/track/${orderData.tracking_code}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Bestelling niet gevonden');
      setOrder(null);
      setTrackingHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackByOrder = async () => {
    if (!orderNumber.trim()) {
      setError('Voer een ordernummer in');
      return;
    }

    // Only require postal code if user is not logged in
    if (!user && !postalCode.trim()) {
      setError('Voer ook je postcode in');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            product_name,
            product_slug,
            quantity,
            price_at_purchase,
            products:product_id (
              images
            )
          )
        `)
        .eq('order_number', orderNumber.trim().toUpperCase())
        .single();

      if (orderError || !orderData) {
        throw new Error('Bestelling niet gevonden');
      }

      // Check if this is the user's own order
      const isOwnOrder = user && orderData.user_id === user.id;

      // Only verify postal code if not logged in or order doesn't belong to user
      if (!isOwnOrder) {
        if (!postalCode.trim()) {
          throw new Error('Voer je postcode in om deze bestelling te bekijken');
        }

        const orderPostalCode = orderData.shipping_address?.postalCode?.replace(/\s/g, '').toUpperCase();
        const inputPostalCode = postalCode.trim().replace(/\s/g, '').toUpperCase();

        if (orderPostalCode !== inputPostalCode) {
          throw new Error('Postcode komt niet overeen');
        }
      }

      const { data: historyData } = await supabase
        .from('order_tracking_history')
        .select('*')
        .eq('order_id', orderData.id)
        .order('created_at', { ascending: false });

      setOrder(orderData);
      setTrackingHistory(historyData || []);
      
      if (orderData.tracking_code) {
        navigate(`/track/${orderData.tracking_code}`, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Bestelling niet gevonden');
      setOrder(null);
      setTrackingHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchMethod === 'code') {
      handleTrackByCode();
    } else {
      handleTrackByOrder();
    }
  };

  // Get product image with fallback
  const getProductImage = (item) => {
    const productImages = item.products?.images;
    if (productImages && Array.isArray(productImages) && productImages.length > 0) {
      return productImages[0];
    }
    return FALLBACK_IMAGE;
  };

  // Status helpers
  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { 
        label: 'Wacht op betaling', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        dotColor: 'bg-yellow-400'
      },
      confirmed: { 
        label: 'Betaling ontvangen', 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        dotColor: 'bg-green-500'
      },
      paid: { 
        label: 'Betaling ontvangen', 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        dotColor: 'bg-green-500'
      },
      processing: { 
        label: 'In behandeling', 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Package,
        dotColor: 'bg-blue-500'
      },
      shipped: { 
        label: 'Verzonden', 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: Truck,
        dotColor: 'bg-purple-500'
      },
      delivered: { 
        label: 'Afgeleverd', 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        dotColor: 'bg-green-600'
      },
      cancelled: { 
        label: 'Geannuleerd', 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: AlertCircle,
        dotColor: 'bg-red-500'
      }
    };
    return statusMap[status] || statusMap.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatShortDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Progress indicator
  const getProgressSteps = () => {
    const steps = [
      { key: 'confirmed', label: 'Besteld' },
      { key: 'processing', label: 'Verwerkt' },
      { key: 'shipped', label: 'Verzonden' },
      { key: 'delivered', label: 'Afgeleverd' }
    ];
    
    const statusOrder = ['pending', 'confirmed', 'paid', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(order?.status || 'pending');
    
    return steps.map((step, index) => {
      let isCompleted = false;
      let isCurrent = false;
      
      if (step.key === 'confirmed' && currentIndex >= 1) isCompleted = true;
      if (step.key === 'processing' && currentIndex >= 3) isCompleted = true;
      if (step.key === 'shipped' && currentIndex >= 4) isCompleted = true;
      if (step.key === 'delivered' && currentIndex >= 5) isCompleted = true;
      
      if (step.key === 'confirmed' && (currentIndex === 1 || currentIndex === 2)) isCurrent = true;
      if (step.key === 'processing' && currentIndex === 3) isCurrent = true;
      if (step.key === 'shipped' && currentIndex === 4) isCurrent = true;
      if (step.key === 'delivered' && currentIndex === 5) isCurrent = true;
      
      return { ...step, isCompleted, isCurrent };
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary/5">

        <div className="max-w-4xl mx-auto px-4 py-8 pt-28">
          {/* Search Form */}
          {!order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary to-primary/80 px-8 py-6 text-white">
                <div className="flex items-center gap-3">
                  <Package className="w-8 h-8" />
                  <div>
                    <h1 className="text-2xl font-bold">Bestelling volgen</h1>
                    <p className="text-white/80 text-sm">Voer je gegevens in om je bestelling te volgen</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* Search Method Toggle */}
                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
                  <button
                    type="button"
                    onClick={() => setSearchMethod('order')}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      searchMethod === 'order'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Met ordernummer
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchMethod('code')}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      searchMethod === 'code'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Met tracking code
                  </button>
                </div>

                {/* Info for logged-in users */}
                {user && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-green-700 text-sm">
                      ✅ Je bent ingelogd. Je kunt je eigen bestellingen bekijken zonder postcode in te vullen.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {searchMethod === 'code' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tracking code
                        </label>
                        <input
                          type="text"
                          value={trackingCode}
                          onChange={(e) => setTrackingCode(e.target.value)}
                          placeholder="bijv. TRACK-2026-0001"
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 transition-colors text-lg"
                        />
                      </div>
                      {!user && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Postcode
                          </label>
                          <input
                            type="text"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            placeholder="bijv. 1234 AB"
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 transition-colors text-lg"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ordernummer
                        </label>
                        <input
                          type="text"
                          value={orderNumber}
                          onChange={(e) => setOrderNumber(e.target.value)}
                          placeholder="bijv. BS-20260113-001"
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 transition-colors text-lg"
                        />
                      </div>
                      {!user && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Postcode
                          </label>
                          <input
                            type="text"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            placeholder="bijv. 1234 AB"
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 transition-colors text-lg"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-red-600">{error}</p>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Zoeken...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        Zoek bestelling
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Order Details */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Back Button */}
              <button
                onClick={() => {
                  setOrder(null);
                  setTrackingHistory([]);
                  setError(null);
                  setTrackingCode('');
                  setOrderNumber('');
                  setPostalCode('');
                  navigate('/track', { replace: true });
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-medium py-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Nieuwe zoekopdracht
              </button>

              {/* Main Order Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm">Bestelling</p>
                      <h2 className="text-xl font-bold">{order.order_number}</h2>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusInfo(order.status).color}`}>
                      {getStatusInfo(order.status).label}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="px-6 py-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    {getProgressSteps().map((step, index) => (
                      <React.Fragment key={step.key}>
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                            step.isCompleted || step.isCurrent
                              ? 'bg-primary text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}>
                            {step.isCompleted ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <span className="text-sm font-bold">{index + 1}</span>
                            )}
                          </div>
                          <span className={`mt-2 text-xs font-medium ${
                            step.isCompleted || step.isCurrent ? 'text-primary' : 'text-gray-400'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                        {index < 3 && (
                          <div className={`flex-1 h-1 mx-2 rounded ${
                            step.isCompleted ? 'bg-primary' : 'bg-gray-200'
                          }`} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Products */}
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Bestelde producten</h3>
                  <div className="space-y-4">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                          <img
                            src={getProductImage(item)}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = FALLBACK_IMAGE;
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{item.product_name}</p>
                          <p className="text-sm text-gray-500">Aantal: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-gray-900">
                          €{(item.price_at_purchase * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotaal</span>
                      <span>€{order.subtotal?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Verzendkosten</span>
                      <span>{order.shipping_cost > 0 ? `€${order.shipping_cost?.toFixed(2)}` : 'Gratis'}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                      <span>Totaal</span>
                      <span className="text-primary">€{order.total?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking & Delivery Info */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Tracking Info */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Truck className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-gray-900">Verzending</h3>
                  </div>
                  
                  {order.carrier_name && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Vervoerder</p>
                        <p className="font-semibold text-gray-900">{order.carrier_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Track & Trace</p>
                        <p className="font-mono text-primary font-semibold">{order.tracking_code}</p>
                      </div>
                      {order.carrier_tracking_url && (
                        <a
                          href={order.carrier_tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Volgen bij {order.carrier_name}
                        </a>
                      )}
                    </div>
                  )}
                  
                  {!order.carrier_name && (
                    <p className="text-gray-500 text-sm">Verzendgegevens worden toegevoegd zodra je bestelling is verzonden.</p>
                  )}
                </div>

                {/* Delivery Address */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Home className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-gray-900">Bezorgadres</h3>
                  </div>
                  
                  {order.shipping_address && (
                    <div className="text-gray-700 space-y-1">
                      {(order.shipping_address.firstName || order.shipping_address.lastName) && (
                        <p className="font-semibold text-gray-900">
                          {order.shipping_address.firstName} {order.shipping_address.lastName}
                        </p>
                      )}
                      <p>{order.shipping_address.street} {order.shipping_address.houseNumber}</p>
                      <p>{order.shipping_address.postalCode} {order.shipping_address.city}</p>
                      {order.shipping_address.country && (
                        <p className="text-gray-500 text-sm">{order.shipping_address.country}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              {trackingHistory.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-gray-900">Tracking geschiedenis</h3>
                  </div>
                  
                  <div className="space-y-0">
                    {trackingHistory.map((entry, index) => {
                      const statusInfo = getStatusInfo(entry.status);
                      const StatusIcon = statusInfo.icon;
                      const isFirst = index === 0;
                      const isLast = index === trackingHistory.length - 1;
                      
                      return (
                        <div key={entry.id} className="relative flex gap-4">
                          {/* Timeline line */}
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full ${isFirst ? 'bg-primary' : statusInfo.dotColor}`} />
                            {!isLast && (
                              <div className="w-0.5 h-full bg-gray-200 min-h-[60px]" />
                            )}
                          </div>
                          
                          {/* Content */}
                          <div className={`flex-1 pb-6 ${isFirst ? '' : ''}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <StatusIcon className={`w-4 h-4 ${isFirst ? 'text-primary' : 'text-gray-400'}`} />
                              <span className={`font-semibold ${isFirst ? 'text-gray-900' : 'text-gray-600'}`}>
                                {statusInfo.label}
                              </span>
                            </div>
                            {entry.description && (
                              <p className="text-gray-600 text-sm mb-1">{entry.description}</p>
                            )}
                            <p className="text-xs text-gray-400">{formatShortDate(entry.created_at)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Contact Link */}
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">
                  Vragen over je bestelling?{' '}
                  <Link to="/contact" className="text-primary hover:underline font-medium">
                    Neem contact op
                  </Link>
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default TrackOrder;
