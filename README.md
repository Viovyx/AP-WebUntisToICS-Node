# [ap.webuntis.viovyx.com](https://ap.webuntis.viovyx.com/)

Easy to use .ics generator for importing your Webuntis calendar into your own calendar app.

## Usage

1. Go to the public url above
2. Find and select your class (If you can't find your class, make sure you've selected the correct schoolyear!)
3. Import the link in your calendar app of choice

This will sync with WebUntis whenever your client syncs the url.

### Filtering
It is possible to filter out subjects that don't apply to you. Filtering is done by adding a `filter` parameter to the url you copied from the steps above. You can have multiple subjects filtered by splitting them with a comma.

Below is an example:
```
https://<the link copied from the steps above>&filter=Ideation, Robot Dynamics
```
This will filter out all subjects that match one of those names (capitalization insensitive). Currently it is only possible to filter on subjects, not on subject info or teacher, this means if there are practical and theoretical classes of one subject it will filter out both.

### Tested clients

| Client                                                         | Comment                                                     |
| -------------------------------------------------------------- | ----------------------------------------------------------- |
| [Google calendar](https://calendar.google.com)                 | Very inconsistend syncing, no force sync. Widely available. |
| [Nextcloud calendar](https://apps.nextcloud.com/apps/calendar) | Inconsistend syncing, no force sync. Only on web.           |
| [ICSx⁵](https://icsx5.bitfire.at/)                             | Syncs consistently, force sync option. Only on Android.     |

Theoretically this should work in any calendar client that supports importing from url and some might have better results, these are just the ones I've tested myself with my experience.

### Preview (Google calendar)

#### Week overview:

<img width="2137" height="1103" alt="week-view" src="https://github.com/user-attachments/assets/866b631e-85e2-4c17-8784-d3a21dda302b" />

#### Detailed info view:

<img width="435" height="294" alt="detail-view" src="https://github.com/user-attachments/assets/adf6c9ec-29c0-442e-95bf-1a2e511de967" />

## Disclaimers

There is a built in cache that clears every 15min to prevent hitting a possible rate limit from WebUntis.

Made to work for [AP Hogeschool WebUntis](https://ap.webuntis.com/)

## Issues

If you run into a bug or issue (that is not related to the [the disclaimers](#disclaimers)), please create an issue [here](https://github.com/Viovyx/AP-WebUntisToICS/issues), and I'll do my best to resolve it.
