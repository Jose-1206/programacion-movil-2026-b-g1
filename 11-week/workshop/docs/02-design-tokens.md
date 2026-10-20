
# CP2 — Navigation and Design Tokens

## 1. Navigation pattern

Attendance Control uses a bottom-tab navigation pattern for the student experience.

Three main sections are available:

- Attendance History (`/tabs/historial`)
- QR Registration (`/tabs/registrar`)
- Student Profile (`/tabs/perfil`)

This pattern allows students to move between frequent tasks without returning to a main menu.

Attendance record details will use stack navigation because they belong to a specific history item.

## 2. Backend references

| Screen | Backend endpoint | Purpose |
|---|---|---|
| Attendance History | GET /api/attendance/history | Retrieve student records |
| QR Registration | POST /api/attendance/register | Register attendance |
| Student Profile | GET /api/users/me | Retrieve authenticated user |

At this stage, only navigation and presentation structure are implemented. Backend integration is pending.

## 3. Design tokens

| Token | Value | Purpose |
|---|---|---|
| Primary | #166A42 | Main actions and headers |
| Secondary | #154D71 | Secondary actions |
| Success | #166534 | Successful registration |
| Danger | #B42318 | Error messages |
| Background | #F4F7F5 | Page background |
| Text | #152C22 | Main content |
| Base font | 1rem | Body text |
| Title font | 1.25rem | Section headings |
| Small spacing | 0.5rem | Compact separation |
| Medium spacing | 1rem | Standard separation |
| Large spacing | 1.5rem | Section separation |

## 4. WCAG contrast verification

| Foreground | Background | Ratio | Result |
|---|---|---|---|
| #FFFFFF | #166A42 | 6.62:1 | Pass |
| #FFFFFF | #154D71 | 9.01:1 | Pass |
| #FFFFFF | #166534 | 7.13:1 | Pass |
| #FFFFFF | #B42318 | 6.57:1 | Pass |
| #152C22 | #F4F7F5 | 13.76:1 | Pass |

These ratios meet the WCAG AA minimum of 4.5:1 for normal text.

## 5. Design decisions

The student navigation is separated into history, attendance registration and profile.

The interface keeps a consistent green primary color and uses rem-based typography for improved scalability.

QR registration and attendance retrieval will be connected to the existing Spring Boot backend in later checkpoints.
