migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('magazine_posts')
    if (!col.fields.getByName('columnist_bio')) {
      col.fields.add(new TextField({ name: 'columnist_bio' }))
    }
    if (!col.fields.getByName('columnist_photo')) {
      col.fields.add(
        new FileField({
          name: 'columnist_photo',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        }),
      )
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('magazine_posts')
    col.fields.removeByName('columnist_bio')
    col.fields.removeByName('columnist_photo')
    app.save(col)
  },
)
