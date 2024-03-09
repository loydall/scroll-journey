import { AnimationDirection } from "../models/AnimationDirection.model"
import { AnimationType } from "../models/AnimationType.model"

export const setElementStyles = (animationType: AnimationType, element: Element, animationComplete: number, animationDirection: AnimationDirection ) => {
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