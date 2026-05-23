migrate(
  (app) => {
    const issues = app.findCollectionByNameOrId('magazine_issues')

    try {
      app.findFirstRecordByData('magazine_issues', 'title', 'Edição Especial de Inverno 2026')
      return // already exists
    } catch (_) {}

    const record = new Record(issues)
    record.set('title', 'Edição Especial de Inverno 2026')
    record.set('edition_number', 42)
    record.set('publication_date', '2026-06-01 12:00:00.000Z')
    record.set('is_published', true)

    // Note: we don't set files here to avoid using external URLs in DB values.
    // The frontend will gracefully fallback to dummy images when the DB fields are empty.
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData(
        'magazine_issues',
        'title',
        'Edição Especial de Inverno 2026',
      )
      app.delete(record)
    } catch (_) {}
  },
)
