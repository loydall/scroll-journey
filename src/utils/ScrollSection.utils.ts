import { AnimationType } from "../models/AnimationType.model"
import { ScrollElement } from "../models/ScrollElement.model"
import { ScrollSection } from "../models/ScrollSection.model"
import { SectionAnimation } from "../models/SectionAnimation.model"

export const registerSections = (target: Element): Array<ScrollSection> => {
    const scrollSections = Array.from(target.querySelectorAll('scroll-section'))
  
    let sectionStart = 0
  
    return scrollSections.map((section: Element) => {
      const duration: number = Number(section.getAttribute('duration')) || 0
      const animationInDuration = Number(section.getAttribute('in-duration')) || 0
      const animationOutDuration = Number(section.getAttribute('out-duration')) || 0
      const overlap: number = Number(section.getAttribute('overlap')) || 0
  
      const sectionAnimation: SectionAnimation = {
        animationInType: section.getAttribute('in') as AnimationType || AnimationType.None,
        animationOutType: section.getAttribute('out') as AnimationType || AnimationType.None,
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
            animationInType:  sectionElement.getAttribute('in') as AnimationType || AnimationType.None,
            animationOutType: sectionElement.getAttribute('out') as AnimationType || AnimationType.None
          }
      })
  
      const scrollSection: ScrollSection = {
        section,
        animation: sectionAnimation,
        start: sectionStart - overlap,
        end: (sectionStart + sectionDuration) - overlap,
        elements
      }
  
      sectionStart+= (sectionDuration - overlap)
  
      return scrollSection
    })
  }