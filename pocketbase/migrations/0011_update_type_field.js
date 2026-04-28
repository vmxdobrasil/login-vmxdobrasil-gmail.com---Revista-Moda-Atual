migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('magazine_posts')
    const typeField = col.fields.getByName('type')
    if (typeField) {
      typeField.selectValues = [
        'social',
        'trends',
        'interview',
        'marketing',
        'style',
        'brand_history',
        'sacoleira',
      ]
    }
    app.save(col)
  },
  (app) => {
    // no-op down migration for select values
  },
)
