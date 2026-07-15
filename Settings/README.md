# SecureView — Security Cameras & Alarms Website

A fast, clean, zero-build website. No frameworks, no build step — just HTML, one
CSS file, and one JavaScript file. **All the words on the site live in simple text
files inside the `Settings/` folder.** Change the text, save, and the site updates.
-
## The pages

| Page | File |
|------|------|
| Home | `index.html` |
| Services (cameras, alarms, other) | `services.html` |
| Free Estimate / Contact | `contact.html` |

## How to update the words (no coding)

1. Open the `Settings/` folder.
2. Find the file for what you want to change:

   | What to change | Edit this file |
   |----------------|----------------|
   | Business name, phone, email, footer, social (all pages) | `Settings/site.txt` |
   | Home page | `Settings/Home/content.txt` |
   | Services page headings | `Settings/Services/content.txt` |
   | Camera options | `Settings/Services/cameras.txt` |
   | Alarm options | `Settings/Services/alarms.txt` |
   | Other services | `Settings/Services/other.txt` |
   | Resolution guide boxes | `Settings/Services/resolution.txt` |
   | Free estimate page | `Settings/Contact/content.txt` |

3. Change the text **after** the colon (`:`). Don't change the labels before it.
   Lines starting with `#` are notes and are ignored.
4. To add a card (a service, camera option, etc.), copy an existing block and edit
   it. Blocks are separated by a **blank line**.

## First things to set

- **Your business name & phone:** edit `Settings/site.txt` (`SITE NAME`, `MONOGRAM`,
  `PHONE`). The phone number powers the Call/Text buttons.
- **Where estimate requests are emailed:** edit `FORM EMAIL` in
  `Settings/Contact/content.txt`. The **first** time the form is submitted,
  [FormSubmit.co](https://formsubmit.co) sends a one-time confirmation email to that
  address — click the link in it once to turn on delivery. (Free, no backend needed.)

## Adding your own photos (replacing the placeholders)

The dashed boxes on the site are image placeholders. Each one has a short description
of the photo that should go there. To use a real photo:

1. Put your image file in this folder (e.g. `camera1.jpg`).
2. In the page's HTML, find the placeholder block, which looks like:

   ```html
   <div class="imgph" data-reveal>
     <div><i class="fa-solid fa-camera"></i><div class="imgph__tag">Image</div>
       <p class="imgph__desc">Close-up of a professionally mounted outdoor camera...</p></div>
   </div>
   ```

3. Replace the inside with your image:

   ```html
   <div class="imgph" data-reveal>
     <img class="imgph__img" src="camera1.jpg" alt="Outdoor camera install" />
   </div>
   ```

Suggested photos (each placeholder already lists a description on the page):
- **Home hero:** a home exterior at dusk with a camera under the eaves.
- **Recent installs:** a mounted camera close-up, a live-view screen/phone, a night-vision shot.
- **Services page:** an image-clarity comparison (e.g. a clear license plate or face).

## Preview locally

The pages load the text files, which browsers block from `file://`, so use a tiny
local server:

```
python3 -m http.server 8000
```

Then open http://localhost:8000

## Publish free with GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repo: **Settings → Pages → Source: main branch → /(root)**.
3. Your site goes live at `https://<your-username>.github.io/<repo-name>`.
