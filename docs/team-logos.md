# Team logos

Logos are loaded only at runtime from the public URLs in `teams.json`. They are not committed and they are not bundled into the APK.

`src/config/features.ts` sets `teamLogos.enabled`. While it is true, the app tries a 7 day disk cache, then the network, then a monogram. If the flag is false, the slot is always a monogram.

These images are third-party trademarks. The flag must be off before any store submission.
