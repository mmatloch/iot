export const isSomeEnum =
    <TEnum extends object>(enumType: TEnum) =>
    (token: unknown): token is TEnum[keyof TEnum] =>
        Object.values(enumType).includes(token as TEnum[keyof TEnum]);
