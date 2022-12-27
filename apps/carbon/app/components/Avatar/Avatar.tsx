import { Avatar as ChakraAvatar, forwardRef } from "@chakra-ui/react";
import { SUPABASE_API_URL } from "~/config/env";
import type { AvatarProps as ChakraAvatarProps } from "@chakra-ui/react";

type AvatarProps = ChakraAvatarProps & {
  path: string | null;
  bucket?: string;
};

export const Avatar = forwardRef(
  ({ path, bucket = "avatars", ...props }: AvatarProps, ref) => {
    const imagePath = path
      ? `${SUPABASE_API_URL}/storage/v1/object/public/${bucket}/${path}`
      : undefined;

    return <ChakraAvatar ref={ref} src={imagePath} {...props} />;
  }
);
