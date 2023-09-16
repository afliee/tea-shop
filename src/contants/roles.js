export const roles = {
    ADMIN: [
        'create:any',
        'read:any',
        'update:any',
        'delete:any'
    ],
    CUSTOMER_SCARE: [ // extend from admin but can't delete user
        'create:any',
        'read:any',
        'update:any',
        'delete:own'
    ],
    POST_MANAGER: [ // extend from admin but can't delete user and can't update user role
        'create:any',
        'read:any',
        'update:own',
        'delete:own'
    ],
    USER: [
        'read:own',
        'update:own',
        'delete:own'
    ]
}
