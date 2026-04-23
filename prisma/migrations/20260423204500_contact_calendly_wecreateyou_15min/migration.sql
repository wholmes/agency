-- Public booking link for /contact Calendly card (CMS row id = 1)
UPDATE "ContactPageCopy"
SET
  "calendlyUrl" = 'https://calendly.com/wecreateyou/15min',
  "calendarCardSubtitle" = '15-minute intro call, no obligation'
WHERE id = 1;
