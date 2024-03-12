import { ScrollSection } from './models/ScrollSection.model'
import { registerSections, updateScrollSections } from './utils/ScrollSection.utils'

let scrollSections: Array<ScrollSection>
let targetY: number = window.scrollY
const easing = 25
const maxSpeed = 70
let isScrolling: boolean = false

const handleScroll = () => {
	const scrollY = window.scrollY
	if (targetY === scrollY) {
		isScrolling = false
		return
	}

	const distance = Math.abs(targetY - scrollY)
	const jump = Math.min(Math.ceil(distance / easing), maxSpeed)
	if (targetY < scrollY) {
		targetY = targetY + jump
	}
	if (targetY > scrollY) {
		targetY = targetY - jump
	}
	updateScrollSections(scrollSections, targetY)
	requestAnimationFrame(handleScroll)
}

const shouldHandleScroll = () => {
	if (isScrolling) return
	isScrolling = true
	handleScroll()
}

const scrollJourney = () => {
	const scrollJourneys = document.querySelectorAll('scroll-journey')
	if (!scrollJourneys) return
	if (scrollJourneys.length > 1) {
		console.warn('Only 1 scroll-journey allowed per page')
		return
	}
	const scrollJourney: Element = scrollJourneys[0]
	scrollSections = registerSections(scrollJourney)
	scrollJourney.setAttribute(
		'style',
		`height: ${scrollSections[scrollSections.length - 1].end}px;`,
	)
	updateScrollSections(scrollSections, 0)
	window.onscroll = shouldHandleScroll
}

scrollJourney()
