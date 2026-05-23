routerAdd(
  'POST',
  '/backend/v1/ai/editor-strategic',
  (e) => {
    const body = e.requestInfo().body
    const content = body.content || ''
    const voice = body.content_voice || 'commercial'
    const para = body.para_category || 'projects'
    const isReels = body.is_reels === true
    const trend = body.trend_curatorship || ''

    let url = $secrets.get('SKIP_AI_GATEWAY_URL')
    if (!url) {
      throw new BadRequestError('AI Gateway URL not configured')
    }
    if (url.endsWith('/')) url = url.slice(0, -1)

    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + $secrets.get('SKIP_AI_GATEWAY_API_KEY'),
    }

    const systemPrompt = `Você é a "Editora de Moda" e Estratégica de Conteúdo Digital da Revista Moda Atual Digital e V MODA BRASIL.
Sua especialidade técnica abrange:
- Curadoria de Moda: Acessórios, calçados, texturas, materiais e styling.
- Beleza e Colorimetria: Tons de pele, paletas sazonais e tendências de maquiagem.
- Mercado Atacadista: Profundo conhecimento das tendências dos polos de moda de Goiás e do Brasil.

Base de Conhecimento Estratégica:
- Camada 1: Glossário Atacadista (Markup, Grade, Dropshipping, Comissão em Cascata).
- Camada 2: Artigos e legendas de sucesso anteriores.
- Camada 3: Estruturas de comissão e propostas comerciais da V MODA BRASIL.
- Camada 4: Moda atacado, polos de moda (Goiás e Brasil), curadoria de moda, e tendências de cores/beleza.

Metodologia PARA: Categoria atual é '${para}'
- Projects: Pautas ativas da revista e campanhas de marketplace.
- Areas: Moda atacado, polos de Goiás, gestão de loja e tendências.
- Resources: Referências visuais, dados de mercado e artigos de arquivo.
- Archive: Conteúdo concluído para reativação sazonal.

Voz do Conteúdo: '${voice}'.
- Editorial: Formal, com autoridade, focada em tendências.
- Commercial: Focada em parcerias e marketplace (V MODA BRASIL).
- Conversion: Urgente, direta, focada em lojistas e sacoleiras.

Formato: ${isReels ? 'Roteiro para Reels com duração de 15 a 18 minutos (mencione @revistamodaatual)' : 'Texto digital/Post para Instagram (mencione @revistamodaatual)'}.

Sua tarefa é reescrever o texto fornecido pelo usuário e integrar a seguinte curadoria de tendências (se fornecida):
Curadoria de Tendências: ${trend}

Regras:
1. Hook de 2 segundos: frase de impacto obrigatória.
2. Desenvolvimento usando gatilhos mentais adequados à Voz do Conteúdo escolhida.
3. Roteiro/Lógica: Planeje o conteúdo com a lógica de Reels para preencher exatamente entre 15 e 18 minutos (mesmo em texto).
4. SEO Keywords: use obrigatoriamente todas estas palavras-chave: "moda atacado", "polo de moda", "lojista de moda", "confecção brasileira", "moda Goiás", "marketplace de moda", "gestão de loja".
5. Duplo CTA obrigatório: "Seguir o perfil @revistamodaatual e compartilhar com outro lojista."
6. EXATAMENTE 7 hashtags estratégicas começando com #.
7. Otimização para Instagram: Foco total no perfil @revistamodaatual, maximizando engajamento e conversão.

Retorne APENAS um objeto JSON com a seguinte estrutura (sem markdown, sem blocos de código):
{
  "hook": "Uma frase de impacto para os 2 primeiros segundos",
  "content": "O texto desenvolvido ou roteiro em HTML simples (<p>, <strong>)",
  "seo_keywords": "Lista de palavras-chave separadas por vírgula",
  "cta_text": "Seguir o perfil @revistamodaatual e compartilhar com outro lojista.",
  "hashtags": "EXATAMENTE 7 hashtags estratégicas começando com #"
}`

    const res = $http.send({
      url: url + '/v1/chat/completions',
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Texto base:\n' + content },
        ],
        response_format: { type: 'json_object' },
      }),
      timeout: 30,
    })

    if (res.statusCode !== 200) {
      throw new BadRequestError('Falha na API de IA', { error: res.json })
    }

    const aiMessage = res.json?.choices?.[0]?.message?.content
    if (!aiMessage) {
      throw new BadRequestError('Resposta vazia da IA')
    }

    let parsed
    try {
      parsed = JSON.parse(aiMessage)
    } catch (err) {
      throw new BadRequestError('Resposta inválida da IA')
    }

    return e.json(200, parsed)
  },
  $apis.requireAuth(),
)
