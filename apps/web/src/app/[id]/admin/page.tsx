import { AdminPage } from "@/components/admin/adminPage";

export default async function AdminUser({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <AdminPage id={id} />;
}
