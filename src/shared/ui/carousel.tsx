/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/lib/utils"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
  showArrows?: boolean // Новая опция: показывать стрелки
  autoPlay?: boolean // Новая опция: автопрокрутка
  autoPlayInterval?: number // Интервал автопрокрутки
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  scrollTo: (index: number) => void
  selectedIndex: number
  scrollSnaps: number[]
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }
  return context
}

function Carousel({
  orientation = "horizontal",
  opts = { loop: true, align: "center" },
  setApi,
  plugins,
  className,
  children,
  showArrows = false, // По умолчанию стрелки скрыты (только свайп)
  autoPlay = false,
  autoPlayInterval = 3000,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins
  )
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
    setSelectedIndex(api.selectedScrollSnap())
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const scrollTo = React.useCallback(
    (index: number) => {
      api?.scrollTo(index)
    },
    [api]
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    },
    [scrollPrev, scrollNext]
  )

  // Автопрокрутка
  React.useEffect(() => {
    if (!autoPlay || !api) return
    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else if (opts?.loop) {
        api.scrollTo(0)
      }
    }, autoPlayInterval)
    return () => clearInterval(interval)
  }, [autoPlay, api, autoPlayInterval, opts?.loop])

  React.useEffect(() => {
    if (!api || !setApi) return
    setApi(api)
  }, [api, setApi])

  React.useEffect(() => {
    if (!api) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect(api)
    setScrollSnaps(api.scrollSnapList())
    api.on("reInit", onSelect)
    api.on("select", onSelect)
    api.on("reInit", () => setScrollSnaps(api.scrollSnapList()))
    return () => {
      api?.off("select", onSelect)
    }
  }, [api, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        scrollTo,
        selectedIndex,
        scrollSnaps,
        showArrows,
        autoPlay,
        autoPlayInterval,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("group relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
        {/* Стрелки навигации - появляются при ховере на десктопе, на мобильных скрыты */}
        {showArrows && (
          <>
            <CarouselPrevious className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <CarouselNext className="opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </>
        )}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-3" : "-mt-3 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-3" : "pt-3",
        className
      )}
      {...props}
    />
  )
}

function CarouselPrevious({
  className,
  variant = "ghost",
  size = "default",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute touch-manipulation rounded-full",
        "border border-border bg-background/80 shadow-md backdrop-blur-sm",
        "transition-all duration-200 hover:bg-background/90",
        orientation === "horizontal"
          ? "top-1/2 left-2 -translate-y-1/2 sm:-left-8"
          : "-top-8 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ChevronLeftIcon className="cn-rtl-flip h-5 w-5" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

function CarouselNext({
  className,
  variant = "ghost",
  size = "default",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute touch-manipulation rounded-full",
        "border border-border bg-background/80 shadow-md backdrop-blur-sm",
        "transition-all duration-200 hover:bg-background/90",
        orientation === "horizontal"
          ? "top-1/2 right-2 -translate-y-1/2 sm:-right-8"
          : "-bottom-8 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ChevronRightIcon className="cn-rtl-flip h-5 w-5" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

// Новый компонент: индикаторы слайдов (точки внизу)
function CarouselDots({ className }: { className?: string }) {
  const { scrollTo, selectedIndex, scrollSnaps } = useCarousel()

  if (scrollSnaps.length <= 1) return null

  return (
    <div className={cn("mt-4 flex justify-center gap-2", className)}>
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          onClick={() => scrollTo(index)}
          className={cn(
            "h-2 rounded-full transition-all duration-200",
            selectedIndex === index
              ? "w-6 bg-primary"
              : "w-2 bg-primary/30 hover:bg-primary/50"
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  )
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  useCarousel,
}
