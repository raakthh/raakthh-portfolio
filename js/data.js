/* Centralized content for raakthh portfolio.
   Edit this file to update the website. Do not add unverified claims or fake links. */
window.PORTFOLIO = {
  brand: "raakthh",
  tagline: "Building with data. Thinking beyond it.",
  intro:
    "I'm Araa, a Data Science student exploring analytics, machine learning, data engineering, and practical software solutions.",
  about: [
    "I'm a Data Science student who enjoys turning raw data into something people can actually use, from analytics and machine learning experiments to data pipelines and small software tools.",
    "Alongside my studies, I run an online store and take part in organizational media work, which keeps me close to real operational data and real audiences.",
  ],
  profileImage: "assets/images/profile/profile.jpg",
  cv: { path: "assets/documents/cv.pdf" },

  categories: [
    "All",
    "Data Science",
    "Data Analytics",
    "Data Engineering",
    "AI",
    "Web Development",
  ],

  projects: [
    {
      id: "savera",
      title: "SAVERA",
      subtitle: "Smart Automotive Vehicle Evaluation and Repair Assessment",
      summary:
        "A vehicle damage assessment concept for automotive workshops, including repair cost estimation, inventory/PPIC, and operational analytics.",
      details: [
        "Concept for automotive workshops focused on assessing vehicle damage.",
        "Covers repair cost estimation.",
        "Includes inventory/PPIC and operational analytics.",
      ],
      categories: ["Web Development", "Data Analytics"],
      tags: [
        "Damage assessment",
        "Cost estimation",
        "Inventory/PPIC",
        "Operational analytics",
      ],
      image: "assets/images/projects/savera.jpeg",
      links: [
        { label: "Repository", url: "https://github.com/raakthh/SAVERA" },
      ],
    },
    {
      id: "nova-ai",
      title: "NOVA AI",
      subtitle: "Chatbot powered by Groq",
      summary: "A chatbot powered by Groq.",
      details: ["A chatbot project built on the Groq platform."],
      categories: ["AI"],
      tags: ["Chatbot", "Groq"],
      image: "assets/images/projects/nova-ai.jpeg",
      links: [
        { label: "Repository", url: "https://github.com/raakthh/NOVA-AI" },
      ],
    },
    {
      id: "apriorirec",
      title: "AprioriRec",
      subtitle: "Recommendation system with Apriori association rules",
      summary: "A recommendation system using Apriori association rules.",
      details: [
        "Recommendation system built on Apriori association rule mining.",
        "A live demo is available online.",
      ],
      categories: ["Data Science"],
      tags: ["Apriori", "Association rules", "Recommendation system"],
      image: "assets/images/projects/apriorirec.jpeg",
      links: [
        {
          label: "Repository",
          url: "https://github.com/raakthh/sistem-rekomendasi-apriori",
        },
        { label: "Live demo", url: "https://apriorirec.onrender.com/" },
      ],
    },
    {
      id: "smartsales",
      title: "SmartSales",
      subtitle: "Sales analytics and business intelligence",
      summary:
        "A sales analytics and business intelligence project involving dashboards, data visualization, and geospatial visualization.",
      details: [
        "Sales analytics and business intelligence work.",
        "Involves dashboards, data visualization, and geospatial visualization.",
        "Repository and demo links are not available yet.",
      ],
      categories: ["Data Analytics"],
      tags: ["Dashboards", "Data visualization", "Geospatial visualization"],
      image: "assets/images/projects/SmartSales.jpg",
      links: [],
    },
  ],

  experience: [
    {
      role: "Owner",
      org: "Firzzy Store",
      description:
        "Managed online store operations, pre-orders, orders, product and inventory data, and transaction records, using Supabase as an operational database.",
    },
    {
      role: "Head of Media & Information Division",
      org: "Dirgantara",
      description:
        "Handled organizational media and information responsibilities.",
    },
    {
      role: "Social Media Specialist",
      org: "Program Studi Sains Data Terapan",
      description:
        "Planned Instagram content using audience insights and engagement data, organized content timelines, and coordinated with the team and lecturers.",
    },
  ],

  skills: [
    {
      group: "Data Science & Machine Learning",
      items: [
        "Python",
        "Data preprocessing",
        "EDA",
        "Machine learning fundamentals",
        "Association rule mining",
        "Model evaluation",
      ],
    },
    {
      group: "Data Analytics & BI",
      items: [
        "SQL",
        "Excel",
        "Power BI",
        "Tableau",
        "Google Looker Studio",
        "Grafana",
        "Dashboards",
        "Data visualization",
        "Analytical reporting",
      ],
    },
    {
      group: "Data Engineering & Processing",
      items: [
        "SQL",
        "Data transformation",
        "Data processing workflows",
        "Database fundamentals",
        "ETL/ELT concepts",
        "Analytics engineering fundamentals",
      ],
    },
    {
      group: "Programming & Web Development",
      items: ["HTML", "CSS", "JavaScript", "Git", "GitHub", "Supabase"],
    },
  ],

  contacts: [
    {
      id: "email",
      label: "Email",
      value: "faradhyasalmaxyz@gmail.com",
      url: "mailto:faradhyasalmaxyz@gmail.com",
      external: false,
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      value: "Message me on WhatsApp",
      url: "https://wa.me/qr/75JLHH2H6CY6A1",
      external: true,
    },
    {
      id: "github",
      label: "GitHub",
      value: "github.com/raakthh",
      url: "https://github.com/raakthh/",
      external: true,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      value: "linkedin.com/in/raakthh",
      url: "https://www.linkedin.com/in/raakthh/",
      external: true,
    },
  ],
};
