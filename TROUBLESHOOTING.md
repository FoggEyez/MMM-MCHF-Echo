# Echo troubleshooting

- **Waiting for playback:** Choose `source: "onspotify"` for an existing connected MMM-OnSpotify 7.0.2 instance, `source: "spotify"` for your own direct connection, or supply the documented notification. The default notification mode has no automatic collector.
- **Bridge stays empty:** Keep the provider enabled. `disabled: true` stops it. Verify its own connection first. Unsupported upstream versions may have different metadata fields.
- **Playback update overdue:** The provider has not supplied fresh data within `staleSeconds`. The arc freezes rather than pretending the connection is live. Check provider polling, credentials and networking; use a freshness window longer than your chosen poll interval.
- **Reconnect Spotify:** Check the app's account allowlist and read-current-playing permission, then reauthorize if the refresh token has expired or been revoked. Never paste credentials into an issue, screenshot or public repository.
- **Protected credential file fails:** Use an absolute path, valid JSON under 16KB, and on Linux owner-only file permissions (`chmod 600`). The file must be a regular file. For token rotation its directory must permit an atomic replacement. Keep it outside this Git repository.
- **Artwork missing:** Only approved Spotify HTTPS CDN image URLs are accepted. Original artwork is not cropped to fill non-square boxes. Hidden compact/idle layouts can intentionally omit artwork.
- **Too cramped:** Start with Plaque 350×110, Sleeve 500×240, or Showcase 350×450. Select `auto` to let the arrangement change with dimensions. Reduced-motion mode disables decorative motion and transitions.
- **Rate limited:** Echo honors Spotify's `Retry-After`; leave it connected and let the backoff finish. Extra modules polling the same account/application may contribute to limits.
- **A paused track remains visible:** This is the `retain` behavior. Choose `collapse`, `plaque`, or `hide` for a quieter empty state. Data never continues moving while paused.

For the OnSpotify bridge, keep the provider enabled at a normal position. Add the `mchf-echo-source-only` class to hide only its card. A provider with no position may not be loaded by MagicMirror.

The default surface is now floating. Choose `surface: "framed"` for a panel and earthy background. The ambient glow appears only with fresh playing data; pause, idle, stale data, suspension and hidden pages fade it away. `glowSource: "artwork"` uses OnSpotify’s published palette when available; choose `custom` and a six-digit hex `glowColor` for a fixed color.
