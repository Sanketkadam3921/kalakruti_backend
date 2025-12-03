const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class DesignService {
  getAllCategories() {
    return [
      {
        id: "kitchen",
        title: "Modular Kitchen Designs",
        description:
          "Functional and beautiful kitchens with smart storage solutions",
        image:
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500",
        count: 15,
      },
      {
        id: "wardrobe",
        title: "Wardrobe Designs",
        description: "Customized wardrobes with optimal storage and style",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        count: 12,
      },
      {
        id: "bathroom",
        title: "Bathroom Designs",
        description:
          "Luxurious and practical bathroom designs for daily comfort",
        image:
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500",
        count: 10,
      },
      {
        id: "master-bedroom",
        title: "Master Bedroom Designs",
        description: "Elegant master bedroom designs for peaceful rest",
        image:
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500",
        count: 18,
      },
      { id: 'living-room', title: 'Living Room Designs', description: 'Inviting living spaces for relaxation and entertainment', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500', count: 24 },
      { id: 'pooja-room', title: 'Pooja Room Designs', description: 'Sacred spaces designed with tradition and elegance', image: 'https://images.unsplash.com/photo-1604328727240-3e2d3f9e2e2f?w=500', count: 8 },
      { id: 'tv-unit', title: 'TV Unit Designs', description: 'Stylish TV units that enhance your entertainment area', image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500', count: 14 },
      { id: 'false-ceiling', title: 'False Ceiling Designs', description: 'Modern ceiling designs that add dimension and style', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500', count: 16 },
      { id: 'kids-bedroom', title: 'Kids Bedroom Designs', description: 'Fun and functional spaces for children to grow and play', image: 'https://images.unsplash.com/photo-1586105449897-20b5efeb3c35?w=500', count: 11 },
      { id: 'dining-room', title: 'Dining Room Designs', description: 'Elegant dining spaces for memorable meals and gatherings', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500', count: 10 },
      { id: 'foyer', title: 'Foyer Designs', description: 'Make a stunning first impression with elegant foyer designs', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=500', count: 7 },
      { id: 'homes-livspace', title: 'Homes by KalaKruti Studio', description: 'Complete home interior solutions from Livspace', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=500', count: 20 },
      { id: 'home-office', title: 'Home Office Designs', description: 'Productive workspaces designed for focus and creativity', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500', count: 13 },
      { id: 'wallpaper', title: 'Home Wallpaper Designs', description: 'Stunning wallpaper designs to transform your walls', image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=500', count: 16 },
      { id: 'tile', title: 'Tile Designs', description: 'Beautiful tile patterns for floors and walls', image: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=500', count: 14 },
      { id: 'study-room', title: 'Study Room Designs', description: 'Focused study spaces for learning and concentration', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500', count: 9 },
      { id: 'space-saving', title: 'Space Saving Designs', description: 'Smart solutions to maximize your living space', image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=500', count: 17 },
      { id: 'door', title: 'Door Designs', description: 'Stylish door designs for every room in your home', image: 'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=500', count: 11 },
      { id: 'crockery-unit', title: 'Crockery Unit Designs', description: 'Display and storage solutions for your dinnerware', image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=500', count: 8 }
    ];
  }

  async getDesignsByCategory(categoryId) {
    const designs = await prisma.design.findMany({
      where: { categoryId },
      select: {
        slug: true,
        title: true,
        style: true,
        price: true,
        image: true,
        description: true,
      },
    });
    return designs;
  }

  async getDesignDetails(slug) {
    const design = await prisma.design.findUnique({ where: { slug } });
    return design;
  }
}

module.exports = new DesignService();
