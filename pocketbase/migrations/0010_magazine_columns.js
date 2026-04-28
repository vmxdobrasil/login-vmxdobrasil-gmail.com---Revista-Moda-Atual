migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('magazine_posts')
    if (!col.fields.getByName('gallery')) {
      col.fields.add(
        new FileField({
          name: 'gallery',
          maxSelect: 10,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        }),
      )
    }
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('magazine_posts')
    col.fields.removeByName('gallery')
    app.save(col)
  },
)
