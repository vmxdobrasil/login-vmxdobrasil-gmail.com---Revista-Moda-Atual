migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('fashion_events')

    const records = [
      {
        title: 'Gisele Bündchen & Paulo Borges',
        description: 'SPFW 2026 - Abertura Oficial',
        is_spotlight: true,
        display_order: 1,
        date: new Date().toISOString(),
      },
      {
        title: 'Marina Ruy Barbosa',
        description: 'Bastidores do desfile exclusivo',
        is_spotlight: false,
        display_order: 2,
        date: new Date().toISOString(),
      },
      {
        title: 'Bruna Marquezine & Convidados',
        description: 'Festa de encerramento VIP em São Paulo',
        is_spotlight: false,
        display_order: 3,
        date: new Date().toISOString(),
      },
    ]

    records.forEach((data) => {
      try {
        app.findFirstRecordByData('fashion_events', 'title', data.title)
      } catch (_) {
        const record = new Record(collection)
        Object.entries(data).forEach(([k, v]) => record.set(k, v))
        app.save(record)
      }
    })
  },
  (app) => {
    // down not required
  },
)
