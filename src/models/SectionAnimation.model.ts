import { AnimationType } from './AnimationType.model'

export interface SectionAnimation {
	animationInType: AnimationType
	animationOutType: AnimationType
	animationInDuration: number
	animationOutDuration: number
}
