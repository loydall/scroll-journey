import { AnimationDirection } from '../models/AnimationDirection.model'
import { AnimationType } from '../models/AnimationType.model'

export const setElementStyles = (
	animationType: AnimationType,
	element: Element,
	animationComplete: number,
	animationDirection: AnimationDirection,
  scale: number = 1
) => {
	switch (animationType) {
		case AnimationType.Fade: {
			switch (animationDirection) {
				case AnimationDirection.In: {
					element.setAttribute(
						'style',
						`opacity: ${animationComplete / 100}; will-change: opacity;`,
					)
					break
				}
				case AnimationDirection.Out: {
					element.setAttribute(
						'style',
						`opacity: ${(100 - animationComplete) / 100}; will-change: opacity;`,
					)
					break
				}
			}
			break
		}
		case AnimationType.ZoomOut: {
			element.setAttribute(
				'style',
				`opacity: ${animationComplete / 100}; transform: scale(${5 - (animationComplete / 100) * 4}); will-change: transform, opacity;`,
			)
			break
		}
		case AnimationType.ZoomIn: {
			element.setAttribute(
				'style',
				`opacity: ${animationComplete / 100}; transform: scale(${animationComplete / 100}); will-change: transform, opacity;`,
			)
			break
		}
		case AnimationType.ScrollUp: {
			switch (animationDirection) {
				case AnimationDirection.Out: {
					element.setAttribute(
						'style',
						`transform: translateY(${animationComplete * -scale}lvh); will-change: transform`,
					)
					break
				}
				case AnimationDirection.In: {
					element.setAttribute(
						'style',
						`transform: translateY(${(100 - animationComplete) * scale}lvh); will-change: transform`,
					)
					break
				}
			}
			break
		}
		case AnimationType.ClipRectangle: {
			switch (animationDirection) {
				case AnimationDirection.Out: {
					element.setAttribute(
						'style',
						`
                    width: ${(animationComplete * -1) / 2 + 50}lvw;
                    height: ${(animationComplete * -1) / 2 + 50}lvh;
                    overflow: hidden;
                    will-change: width, height`,
					)
					break
				}
				case AnimationDirection.In: {
					element.setAttribute(
						'style',
						`
                      width: ${animationComplete / 2 + 50}lvw;
                      height: ${animationComplete / 2 + 50}lvh;
                      overflow: hidden;
                      opacity: ${animationComplete / 100};
                      will-change: width, height, opacity`,
					)
					break
				}
			}
			break
		}
    case AnimationType.ScrollLeft: {
      element.setAttribute(
        'style',
        `transform: translateX(calc(${(-animationComplete) * scale}% + (${animationComplete} * 1lvw))); width: max-content; will-change: transform`,
      )
	  break
    }
	case AnimationType.Rotate: {
		element.setAttribute(
			'style',
			`transform: rotate(${(-animationComplete) * scale}deg); will-change: transform`,
		  )
	}
	}
}
