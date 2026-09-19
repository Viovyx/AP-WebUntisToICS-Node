# [ap.webuntis.viovyx.com](https://ap.webuntis.viovyx.com/)

Easy to use .ics generator for importing your Webuntis calendar into your own calendar app.

## Usage


### Using the built in calendar
1. Go to the public url above
2. Find and click your class (If you can't find your class, make sure you've selected the correct schoolyear!)
3. Choose `Open Calendar`

You can view your schedule there and save the url to come back later. You can also filter out subjects as explained below by adding the `filter` parameter to the url.

### Syncing with your own calendar client
1. Go to the public url above
2. Find and click your class (If you can't find your class, make sure you've selected the correct schoolyear!)
3. Choose `Copy ICS sync url`
4. Import the link in your calendar app of choice

This will sync with WebUntis whenever your client syncs the url. You can also filter out subjects as explained below by adding the `filter` parameter to the url.

## Filtering
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

### Examples

#### Built in calendar

##### Week overview:

<img width="2791" height="1595" alt="built-in-week-view" src="https://github.com/user-attachments/assets/27f7df53-3d26-4940-a9d1-ae9714aa45c3" />

##### Detailed info view:

<img width="500" height="auto" alt="built-in-detail-view" src="https://github.com/user-attachments/assets/b03014ee-3e9f-4413-947e-b43c5c945e54" />

#### Google calendar

##### Week overview:

<img width="2137" height="1103" alt="week-view" src="https://github.com/user-attachments/assets/866b631e-85e2-4c17-8784-d3a21dda302b" />

##### Detailed info view:

<img width="500" height="auto" alt="detail-view" src="https://github.com/user-attachments/assets/adf6c9ec-29c0-442e-95bf-1a2e511de967" />


## Disclaimers

There is a built in cache that clears every 15min to prevent hitting a possible rate limit from WebUntis.

Made to work for [AP Hogeschool WebUntis](https://ap.webuntis.com/)

## Issues

If you run into a bug or issue (that is not related to the [the disclaimers](#disclaimers)), please create an issue [here](https://github.com/Viovyx/AP-WebUntisToICS/issues), and I'll do my best to resolve it.
