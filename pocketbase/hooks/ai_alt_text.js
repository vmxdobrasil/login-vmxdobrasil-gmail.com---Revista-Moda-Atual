routerAdd(
  'POST',
  '/backend/v1/ai/alt-text',
  (e) => {
    const body = e.requestInfo().body
    if (!body.image) return e.badRequestError('Image base64 is required')

    const res = $http.send({
      url: 'https://api.openai.com/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + $secrets.get('OPENAI_API_KEY'),
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Descreva esta imagem de forma concisa e precisa para uso como alt-text de acessibilidade. Retorne APENAS o texto descritivo. Máximo de 150 caracteres.',
              },
              { type: 'image_url', image_url: { url: body.image } },
            ],
          },
        ],
      }),
    })

    if (res.statusCode !== 200) {
      return e.internalServerError('Failed to communicate with AI')
    }

    const aiContent = res.json.choices[0].message.content.trim()
    return e.json(200, { alt_text: aiContent })
  },
  $apis.requireAuth(),
)
