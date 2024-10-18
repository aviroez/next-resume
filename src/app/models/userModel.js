import prisma from "../../../prisma/client";

const UserModel = {
    findAll() {
        return prisma.user.findMany()
    },
    findById(id) {
        return prisma.user.findUnique({
            where: {
                id:id
            }
        })
    },
    findByIdOrthrow(id) {
        return prisma.user.findUniqueOrThrow({
            where: {
                id: id
            }
        })
    },
    findByEmail(email) {
        return prisma.user.findFirst({
            where: {
                email: email
            }
        })
    },
    findByToken(token) {
        return prisma.user.findFirst({
            where: {
                token: token
            }
        })
    },
    create(data) {
        return prisma.user.create({data})

    },
    update(id, data) {
        return prisma.user.update({
            data,
            where: {
                id:id
            }
        })
    },
    patch(id, data) {
        return prisma.user.patch({
            data,
            where: {
                id:id
            }
        })
    },
    delete(id) {
        return prisma.user.delete({
            where: {
                id:id
            }
        })
    }
}

export default UserModel;
