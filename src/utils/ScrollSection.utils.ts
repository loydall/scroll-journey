import { AnimationType } from '../models/AnimationType.model'
import { ScrollElement } from '../models/ScrollElement.model'
import { ScrollSection } from '../models/ScrollSection.model'
import { SectionAnimation } from '../models/SectionAnimation.model'
import { applyElementAnimations, applySectionAnimation } from './Animation.utils'

export const registerSections = (target: Element): Array<ScrollSection> => {
	const scrollSections = Array.from(target.querySelectorAll('scroll-section'))

	let sectionStart = 0

	return scrollSections.map((section: Element) => {
		const duration: number = Number(section.getAttribute('duration')) || 0
		const animationInDuration =
			Number(section.getAttribute('in-duration')) || 0
		const animationOutDuration =
			Number(section.getAttribute('out-duration')) || 0
		const overlap: number = Number(section.getAttribute('overlap')) || 0
		const scale: number = Number(section.getAttribute('scale')) || 1

		const sectionAnimation: SectionAnimation = {
			animationInType:
				(section.getAttribute('in') as AnimationType) ||
				AnimationType.None,
			animationOutType:
				(section.getAttribute('out') as AnimationType) ||
				AnimationType.None,
			animationInDuration,
			animationOutDuration,
			scale,
		}

		const sectionDuration =
			duration + animationInDuration + animationOutDuration

		const sectionElements =
			Array.from(section.querySelectorAll('scroll-element')) || []

		const elements = sectionElements.map(
			(sectionElement: Element): ScrollElement => {
				const elementFrames: string =
					sectionElement.getAttribute('keyframes') || ''
				const elementScale =
					Number(sectionElement.getAttribute('scale')) || 1
				const keyFrames = elementFrames.split(',')
				const sectionPercentage = sectionDuration / 100

				return {
					element: sectionElement,
					animationInStart:
						sectionStart +
						Number(keyFrames[0]) * sectionPercentage -
						overlap,
					animationInEnd:
						sectionStart +
						Number(keyFrames[1]) * sectionPercentage -
						overlap,
					animationOutStart:
						sectionStart +
						Number(keyFrames[2]) * sectionPercentage -
						overlap,
					animationOutEnd:
						sectionStart +
						Number(keyFrames[3]) * sectionPercentage -
						overlap,
					animationInType:
						(sectionElement.getAttribute('in') as AnimationType) ||
						AnimationType.None,
					animationOutType:
						(sectionElement.getAttribute('out') as AnimationType) ||
						AnimationType.None,
					scale: elementScale,
				}
			},
		)

		const scrollSection: ScrollSection = {
			section,
			animation: sectionAnimation,
			start: sectionStart - overlap,
			end: sectionStart + sectionDuration - overlap,
			elements,
			isActive: false,
		}

		sectionStart += sectionDuration - overlap

		return scrollSection
	})
}

export const updateScrollSections = (scrollSections: Array<ScrollSection>, targetY: number) => {
	scrollSections.forEach((scrollSection: ScrollSection) => {
		if (scrollSection.end < targetY) {
			applySectionAnimation(100, 100, scrollSection)
		}
		if (scrollSection.start > targetY) {
			applySectionAnimation(0, 0, scrollSection)
		}
		applyElementAnimations(scrollSection.elements, targetY)

		if (scrollSection.start <= targetY && scrollSection.end >= targetY) {
			if (!scrollSection.isActive) {
				scrollSection.isActive = true
				scrollSection.section.classList.add('scroll-section--active')
			}
			const animationInComplete =
				targetY <
				scrollSection.start +
					scrollSection.animation.animationInDuration
					? ((targetY - scrollSection.start) /
							scrollSection.animation.animationInDuration) *
						100
					: 100
			const animationOutComplete =
				targetY >
				scrollSection.end - scrollSection.animation.animationOutDuration
					? ((targetY -
							(scrollSection.end -
								scrollSection.animation.animationOutDuration)) /
							scrollSection.animation.animationOutDuration) *
						100
					: 0
			applySectionAnimation(
				animationInComplete,
				animationOutComplete,
				scrollSection,
			)
			return
		}

		if ((scrollSection.isActive = true)) {
			scrollSection.isActive = false
			scrollSection.section.classList.remove('scroll-section--active')
		}
	})
}
