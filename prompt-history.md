# Prompt history

## Session 2026-10-03

1. hi
2. /audit-all — Run a full site audit on the current project by invoking these skills in order, combining results into one report with a section per skill: /accessibility, /best-practices, /seo, /gsap-performance, /webquality-audit. End with a prioritized list of the top issues across all five, ranked by impact.
3. thanks for the detailed report, let's got with calm and fix the highest impact based on your provided table. Note: On the #4 I think it would work but with a conditional we show the menu only if 2.5s (maximum time I would like to put a user to wait for the experience) and with a message saying "The experience is still loading but you can start here" or something similar. How would you solve the #7 or what is your recomendation? and with the #10 I would like to still have tweakpane but only when #debug hash is on the site is that the case? it loads only when the hash is there OR it always load. if always load we need to fix that... if not we can savely ignore it
4. Fix: Card animations composite blurred glass over a live canvas (add will-change: transform to .container during the transition, or lower the scene's render cost while a card is open).
5. Fix: The sitemap lastmod is always the build date. Use the date the profile content last changed.
6. Fix: Two <h1>s while a card is open.
7. Fix (Low a11y): tooltips on keyboard focus; lang on Content card titles; explicit :focus-visible style.
8. ok with the #7 go ahead and do the code (I'll try reducing the size of the file). And with #4 let's go with option b
9. What happen with my img on the about card??? (answer: it doesn't show at all)
10. ESC should close the card/modal
11. On the content card and on the experiences card I got lists, can we mantain the same layout and elements but use this: https://vue-bits.dev/components/animated-list — DO not install any additional library
