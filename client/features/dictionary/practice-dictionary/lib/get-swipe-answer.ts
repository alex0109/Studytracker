import { FlashcardAnswerEnum } from "../model";
import { SWIPE_THRESHOLD, SWIPE_VELOCITY } from "../consts";

interface Vector {
  x: number;
  y: number;
}

// Dominant axis decides the answer, swiping up is ignored
export function getSwipeAnswer(
  offset: Vector,
  velocity: Vector,
): FlashcardAnswerEnum | null {
  const isHorizontal = Math.abs(offset.x) >= Math.abs(offset.y);

  if (isHorizontal) {
    if (
      offset.x > SWIPE_THRESHOLD ||
      (offset.x > 0 && velocity.x > SWIPE_VELOCITY)
    ) {
      return FlashcardAnswerEnum.Know;
    }

    if (
      offset.x < -SWIPE_THRESHOLD ||
      (offset.x < 0 && velocity.x < -SWIPE_VELOCITY)
    ) {
      return FlashcardAnswerEnum.DontKnow;
    }

    return null;
  }

  if (
    offset.y > SWIPE_THRESHOLD ||
    (offset.y > 0 && velocity.y > SWIPE_VELOCITY)
  ) {
    return FlashcardAnswerEnum.Unsure;
  }

  return null;
}
