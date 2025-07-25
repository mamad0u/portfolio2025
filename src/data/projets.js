export const projetsData = [
  { 
    slug: "blurry", 
    name: "BLURRY", 
    adjetive: ["CREATIVE", "HOME-MADE", "INDEPENDENT"],
    descriptiontech: "NEXTJS, SHOPIFY,STOREFRONT API, GRAPHQL, GSAP", 
    fullDescription: "Blurry est une marque de vetement streetwear bordelaise cree par un indeendant. Il a besoin d'un site web pour presenter sa marque et ses produits. Il a besoin d'un site web pour presenter.",
    technologies: ["Next.js", "React", "GSAP", "CSS Modules"],
    client: "BLURRY",
    service: "DEVELOPPEMENT WEB",
    imagecard: "/images/blurry/blurry1.webp",
    images: ["/images/blurry/blurry2.webp","/images/blurry/blurry3.webp","/images/blurry/blurry4.webp"],
    github: "https://github.com/votre-username/portfolio",
    live: "https://votre-portfolio.com"
    
  },
  { 
    slug: "e-commerce", 
    name: "E-COMMERCE", 
    description: "UN SITE DE VENTE EN LIGNE",
    fullDescription: "Une plateforme e-commerce complète avec gestion des produits, panier d'achat, système de paiement sécurisé et interface d'administration.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "Express"],
    image: "/images/ecommerce.jpg",
    imagecard: "/images/ecommerce.jpg",
    github: "https://github.com/votre-username/ecommerce",
    live: "https://votre-ecommerce.com"
  },
  { 
    slug: "blog", 
    name: "BLOG", 
    description: "UN BLOG PERSONNEL",
    fullDescription: "Un blog moderne avec système de gestion de contenu, commentaires, recherche avancée et design responsive optimisé pour la lecture.",
    technologies: ["Next.js", "Sanity CMS", "Tailwind CSS", "Vercel"],
    image: "/images/blog.jpg",
    imagecard: "/images/blog.jpg",
    github: "https://github.com/votre-username/blog",
    live: "https://votre-blog.com"
  },
  { 
    slug: "app-mobile", 
    name: "APP MOBILE", 
    description: "UNE APPLICATION MOBILE",
    fullDescription: "Une application mobile cross-platform développée avec React Native, offrant une expérience utilisateur native sur iOS et Android.",
    technologies: ["React Native", "Expo", "Firebase", "Redux"],
    image: "/images/app-mobile.jpg",
    imagecard: "/images/app-mobile.jpg",
    github: "https://github.com/votre-username/app-mobile",
    live: "https://expo.dev/votre-app"
  },
  { 
    slug: "nouveau-projet", 
    name: "NOUVEAU PROJET", 
    description: "UN NOUVEAU PROJET",
    fullDescription: "UN NOUVEAU PROJET AVEC TOUTES LES INFORMATIONS IMPORTANTES.",
    technologies: ["React", "Node.js", "MongoDB"],
    image: "/images/nouveau-projet.jpg",
    imagecard: "/images/nouveau-projet.jpg",
    github: "https://github.com/votre-username/nouveau-projet",
    live: "https://votre-nouveau-projet.com"
  }
];

// Fonction utilitaire pour récupérer un projet par slug
export const getProjetBySlug = (slug) => {
  return projetsData.find(projet => projet.slug === slug);
};

// Fonction utilitaire pour récupérer tous les projets
export const getAllProjets = () => {
  return projetsData;
}; 