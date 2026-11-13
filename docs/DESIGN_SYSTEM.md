# Design System & Motion Principles: Tab Split

## Aesthetic Identity: "The Verdict Room"
The core visual language is **courtroom-meets-Vegas-nightclub**.
- **No corporate AI SaaS templates.** No standard dark-mode with blue gradients.
- **Gen Z-facing:** Bold typography, snappy motion, irreverent copy.
- **Textures:** Neon signage lighting, gavel motifs, receipt-paper textures for claims/evidence, low-light backdrops.

## Colors
Tokens must be used semantically across the Next.js/Tailwind setup:
- **`midnight-docket`** (`#09090b` / `hsl(240, 10%, 4%)`): Deep, near-black ambient background.
- **`verdict-gold`** (`#ffd700` / `hsl(47, 100%, 50%)`): Primary high-contrast accent for winning claims and prominent UI actions. Think electric neon.
- **`neon-alibi`** (`#39ff14` / `hsl(110, 100%, 54%)`): Secondary electric accent for supporting evidence and positive feedback.
- **`guilty-red`** (`#ff073a` / `hsl(348, 100%, 51%)`): Alert/negative accent for disputed claims and negative feedback.
- **`receipt-paper`** (`#f4f4f0` / `hsl(60, 11%, 95%)`): Off-white, slightly textured surface color for claim bubbles, cards, and modal dialogs.
- **`ink-black`** (`#111111` / `hsl(0, 0%, 7%)`): High-contrast text color used specifically on top of `receipt-paper`.

## Typography
- **Headings**: Unapologetic, tight tracking, all-caps for impact (e.g., "THE VERDICT ROOM").
- **Body**: Clean sans-serif but bold weights. 
- **Scale**: Heavy emphasis on `text-4xl` to `text-6xl` for hero numbers (Confidence Gauge).

## Spacing & Structure
- **Tight & Snappy**: Minimal padding in structural containers, maximal padding in floating elements to make them pop against the `midnight-docket`.
- Floating panels, heavy drop shadows (neon glows) for active states.

## Motion Principles
*Mandatory rules for all animated sequences. Do not just "use animations."*

1. **GSAP**: Owns scroll-driven and timeline-based motion.
   - Use for: ScrollTrigger parallax sequences, staggered reveal timelines when evidence streams in.
2. **Framer Motion**: Owns component-level and layout transitions.
   - Use for: Page/section enter-exit, shared layout animations, `AnimatePresence` for components mounting/unmounting.
3. **anime.js**: Owns small, punchy micro-interactions.
   - Use for: Button hover feedback, number count-ups (Confidence scores), icon morphs. Overkill to use GSAP/Framer here.
4. **Three.js / React Three Fiber**: Owns the real 3D/WebGL moments.
   - Use for: The hero scene (Phase 3) and the live force-graph (Phase 4). Not sprinkled everywhere.
5. **Accessibility**: Every animation MUST have a `prefers-reduced-motion` fallback. No jank for judges tabbing quickly through submissions.

## Component Inventory (Phase 2 Focus)
- `AmbientBackground`: CSS/Tailwind animated background patterns (glow, aurora, grid/noise). Slow, ambient, non-distracting.
- `ConfidenceGauge`: Animated radial/arc gauge using anime.js (count-up) and Framer (arc fill).
- `ClaimBubble`: Chat-style component with receipt-paper styling.
- `Shadcn Restyles`: `Button`, `Badge`, `Card`, `Dialog`, `Tabs` heavily modified to abandon their default corporate look.
