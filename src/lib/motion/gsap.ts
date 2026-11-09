import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/*
 * Core only: gsap + ScrollTrigger are needed on every page.
 * The other plugins (SplitText, ScrambleText, DrawSVG, Flip, Observer) are
 * imported and registered by the feature modules that use them, which are
 * lazy-loaded, so they never weigh on the initial bundle.
 * gsap.registerPlugin() is idempotent, so registering in each feature is safe.
 */
gsap.registerPlugin(ScrollTrigger);

gsap.defaults({ ease: 'power3.out', duration: 0.8 });
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };
