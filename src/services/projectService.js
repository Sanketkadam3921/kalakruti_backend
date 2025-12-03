const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class ProjectService {
    async getDelivered() {
        const projects = await prisma.project.findMany({
            where: { status: 'COMPLETED' },
            orderBy: { createdAt: 'desc' },
            include: {
                images: {
                    orderBy: { order: 'asc' },
                    take: 1
                }
            }
        });

        return projects.map(p => ({
            id: p.id,
            title: p.title,
            location: p.location,
            scope: p.scope,
            bhk: p.bhk,
            pricing: p.pricing,
            image: p.images[0]?.url || null,
            status: 'COMPLETED',
            type: 'delivered'
        }));
    }

    async getDeliveredById(id) {
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                images: { orderBy: { order: 'asc' } }
            }
        });

        if (!project || project.status !== 'COMPLETED') {
            return null;
        }

        return {
            id: project.id,
            title: project.title,
            description: project.description || '',
            location: project.location,
            budget: project.budget || '',
            area: project.area || '',
            style: project.style || '',
            scope: project.scope,
            bhk: project.bhk,
            pricing: project.pricing,
            images: project.images.map(img => img.url),
            longDescription: project.longDescription || ''
        };
    }
}

module.exports = new ProjectService();









