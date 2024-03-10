import { AnimationDirection } from "../models/AnimationDirection.model";
import { AnimationType } from "../models/AnimationType.model";

export const setElementStyles = (
  animationType: AnimationType,
  element: Element,
  animationComplete: number,
  animationDirection: AnimationDirection,
) => {
  switch (animationType) {
    case AnimationType.Fade: {
      switch (animationDirection) {
        case AnimationDirection.In: {
          element.setAttribute(
            "style",
            `opacity: ${animationComplete / 100}; will-change: opacity;`,
          );
          break;
        }
        case AnimationDirection.Out: {
          element.setAttribute(
            "style",
            `opacity: ${(100 - animationComplete) / 100}; will-change: opacity;`,
          );
          break;
        }
      }
      break;
    }
    case AnimationType.ZoomOut: {
      element.setAttribute(
        "style",
        `opacity: ${animationComplete / 100}; transform: scale(${5 - (animationComplete / 100) * 4}); will-change: transform, opacity;`,
      );
      break;
    }
    case AnimationType.ZoomIn: {
      element.setAttribute(
        "style",
        `opacity: ${animationComplete / 100}; transform: scale(${animationComplete / 100}); will-change: transform, opacity;`,
      );
      break;
    }
    case AnimationType.ScrollUp: {
      switch (animationDirection) {
        case AnimationDirection.Out: {
          element.setAttribute(
            "style",
            `transform: translateY(${animationComplete * -1}lvh); will-change: transform`,
          );
          break;
        }
        case AnimationDirection.In: {
          element.setAttribute(
            "style",
            `transform: translateY(${100 - animationComplete}lvh); will-change: transform`,
          );
          break;
        }
      }
      break;
    }
    case AnimationType.ClipRectangle: {
      switch (animationDirection) {
        case AnimationDirection.Out: {
          element.setAttribute(
            "style",
            `
                    width: ${(animationComplete * -1) / 2 + 50}lvw;
                    height: ${(animationComplete * -1) / 2 + 50}lvh;
                    overflow: hidden;
                    will-change: width, height`,
          );
          break;
        }
        case AnimationDirection.In: {
          element.setAttribute(
            "style",
            `
                      width: ${animationComplete / 2 + 50}lvw;
                      height: ${animationComplete / 2 + 50}lvh;
                      overflow: hidden;
                      opacity: ${animationComplete / 100};
                      will-change: width, height, opacity`,
          );
          break;
        }
      }
      break;
    }
  }
};
