import './style.css'

enum AnimationDirection {
  in = 'in',
  out = 'out'
}

enum AnimationType {
  fade = 'fade',
  zoomIn = 'zoom-in',
  zoomOut = 'zoom-out',
  scrollUp = 'scroll-up',
  none = 'none'
}

interface SectionAnimation {
  animationInType: AnimationType
  animationOutType: AnimationType
  animationInDuration: number
  animationOutDuration: number
}

interface ScrollElement {
  element: Element
  animationInStart: number
  animationInEnd: number
  animationOutStart: number
  animationOutEnd: number
  animationInType: AnimationType
  animationOutType: AnimationType
}

interface ScrollSection {
  start: number
  end: number
  animation: SectionAnimation
  section: Element
  elements: Array<ScrollElement>
}

const registerSections = (target: Element): Array<ScrollSection> => {
  const scrollSections = Array.from(target.querySelectorAll('scroll-section'))

  let sectionStart = 0

  return scrollSections.map((section: Element) => {
    const duration: number = Number(section.getAttribute('duration')) || 0
    const animationInDuration = Number(section.getAttribute('in-duration')) || 0
    const animationOutDuration = Number(section.getAttribute('out-duration')) || 0

    const sectionAnimation: SectionAnimation = {
      animationInType: section.getAttribute('in') as AnimationType || AnimationType.none,
      animationOutType: section.getAttribute('out') as AnimationType || AnimationType.none,
      animationInDuration,
      animationOutDuration,
    }

    const sectionDuration = duration + animationInDuration + animationOutDuration

    const sectionElements = Array.from(section.querySelectorAll('scroll-element')) || []

    const elements = sectionElements.map((sectionElement: Element): ScrollElement => {
        const elementFrames: string = sectionElement.getAttribute('keyframes') || ''
        const keyFrames = elementFrames.split(',')
        const sectionPercentage = sectionDuration / 100

        return {
          element: sectionElement,
          animationInStart: sectionStart + Number(keyFrames[0]) * sectionPercentage,
          animationInEnd: sectionStart + Number(keyFrames[1]) * sectionPercentage,
          animationOutStart: sectionStart + Number(keyFrames[2]) * sectionPercentage,
          animationOutEnd: sectionStart + Number(keyFrames[3]) * sectionPercentage,
          animationInType:  sectionElement.getAttribute('in') as AnimationType || AnimationType.none,
          animationOutType: sectionElement.getAttribute('out') as AnimationType || AnimationType.none
        }
    })

    const scrollSection: ScrollSection = {
      section,
      animation: sectionAnimation,
      start: sectionStart,
      end: sectionStart + sectionDuration,
      elements
    }

    sectionStart+= sectionDuration

    return scrollSection
  })
}

let scrollSections: Array<ScrollSection>
let targetY: number = 0;

const setElementStyles = (animationType: AnimationType, element: Element, animationComplete: number, animationDirection: AnimationDirection ) => {
  switch (animationType) {
    case AnimationType.fade: {
      switch (animationDirection) {
        case AnimationDirection.in:
        {
          element.setAttribute('style', `opacity: ${animationComplete / 100}; will-change: opacity;`)
          break
        }
        case AnimationDirection.out:{
          element.setAttribute('style', `opacity: ${(100 - animationComplete) / 100}; will-change: opacity;`)
          break
        }
      }
      break
    }
    case AnimationType.zoomOut: 
    {
      element.setAttribute('style', `opacity: ${animationComplete / 100}; transform: scale(${5 - (animationComplete / 100) * 4}); will-change: transform, opacity;`)
      break
    }
    case AnimationType.zoomIn: 
    {
      element.setAttribute('style', `opacity: ${animationComplete / 100}; transform: scale(${(animationComplete / 100)}); will-change: transform, opacity;`)
      break
    }
  }
}

const applySectionAnimation = (animationInComplete: number, animationOutComplete: number, scrollSection: ScrollSection) => {
  if(animationInComplete > 0 && animationInComplete < 100) {
    setElementStyles(scrollSection.animation.animationInType, scrollSection.section, animationInComplete, AnimationDirection.in)
  }
 
  if(animationOutComplete > 0 && animationOutComplete < 100) {
    setElementStyles(scrollSection.animation.animationOutType, scrollSection.section, animationOutComplete, AnimationDirection.out)
  }
}

const applyElementAnimations = (scrollElements: Array<ScrollElement>) => {
    scrollElements.forEach((scrollElement: ScrollElement) => {
      
      let animationInComplete = 0

      if (targetY >= scrollElement.animationInStart && targetY <= scrollElement.animationInEnd) {
          animationInComplete = ((targetY - scrollElement.animationInStart) / (scrollElement.animationInEnd - scrollElement.animationInStart)) * 100
          setElementStyles(scrollElement.animationInType, scrollElement.element, animationInComplete, AnimationDirection.in)
      }
      if (targetY > scrollElement.animationInEnd && targetY < scrollElement.animationOutStart) {
          animationInComplete = 100
          setElementStyles(scrollElement.animationInType, scrollElement.element, animationInComplete, AnimationDirection.in)
      }

      let animationOutComplete = 0
      if (targetY >= scrollElement.animationOutStart && targetY <= scrollElement.animationOutEnd) {
        animationOutComplete = ((targetY - scrollElement.animationOutStart) / (scrollElement.animationOutEnd - scrollElement.animationOutStart)) * 100
        setElementStyles(scrollElement.animationOutType, scrollElement.element, animationOutComplete, AnimationDirection.out)
      }
      if (targetY > scrollElement.animationOutEnd) {
        animationOutComplete = 100
        setElementStyles(scrollElement.animationOutType, scrollElement.element, animationOutComplete, AnimationDirection.out)
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
    if(scrollSection.start <= targetY && scrollSection.end >= targetY) {
      if(!scrollSection.section.classList.contains('scroll-section--active')) {
        scrollSection.section.classList.add('scroll-section--active')
      }
      const animationInComplete = targetY < scrollSection.start + scrollSection.animation.animationInDuration ? ((targetY - scrollSection.start) / scrollSection.animation.animationInDuration) * 100 : 100
      const animationOutComplete = targetY > scrollSection.end - scrollSection.animation.animationOutDuration ? ((targetY - (scrollSection.end - scrollSection.animation.animationOutDuration)) / scrollSection.animation.animationOutDuration) * 100 : 0
      applySectionAnimation(animationInComplete, animationOutComplete, scrollSection)
      applyElementAnimations(scrollSection.elements)
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
  if(Math.abs(targetY - scrollY) < 1) {
    isScrolling = false
    targetY = scrollY
    return
  }

  const jump = (scrollY - targetY) / 10
  targetY = targetY + jump
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
    console.log('Only 1 scroll-journey allowed per page')
    return
  }
  const scrollJourney: Element = scrollJourneys[0]
  scrollSections = registerSections(scrollJourney)
  scrollJourney.setAttribute('style', `height: ${scrollSections[scrollSections.length - 1].end}px;`)

  window.onscroll = shouldHandleScroll
} 

scrollJourney()

