# The Brew Station — mobile QR ordering MVP

## What this version does
- Mobile-first cafe menu
- Reads table number from `?table=1`, `?table=2`, etc.
- Cart and quantity controls
- Waffle Vanilla/Brownie base selection
- Online UPI option (configure your UPI ID)
- Cash/pay-at-counter option
- Optional Google Sheets order receiver

## Important
The UPI link opens the customer's UPI app, but this free MVP does NOT verify payment automatically. For automatic payment verification, add a payment gateway later.

## Configure
Open `app.js` and change:
- `upiId`
- `upiName`
- `orderApi` (after deploying Code.gs as a Google Apps Script Web App)

## Table QR links
Use:
https://YOUR-SITE.pages.dev/?table=1
https://YOUR-SITE.pages.dev/?table=2
...
https://YOUR-SITE.pages.dev/?table=7

Print one QR per table.

## Free launch
1. Create a GitHub repository and upload all files.
2. In Cloudflare Pages, connect the GitHub repository.
3. Deploy as a static site.
4. Use the generated `pages.dev` URL for your QR codes.

## Google Sheets backend
Create a Google Sheet, open Extensions → Apps Script, paste Code.gs, deploy as a Web App with access for anyone, then put the Web App URL in `CONFIG.orderApi`.

This gives you a free basic order log in Google Sheets. For production use, secure the admin side and add server-side validation/payment verification.
