import { mergeComposeFiles } from './mergeComposeFiles'

const nodeProcess: any = { cwd: () => __dirname }

/**
 * Some notes on the recent V2 docker-compose config update and how it affects Dockest
 * @ref https://github.com/erikengervall/dockest/issues/283
 */

/** compose-file.yml
 version: '3.8'
 
 services:
   redis:
     image: redis:5.0.3-alpine
     ports:
       - 6379:6379/tcp
 */

/** pre V2 docker-compose config
services:
  redis:
    image: redis:5.0.3-alpine
    ports:
    - protocol: tcp
      published: 6379
      target: 6379
version: '3.8'
 */

/** post V2 docker-compose config
services:
  redis:
    image: redis:5.0.3-alpine
    networks:
      default: null
    ports:
    - mode: ingress
      target: 6379
      published: 6379
      protocol: tcp
networks:
  default:
    name: bootstrap_default
 */

describe('mergeComposeFiles', () => {
  describe('happy', () => {
    it('should work for single compose file', async () => {
      const { mergedComposeFiles } = await mergeComposeFiles('mergeComposeFiles.spec.yml', nodeProcess)

      expect(mergedComposeFiles).toContain('redis:')
      expect(mergedComposeFiles).toContain('image: redis:5.0.3-alpine')
      expect(mergedComposeFiles).toContain('ports:')
      expect(mergedComposeFiles).toContain('published: 6379')
      expect(mergedComposeFiles).toContain('target: 6379')
    })

    it('should work for multiple compose files', async () => {
      const { mergedComposeFiles } = await mergeComposeFiles(
        ['mergeComposeFiles.spec.yml', 'mergeComposeFiles2.spec.yml'],
        nodeProcess,
      )
      expect(mergedComposeFiles).toContain('postgres:')
      expect(mergedComposeFiles).toContain(`environment:
      POSTGRES_DB: nobueno
      POSTGRES_PASSWORD: is
      POSTGRES_USER: ramda`)
      expect(mergedComposeFiles).toContain('image: postgres:9.6-alpine')
      expect(mergedComposeFiles).toContain('published: 5433')
      expect(mergedComposeFiles).toContain('target: 5432')

      expect(mergedComposeFiles).toContain('redis:')
      expect(mergedComposeFiles).toContain('image: redis:5.0.3-alpine')
      expect(mergedComposeFiles).toContain('published: 6379')
      expect(mergedComposeFiles).toContain('target: 6379')
    })
  })

  describe('sad', () => {
    it('should throw if invalid name of compose file', async () => {
      const promise = mergeComposeFiles('this-file-does-not-exist.yml', nodeProcess)

      await expect(promise).rejects.toThrow('Invalid Compose file(s)')
    })
  })
})
