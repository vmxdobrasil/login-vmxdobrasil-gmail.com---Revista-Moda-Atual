migrate(
  (app) => {
    try {
      const valter = app.findAuthRecordByEmail('users', 'valterpmendonca@gmail.com')
      valter.set('bio', 'Especialista em marketing de moda e editor-chefe da Revista Moda Atual.')
      valter.set('role', 'Editor de Marketing de Moda')
      app.save(valter)
    } catch (_) {}

    try {
      app.findAuthRecordByEmail('users', 'fabia@modaatual.com')
    } catch (_) {
      const users = app.findCollectionByNameOrId('users')
      const fabia = new Record(users)
      fabia.setEmail('fabia@modaatual.com')
      fabia.setPassword('Skip@Pass')
      fabia.setVerified(true)
      fabia.set('name', 'Fábia Mendonça')
      fabia.set('bio', 'Jornalista de moda focada em tendências, estilo e cultura.')
      fabia.set('role', 'Colunista Principal')
      app.save(fabia)
    }

    const eventsCol = app.findCollectionByNameOrId('fashion_events')
    const e1 = new Record(eventsCol)
    e1.set('title', 'São Paulo Fashion Week')
    e1.set('description', 'O maior evento de moda do Brasil com as principais marcas.')
    e1.set('date', '2026-10-15 10:00:00.000Z')
    e1.set('location', 'Pavilhão das Culturas Brasileiras, SP')
    app.save(e1)

    const e2 = new Record(eventsCol)
    e2.set('title', 'Lançamento Coleção Verão 2027')
    e2.set('description', 'Apresentação exclusiva das novas tendências para o verão.')
    e2.set('date', '2026-11-20 19:00:00.000Z')
    e2.set('location', 'Copacabana Palace, RJ')
    app.save(e2)

    const e3 = new Record(eventsCol)
    e3.set('title', 'Milano Fashion Week - Transmissão')
    e3.set('description', 'Cobertura ao vivo dos desfiles direto de Milão.')
    e3.set('date', '2026-09-20 08:00:00.000Z')
    e3.set('location', 'Online')
    app.save(e3)

    const mediaCol = app.findCollectionByNameOrId('media_assets')
    const m1 = new Record(mediaCol)
    m1.set('title', 'Capa Outono')
    m1.set('alt_text', 'Modelo com casaco de outono')
    app.save(m1)
    const m2 = new Record(mediaCol)
    m2.set('title', 'Editorial Inverno')
    m2.set('alt_text', 'Estilo de inverno nas ruas')
    app.save(m2)
    const m3 = new Record(mediaCol)
    m3.set('title', 'Acessórios 2026')
    m3.set('alt_text', 'Bolsas e sapatos em destaque')
    app.save(m3)
    const m4 = new Record(mediaCol)
    m4.set('title', 'Desfile SPFW')
    m4.set('alt_text', 'Passarela do SPFW')
    app.save(m4)
    const m5 = new Record(mediaCol)
    m5.set('title', 'Entrevista Exclusiva')
    m5.set('alt_text', 'Estúdio de gravação')
    app.save(m5)
  },
  (app) => {
    app.db().newQuery('DELETE FROM fashion_events').execute()
    app.db().newQuery('DELETE FROM media_assets').execute()
  },
)
