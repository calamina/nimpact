// composables/createTransitions.ts
import gsap from 'gsap'
import { nextTick } from 'vue'

export function useCreateTransition() {
  const onStepBeforeEnter = (el: Element) => {
    gsap.set(el, {
      opacity: 0,
      y: '0.4rem',
      overflow: 'clip',
    })
  }

  const onStepEnter = (el: Element, done: () => void) => {
    const target = el as HTMLElement

    gsap
      .timeline({ onComplete: done })
      .to(target, {
        duration: 0.2,
        ease: 'power3.out',
      })
      .to(target, {
        opacity: 1,
        y: 0,
        duration: 0.2,
        ease: 'power2.out',
      })
  }

  const onPhaseLeave = (el: Element, done: () => void) => {
    const target = el as HTMLElement

    gsap.to(target, {
      opacity: 0,
      duration: 0.12,
      ease: 'power2.in',
      onComplete: done,
    })
  }

  const onPhaseBeforeEnter = (el: Element) => {
    gsap.set(el, {
      opacity: 0,
      y: '0.4rem',
      overflow: 'clip',
    })
  }

  const onPhaseEnter = async (el: Element, done: () => void) => {
    const target = el as HTMLElement
    await nextTick()

    const tl = gsap.timeline({ onComplete: done })

    tl.to(target, {
      duration: 0.2,
      ease: 'power3.out',
    })

    tl.to(
      target,
      {
        opacity: 1,
        y: 0,
        duration: 0.15,
        ease: 'power2.out',
      },
      '-=0.05',
    )
  }

  return {
    onPhaseBeforeEnter,
    onPhaseEnter,
    onPhaseLeave,
    onStepBeforeEnter,
    onStepEnter,
  }
}
