
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = "AIzaSyBhIyTAAKEBD7QNPrnXidDq49Lwo9azBsA";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, isImageRequest } = await req.json();
    console.log('Received request:', { message, isImageRequest });

    if (isImageRequest) {
      // Use Imagen model for image generation
      const imageResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImage?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: {
              text: message
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_LOW_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH", 
                threshold: "BLOCK_LOW_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_LOW_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_LOW_AND_ABOVE"
              }
            ]
          }),
        }
      );

      if (!imageResponse.ok) {
        const errorText = await imageResponse.text();
        console.error('Imagen API error:', errorText);
        throw new Error(`Imagen API error: ${imageResponse.status} - ${errorText}`);
      }

      const imageData = await imageResponse.json();
      console.log('Image generation response:', imageData);

      if (imageData.candidates && imageData.candidates[0]) {
        const imageBase64 = imageData.candidates[0].image.data;
        return new Response(
          JSON.stringify({ 
            response: `data:image/jpeg;base64,${imageBase64}`,
            isImage: true 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        throw new Error('No image generated');
      }
    } else {
      // Use Gemini Pro for text generation
      const textResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: message
                  }
                ]
              }
            ],
            safetySettings: [
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_LOW_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_LOW_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HARASSMENT", 
                threshold: "BLOCK_LOW_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_LOW_AND_ABOVE"
              }
            ]
          }),
        }
      );

      if (!textResponse.ok) {
        const errorText = await textResponse.text();
        console.error('Gemini API error:', errorText);
        throw new Error(`Gemini API error: ${textResponse.status} - ${errorText}`);
      }

      const textData = await textResponse.json();
      console.log('Text generation response:', textData);

      if (textData.candidates && textData.candidates[0] && textData.candidates[0].content) {
        const generatedText = textData.candidates[0].content.parts[0].text;
        return new Response(
          JSON.stringify({ 
            response: generatedText,
            isImage: false 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        throw new Error('No text generated');
      }
    }
  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate response. Please try again.',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
