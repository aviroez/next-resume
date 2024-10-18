import prisma from "../../../prisma/client";

const UploadModel = {
    findAll(params) {
        if (params !== undefined) {
            return prisma.upload.findMany({
                where: params
            })
        } else {
            return prisma.upload.findMany()
        }
    },
    findById(id) {
        return prisma.upload.findUnique({where:{id:id}})
    },
    findByIdOrthrow(id) {
        return prisma.upload.findUniqueOrThrow({where:{id:id}})
    },
    create(data) {
        return prisma.upload.create({data})
    },
    update(id, data) {
        return prisma.upload.update({
            data,
            where: {
                id:id
            }
        })
    },
    patch(id, data) {
        return prisma.upload.patch({
            data,
            where: {
                id:id
            }
        })
    },
    delete(id) {
        return prisma.upload.delete({
            where: {
                id:id
            }
        })

    }
}

export default UploadModel;
