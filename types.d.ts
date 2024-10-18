type User = {
    id: number,
    name: string,
    email: string,
    password: string,
    token: string,
    role: string,
    createdAt: string,
    updatedAt: string,
}

type Portfolio = {
    id: number,
    company: string,
    title: string,
    tag: string,
    description: string,
    dateFrom: string,
    dateTo: string,
    createdAt: string,
    updatedAt: string,
}

type Upload = {
    id: number,
    portfolioId: number,
    name: string,
    type: string,
    slug: string,
    directory: string,
    createdAt: string,
    updatedAt: string,
}
