migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('magazine_posts')

    if (!col.fields.getByName('para_category')) {
      col.fields.add(
        new SelectField({
          name: 'para_category',
          values: ['projects', 'areas', 'resources', 'archive'],
          maxSelect: 1,
        }),
      )
    }
    if (!col.fields.getByName('content_voice')) {
      col.fields.add(
        new SelectField({
          name: 'content_voice',
          values: ['editorial', 'commercial', 'conversion'],
          maxSelect: 1,
        }),
      )
    }
    if (!col.fields.getByName('hook')) {
      col.fields.add(new TextField({ name: 'hook' }))
    }
    if (!col.fields.getByName('seo_keywords')) {
      col.fields.add(new TextField({ name: 'seo_keywords' }))
    }
    if (!col.fields.getByName('hashtags')) {
      col.fields.add(new TextField({ name: 'hashtags' }))
    }
    if (!col.fields.getByName('cta_text')) {
      col.fields.add(new TextField({ name: 'cta_text' }))
    }

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('magazine_posts')

    col.fields.removeByName('para_category')
    col.fields.removeByName('content_voice')
    col.fields.removeByName('hook')
    col.fields.removeByName('seo_keywords')
    col.fields.removeByName('hashtags')
    col.fields.removeByName('cta_text')

    app.save(col)
  },
)
