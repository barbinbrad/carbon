import { File, useNotification } from "@carbon/react";
import { Button, VStack } from "@chakra-ui/react";
import { useSubmit } from "@remix-run/react";
import type { ChangeEvent } from "react";
import { Avatar } from "~/components";
import { useSupabase } from "~/lib/supabase";
import type { Account } from "~/modules/account";

type ProfilePhotoFormProps = {
  user: Account;
};

const ProfilePhotoForm = ({ user }: ProfilePhotoFormProps) => {
  const { supabase } = useSupabase();
  const notification = useNotification();
  const submit = useSubmit();

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && supabase) {
      const avatarFile = e.target.files[0];
      const fileExtension = avatarFile.name.substring(
        avatarFile.name.lastIndexOf(".") + 1
      );

      const imageUpload = await supabase.storage
        .from("avatars")
        .upload(`${user.id}.${fileExtension}`, avatarFile, {
          cacheControl: `${12 * 60 * 60}`,
          upsert: true,
        });

      if (imageUpload.error) {
        notification.copyableError(imageUpload.error, "Failed to upload image");
      }

      if (imageUpload.data?.path) {
        submitAvatarUrl(imageUpload.data.path);
      }
    }
  };

  const deleteImage = async () => {
    if (supabase) {
      const imageDelete = await supabase.storage
        .from("avatars")
        .remove([`${user.id}.png`]);

      if (imageDelete.error) {
        notification.copyableError(imageDelete.error, "Failed to remove image");
      }

      submitAvatarUrl(null);
    }
  };

  const submitAvatarUrl = (path: string | null) => {
    const formData = new FormData();
    formData.append("intent", "photo");
    if (path) formData.append("path", path);
    submit(formData, {
      method: "post",
      action: "/x/account/profile",
    });
  };

  return (
    <VStack w="full" spacing={2} px={8}>
      <Avatar size="2xl" path={user?.avatarUrl} title={user?.fullName ?? ""} />
      <File accept="image/*" onChange={uploadImage}>
        {user.avatarUrl ? "Change" : "Upload"}
      </File>

      {user.avatarUrl && (
        <Button variant="outline" onClick={deleteImage}>
          Remove
        </Button>
      )}
    </VStack>
  );
};

export default ProfilePhotoForm;
