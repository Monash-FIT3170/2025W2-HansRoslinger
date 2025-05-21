import { createUser } from "./user/createUser";
import { updateS3BucketUrl } from "./user/updateS3BucketUrl";
import { updateUserEmail } from "./user/updateEmail";

async function main() {
  const user = await createUser(
    "alice@example.com",
    "Alice",
    "https://s3.bucket/alice",
    "password",
  );

  await updateS3BucketUrl(user.id, "https://s3.bucket/new-alice");

  await updateUserEmail(user.id, "alice.new@example.com");
}

main().catch(console.error);
