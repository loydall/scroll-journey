import { ScrollElement } from "./ScrollElement.model"
import { SectionAnimation } from "./SectionAnimation.model"

export interface ScrollSection {
    start: number
    end: number
    animation: SectionAnimation
    section: Element
    elements: Array<ScrollElement>
  }