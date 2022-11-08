import { Validator, createValidator } from '@common/validator';
import { Type } from '@sinclair/typebox';
import JWT from 'jsonwebtoken';

export interface UserInfo {
    email: string;
    firstName: string;
    lastName: string;
    name: string;
    avatarUrl: string;
}

const googleUserInfoSchema = Type.Object({
    email: Type.String(),
    given_name: Type.String(),
    family_name: Type.String(),
    picture: Type.String(),
    name: Type.String(),
});

export const getUserInfoFromGoogleJWT = (token: string): UserInfo => {
    const decodedToken = JWT.decode(token);

    const validator: Validator = createValidator();
    validator.validateOrThrow(googleUserInfoSchema, decodedToken);

    return {
        email: decodedToken.email,
        firstName: decodedToken.given_name,
        lastName: decodedToken.family_name,
        name: decodedToken.name,
        avatarUrl: decodedToken.picture,
    };
};
