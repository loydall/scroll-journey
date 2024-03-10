import { AnimationDirection } from './models/AnimationDirection.model'
import { ScrollElement } from './models/ScrollElement.model'
import { ScrollSection } from './models/ScrollSection.model'

import './style.css'
import { registerSections } from './utils/ScrollSection.utils'
import { setElementStyles } from './utils/Style.utils'

let scrollSections: Array<ScrollSection>
let targetY: number = window.scrollY
const easing = 20

const applySectionAnimation = (animationInComplete: number, animationOutComplete: number, scrollSection: ScrollSection) => {
  if(animationInComplete > 0 && animationInComplete <= 100) {
    setElementStyles(scrollSection.animation.animationInType, scrollSection.section, animationInComplete, AnimationDirection.In)
  }
 
  if(animationOutComplete > 0 && animationOutComplete <= 100) {
    setElementStyles(scrollSection.animation.animationOutType, scrollSection.section, animationOutComplete, AnimationDirection.Out)
  }
}

const applyElementAnimations = (scrollElements: Array<ScrollElement>) => {
    scrollElements.forEach((scrollElement: ScrollElement) => {
      
      let animationInComplete = 0

      if (targetY < scrollElement.animationInStart) {
        setElementStyles(scrollElement.animationInType, scrollElement.element, animationInComplete, AnimationDirection.In)
      }
      if (targetY >= scrollElement.animationInStart && targetY <= scrollElement.animationInEnd) {
          animationInComplete = ((targetY - scrollElement.animationInStart) / (scrollElement.animationInEnd - scrollElement.animationInStart)) * 100
          setElementStyles(scrollElement.animationInType, scrollElement.element, animationInComplete, AnimationDirection.In)
      }
      if (targetY > scrollElement.animationInEnd && targetY < scrollElement.animationOutStart) {
          animationInComplete = 100
          setElementStyles(scrollElement.animationInType, scrollElement.element, animationInComplete, AnimationDirection.In)
      }
      

      let animationOutComplete = 0
      if (targetY >= scrollElement.animationOutStart && targetY <= scrollElement.animationOutEnd) {
        animationOutComplete = ((targetY - scrollElement.animationOutStart) / (scrollElement.animationOutEnd - scrollElement.animationOutStart)) * 100
        setElementStyles(scrollElement.animationOutType, scrollElement.element, animationOutComplete, AnimationDirection.Out)
      }
      if (targetY > scrollElement.animationOutEnd) {
        animationOutComplete = 100
        setElementStyles(scrollElement.animationOutType, scrollElement.element, animationOutComplete, AnimationDirection.Out)
      }

    })
}

const updateScrollSections = () => {
  scrollSections.forEach((scrollSection: ScrollSection) => {
    if(scrollSection.end < targetY) {
      applySectionAnimation(100, 100, scrollSection)
    }
    if(scrollSection.start > targetY) {
      applySectionAnimation(0, 0, scrollSection)
    }
    applyElementAnimations(scrollSection.elements)

    if(scrollSection.start <= targetY && scrollSection.end >= targetY) {
      if(!scrollSection.section.classList.contains('scroll-section--active')) {
        scrollSection.section.classList.add('scroll-section--active')
      }
      const animationInComplete = targetY < scrollSection.start + scrollSection.animation.animationInDuration ? ((targetY - scrollSection.start) / scrollSection.animation.animationInDuration) * 100 : 100
      const animationOutComplete = targetY > scrollSection.end - scrollSection.animation.animationOutDuration ? ((targetY - (scrollSection.end - scrollSection.animation.animationOutDuration)) / scrollSection.animation.animationOutDuration) * 100 : 0
      applySectionAnimation(animationInComplete, animationOutComplete, scrollSection)
      return
    }
    
    if(scrollSection.section.classList.contains('scroll-section--active')) {
      scrollSection.section.classList.remove('scroll-section--active')
    }
  })

}

let isScrolling: boolean = false

const handleScroll = () => {
  const scrollY = window.scrollY
  if(targetY === scrollY) {
    isScrolling = false
    return
  }

  const distance = Math.abs(targetY - scrollY)
  const jump = Math.ceil(distance / easing)
  if (targetY < scrollY) {
      targetY = targetY + jump
  }
  if (targetY > scrollY) {
    targetY = targetY - jump
  }
  updateScrollSections()
  requestAnimationFrame(handleScroll)
}

const shouldHandleScroll = () => {
  if(isScrolling) return
  isScrolling = true
  handleScroll()
}

const scrollJourney = () => {
  const scrollJourneys = document.querySelectorAll('scroll-journey')
  if(!scrollJourneys) return
  if(scrollJourneys.length > 1) {
    console.warn('Only 1 scroll-journey allowed per page')
    return
  }
  const scrollJourney: Element = scrollJourneys[0]
  scrollSections = registerSections(scrollJourney)
  scrollJourney.setAttribute('style', `height: ${scrollSections[scrollSections.length - 1].end}px;`)
  updateScrollSections()
  window.onscroll = shouldHandleScroll
} 

scrollJourney()

