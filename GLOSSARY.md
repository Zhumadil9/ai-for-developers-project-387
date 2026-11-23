# Calendar Booking

## Language

**Catalog of Event Types**:
A page that presents the meeting types available for booking.
_Avoid_: Meeting catalog, booking list

**Event Type**:
A reusable meeting configuration that defines a meeting name and duration.
_Avoid_: Meeting template, appointment type

**Booking**:
A confirmed or placeholder reservation of an available time for an Event Type.
_Avoid_: Appointment, reservation

**Guest**:
A person who opens a public link and selects or requests a time.
_Avoid_: Visitor, client

**Owner**:
A person who configures Event Types and availability.
_Avoid_: Host, administrator

**Availability**:
The working-hours periods from which free starts for an Event Type can be offered.

**Time Slot**:
A local interval with a start and an end that is available for one Event Type.
_Avoid_: Appointment slot, timespan

**Conflict**:
The rejection of a Booking because its interval overlaps another Booking.
