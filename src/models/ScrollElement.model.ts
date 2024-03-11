import { AnimationType } from './AnimationType.model'

export interface ScrollElement {
	element: Element
	animationInStart: number
	animationInEnd: number
	animationOutStart: number
	animationOutEnd: number
	animationInType: AnimationType
	animationOutType: AnimationType
	scale: number
}
