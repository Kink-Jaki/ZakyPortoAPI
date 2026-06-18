import 'dotenv/config';
import { db } from '../db/client.js';
import { projects } from '../db/schema/projects.js';
import { skills } from '../db/schema/skills.js';
import { experiences } from '../db/schema/experiences.js';
const SEED_PROJECTS = [
    {
        title: 'URL Shortener API',
        description: 'Layanan pemendek URL yang sangat cepat dan efisien, dilengkapi dengan fitur analitik klik dasar.',
        stack: 'Hono.js, TypeScript, PostgreSQL',
        githubUrl: 'https://github.com/example/url-shortener-api',
        demoUrl: 'https://example.com/url-shortener',
        imageUrl: null,
    },
    {
        title: 'Portfolio CMS',
        description: 'Sistem manajemen konten headless (API-first) untuk mengelola data portofolio secara dinamis dan aman.',
        stack: 'Node.js, Hono.js, PostgreSQL',
        githubUrl: 'https://github.com/example/portfolio-cms',
        demoUrl: 'https://example.com/portfolio',
        imageUrl: null,
    },
    {
        title: 'Authentication Service',
        description: 'Microservice autentikasi terpusat yang aman, diimplementasikan menggunakan standar token JWT.',
        stack: 'TypeScript, JWT, PostgreSQL',
        githubUrl: 'https://github.com/example/auth-service',
        demoUrl: null,
        imageUrl: null,
    },
    {
        title: 'Inventory Management System',
        description: 'Sistem informasi manajemen stok barang komprehensif untuk pencatatan transaksi dan pelaporan.',
        stack: 'Laravel, MySQL',
        githubUrl: 'https://github.com/example/inventory-mgmt',
        demoUrl: 'https://example.com/inventory',
        imageUrl: null,
    },
    {
        title: 'Mobile Task Manager',
        description: 'Aplikasi mobile produktivitas luring (offline-first) untuk mengelola tugas harian pengguna.',
        stack: 'Flutter, SQLite',
        githubUrl: 'https://github.com/example/mobile-task-manager',
        demoUrl: null,
        imageUrl: null,
    },
    {
        title: 'WhatsApp Notification Service',
        description: 'Layanan API gateway webhook untuk memicu dan mengirimkan notifikasi WhatsApp secara otomatis.',
        stack: 'Node.js, Postman API, PostgreSQL',
        githubUrl: 'https://github.com/example/wa-notification-service',
        demoUrl: null,
        imageUrl: null,
    },
];
const SEED_SKILLS = [
    { name: 'Node.js', category: 'Backend Development' },
    { name: 'TypeScript', category: 'Backend Development' },
    { name: 'JavaScript', category: 'Backend Development' },
    { name: 'Hono.js', category: 'Backend Development' },
    { name: 'Laravel', category: 'Backend Development' },
    { name: 'Python', category: 'Backend Development' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'MySQL', category: 'Database' },
    { name: 'SQLite', category: 'Database' },
    { name: 'HTML', category: 'Frontend Development' },
    { name: 'CSS', category: 'Frontend Development' },
    { name: 'Tailwind CSS', category: 'Frontend Development' },
    { name: 'Bootstrap', category: 'Frontend Development' },
    { name: 'Flutter', category: 'Mobile Development' },
    { name: 'Git', category: 'Tools & Workflow' },
    { name: 'GitHub', category: 'Tools & Workflow' },
    { name: 'Postman', category: 'Tools & Workflow' },
    { name: 'Unity', category: 'Game Development' },
    { name: 'Construct 3', category: 'Game Development' },
    { name: 'C#', category: 'Game Development' },
];
const SEED_EXPERIENCES = [
    {
        title: 'Vocational Internship',
        organization: 'Arre Technology',
        description: 'Magang kejuruan dengan fokus pada pengembangan aplikasi web dan arsitektur API modern menggunakan ekosistem berbasis TypeScript.',
        startDate: new Date('2026-01-01'),
        endDate: null,
    },
    {
        title: 'Rekayasa Perangkat Lunak',
        organization: 'SMKS PGRI Wlingi',
        description: 'Pendidikan kejuruan (SMK) yang berfokus pada fundamental pemrograman, pengembangan web, dan rekayasa perangkat lunak.',
        startDate: new Date('2024-01-01'),
        endDate: null,
    },
];
async function main() {
    // Reset untuk dev/PKL: agar selalu terlihat dummy data.
    await db.delete(projects);
    await db.delete(skills);
    await db.delete(experiences);
    await db.insert(projects).values(SEED_PROJECTS);
    await db.insert(skills).values(SEED_SKILLS);
    // experiences.skills is stored as jsonb array in DB schema, so also include `type` field.
    await db.insert(experiences).values(SEED_EXPERIENCES.map((e) => ({
        ...e,
        type: "work",
        skills: [],
    })));
    console.log('✅ Dummy data seeded: projects/skills/experiences');
}
main()
    .then(() => process.exit(0))
    .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
