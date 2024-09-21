const config = plop => {
  plop.setGenerator('component', {
    description: 'A component generator for the app',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Enter component name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/elements/{{dashCase name}}/{{dashCase name}}.tsx',
        templateFile: 'plop/templates/components/component.hbs',
      },
      {
        type: 'add',
        path: 'src/components/elements/{{dashCase name}}/{{dashCase name}}.module.scss',
        templateFile: 'plop/templates/components/component.module.hbs',
      },
    ],
  }),
    plop.setGenerator('container', {
      description: 'A container generator for the app',
      prompts: [
        {
          type: 'input',
          name: 'name',
          message: 'Enter container name',
        },
      ],
      actions: [
        {
          type: 'add',
          path: 'src/components/containers/{{dashCase name}}/{{dashCase name}}.tsx',
          templateFile: 'plop/templates/components/section.hbs',
        },
        {
          type: 'add',
          path: 'src/components/containers/{{dashCase name}}/{{dashCase name}}.module.scss',
          templateFile: 'plop/templates/components/section.module.hbs',
        },
      ],
    });
};

module.exports = config;
