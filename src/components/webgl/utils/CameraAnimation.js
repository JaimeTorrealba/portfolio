import { gsap } from 'gsap'

export const OSSPos = (camera) => {
    gsap.to(camera.position, {
        duration: 1.5, x:15, y: 3.5, z: 25,  ease: 'power2.out', onUpdate: () => {
          camera.updateProjectionMatrix()
          camera.lookAt(0, 3.5, 0)
        }
      })
}

export const initPos = (camera) => {
    gsap.to(camera.position, {
        duration: 1,x:0, y: 3.5, z: 25, ease: 'power2.out', onUpdate: () => {
          camera.updateProjectionMatrix()
          camera.lookAt(0, 3.5, 0)
        }
      })
}

export const contactPos = (camera) => {
    gsap.to(camera.position, {
        duration: 1,x:-15, y: 3.5, z: 25,  ease: 'power2.out', onUpdate: () => {
          camera.updateProjectionMatrix()
          camera.lookAt(0, 3.5, 0)
        }
      })
}
// TODO add settings view
export const latestExperiencePos = (camera) => {
    gsap.to(camera.position, {
        duration: 1,x:0, y: 3.5, z: 15, ease: 'power2.out', onUpdate: () => {
          camera.updateProjectionMatrix()
          camera.lookAt(0, 3.5, 0)
        }
      })
}