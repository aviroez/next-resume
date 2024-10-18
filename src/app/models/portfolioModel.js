import prisma from "../../../prisma/client";

const PortfolioModel = {
    findAll() {
        return prisma.portfolio.findMany()
    },
    findById(id) {
        return prisma.portfolio.findFirst({
            where: {
                id: id
            }
        })
    },
    findByIdOrthrow(id) {
        return prisma.portfolio.findUniqueOrThrow({
            where: {
                id: id
            }
        })
    },
    create(data) {
        return prisma.portfolio.create({data})

    },
    update(id, data) {
        return prisma.portfolio.update({
            data,
            where: {
                id:id
            }
        })
    },
    patch(id, data) {
        return prisma.portfolio.patch({
            data,
            where: {
                id:id
            }
        })
    },
    delete(id) {
        return prisma.portfolio.delete({
            where: {
                id:id
            }
        })
    }
}

export default PortfolioModel;
