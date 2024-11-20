import { UserPage } from "@/components/user/userPage";

export default async function AdminUser({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <UserPage id={id} />;
}
