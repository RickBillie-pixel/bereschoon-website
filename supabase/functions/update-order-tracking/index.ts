import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TrackingUpdate {
  orderId: string;
  status?: string;
  carrierName?: string;
  carrierTrackingUrl?: string;
  trackingCode?: string;
  location?: string;
  description?: string;
  sendEmail?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Configuratie ontbreekt');
    }

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Niet geautoriseerd' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client with user's token
    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      global: {
        headers: { Authorization: authHeader }
      }
    });

    // Verify user is admin
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Niet geautoriseerd' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!adminUser) {
      return new Response(
        JSON.stringify({ error: 'Alleen admins kunnen tracking informatie updaten' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const body: TrackingUpdate = await req.json();
    const { 
      orderId, 
      status, 
      carrierName, 
      carrierTrackingUrl, 
      trackingCode,
      location,
      description,
      sendEmail = true
    } = body;

    if (!orderId) {
      throw new Error('Order ID is verplicht');
    }

    // Get current order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error('Order niet gevonden');
    }

    // Prepare update data
    const updateData: Record<string, any> = {};
    
    if (status) {
      updateData.status = status;
      
      // Set timestamps based on status
      if (status === 'shipped' && !order.shipped_at) {
        updateData.shipped_at = new Date().toISOString();
      } else if (status === 'delivered' && !order.delivered_at) {
        updateData.delivered_at = new Date().toISOString();
      }
    }
    
    if (carrierName !== undefined) updateData.carrier_name = carrierName;
    if (carrierTrackingUrl !== undefined) updateData.carrier_tracking_url = carrierTrackingUrl;
    if (trackingCode !== undefined) updateData.tracking_code = trackingCode;

    // Update order if there are changes
    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (updateError) {
        console.error('Order update error:', updateError);
        throw new Error('Kon order niet updaten');
      }
    }

    // Add tracking history entry
    let historyDescription = description;
    if (!historyDescription && status) {
      // Generate default description based on status
      switch (status) {
        case 'processing':
          historyDescription = 'Je bestelling wordt verwerkt en klaargezet voor verzending';
          break;
        case 'shipped':
          historyDescription = carrierName 
            ? `Je bestelling is verzonden via ${carrierName}` 
            : 'Je bestelling is verzonden';
          break;
        case 'delivered':
          historyDescription = 'Je bestelling is succesvol afgeleverd';
          break;
        case 'cancelled':
          historyDescription = 'Bestelling is geannuleerd';
          break;
        default:
          historyDescription = `Status gewijzigd naar: ${status}`;
      }
    }

    if (status || description) {
      try {
        await supabase.rpc('add_tracking_history', {
          p_order_id: orderId,
          p_status: status || order.status,
          p_location: location || null,
          p_description: historyDescription || null,
          p_is_automated: false,
          p_carrier_status: null
        });
      } catch (trackingError) {
        console.error('Failed to add tracking history:', trackingError);
      }
    }

    // Email functionality removed - tracking is available via tracking page

    // Get updated order with tracking history
    const { data: updatedOrder, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        order_tracking_history (
          id,
          status,
          location,
          description,
          created_at,
          is_automated,
          carrier_status
        )
      `)
      .eq('id', orderId)
      .single();

    if (fetchError) {
      console.error('Failed to fetch updated order:', fetchError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Tracking informatie succesvol bijgewerkt',
        order: updatedOrder || order
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Update tracking error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Er is een fout opgetreden'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});

