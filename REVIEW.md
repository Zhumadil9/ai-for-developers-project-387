# Review Criteria

Review the pull request against the approved specification:
https://github.com/Zhumadil9/ai-for-developers-project-387/issues/3

## Calendar rules

- An optional booking note must be preserved through TypeSpec, generated OpenAPI,
  generated SDK, Express, and the frontend.
- A note longer than 500 characters must return a contract-compatible 400 response.
- A booking without a note must remain valid.
- An exact or partial overlap must still return 409 and must not create a Booking
  or persist its note.
- The Owner upcoming-meetings view must show a note next to the meeting.
- Editing or deleting a note after booking is out of scope.

## Review output

Every confirmed defect must include:

- file and line
- the violated condition
- the user-visible or API consequence
