const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // CORS 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 200, 
      headers,
      body: ''
    };
  }

  try {
    // POST 요청만 처리
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // 요청 본문 파싱
    const requestBody = JSON.parse(event.body);
    const { model, prompt, maxOutputTokens, temperature } = requestBody;

    // 필수 파라미터 검증
    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Prompt is required' })
      };
    }

    // Google API 키 확인
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Google API key not configured',
          message: '관리자에게 API 키 설정을 요청하세요.'
        })
      };
    }

    // Google Gemini API 호출
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-flash-2.5'}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: maxOutputTokens || 800,
          temperature: temperature || 0.7
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Google Gemini API 오류:', errorData);
      
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: 'Google Gemini API 호출 실패',
          message: errorData.error?.message || 'API 호출 중 오류가 발생했습니다.',
          details: errorData
        })
      };
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('❌ Google Gemini API 함수 오류:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: '서버 내부 오류',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
