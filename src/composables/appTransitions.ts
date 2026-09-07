import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/all'

gsap.registerPlugin(ScrollToPlugin)

export function useTimelineTransition() {
  const timelineBeforeEnter = (el: Element) => {
    gsap.set(el, {
      opacity: 0,
    })
  }

  const timelineEnter = (el: Element, done: () => void) => {
    const target = el as HTMLElement
    const container = target.closest('.timeline-view') as HTMLElement

    if (container) {
      gsap.to(container, {
        paddingBottom: `${window.innerHeight * 0.4}px`,
        duration: 0.2,
        ease: 'power2.out',
      })
    }

    gsap
      .timeline({ onComplete: done })
      .to(target, {
        opacity: 1,
        duration: 0.2,
        ease: 'power2.out',
      })
      .to(
        window,
        {
          scrollTo: 'max',
          duration: 0.4,
          delay: 0.1,
          ease: 'sine.out',
        },
        '<',
      )
  }

  const timelineEnterNoscroll = (el: Element, done: () => void) => {
    const target = el as HTMLElement

    gsap.to(target, {
      opacity: 1,
      duration: 0.2,
      ease: 'power2.out',
      onComplete: done,
    })
  }

  return {
    timelineBeforeEnter,
    timelineEnter,
    timelineEnterNoscroll,
  }
}
