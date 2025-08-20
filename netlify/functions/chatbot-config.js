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
    // 환경변수에서 API 키 가져오기
    const config = {
      openai: {
        apiKey: process.env.OPENAI_API_KEY || '',
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        enabled: !!process.env.OPENAI_API_KEY
      },
      google: {
        apiKey: process.env.GOOGLE_API_KEY || '',
        model: process.env.GOOGLE_MODEL || 'gemini-flash-2.5',
        enabled: !!process.env.GOOGLE_API_KEY
      },
      timestamp: new Date().toISOString(),
      source: 'netlify-environment'
    };

    // API 키가 설정되지 않은 경우 경고
    if (!config.openai.apiKey && !config.google.apiKey) {
      console.warn('⚠️ 환경변수에 API 키가 설정되지 않았습니다.');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(config)
    };
  } catch (error) {
    console.error('❌ 설정 로드 중 오류:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: '설정을 가져올 수 없습니다.',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
