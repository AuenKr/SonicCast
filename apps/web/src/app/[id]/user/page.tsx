export default async function User({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <div>
      <span>From user page</span>
      <div>Id : {id}</div>
    </div>
  );
}
