migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('fashion_events')
    col.fields.add(new BoolField({ name: 'is_spotlight' }))
    col.fields.add(new NumberField({ name: 'display_order', onlyInt: true }))
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('fashion_events')
    col.fields.removeByName('is_spotlight')
    col.fields.removeByName('display_order')
    app.save(col)
  },
)
