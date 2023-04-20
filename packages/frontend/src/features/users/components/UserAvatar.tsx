import type { User } from '@definitions/entities/userTypes';
import { Avatar } from '@mui/material';

interface Props {
    user?: User;
    size?: number;
}

const DEFAULT_AVATAR_SIZE = 64;

export default function UserAvatar({ user, size }: Props) {
    const avatarSize = size || DEFAULT_AVATAR_SIZE;
    return <Avatar src={user?.avatarUrl} sx={{ width: avatarSize, height: avatarSize }} />;
}
