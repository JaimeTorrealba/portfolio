import { gsap } from 'gsap'

export const aboutViewAnimation = (camera) => {
    gsap.to(camera.position, {
        duration: 1.5, y: 0.5, z: 10, x:0, ease: 'power2.out', onUpdate: () => {
          camera.updateProjectionMatrix()
          camera.lookAt(0, 3.5, 0)
        }
      })
}

export const originalPosition = (camera) => {
    gsap.to(camera.position, {
        duration: 1, y: 3.5, z: 25, x:0, ease: 'power2.out', onUpdate: () => {
          camera.updateProjectionMatrix()
          camera.lookAt(0, 3.5, 0)
        }
      })
}

export const contactViewPosition = (camera) => {
    gsap.to(camera.position, {
        duration: 1, y: 3.5, z: 25, x:-15, ease: 'power2.out', onUpdate: () => {
          camera.updateProjectionMatrix()
          camera.lookAt(0, 3.5, 0)
        }
      })
}
// TODO add settings view
export const settingsViewPosition = (camera) => {
    gsap.to(camera.position, {
        duration: 1, y: 3.5, z: 25, x:15, ease: 'power2.out', onUpdate: () => {
          camera.updateProjectionMatrix()
          camera.lookAt(0, 3.5, 0)
        }
      })
}