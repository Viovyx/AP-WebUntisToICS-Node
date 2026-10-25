# [ap.webuntis.viovyx.com](https://ap.webuntis.viovyx.com/)

Easy to use .ics generator for importing your Webuntis calendar into your own calendar app.

## Usage

### Using the built in calendar

1. Go to the public url above
2. On first launch you will be presented with the list of available classes.
3. Select the classes that you want to view in your calendar and click `save`.
4. It is possible to hide courses that you don't want to see by opening said course and clicking `hide` and confirming the action.
    1. To show the courses again, go to settings in the bottom right corner
    2. Select the class of which you have hidden a course.
    3. Click on the course you want to show again and confirm the action.

### Syncing with your own calendar client

1. Open the settings in the bottom right corner.
2. Make sure the class you want the sync url for is already selected and listed at the top.
3. Click on that class so the copy button is shown.
    1. This view also lists the courses you have hidden.
4. Choose `Copy ICS link`
5. Import the link in your calendar app of choice

This will sync with WebUntis whenever your client syncs the url. It will also exclude the courses you have hidden.

### Tested clients

| Client                                                         | Comment                                                     |
| -------------------------------------------------------------- | ----------------------------------------------------------- |
| [Google calendar](https://calendar.google.com)                 | Very inconsistend syncing, no force sync. Widely available. |
| [Nextcloud calendar](https://apps.nextcloud.com/apps/calendar) | Inconsistend syncing, no force sync. Only on web.           |
| [ICSx⁵](https://icsx5.bitfire.at/)                             | Syncs consistently, force sync option. Only on Android.     |

Theoretically this should work in any calendar client that supports importing from url and some might have better results, these are just the ones I've tested myself with my experience.

## Examples

### Built in calendar

#### Week overview:

<img width="1920" height="1080" alt="custom-week-overview" src="https://github.com/user-attachments/assets/5e19fd2f-41a8-4c7e-afa7-00510acc75e8" />

#### Detailed info view:

<img width="500" height="auto" alt="custom-detail-view" src="https://github.com/user-attachments/assets/79491f1b-cb4b-481d-ab68-9effe8dc15b4" />

### Google calendar

#### Week overview:

<img width="2137" height="1103" alt="week-view" src="https://github.com/user-attachments/assets/866b631e-85e2-4c17-8784-d3a21dda302b" />

#### Detailed info view:

<img width="500" height="auto" alt="detail-view" src="https://github.com/user-attachments/assets/adf6c9ec-29c0-442e-95bf-1a2e511de967" />

## Disclaimers

There is a built in cache that clears every 15min to prevent hitting a possible rate limit from WebUntis.

Made to work for [AP Hogeschool WebUntis](https://ap.webuntis.com/)

## Issues

If you run into a bug or issue (that is not related to the [the disclaimers](#disclaimers)), please create an issue [here](https://github.com/Viovyx/AP-WebUntisToICS/issues), and I'll do my best to resolve it.
