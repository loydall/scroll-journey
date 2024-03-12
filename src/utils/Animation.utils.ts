import { AnimationDirection } from '../models/AnimationDirection.model'
import { ScrollElement } from '../models/ScrollElement.model'
import { ScrollSection } from '../models/ScrollSection.model'
import { setElementStyles } from './Style.utils'

export const applySectionAnimation = (
	animationInComplete: number,
	animationOutComplete: number,
	scrollSection: ScrollSection,
): void => {
	if (!scrollSection.isActive) return
	if (animationInComplete > 0 && animationInComplete <= 100) {
		setElementStyles(
			scrollSection.animation.animationInType,
			scrollSection.section,
			animationInComplete,
			AnimationDirection.In,
			scrollSection.animation.scale,
		)
	}

	if (animationOutComplete > 0 && animationOutComplete <= 100) {
		setElementStyles(
			scrollSection.animation.animationOutType,
			scrollSection.section,
			animationOutComplete,
			AnimationDirection.Out,
			scrollSection.animation.scale,
		)
	}
}

export const applyElementAnimations = (
	scrollElements: Array<ScrollElement>,
	targetY: number,
): void => {
	scrollElements.forEach((scrollElement: ScrollElement) => {
		let animationInComplete = 0

		if (targetY < scrollElement.animationInStart) {
			setElementStyles(
				scrollElement.animationInType,
				scrollElement.element,
				animationInComplete,
				AnimationDirection.In,
				scrollElement.scale,
			)
		}
		if (
			targetY >= scrollElement.animationInStart &&
			targetY <= scrollElement.animationInEnd
		) {
			animationInComplete =
				((targetY - scrollElement.animationInStart) /
					(scrollElement.animationInEnd -
						scrollElement.animationInStart)) *
				100
			setElementStyles(
				scrollElement.animationInType,
				scrollElement.element,
				animationInComplete,
				AnimationDirection.In,
				scrollElement.scale,
			)
		}
		if (
			targetY > scrollElement.animationInEnd &&
			targetY < scrollElement.animationOutStart
		) {
			animationInComplete = 100
			setElementStyles(
				scrollElement.animationInType,
				scrollElement.element,
				animationInComplete,
				AnimationDirection.In,
				scrollElement.scale,
			)
		}

		let animationOutComplete = 0
		if (
			targetY >= scrollElement.animationOutStart &&
			targetY <= scrollElement.animationOutEnd
		) {
			animationOutComplete =
				((targetY - scrollElement.animationOutStart) /
					(scrollElement.animationOutEnd -
						scrollElement.animationOutStart)) *
				100
			setElementStyles(
				scrollElement.animationOutType,
				scrollElement.element,
				animationOutComplete,
				AnimationDirection.Out,
				scrollElement.scale,
			)
		}
		if (targetY > scrollElement.animationOutEnd) {
			animationOutComplete = 100
			setElementStyles(
				scrollElement.animationOutType,
				scrollElement.element,
				animationOutComplete,
				AnimationDirection.Out,
				scrollElement.scale,
			)
		}
	})
}
