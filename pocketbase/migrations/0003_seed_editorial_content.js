migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'valterpmendonca@gmail.com')
    } catch (_) {
      const record = new Record(users)
      record.setEmail('valterpmendonca@gmail.com')
      record.setPassword('Skip@Pass')
      record.setVerified(true)
      record.set('name', 'Admin Editor')
      app.save(record)
    }

    const posts = app.findCollectionByNameOrId('magazine_posts')
    const seeds = [
      {
        title: 'O Retorno do Glamour nas Festas Paulistanas',
        subtitle: 'As celebridades que marcaram presença no baile de gala de inverno.',
        author: 'Fábia Mendonça',
        content:
          '<p>A noite de ontem foi marcada por muito brilho e sofisticação no coração de São Paulo. Entre os convidados mais aguardados, grandes nomes da moda não decepcionaram.</p>',
        type: 'social',
        is_published: true,
      },
      {
        title: 'Como o Digital Influencia o Varejo Físico',
        subtitle: 'Estratégias de integração omnichannel para marcas de luxo.',
        author: 'Valter Mendonça',
        content:
          '<p>O marketing de moda nunca foi tão dependente de dados. Hoje em dia, a jornada do cliente começa online e termina na loja física com uma experiência imersiva e personalizada.</p>',
        type: 'marketing',
        is_published: true,
      },
      {
        title: 'Do Sonho à Vitrine: A Trajetória de Maria',
        subtitle: 'Como uma pequena confecção se tornou referência no bairro.',
        author: 'Redação',
        content:
          '<p>Maria começou vendendo roupas de porta em porta e hoje comanda uma confecção com 20 funcionários. Uma história inspiradora de persistência e amor pela moda brasileira.</p>',
        type: 'sacoleira',
        is_published: true,
      },
      {
        title: 'Conversa com o Estilista Revelação do Ano',
        subtitle: 'Uma entrevista exclusiva sobre inspirações e sustentabilidade.',
        author: 'Redação',
        content:
          '<p><strong>P:</strong> Quais foram suas maiores inspirações para esta coleção?<br/><strong>R:</strong> A natureza brasileira e as raízes da tecelagem artesanal que aprendi com minha avó.</p>',
        type: 'interview',
        is_published: false,
      },
    ]

    for (const seed of seeds) {
      try {
        app.findFirstRecordByData('magazine_posts', 'title', seed.title)
      } catch (_) {
        const record = new Record(posts)
        record.set('title', seed.title)
        record.set('subtitle', seed.subtitle)
        record.set('author', seed.author)
        record.set('content', seed.content)
        record.set('type', seed.type)
        record.set('is_published', seed.is_published)
        app.save(record)
      }
    }
  },
  (app) => {
    const titles = [
      'O Retorno do Glamour nas Festas Paulistanas',
      'Como o Digital Influencia o Varejo Físico',
      'Do Sonho à Vitrine: A Trajetória de Maria',
      'Conversa com o Estilista Revelação do Ano',
    ]
    for (const title of titles) {
      try {
        const record = app.findFirstRecordByData('magazine_posts', 'title', title)
        app.delete(record)
      } catch (_) {}
    }
  },
)
