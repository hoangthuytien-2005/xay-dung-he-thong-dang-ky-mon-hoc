import { seedDatabase } from "../lib/db-seed";

async function run() {
  console.log("🌱 [Seed Script] Đang kết nối và nạp dữ liệu mẫu vào MongoDB...");
  const result = await seedDatabase();
  console.log(result.message);
  process.exit(result.success ? 0 : 1);
}

run();
