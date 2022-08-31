import { User } from '@definitions/userTypes';
import { Avatar } from '@mui/material';

interface Props {
    user: User;
}

const AVATAR_SIZE = 64;

export default function UserAvatar({ user }: Props) {
    return <Avatar src={user.avatarUrl} sx={{ width: AVATAR_SIZE, height: AVATAR_SIZE }} />;
}
