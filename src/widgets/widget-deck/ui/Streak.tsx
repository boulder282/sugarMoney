import WidgetMenu from "./WidgetMenu"

// Golden glow in the stroke core fading to violet at the edges
const DIGIT_GRADIENT =
  "radial-gradient(closest-side at 50% 45%, #FFC46B 5%, #DD8DF5 45%, #8B5CF6 75%, #6D28D9 100%)"

const Streak = ({ days = 48 }: { days?: number }) => {
  const digits = String(days).split("")

  return (
    <div
      className="relative flex h-[295px] w-[225px] flex-col justify-end overflow-hidden rounded-[24px] bg-[#1F2021] pt-[21px] pr-4 pb-4 pl-4 shadow-xl"
      style={{
        border: "1px solid transparent",
        backgroundImage:
          "linear-gradient(#1F2021, #1F2021), linear-gradient(135deg, rgba(255,255,255,0.04), #6666FF)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
        // Keep the grain's blend mode local to this card so it composites
        // against the card once and stays cached while the slide rotates.
        isolation: "isolate",
      }}
    >
      <WidgetMenu />

      {/* Giant digits stepping diagonally, cropped by the card */}
      <div aria-label={String(days)} className="absolute inset-0 select-none">
        {digits.map((digit, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute text-[230px] leading-none font-black"
            style={{
              left: `${i * 85 - 30}px`,
              top: `${i * 115 - 45}px`,
              background: DIGIT_GRADIENT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(-10px 12px 18px rgba(0, 0, 0, 0.6))",
            }}
          >
            {digit}
          </span>
        ))}
        {/* Noise grain overlay */}
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          className="pointer-events-none absolute inset-0 h-full w-full"
          // translateZ(0) rasterizes the noise into its own layer once,
          // so the costly turbulence isn't recomputed as the slide moves.
          style={{ mixBlendMode: "overlay", opacity: 0.5, transform: "translateZ(0)" }}
        >
          <filter id="streak-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="2"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#streak-grain)" />
        </svg>
      </div>

      {/* Description */}
      <p className="relative z-10 text-[13px] font-medium leading-snug text-white">
        Дней подряд ты каждый день записывал расходы!
      </p>
    </div>
  )
}

export default Streak
