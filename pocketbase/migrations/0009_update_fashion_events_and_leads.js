migrate(
  (app) => {
    const eventsCol = app.findCollectionByNameOrId('fashion_events')
    if (!eventsCol.fields.getByName('category')) {
      eventsCol.fields.add(
        new SelectField({
          name: 'category',
          values: ['Desfile', 'Festa', 'Tapete Vermelho', 'Outros'],
          maxSelect: 1,
        }),
      )
    }
    if (!eventsCol.fields.getByName('gallery_data')) {
      eventsCol.fields.add(new JSONField({ name: 'gallery_data' }))
    }
    app.save(eventsCol)

    const leadsCol = app.findCollectionByNameOrId('leads')
    leadsCol.listRule = "@request.auth.id != ''"
    app.save(leadsCol)
  },
  (app) => {
    const eventsCol = app.findCollectionByNameOrId('fashion_events')
    eventsCol.fields.removeByName('category')
    eventsCol.fields.removeByName('gallery_data')
    app.save(eventsCol)
  },
)
