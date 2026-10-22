
# CP8 — Attendance Control Usability Test

## 1. Objective

Evaluate the usability of Attendance Control through three practical tasks completed by two real participants.

The evaluation focuses on QR registration, attendance history navigation, and error recovery.

## 2. Test Environment

- Device: Windows laptop
- Browser: Google Chrome
- Participants: 2
- Test date: 22-10-2026
- Application: Attendance Control

## 3. Test Tasks

| Task | Description |
|---|---|
| T1 | Validate a QR registration code |
| T2 | Find and review the Programación Móvil attendance detail |
| T3 | Recover from a simulated QR validation error |

## 4. Usability Results

| Participant | Task | Completed | Time | Errors | Observation |
|---|---|---|---|---|---|
| P1 | T1 | Yes | 30 s | 0 | Completed successfully without reported errors |
| P1 | T2 | Yes | 35 s | 0 | Completed successfully without reported errors |
| P1 | T3 | Yes | 40 s | 0 | Completed successfully without reported errors |
| P2 | T1 | Yes | 34 s | 0 | Completed successfully without reported errors |
| P2 | T2 | Yes | 39 s | 0 | Completed successfully without reported errors |
| P2 | T3 | Yes | 47 s | 0 | Completed successfully without reported errors |

## 5. Main Findings

### Finding 1 — QR Registration

Both participants completed QR registration without errors.

Average completion time: 32 seconds.

### Finding 2 — Attendance Detail Navigation

Both participants successfully accessed the Programación Móvil attendance detail.

Average completion time: 37 seconds.

### Finding 3 — Error Recovery

Both participants completed error recovery without errors.

Average completion time: 43.5 seconds.

Error recovery required the most time of the three tasks.

## 6. Identified Improvement Opportunity

The error recovery flow was the slowest task for both participants.

A persistent inline error message could make validation feedback easier to review without depending only on a temporary toast.

This is a preventive improvement. Neither participant reported a usability error.

## 7. Current Limitations

The application uses simulated attendance records and QR validation.

The results evaluate frontend usability rather than real backend registration.

No participant errors were reported during the sessions.

## 8. Usability Improvement Implementation

### 8.1. Selected Improvement

During the usability test, both participants completed all three tasks successfully without reporting errors.

However, error recovery required the longest average completion time (43.5 seconds).

Based on this observation, the QR registration form was selected for a preventive usability improvement.

### 8.2. Identified Opportunity

Previously, the QR registration form displayed validation failures using a temporary IonToast.

The notification disappeared after three seconds, which could make it difficult for users to review the error message.

Although the participants did not report this as a problem, providing persistent feedback could improve the experience.

### 8.3. Implemented Solution

The QR registration form was updated to display a persistent inline error message.

The following improvements were implemented:

- Added a persistent error message below the QR code field.
- Preserved the IonToast notification.
- Automatically cleared the error when the user edited the code.
- Cleared validation errors when the user discarded the form.
- Maintained the existing loading indicator and input validation.

### 8.4. Technical Changes

Modified file:

`src/features/attendance/presentation/QrRegistrationPage.tsx`

The component now uses the `submissionError` state to manage persistent validation feedback.

The existing QR registration simulation remains unchanged.

### 8.5. Verification Results

| Test | Expected Behavior | Result |
|---|---|---|
| Invalid QR code | Display toast and persistent error | Passed |
| Toast timeout | Keep inline error visible | Passed |
| Edit QR code | Clear previous validation error | Passed |
| Valid demonstration code | Display success feedback | Passed |
| Cancel registration | Clear the code and validation errors | Passed |

### 8.6. Conclusion

The usability sessions showed that both participants could complete the required tasks without errors.

Error recovery was identified as the slowest interaction and was selected for a preventive improvement.

The updated form now provides persistent validation feedback, improving message visibility without changing the existing navigation or registration workflow.

The improvement was verified manually. No additional participant usability test was performed after the correction.

