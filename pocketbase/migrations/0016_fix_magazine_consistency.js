migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('magazine_issues')

    // Ensure public access
    col.listRule = ''
    col.viewRule = ''
    app.save(col)

    // Seed "Edição Especial de Inverno 2026"
    try {
      app.findFirstRecordByData('magazine_issues', 'edition_number', 42)
    } catch (_) {
      const record = new Record(col)
      record.set('title', 'Edição Especial de Inverno 2026')
      record.set('edition_number', 42)
      record.set('publication_date', '2026-06-01 12:00:00.000Z')
      record.set('is_published', true)
      record.set('cover_image', 'cover_placeholder.jpg')
      record.set('pages', 'page_placeholder.jpg')
      app.save(record)
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData('magazine_issues', 'edition_number', 42)
      app.delete(record)
    } catch (_) {}
  },
)
