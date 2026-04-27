routerAdd(
  'POST',
  '/backend/v1/ai/editor',
  (e) => {
    const body = e.requestInfo().body
    if (!body.content) return e.badRequestError('Content is required')

    const prompt = `Você é o Editor Estratégico da revista Moda Atual. 
Analise o seguinte conteúdo e forneça:
1. 3 sugestões de títulos de alto impacto e SEO (no máximo 60 caracteres cada).
2. Uma Meta-Description otimizada para SEO (no máximo 160 caracteres).
3. Uma lista de hashtags separadas por espaço para Instagram, TikTok e LinkedIn.

Retorne APENAS um objeto JSON com a seguinte estrutura e NADA MAIS:
{
  "titles": ["Título 1", "Título 2", "Título 3"],
  "meta_description": "A meta description...",
  "hashtags": "#moda #tendencia #fashion"
}

Conteúdo:
${body.content}`

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
