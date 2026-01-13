import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, MapPin, Truck, CheckCircle, Clock, Search, 
  AlertCircle, ExternalLink, ArrowLeft, Calendar, Info
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { supabase } from '../lib/supabase';

const TrackOrder = () => {
  const { trackingCode: urlTrackingCode } = useParams();
  const navigate = useNavigate();
  
  const [searchMethod, setSearchMethod] = useState(urlTrackingCode ? 'code' : 'order');
  const [trackingCode, setTrackingCode] = useState(urlTrackingCode || '');
  const [orderNumber, setOrderNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [trackingHistory, setTrackingHistory] = useState([]);

  // Auto-load if tracking code is in URL
  useEffect(() => {
    if (urlTrackingCode) {
      handleTrackByCode(urlTrackingCode);
    }
  }, [urlTrackingCode]);

  const handleTrackByCode = async (code = trackingCode) => {
    if (!code.trim()) {
      setError('Voer een tracking code in');
      return;
    }

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
            product_name,
            quantity,
            price_at_purchase
          )
        `)
        .eq('tracking_code', code.trim().toUpperCase())
        .single();

      if (orderError || !orderData) {
        throw new Error('Bestelling niet gevonden met deze tracking code');
      }

      // Fetch tracking history
      const { data: historyData, error: historyError } = await supabase
        .from('order_tracking_history')
        .select('*')
        .eq('order_id', orderData.id)
        .order('created_at', { ascending: false });

      if (historyError) {
        console.error('Error fetching tracking history:', historyError);
      }

      setOrder(orderData);
      setTrackingHistory(historyData || []);
    } catch (err) {
      console.error('Tracking error:', err);
      setError(err.message || 'Kon bestelling niet vinden');
      setOrder(null);
      setTrackingHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackByOrder = async () => {
    if (!orderNumber.trim() || !postalCode.trim()) {
      setError('Voer zowel ordernummer als postcode in');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch order by order number
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            quantity,
            price_at_purchase
          )
        `)
        .eq('order_number', orderNumber.trim().toUpperCase())
        .single();

      if (orderError || !orderData) {
        throw new Error('Bestelling niet gevonden met dit ordernummer');
      }

      // Verify postal code matches
      const orderPostalCode = orderData.shipping_address?.postalCode?.replace(/\s/g, '').toUpperCase();
      const inputPostalCode = postalCode.trim().replace(/\s/g, '').toUpperCase();

      if (orderPostalCode !== inputPostalCode) {
        throw new Error('Postcode komt niet overeen met deze bestelling');
      }

      // Fetch tracking history
      const { data: historyData, error: historyError } = await supabase
        .from('order_tracking_history')
        .select('*')
        .eq('order_id', orderData.id)
        .order('created_at', { ascending: false });

      if (historyError) {
        console.error('Error fetching tracking history:', historyError);
      }

      setOrder(orderData);
      setTrackingHistory(historyData || []);
      
      // Update URL with tracking code
      if (orderData.tracking_code) {
        navigate(`/track/${orderData.tracking_code}`, { replace: true });
      }
    } catch (err) {
      console.error('Tracking error:', err);
      setError(err.message || 'Kon bestelling niet vinden');
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'paid':
      case 'processing':
        return <Package className="w-6 h-6 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Package className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Wacht op betaling';
      case 'paid':
        return 'Betaling ontvangen';
      case 'processing':
        return 'In behandeling';
      case 'shipped':
        return 'Verzonden';
      case 'delivered':
        return 'Afgeleverd';
      case 'cancelled':
        return 'Geannuleerd';
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid':
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <PageTransition className="pt-24">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
              <Package className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Track je bestelling</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Voer je tracking code of ordernummer in om je bestelling te volgen
            </p>
          </motion.div>

          {/* Search Form */}
          {!order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                {/* Search Method Toggle */}
                <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setSearchMethod('code')}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      searchMethod === 'code'
                        ? 'bg-white shadow-sm text-primary'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Tracking Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchMethod('order')}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      searchMethod === 'order'
                        ? 'bg-white shadow-sm text-primary'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Ordernummer
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  {searchMethod === 'code' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tracking Code
                      </label>
                      <input
                        type="text"
                        value={trackingCode}
                        onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                        placeholder="BS-XXXX-XXXX-XXXX"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-center text-lg font-mono"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Voer je tracking code in zoals vermeld op je orderbevestiging
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ordernummer
                        </label>
                      <input
                        type="text"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                        placeholder="2026-0001"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono"
                      />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postcode
                        </label>
                        <input
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                          placeholder="1234 AB"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600">{error}</p>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
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
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Order Details */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              {/* Back Button */}
              <button
                onClick={() => {
                  setOrder(null);
                  setTrackingHistory([]);
                  setError(null);
                  navigate('/track');
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Nieuwe zoekopdracht
              </button>

              {/* Order Header */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Order {order.order_number}</h2>
                    <p className="text-gray-600">
                      Geplaatst op {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="font-semibold">{getStatusText(order.status)}</span>
                  </div>
                </div>

                {/* Tracking Code */}
                <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tracking Code</p>
                      <p className="text-2xl font-mono font-bold text-primary">{order.tracking_code}</p>
                    </div>
                    <Package className="w-12 h-12 text-primary/30" />
                  </div>
                </div>

                {/* Carrier Info */}
                {order.carrier_name && (
                  <div className="bg-purple-50 rounded-xl p-6 mb-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-purple-600 font-medium mb-1">Vervoerder</p>
                        <p className="text-lg font-bold text-purple-900 mb-2">{order.carrier_name}</p>
                        {order.tracking_code && (
                          <p className="text-sm text-purple-700">
                            Track & Trace: {order.tracking_code}
                          </p>
                        )}
                      </div>
                      {order.carrier_tracking_url && (
                        <a
                          href={order.carrier_tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Volg bij {order.carrier_name}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-bold mb-4">Bestelde producten</h3>
                  <div className="space-y-3">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-gray-600">Aantal: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">€{(item.price_at_purchase * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 mt-4 border-t-2 border-gray-200">
                    <p className="text-lg font-bold">Totaal</p>
                    <p className="text-2xl font-bold text-primary">€{order.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  Tracking History
                </h3>

                {trackingHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nog geen tracking informatie beschikbaar</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {trackingHistory.map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pl-8 pb-6 last:pb-0"
                      >
                        {/* Timeline Line */}
                        {index < trackingHistory.length - 1 && (
                          <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-200" />
                        )}

                        {/* Timeline Dot */}
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-4 border-primary" />

                        {/* Content */}
                        <div className={`p-4 rounded-xl ${index === 0 ? 'bg-primary/5 border-2 border-primary/20' : 'bg-gray-50'}`}>
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(entry.status)}
                              <h4 className="font-bold text-lg">{getStatusText(entry.status)}</h4>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              {formatDate(entry.created_at)}
                            </div>
                          </div>
                          {entry.description && (
                            <p className="text-gray-700 ml-8">{entry.description}</p>
                          )}
                          {entry.location && (
                            <p className="text-sm text-gray-500 ml-8 mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {entry.location}
                            </p>
                          )}
                          {entry.is_automated && (
                            <p className="text-xs text-gray-400 ml-8 mt-2">Automatische update</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-lg font-bold mb-4">Bezorgadres</h3>
                <div className="text-gray-700">
                  <p>{order.shipping_address.street} {order.shipping_address.houseNumber}</p>
                  <p>{order.shipping_address.postalCode} {order.shipping_address.city}</p>
                  <p>{order.shipping_address.country}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default TrackOrder;

