const {PrismaClient} = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
async function seedDeliveredProjects(projects) {
    for ( const project of projects ){
        await prisma.project.upsert({
            where: {id :project.id},
            update : {},
            create : {
         id : project.id ,
                title : project.title,
                description: project.description,
         longDescription: project.longDescription,
        location: project.location,
        scope: project.scope,
        bhk: project.bhk,
        pricing: project.pricing,
        budget: project.budget,
        area: project.area,
        style: project.style,
        status: project.status
            }
        });

        if ( project.images && project.images.length){
            for ( let i = 0 ; i < project.images.length ; i++){
const imageId = `${project.id}-img-${i}`;
                await prisma.projectImage.upsert({
                    where: { id: imageId },
          update: { url: project.images[i], order: i },
          create: {
            id: imageId,
            url: project.images[i],
            order: i,
            projectId: project.id
          }
                })
            }
        }
    }
      console.log('✅ Delivered projects seeded successfully!');

}

async function main() {
  const filePath = path.join(__dirname, 'data', 'deliveredProjects.json');
  const projects = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
  await seedDeliveredProjects(projects)

}
main().catch((e) => {
    console.error("Error during seeding" . e);
    process.exit(1)
}).finally(async() => {
    await prisma.$disconnect()
})