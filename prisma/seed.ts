import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { emptyDocument } from "../src/lib/tiptap";
import { markdownToTipTap } from "../src/lib/tiptap-render";

const prisma = new PrismaClient();

async function seedMdxPosts() {
  const blogDir = path.join(process.cwd(), "content/blog");
  if (!fs.existsSync(blogDir)) return;

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) continue;

    const raw = fs.readFileSync(path.join(blogDir, file), "utf8");
    const { data, content } = matter(raw);

    await prisma.blogPost.create({
      data: {
        title: data.title as string,
        slug,
        description: data.description as string,
        content: markdownToTipTap(content),
        tags: JSON.stringify((data.tags as string[]) ?? []),
        status: "published",
        author: (data.author as string) ?? "Iftekhar Ahmed Eather",
        publishedAt: new Date(data.date as string),
      },
    });
  }
}

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@eatherahmed.com";
  const password = process.env.ADMIN_PASSWORD ?? "change-me-on-first-login";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Iftekhar Ahmed Eather",
      passwordHash,
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      title:
        "Technical Lead · Senior System Engineer · System Architecture · Cloud (AWS & Alibaba Cloud)",
      tagline:
        "Engineering Manager · System Architecture · Cloud (AWS & Alibaba Cloud)",
      summary:
        "Technical Lead and Senior System Engineer with 16+ years delivering enterprise software, SaaS platforms, AI solutions, and government digital transformation projects across Japan and Bangladesh. Seven-plus years leading Agile/Scrum teams through full delivery lifecycles — architecture, cloud infrastructure, backend engineering, and stakeholder alignment. Certified Scrum Alliance professional (CSPO, CSM, A-CSD, CSD).",
      location: "Saitama, Japan",
      availabilityMessage:
        "Actively exploring Technical Lead, Engineering Manager, and Senior System Engineer roles.",
    },
    create: {
      id: 1,
      siteName: "Iftekhar Ahmed Eather",
      shortName: "Iftekhar Eather",
      title:
        "Technical Lead · Senior System Engineer · System Architecture · Cloud (AWS & Alibaba Cloud)",
      tagline:
        "Engineering Manager · System Architecture · Cloud (AWS & Alibaba Cloud)",
      summary:
        "Technical Lead and Senior System Engineer with 16+ years delivering enterprise software, SaaS platforms, AI solutions, and government digital transformation projects across Japan and Bangladesh. Seven-plus years leading Agile/Scrum teams through full delivery lifecycles — architecture, cloud infrastructure, backend engineering, and stakeholder alignment. Certified Scrum Alliance professional (CSPO, CSM, A-CSD, CSD).",
      location: "Saitama, Japan",
      email: "eather.ahmed@gmail.com",
      availabilityStatus: "open",
      availabilityLabel: "Open to opportunities",
      availabilityMessage:
        "Actively exploring Technical Lead, Engineering Manager, and Senior System Engineer roles.",
    },
  });

  const postCount = await prisma.blogPost.count();
  if (postCount === 0) {
    await seedMdxPosts();
  }

  if (postCount === 0 && (await prisma.blogPost.count()) === 0) {
    await prisma.blogPost.create({
      data: {
        title: "Welcome to My Engineering Blog",
        slug: "welcome-to-my-engineering-blog",
        description:
          "Thoughts on software engineering, team leadership, and building reliable systems.",
        content: emptyDocument(),
        tags: JSON.stringify(["Engineering"]),
        status: "draft",
        author: "Iftekhar Ahmed Eather",
      },
    });
  }

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
