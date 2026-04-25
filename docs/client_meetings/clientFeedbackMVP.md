### Booking Page
Some pagination / seperate pages can be added to stop the user being overwhelmed with too many form options. Additional fields:
- Via
- Number of passengers
- Luggage (No. of carry-on, no. of suitcases)
- Return option? Mirror the booking upon creation so that when it's created it will make a mirrored return. Return time, date, destination should be independent of outgoing trip.
- A page to review your booking details before they're submitted "Does this look correct?"

In the process, the Post Order number must be added, the department head / level approver can add the post order number. It becomes mandatory before it gets sent to Proline.

### Integration with iCabbi
As a super admin (owner/superuser), you should be able to override and add comments about bookings, trigger department notifications, etcetera, and then reflect those changes to iCabbi. Integration with iCabbi in the future should be made to be independent of each other / possibly removed if the university starts paying for active taxi vehicles by the hour.

Replication of data should be prioritised in this order: UoB Taxi Booking Page to iCabbi (not to panic about the other way around except for pricing or other data not available from our own sources).

The booking should only be sent to the iCabbi API once it has been approved, but updateds to the data should still be able to be made to existing approved bookings by a superadmin user.

### Other Integrations
The solution / API we use for map / address finding should be scalable.

### Getting feedback
We will share some screenshots of the app working so that we can get some feedback about the theme. We can get inspiration from the iCabbi form.

### Additional features to consider
Also a feedback form / commenting page for passengers about the journey, pickup, and overall driver rating. (Not a public review page, just for the drivers / company to see).

### How long is acceptable between booking and ride
Time before booking: 24 hours before a booking is sent to iCabbi, and if they'd like anything earlier, request them to call Proline taxi themselves. Do not allow users to book a ride that's within 24 hours of current time, and warn that rides are subject to availability.