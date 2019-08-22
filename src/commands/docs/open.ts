import { GluegunCommand } from 'gluegun'
import * as open from 'open'
import { ExtendedGluegunToolbox } from '../../interfaces/extended-gluegun-toolbox'

/**
 * Open documentations
 */
const NewCommand: GluegunCommand = {
  name: 'open',
  alias: ['o'],
  description: 'Open documentation',
  hidden: false,
  run: async (toolbox: ExtendedGluegunToolbox) => {
    // Retrieve the tools we need
    const {
      helper,
      parameters,
      print: { error },
      prompt: { ask }
    } = toolbox

    const choices = ['lenne.Tech', 'NestJS', 'GlueGun']

    // Get input
    let input = await helper.getInput(parameters.first, {
      name: 'doc',
      showError: true
    })
    if (!input || !choices.includes(input)) {
      // Select type
      const { type } = await ask({
        type: 'select',
        name: 'type',
        message: 'Select',
        choices: choices.slice(0)
      })
      input = type
    }

    switch (input) {
      case choices[0]: {
        await open('http://lenne.tech')
        break
      }
      case choices[1]: {
        await open('https://docs.nestjs.com/')
        break
      }
      case choices[2]: {
        await open('https://infinitered.github.io/gluegun/#/?id=quick-start')
        break
      }
      default: {
        error(`${input} not found!`)
        return
      }
    }

    // For tests
    return `docs open`
  }
}

export default NewCommand
