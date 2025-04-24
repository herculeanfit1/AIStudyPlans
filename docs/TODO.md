# SchedulEd Application - TODO List

## Email Integration

- [x] Set up Resend package
- [x] Create email service utilities
- [x] Create email templates
- [x] Set up waitlist API endpoint
- [ ] Verify domain `aistudyplans.com` with Resend
  - Go to https://resend.com/domains
  - Add aistudyplans.com as domain
  - Follow DNS verification steps
  - Update EMAIL_FROM in .env.local after verification

## Application Structure

- [ ] Review directory structure (consider moving from scheduledapp/ subfolder to root)
- [ ] Ensure all components are properly connected
- [ ] Test navigation between pages

## Future Enhancements

- [ ] Implement user authentication
- [ ] Add database integration for waitlist
- [ ] Create study plan generation functionality
- [ ] Build calendar integration
- [ ] Add progress tracking 