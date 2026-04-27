routerAdd('POST', '/backend/v1/ai/chat', (e) => {
  const body = e.requestInfo().body
  if (!body.messages) return e.badRequestError('Messages are required')

  const systemPrompt = `Você é o "Assistente ModaAtual", um assistente virtual amigável, profissional e sofisticado da revista Moda Atual.
Sua função é guiar os leitores, responder perguntas básicas sobre a revista e capturar leads.
Nossas principais colunas:
- Holofote (Social) assinada por Fábia Mendonça
- Marketing assinada por Valter Mendonça
- Sacoleira assinada pela Redação
- Estilo, Tendências e Entrevistas

Se o usuário demonstrar interesse em "Anunciar" (Mídia Kit, parcerias) ou "Assinar" a revista, você DEVE usar a ferramenta (function) 'capture_lead' para registrar o interesse, pedindo o nome e email deles antes se não tiver.
Seja conciso, elegante e prestativo.`

  const tools = [
    {
      type: 'function',
      function: {
        name: 'capture_lead',
        description:
          'Captura os dados de um usuário interessado em anunciar ou assinar a revista Moda Atual.',
        parameters: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Nome do usuário' },
            email: { type: 'string', description: 'Email do usuário' },
            type: {
              type: 'string',
              enum: ['advertise', 'subscribe'],
              description: "Tipo de interesse: 'advertise' ou 'subscribe'",
            },
            notes: { type: 'string', description: 'Notas ou contexto adicionais' },
          },
          required: ['name', 'email', 'type'],
        },
      },
    },
  ]

  const res = $http.send({
    url: 'https://api.openai.com/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + $secrets.get('OPENAI_API_KEY'),
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: systemPrompt }, ...body.messages],
      tools: tools,
      tool_choice: 'auto',
    }),
  })

  if (res.statusCode !== 200) {
    return e.internalServerError('Failed to communicate with AI')
  }

  const aiMessage = res.json.choices[0].message

  if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
    const toolCall = aiMessage.tool_calls[0]
    if (toolCall.function.name === 'capture_lead') {
      let args = {}
      try {
        args = JSON.parse(toolCall.function.arguments)
      } catch (err) {}

      try {
        const collection = $app.findCollectionByNameOrId('leads')
        const record = new Record(collection)
        record.set('name', args.name || 'Sem Nome')
        record.set('email', args.email || 'Sem Email')
        record.set('type', args.type || 'subscribe')
        record.set('notes', args.notes || '')
        $app.save(record)
      } catch (err) {
        console.log('Failed to save lead', err)
      }

      const secondRes = $http.send({
        url: 'https://api.openai.com/v1/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + $secrets.get('OPENAI_API_KEY'),
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...body.messages,
            aiMessage,
            {
              role: 'tool',
              tool_call_id: toolCall.id,
              name: toolCall.function.name,
              content: 'Lead salvo com sucesso. Agradeça ao usuário.',
            },
          ],
        }),
      })

      if (secondRes.statusCode === 200) {
        return e.json(200, { message: secondRes.json.choices[0].message })
      }
    }
  }

  return e.json(200, { message: aiMessage })
})
