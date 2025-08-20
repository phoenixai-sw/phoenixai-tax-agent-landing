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
    const { model, messages, max_tokens, temperature } = requestBody;

    // 필수 파라미터 검증
    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Messages array is required' })
      };
    }

    // Anthropic API 키 확인
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Anthropic API key not configured',
          message: '관리자에게 API 키 설정을 요청하세요.'
        })
      };
    }

    // Anthropic Claude API 호출
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-3-5-sonnet-20241022',
        max_tokens: max_tokens || 800,
        messages: messages
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Anthropic Claude API 오류:', errorData);
      
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: 'Anthropic Claude API 호출 실패',
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
    console.error('❌ Anthropic Claude API 함수 오류:', error);
    
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
