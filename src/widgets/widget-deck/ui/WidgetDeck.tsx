import { useCallback, useEffect, useState } from "react"
import ExpenseChart from "./ExpenseChart"
import BudgetOverview from "./BudgetOverview"
import Streak from "./Streak"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
  type CarouselApi,
} from "@/shared/ui/carousel"

// Side slides tilt outward and sink, as if laid on a wheel rim
const WHEEL_ROTATE_DEG = 5
const WHEEL_DROP_PX = 300

const WidgetDeck = ({ onOpenExpenses }: { onOpenExpenses?: () => void }) => {
  const [api, setApi] = useState<CarouselApi>()

  const tweenWheel = useCallback((emblaApi: CarouselApi) => {
    if (!emblaApi) return
    const engine = emblaApi.internalEngine()
    const scrollProgress = emblaApi.scrollProgress()
    const slideNodes = emblaApi.slideNodes()

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      const slidesInSnap = engine.slideRegistry[snapIndex]

      slidesInSnap.forEach((slideIndex) => {
        let diffToTarget = scrollSnap - scrollProgress

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target()
            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target)
              if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress)
              if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress)
            }
          })
        }

        const rotate = diffToTarget * WHEEL_ROTATE_DEG
        const drop = diffToTarget * diffToTarget * WHEEL_DROP_PX
        // translateZ(0) keeps the slide on the GPU layer promoted below.
        slideNodes[slideIndex].style.transform =
          `translate3d(0, ${drop}px, 0) rotate(${rotate}deg)`
      })
    })
  }, [])

  useEffect(() => {
    if (!api) return
    // Promote slides to their own compositor layer so the per-frame transform
    // tween composites on the GPU instead of repainting the cards every frame.
    for (const node of api.slideNodes()) {
      node.style.willChange = "transform"
    }
    tweenWheel(api)
    api.on("scroll", tweenWheel).on("reInit", tweenWheel)
    return () => {
      api.off("scroll", tweenWheel).off("reInit", tweenWheel)
    }
  }, [api, tweenWheel])

  return (
    <Carousel
      opts={{ align: "center", loop: false, containScroll: false, startIndex: 1 }}
      setApi={setApi}
      className="w-full"
    >
      <CarouselContent className="pt-2 pb-16">
        <CarouselItem className="basis-auto">
          <Streak days={48} />
        </CarouselItem>
        <CarouselItem className="basis-auto">
          <ExpenseChart />
        </CarouselItem>
        <CarouselItem className="basis-auto">
          <BudgetOverview onOpen={onOpenExpenses} />
        </CarouselItem>
      </CarouselContent>
      <CarouselDots className="mt-0" />
    </Carousel>
  )
}

export default WidgetDeck
