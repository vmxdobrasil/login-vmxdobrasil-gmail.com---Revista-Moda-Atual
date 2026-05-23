routerAdd(
  'POST',
  '/backend/v1/ai/fashion-curator',
  (e) => {
    const body = e.requestInfo().body
    const { accessories, footwear, beauty, colors, trends, urgency } = body

    const prompt = `Você é o Editor Chefe de Moda da revista "@revistamodaatual".
Sua tarefa é criar um post curado de alta conversão para o Instagram focado nestas áreas:
- Acessórios: ${accessories || 'N/A'}
- Calçados: ${footwear || 'N/A'}
- Beleza: ${beauty || 'N/A'}
- Colorimetria: ${colors || 'N/A'}
- Tendências: ${trends || 'N/A'}

Urgência / Furo de Reportagem (First-hand news): ${
      urgency
        ? 'SIM. Trate como notícia de última hora, com tom de urgência e exclusividade ("Em primeira mão", "Urgente", etc).'
        : 'NÃO.'
    }

Crie um conteúdo completo, com tom profissional, autoritário, voltado para lojistas e fashionistas. Formate especificamente para Instagram (Reels ou Carrossel).

Retorne APENAS um objeto JSON válido com a seguinte estrutura:
{
  "title": "Manchete chamativa (máx 60 chars)",
  "hook": "Frase de gancho inicial de alto impacto (para prender a atenção nos primeiros 2s)",
  "content": "Texto do corpo em HTML (<p>, <strong>, etc) pronto para ser renderizado como texto no frontend. Crie uma narrativa coesa conectando os tópicos fornecidos.",
  "hashtags": "#moda #tendencia ... (pelo menos 7)",
  "cta_text": "Chamada para ação assertiva (ex: Comente 'EU QUERO')",
  "seo_keywords": "palavras-chave estratégicas separadas por vírgula"
}`

    const res = $http.send({
      url: 'https://api.openai.com/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + $secrets.get('OPENAI_API_KEY'),
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      }),
    })

    if (res.statusCode !== 200) {
      return e.internalServerError('Failed to communicate with AI')
    }

    try {
      const aiContent = JSON.parse(res.json.choices[0].message.content)
      return e.json(200, aiContent)
    } catch (err) {
      return e.internalServerError('Failed to parse AI response')
    }
  },
  $apis.requireAuth(),
)
