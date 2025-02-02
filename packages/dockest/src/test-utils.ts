import { ReplaySubject } from 'rxjs'
import { DockestService, DockerComposeFile, Runner } from './@types'
import { Logger } from './Logger'

export const createRunner = (overrides?: Partial<Runner>): Runner => ({
  commands: [],
  containerId: '',
  dependsOn: [],
  dockerComposeFileService: { image: 'node:10-alpine', ports: [{ published: 3000, target: 3000 }] },
  dockerEventStream$: new ReplaySubject(),
  logger: new Logger('node'),
  readinessCheck: () => Promise.resolve(),
  serviceName: 'node',
  ...(overrides || {}),
})

export const DOCKEST_SERVICE: DockestService = {
  serviceName: 'redis',
}

export const DOCKER_COMPOSE_FILE: DockerComposeFile = {
  version: '3.8',
  services: {
    [DOCKEST_SERVICE.serviceName]: {
      image: 'redis:5.0.3-alpine',
      ports: [
        {
          published: 6379,
          target: 6379,
        },
      ],
    },
  },
}

export const MERGED_COMPOSE_FILES = `
services:
  redis:
    image: redis:5.0.3-alpine
    ports:
    - published: 6379
      target: 6379
version: '3.8'
`

export const MERGED_COMPOSE_FILES_VERSION_2_3_3_PLUS = `
name: application
services:
  redis:
    image: redis:5.0.3-alpine
    ports:
    - published: '6379'
      target: 6379
`
