# Echo · Mirror Mischief

**MCHF = Mischief.** Echo is a responsive music card for MagicMirror²: original artwork, an engraved observatory frame, restrained track transitions and a small arc showing real playback progress.

Part of [Mirror Mischief](https://github.com/FoggEyez/Mirror-Mischief). Meaning: sound that leaves an impression. Requires MagicMirror² 2.38+ and Node 22+. It displays playback; it does not play or capture audio.

![Echo working-render preview](preview/Echo.png)

## Install

This first version is being reviewed locally. Until its public repository is published, copy the complete `MMM-MCHF-Echo` folder into your MagicMirror `modules` directory, then run `npm ci --ignore-scripts` there. The clone commands below are for the intended published repository; its URL is not a claim that publication is complete.

```sh
cd ~/MagicMirror/modules
git clone https://github.com/FoggEyez/MMM-MCHF-Echo.git
cd MMM-MCHF-Echo
npm ci --ignore-scripts
```

No runtime packages, build step or companion subscription is required. The repository/folder/entry name is `MMM-MCHF-Echo`.

## Easiest setup: reuse MMM-OnSpotify

If [MMM-OnSpotify](https://github.com/Fabrizz/MMM-OnSpotify) is already connected, add Echo and choose `source: "onspotify"`. Echo reads the existing module's frontend playback metadata. It does not copy credentials, request new Spotify permissions, or make a second set of Spotify API requests. Leave the provider enabled. To show only Echo, keep the provider’s normal `position` and add `mchf-echo-source-only` to its existing `classes` string. Echo’s stylesheet hides that card while keeping the provider loaded. Removing its position can prevent MagicMirror from loading the provider. Do not set the provider `disabled: true`.

```js
{
  module: "MMM-MCHF-Echo",
  position: "top_right",
  config: {
    source: "onspotify",
    layout: "auto",
    preset: "observatory",
    background: "original",
    panelWidth: 350,
    panelHeight: 300,
    idleBehavior: "retain",
    motion: "gentle",
    entrance: "fade"
  }
}
```

The bridge targets MMM-OnSpotify 7.0.2's `playerData` fields. Its timestamp changes only when the provider supplies a new object, so a broken connection cannot keep old data falsely fresh. The provider remains an independent upstream module, with its own installation, account and license. Other upstream versions need verification.

## Independent Spotify connection

An existing provider is optional. Set `source: "spotify"` and configure your own Spotify application and an authorized refresh token with `user-read-currently-playing`. Use the [official authorization guide](https://developer.spotify.com/documentation/web-api/tutorials/code-flow). Echo does not include a browser login wizard in this release.

Prefer a protected JSON credentials file outside this repository:

```json
{
  "clientId": "YOUR_SPOTIFY_APP_CLIENT_ID",
  "clientSecret": "YOUR_SPOTIFY_APP_CLIENT_SECRET",
  "refreshToken": "YOUR_AUTHORIZED_REFRESH_TOKEN"
}
```

Set `credentialsFile` to its absolute path, restrict it to your account (`chmod 600` on Linux), and include it in your own protected credential recovery process. Echo saves rotated refresh tokens into this same protected file with an atomic replacement. It never writes tokens to module source, exports or logs. Windows file access should be restricted through your account's filesystem permissions.

Alternatively set the three credential settings directly in the private MagicMirror configuration. As with other MagicMirror modules, configuration is available to the mirror's browser; the protected-file method keeps these values out of browser configuration. Refresh-token rotations from direct configuration are kept in memory until restart. A public/PKCE token can use `clientId` and `refreshToken` without `clientSecret`.

Spotify's account/developer restrictions still apply. Development Mode currently requires the app owner's Premium account and allows up to five authorized, allowlisted users. Each public-module owner should use their own developer application; this project does not provide a shared public Spotify client. See [Spotify quota modes](https://developer.spotify.com/documentation/web-api/concepts/quota-modes).

## Manual and companion customization

The same literal defaults are available in ordinary `config.js` and in compatible Mirror Mischief companion settings. The companion is optional. After changing configuration, restart MagicMirror normally. Layout can also adapt to a container's width; the exported `resize(width,height)` method supports preview/layout helpers.

`auto` selects a compact Plaque below 145px tall, a side-by-side Sleeve for wide/medium cards, and a tall Showcase otherwise. Recommended starting sizes: Plaque 350×110, Sleeve 500×240, Showcase 350×450. Avoid shrinking below 240px wide if you want readable metadata. The compact Plaque omits artwork and hides the progress detail; it always retains Spotify attribution.

| Setting | Default | Meaning |
| --- | --- | --- |
| `source` | `"notification"` | `notification`, `onspotify`, or independent `spotify` connection. |
| `notificationName` | `"MCHF_ECHO_PLAYBACK"` | Notification listened to in notification mode. |
| `layout` | `"auto"` | `auto`, `plaque`, `sleeve`, `showcase`. |
| `preset` | `"observatory"` | `observatory`, `earthen`, `glass`. |
| `background` | `"original"` | `original`, `moss`, `sage`, `clay`, `sand`, `walnut`, `slate`, `peat`. |
| `panelWidth` | `350` | Initial card width in pixels. |
| `panelHeight` | `300` | Initial card height in pixels. |
| `showProgress` | `true` | Display the informational elapsed-time arc outside the artwork. |
| `showRemaining` | `true` | Show remaining time next to elapsed time. |
| `showAlbum` | `true` | Show original artwork where the layout has room. |
| `idleBehavior` | `"retain"` | `retain` last track, `collapse` to a short Plaque, `plaque` at configured height, or `hide`. |
| `motion` | `"gentle"` | `gentle` enables restrained ornament; `none` or `still` stops motion. OS reduced-motion preference is respected. |
| `entrance` | `"fade"` | `fade`, `flip`, or `none` for metadata on first render; artwork stays static. |
| `transitionStyle` | `"fade"` | `fade` text transition, or `none`. Artwork is never animated. |
| `transitionMs` | `500` | Text transition duration, bounded to 100–1400ms. |
| `ornament` | `true` | Subtle brass-label glint while genuinely playing; no fake audio spectrum. |
| `staleSeconds` | `90` | Freshness window, bounded to 15–3600 seconds. Progress freezes and the card marks overdue data. |
| `clientId` | `""` | Spotify app client ID, optional when read from file. |
| `clientSecret` | `""` | Spotify app client secret for confidential apps; file recommended. |
| `refreshToken` | `""` | Authorized Spotify refresh token; file recommended. |
| `credentialsFile` | `""` | Absolute path to an owner-private JSON credentials file. |
| `pollSeconds` | `10` | Direct Spotify playing poll interval, bounded 5–300 seconds. |
| `idlePollSeconds` | `30` | Direct Spotify idle/error poll interval, bounded 15–600 seconds. |
| `hiddenPollSeconds` | `60` | Minimum direct Spotify poll interval when hidden, bounded 30–1800 seconds. |

Empty credentials never trigger a guessed connection. Disconnected, authorization-required, rate-limited and stale states are explicit. Spotify rate limits honor `Retry-After`; repeated reconnect errors back off. When you use a provider whose polling interval exceeds the freshness window, increase `staleSeconds` accordingly.

## Notification integration

No account or network connection is required for a compatible metadata sender. Send:

```js
this.sendNotification("MCHF_ECHO_PLAYBACK", {
  status: "playing", // playing, paused, idle, unavailable, reconnect, limited
  observedAt: Date.now(),
  title: "Your current track",
  artist: "Artist",
  album: "Album",
  progressMs: 12000,
  durationMs: 180000,
  imageUrl: "https://i.scdn.co/image/VALID_SPOTIFY_IMAGE_ID",
  spotifyUrl: "https://open.spotify.com/track/VALID_SPOTIFY_TRACK_ID",
  type: "track"
});
```

Spotify's standard current-playing response is also accepted. Supply the actual observation time; do not restamp unchanged cached playback indefinitely. Only Spotify HTTPS image CDN URLs and `open.spotify.com` links are displayed. Metadata is rendered as text, never HTML. The frontend's `setPlayback(payload)` method accepts the same data for previews/integrations. `resize(width,height)` changes layout; `destroy()` disconnects observers, timers, visibility listeners and this instance's optional backend session.

The arc represents elapsed playback, interpolated between fresh observations and stopped while paused. It is informational, not a seek control. Spotify's Web API provides no live audio samples for a true waveform; Echo does not claim beat-reactive visuals, lyrics or audio analysis.

## Privacy, branding and dependencies

- `onspotify` uses metadata already present in the browser and adds no Spotify requests. `notification` has no collector. Direct `spotify` mode contacts only `accounts.spotify.com` and `api.spotify.com`; artwork is requested directly from the allowed Spotify image hosts.
- No location, usage analytics, microphone or listening-history database is collected. The current snapshot remains in memory. Token refresh requests and response bodies are not logged or forwarded to the frontend. If you configure secrets directly in MagicMirror's config rather than a file, MagicMirror's normal browser-configuration visibility applies.
- Spotify artwork remains intact, static and unobscured. A 4px corner radius follows Spotify's current small/medium-device guidance. Decoration and progress stay outside the artwork. Original metadata links back to Spotify, and the approved full white Spotify logo is included without alteration.
- The white Spotify logo is a Spotify trademark, provided under its [design and branding guidelines](https://developer.spotify.com/documentation/design), not under this project's MIT license. No endorsement is implied. All module code is original Mirror Mischief work; the optional upstream adapter does not copy MMM-OnSpotify source.

## Update and remove

Update with `git pull` and `npm ci --ignore-scripts`, then restart MagicMirror. To remove Echo, remove its configuration entry and restart; then remove `modules/MMM-MCHF-Echo` if desired. The independent upstream provider and its connection remain yours to manage. If using direct Spotify mode, revoke this app's account access through Spotify and remove the protected credential file when it is no longer needed. Do not delete credentials owned by another module.

## Verification and compatibility

`npm test` exercises metadata sanitization, real/paused/stale progress, seeking, responsive face choices, serialized OAuth refresh, token expiry, rate-limit backoff, upstream-object freshness and lifecycle cleanup. API tests use fake responses and make no network requests. Artwork and Spotify API behavior depend on the account's supported content and permissions. The bridge specifically targets MMM-OnSpotify 7.0.2. Working-render screenshots use synthetic metadata; they do not establish every hardware/account combination as tested.
