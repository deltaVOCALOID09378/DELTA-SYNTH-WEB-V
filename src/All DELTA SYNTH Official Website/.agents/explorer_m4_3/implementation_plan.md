# Implementation Plan for M4_Files_Events

## Overview
This plan details the creation of `src/files.html` and `src/events.html`, and updating navigation links in all existing `.html` files inside `src/`.

## 1. Update Navigation Links
In all HTML files inside `src/` (e.g., `index.html`, `about.html`, and any newly created files), update the shared Navbar to link to the correct pages instead of `#`:
- Desktop and Mobile menu:
  - Change Voicebanks `#` to `voicebank.html`
  - Change Files `#` to `files.html`
  - Change Events `#` to `events.html`
  - Change Collab `#` to `collab.html`

## 2. Create `src/files.html`
- **Structure**: Copy the basic layout from `src/index.html` (including `<head>`, Navbar, `<main>`, and Footer).
- **Hero Section**: Add a hero section with the title "Files & Downloads" and a subtitle "All USTX, MIDI, SVP and VSQX file".
- **Content Section**:
  - Use a Tailwind grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`).
  - Create card placeholders for different file types: USTX, MIDI, SVP, and VSQX.
  - Each card should have a title, a short description, and a "Download" button.

## 3. Create `src/events.html`
- **Structure**: Copy the basic layout from `src/index.html` (including `<head>`, Navbar, `<main>`, and Footer).
- **Hero Section**: Add a hero section with the title "Upcoming Events".
- **Content Section**:
  - Use a Tailwind grid or list layout.
  - Add the following events (extracted from Wix source):
    - **Yung Shah w/DJ Maco** - Saturday 22 Jul, Location: Cypher City
    - **Big Broadie** - Friday 21 Jul, Location: Cypher City
    - **T.O.A.S.T.** - Tuesday 18 Jul, Location: Cypher City
  - Each event card should have the Title, Date, Location, and a "More Info" or "Details" button.

## 4. Final Review
- Ensure the mobile menu toggle works on the new pages (copy the JS script from the bottom of `index.html`).
- Validate that all internal links are working correctly across all pages.
