# Echo and Mirror Mischief

**MCHF = Mischief. Echo means sound that leaves an impression.**

[Mirror Mischief project hub](https://github.com/FoggEyez/Mirror-Mischief) · [Echo repository](https://github.com/FoggEyez/MMM-MCHF-Echo)

The public companion installer is **not yet released**. This repository contains a standalone MagicMirror² module, not the full companion. Manual installation and configuration are fully supported through the README and `config.example.js`.

If you already use the development companion:

1. Open Browse modules → Install from a link and paste this repository URL.
2. Open Echo's settings and choose a playback source. `onspotify` reuses an existing enabled MMM-OnSpotify connection; `spotify` uses your own authorized Spotify application; the default `notification` mode waits for a compatible metadata sender.
3. Choose a face, dimensions, floating or framed surface, glow and idle behavior. Preview Studio uses sample playback and does not establish a live account connection.
4. Choose a screen region, save and inspect the mirror. Keep one Echo instance in this release. When reusing MMM-OnSpotify, leave the provider enabled and follow the README's source-only styling instructions to hide its original card.

The module exposes literal defaults for automatic settings discovery. `companion.json` documents supported settings and placement; the current companion does not automatically import that file. Echo displays metadata and progress, not audio. The optional provider keeps its own installation, account and permissions.

For an independent Spotify connection, prefer an owner-protected credentials file outside this repository. Do not share tokens, credentials, private configuration or real listening screenshots in issues. Spotify account and developer requirements still apply; see the README for setup, privacy, freshness states and protected recovery guidance.

Use this repository's issues for Echo bugs and the hub for companion questions. See README and VALIDATION.md for verification scope, manual customization and removal.
