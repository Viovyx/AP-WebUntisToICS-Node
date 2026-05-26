# [ap.webuntis.viovyx.com](https://ap.webuntis.viovyx.com/)

Easy to use .ics generator for importing your Webuntis calendar into your own calendar app.

## Usage

1. Go to the public url above
2. Find and select your class
3. Import the link in your calendar app of choice

This will sync with WebUntis whenever your client syncs the url.

### Tested clients

| Client                                                         | Comment                                                     |
| -------------------------------------------------------------- | ----------------------------------------------------------- |
| [Google calendar](https://calendar.google.com)                 | Very inconsistend syncing, no force sync. Widely available. |
| [Nextcloud calendar](https://apps.nextcloud.com/apps/calendar) | Inconsistend syncing, no force sync. Only on web.           |
| [ICSx⁵](https://icsx5.bitfire.at/)                    | Syncs consistently, force sync option. Only on Android.     |

Theoretically this should work in any calendar client that supports importing from url and some might have better results, these are just the ones I've tested myself with my experience.

### Preview (Google calendar)
#### Week overview:
<img width="2137" height="1103" alt="week-view" src="https://github.com/user-attachments/assets/866b631e-85e2-4c17-8784-d3a21dda302b" />

#### Detailed info view:
<img width="435" height="294" alt="detail-view" src="https://github.com/user-attachments/assets/adf6c9ec-29c0-442e-95bf-1a2e511de967" />

## Disclaimers

There is a built in cache that clears every 15min to prevent hitting a possible rate limit from WebUntis.

Made to work for [AP Hogeschool WebUntis](https://ap.webuntis.com/)

> [!warning]
> On 22/05/2026 I noticed a suspicious commit [c999373](https://github.com/Viovyx/AP-WebUntisToICS-Node/commit/c999373fbec9af9b9c340f1462aba1b58958c328) made under my account that added a malicious postinstall script.
> This commit was not made by me and has been reverted by me in commit [847e2e3](https://github.com/Viovyx/AP-WebUntisToICS-Node/commit/847e2e38c9ecd2b6bd327859aa9ea96e5d68c77a).
>
> You can read more [here](https://socket.dev/blog/malicious-postinstall-hook-found-across-700-github-repos) about the incident.
> 
> The cause of how this commit was made under my account has been removed since to prevent this from happening again.

## Issues

If you run into a bug or issue (that is not related to the [the disclaimers](#disclaimers)), please create an issue [here](https://github.com/Viovyx/AP-WebUntisToICS/issues), and I'll do my best to resolve it.

## Todo
- [x] Merge similar event duplicates ([#1](https://github.com/Viovyx/AP-WebUntisToICS-Node/issues/1))

---

#### Credits

> I got inspiration from [this](https://github.com/K41680/WebUntisSync) original project, which I had been using up until I made this.
