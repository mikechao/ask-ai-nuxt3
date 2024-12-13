// see all availabe configs here: https://github.com/viandwi24/nuxt3-awesome-starter/blob/v2/app.config.ts
export default defineAppConfig({
    awesome: {
      name: 'Ask AI',
      description:
        'Ask AI about text, audio or an image',
      author: {
        name: 'Mike Chao',
        links: {
          github: 'https://github.com/mikechao',
        },
      },
      project: {
        links: {
            github: '',
        }
      },
      layout: {
        page: {
            navbar: {
                menus: [{type: 'button', title:'Text', to: '/text'}]
            }
        }
      }
    },
})