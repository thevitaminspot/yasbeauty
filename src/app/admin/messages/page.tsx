import { MessagesList } from "@/components/admin/messages-list";
import { AdminPageHeader } from "@/components/admin/ui";
import { readMessages } from "@/lib/messages-store";

export const metadata = { title: "Messages" };
export const instant = false;

export default async function AdminMessagesPage() {
  const rows = await readMessages();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Inbox"
        title="Messages"
        description="Notes from the contact form."
      />
      <MessagesList rows={rows} />
    </div>
  );
}
