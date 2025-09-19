import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user authentication
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const datasetData = await req.json();
    
    console.log('Saving dataset for user:', user.id);
    console.log('Dataset data:', JSON.stringify(datasetData, null, 2));

    // Insert dataset into database
    const { data, error } = await supabaseClient
      .from('datasets')
      .insert({
        user_id: user.id,
        name: datasetData.name,
        columns: datasetData.columns,
        row_count: datasetData.row_count,
        sample_rows: datasetData.sample_rows,
        chart_config: datasetData.chart_config,
        file_url: datasetData.file_url || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving dataset:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Dataset saved successfully:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        datasetId: data.id,
        message: 'Dataset saved successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in save-dataset function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});