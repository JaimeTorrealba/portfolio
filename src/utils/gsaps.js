import gsap from 'gsap'

export const showText = (elem) => {
  const tl = gsap.timeline()

  return tl.from(elem, {
    yPercent: 300,
    ease: 'Power3.out',
    stagger: 0.01,
    duration: 1,
    delay: 0,
  })
}

export const appear = (elem) => {
  const tl = gsap.timeline()
  return tl.to(elem, {
    y: 0,
    opacity: 1,
    duration: 1,
    delay: 1,
  })
}