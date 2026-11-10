# Lattis: rules for agents working in this repo

This code is the coded version of the Lattis designs in Figma. The designs and the team's decisions live on the **SPEC page** of the Figma file `User Interface` (file key `3o12PsA7e3ORLlmHzaYjNm`, node `357:2806`).

## Before you change anything

1. Read the SPEC page's **Lattis · Rules** spec and follow its "Start here" steps.
2. Read your person's own spec and their **For you** inbox.
3. Check **Lattis · Group understanding** and **Needs attention**. Don't build something that contradicts an open disagreement without saying so.

## While you work

1. Stay in your person's section when you can: `/phone` (Brayden), `/ranch` (Chris), `/vet` (Finley).
2. Names, cows and times come from `src/lib/story.ts`. Never hard-code them in a page.
3. Colors and type come from the CSS variables in `src/app/globals.css`, which mirror the Figma styles. Don't add raw hex values in pages.
4. Design rules from the specs:
   1. No outlines, divider lines or status dots. Flat warm cards (`.card`).
   2. Urgency is a word (Urgent, Needs a look, FYI), never a badge or banner.
   3. Orange only for what needs you. Orange text uses `--secondary-text`.
   4. One dark primary action per screen.
   5. Sentence case. No all caps, no middle dots, no exclamation marks.
   6. Plain words. Inform, don't instruct.

## After you change something

1. Log it in your person's spec on the SPEC page (Work log), with a link to the commit or pull request.
2. If it affects another person's section, flag them in their For you inbox (Rules section 9).
3. Refresh the Dashboard spec.
