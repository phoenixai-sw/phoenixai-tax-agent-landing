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

    // OpenAI API 키 확인 (Netlify 환경변수 우선)
    let apiKey = process.env.DEFAULT_OPENAI_API_KEY;
    
    // 기본 키가 없으면 개인 키 사용
    if (!apiKey) {
      apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.log('❌ OpenAI API 키가 설정되지 않음');
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ 
            error: 'OpenAI API key not configured',
            message: 'Netlify 환경변수에 DEFAULT_OPENAI_API_KEY를 설정해주세요.'
          })
        };
      }
      console.log('⚠️ 개인 OpenAI API 키 사용 중');
    } else {
      console.log('✅ 기본 OpenAI API 키 사용 중');
    }

    // 메시지 배열 검증 및 정리
    const validatedMessages = messages.filter(msg => 
      msg && typeof msg === 'object' && 
      msg.role && typeof msg.role === 'string' && 
      msg.content && typeof msg.content === 'string'
    );

    if (validatedMessages.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '유효한 메시지가 없습니다.' })
      };
    }

    // 토큰 한도 계산 (복잡한 질문 대응)
    const safeMaxTokens = Math.min(max_tokens || 3000, 5000);
    
    console.log('🤖 OpenAI API 호출 정보:', {
      model: model || 'gpt-4o',
      messageCount: validatedMessages.length,
      maxTokens: safeMaxTokens,
      temperature: temperature || 0.7
    });

    // OpenAI API 호출
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model || 'gpt-4o',
        messages: validatedMessages,
        max_tokens: safeMaxTokens,
        temperature: temperature || 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API 오류:', errorData);
      
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: 'OpenAI API 호출 실패',
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
    console.error('❌ OpenAI API 함수 오류:', error);
    
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
