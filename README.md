# orbiter

3D celestial orrery clock. Three concentric glowing rings orbit in deep space — seconds (cyan), minutes (amber), hours (gold). A glowing sphere marks the current value on each ring. The hero time number glows at center.

**Visual Style:** Dark — Void adapted (celestial/mechanical with warm gold accents)

**Data Source:** TimeAPI.io — live time data for Los Angeles timezone

**How it works:**
- The inner ring tracks seconds (cyan sphere orbits once per minute)
- The middle ring tracks minutes (amber sphere orbits once per hour)
- The outer ring tracks hours (gold sphere orbits once per 12 hours)
- Ring colors shift subtly through the day (cool blue at midnight → warm gold at noon → amber at dusk)
- Tap any sphere to see timezone details in the Quiet Zone panel
- The hero number (top-left) shows live HH:MM:SS, updating every frame
- OrbitControls let you zoom/rotate the scene on desktop and mobile

**GitHub:** https://github.com/parthchandak02/orbiter

**Live:** https://orbiter.parthchandak.info

**Tech:** React Three Fiber + drei. Hosted on Cloudflare Pages.
