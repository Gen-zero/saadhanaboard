import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WaitlistRequest {
  name: string;
  email: string;
  reason?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, reason }: WaitlistRequest = await req.json();

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: 'Name and email are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Processing waitlist submission:', { name, email });

    // Get the Google Sheets webhook URL from secrets
    const googleSheetsUrl = Deno.env.get('GOOGLE_SHEETS_WEBHOOK_URL');
    
    if (!googleSheetsUrl) {
      console.error('GOOGLE_SHEETS_WEBHOOK_URL not configured');
      return new Response(
        JSON.stringify({ error: 'Google Sheets integration not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Send data to Google Sheets
    const timestamp = new Date().toISOString();
    const sheetsResponse = await fetch(googleSheetsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        reason: reason || '',
        timestamp,
      }),
    });

    if (!sheetsResponse.ok) {
      const errorText = await sheetsResponse.text();
      console.error('Google Sheets API error:', errorText);
      throw new Error(`Failed to save to Google Sheets: ${sheetsResponse.status}`);
    }

    console.log('Successfully saved to Google Sheets');

    return new Response(
      JSON.stringify({ 
        message: 'Successfully joined the waiting list!',
        success: true 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in submit-waitlist function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to join waitlist' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
