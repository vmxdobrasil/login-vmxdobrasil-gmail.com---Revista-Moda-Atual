migrate(
  (app) => {
    const posts = app.findCollectionByNameOrId('magazine_posts')
    posts.fields.add(
      new SelectField({
        name: 'status',
        values: ['draft', 'review', 'published'],
        maxSelect: 1,
      }),
    )
    posts.addIndex('idx_posts_status', false, 'status', '')
    app.save(posts)

    const users = app.findCollectionByNameOrId('users')
    users.fields.add(new TextField({ name: 'bio' }))
    users.fields.add(new TextField({ name: 'role' }))
    users.fields.add(new JSONField({ name: 'social_links' }))
    app.save(users)

    const media = new Collection({
      name: 'media_assets',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'file',
          type: 'file',
          required: false,
          maxSelect: 1,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        },
        { name: 'alt_text', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(media)

    const events = new Collection({
      name: 'fashion_events',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'date', type: 'date', required: true },
        { name: 'location', type: 'text' },
        {
          name: 'image',
          type: 'file',
          maxSelect: 1,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(events)

    // Migrate existing data statuses
    app
      .db()
      .newQuery(
        `UPDATE magazine_posts SET status = 'published' WHERE is_published = 1 OR is_published = 'true'`,
      )
      .execute()
    app
      .db()
      .newQuery(
        `UPDATE magazine_posts SET status = 'draft' WHERE is_published = 0 OR is_published = 'false' OR is_published IS NULL`,
      )
      .execute()
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('fashion_events'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('media_assets'))
    } catch (_) {}

    const posts = app.findCollectionByNameOrId('magazine_posts')
    posts.removeIndex('idx_posts_status')
    posts.fields.removeByName('status')
    app.save(posts)

    const users = app.findCollectionByNameOrId('users')
    users.fields.removeByName('bio')
    users.fields.removeByName('role')
    users.fields.removeByName('social_links')
    app.save(users)
  },
)
