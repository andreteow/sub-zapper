
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EmailHeader {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  labelIds: string[];
}

interface EmailTableProps {
  emails: EmailHeader[];
}

const EmailTable: React.FC<EmailTableProps> = ({ emails }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  const formatSender = (from: string) => {
    // Extract name and email from format "Name <email@example.com>"
    const match = from.match(/^([^<]+)?<?([^>]+)?>?$/);
    if (match) {
      const name = match[1]?.trim() || '';
      const email = match[2]?.trim() || from;
      return name || email;
    }
    return from;
  };

  return (
    <ScrollArea className="h-[400px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>From</TableHead>
            <TableHead className="w-[50%]">Subject</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emails.map((email) => (
            <TableRow key={email.id}>
              <TableCell className="font-medium">{formatSender(email.from)}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{email.subject}</div>
                  <div className="text-sm text-muted-foreground">{email.snippet}</div>
                </div>
              </TableCell>
              <TableCell className="text-right">{formatDate(email.date)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default EmailTable;
