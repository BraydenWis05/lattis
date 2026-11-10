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

Connect this repo to [Vercel](https://vercel.com/new) (free). Every push to `main` updates the site, and every pull request gets its own preview link.

## Rules from the SPEC page

The design decisions live on the SPEC page of the Figma file. Read it before changing a design, and log what you change in your own spec. See `CLAUDE.md` for the rules agents follow.
