# Lattis

Cattle health, from the drone to your own vet. SCAD UXDG 450 team project.

One website, three sections:

| Section | Route | Who it's for | Lead |
|---|---|---|---|
| Rancher app | `/phone` | Dale and Wade, in the field (shown in a phone frame) | Brayden |
| Rancher software | `/ranch` | Not started | Chris |
| Vet website | `/vet` | Not started | Finley |

The home page (`/`) links to all three, so one link previews the whole system.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## The phone screens come straight from Figma

The rancher app isn't redrawn by hand. On every build, `scripts/figma-sync.mjs` reads the Figma file and copies every phone screen, layer by layer: auto layout, spacing, colors, text styles, photos, icons and prototype links. `src/figma/Render.tsx` draws them, so the site matches Figma and every tap goes where the Figma prototype goes.

- **To change a phone screen, change it in Figma,** then re-run the **Publish to GitHub Pages** workflow (Actions tab) or push anything.
- It starts at the tab pages and follows every prototype link, so a new screen shows up once something links to it.
- The phone is iPhone 17 size: 402 x 874.
- Don't edit `src/figma/screens.json` by hand. The next sync replaces it.
- The sync needs the repo secret `FIGMA_TOKEN` (a read-only Figma token).

## The options panel

The round button at the bottom left of every page opens the options panel:

- **Tabs** switch between the three sections.
- **Section options** switch between versions of a layout (A, B, C).
- **Data** changes what the screen is showing: how many cows need you, how much each card shows, long names, a drone check that's flying or missed, no signal.

Your choices are saved in the page link. **Copy link to this view** gives you a link that opens the same version for someone else.

To add options to your section, add them to `src/lib/options.ts`, then read one in your page with `useOption("ranch", "layout")`.

## Where things live

```
src/
  app/
    page.tsx          home: links to the three sections
    phone/            rancher app (phone screens)
    ranch/            rancher software (desktop)
    vet/              vet website
  components/         pieces shared by every section
  lib/story.ts        the sample story: people, cows, times
  app/globals.css     colors and type, copied from the Figma styles
public/photos/        drone photos (add your own)
```

**Change a name or a cow once in `src/lib/story.ts`** and all three sections update. That keeps the phone, the ranch software and the vet website telling the same story.

**Colors and type come from Figma.** The User Interface file's local styles are the source. Change them in Figma first, then in `globals.css`.

## Working together

1. Pull before you start: `git pull`.
2. Work on a branch: `git checkout -b chris/ranch-today`.
3. Stay in your section's folder when you can. Shared files (`components/`, `lib/story.ts`, `globals.css`) affect everyone, so say so in your pull request.
4. Open a pull request into `main`.

## Preview online

The site publishes to GitHub Pages on every push to `main`. In the repo settings, Pages > Source must be set to **GitHub Actions**.

## Rules from the SPEC page

The design decisions live on the SPEC page of the Figma file. Read it before changing a design, and log what you change in your own spec. See `CLAUDE.md` for the rules agents follow.

## Live site

https://braydenwis05.github.io/lattis/

Every push to `main` rebuilds it (see `.github/workflows/pages.yml`). It takes about two minutes.
