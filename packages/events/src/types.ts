export type SuperhumanEvents = {
  "gmail/message.received": {
    data: {
      messageId: string;
      tenantId: string;
      subject: string;
      from: string;
      snippet: string;
    };
  };
  "gmail/followup.check": {
    data: {
      emailId: string;
      tenantId: string;
      remindAt: string;
    };
  };
  "calendar/event.changed": {
    data: {
      eventId: string;
      tenantId: string;
      summary: string;
      start: string;
    };
  };
  "linear/issue.created": {
    data: {
      issueId: string;
      tenantId: string;
      title: string;
      url: string;
      assigneeEmail: string | null;
    };
  };
};
