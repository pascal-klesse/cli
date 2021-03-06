import * as crypto from 'crypto'
import { GluegunCommand } from 'gluegun'
import { join } from 'path'
import { ExtendedGluegunToolbox } from '../../interfaces/extended-gluegun-toolbox'

/**
 * Create a new server
 */
const NewCommand: GluegunCommand = {
  name: 'create',
  alias: ['c'],
  description: 'Creates a new server',
  hidden: false,
  run: async (toolbox: ExtendedGluegunToolbox) => {
    // Retrieve the tools we need
    const {
      filesystem,
      helper,
      meta,
      parameters,
      patching,
      print: { error, info, spin, success },
      prompt: { ask },
      strings: { kebabCase },
      system,
      template
    } = toolbox

    // Start timer
    const timer = system.startTimer()

    // Info
    info('Create a new server')

    // Git
    const git = !!system.which('git')

    // Get name
    const name = await helper.getInput(parameters.first, {
      name: 'server name',
      showError: true
    })
    if (!name) {
      return
    }

    // Set project directory
    const projectDir = kebabCase(name)

    // Check if directory already exists
    if (filesystem.exists(projectDir)) {
      info(``)
      error(`There's already a folder named "${projectDir}" here.`)
      return undefined
    }

    // Get source
    if (git) {
      let source = parameters.options.source
      if (!source) {
        source = (await ask({
          type: 'select',
          name: 'source',
          message: 'Which source should be used to create the server?',
          choices: [
            'Latest starter kit via git (recommended when online)',
            'Templates from local CLI (recommended when offline)'
          ]
        })).source
      }

      if (source && source.includes('git')) {
        // Clone git repository
        const cloneSpinner = spin(
          'Clone https://github.com/lenneTech/nest-server-starter.git'
        )
        await system.run(
          `git clone https://github.com/lenneTech/nest-server-starter.git ${projectDir}`
        )
        if (filesystem.isDirectory(`./${projectDir}`)) {
          filesystem.remove(`./${projectDir}/.git`)
          cloneSpinner.succeed(
            'Repository cloned from https://github.com/lenneTech/nest-server-starter.git'
          )
        }
      } else {
        // Copy templates
        filesystem.copy(
          join(__dirname, '../../templates/nest-server-starter'),
          projectDir
        )
      }
    } else {
      // Copy templates
      filesystem.copy(
        join(__dirname, '../../templates/nest-server-starter'),
        projectDir
      )
    }

    // Check directory
    if (!filesystem.isDirectory(`./${projectDir}`)) {
      error(`The directory "${projectDir}" could not be created.`)
      return undefined
    }

    const prepareSpinner = spin('Prepare files')

    // Set readme
    await template.generate({
      template: 'nest-server-starter-extra/README.md.ejs',
      target: `./${projectDir}/README.md`,
      props: { name }
    })

    // Set configuration
    await patching.replace(
      `./${projectDir}/src/config.env.ts`,
      'SECRET_OR_PRIVATE_KEY_DEV',
      crypto.randomBytes(512).toString('base64')
    )
    await patching.replace(
      `./${projectDir}/src/config.env.ts`,
      'SECRET_OR_PRIVATE_KEY_PROD',
      crypto.randomBytes(512).toString('base64')
    )

    // Set package.json
    await patching.update(`./${projectDir}/package.json`, config => {
      config.author = ''
      config.bugs = {
        url: ''
      }
      config.description = name
      config.homepage = ''
      config.name = projectDir
      config.repository = {
        type: 'git',
        url: ''
      }
      config.version = '0.0.1'
      return config
    })

    prepareSpinner.succeed('Files prepared')

    // Init
    const installSpinner = spin('Install npm packages')
    await system.run(`cd ${projectDir} && npm i`)
    installSpinner.succeed('NPM packages installed')
    if (git) {
      const initGitSpinner = spin('Initialize git')
      await system.run(
        `cd ${projectDir} && git init && git add . && git commit -am "Init via lenne.Tech CLI ${meta.version()}"`
      )
      initGitSpinner.succeed('Git initialized')
    }

    // We're done, so show what to do next
    info(``)
    success(
      `Generated ${name} server with lenne.Tech CLI ${meta.version()} in ${helper.msToMinutesAndSeconds(
        timer()
      )}m.`
    )
    info(``)
    info(`Next:`)
    info(`  Start database server (e.g. MongoDB)`)
    info(`  $ cd ${projectDir}`)
    info(`  $ npm run test:e2e`)
    info(``)

    // For tests
    return `new server ${toolbox.parameters.first}`
  }
}

export default NewCommand
