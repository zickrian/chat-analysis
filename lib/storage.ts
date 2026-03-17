import { AnalysisResult } from "@/lib/types";
import fs from "fs";
import path from "path";
import os from "os";

type Entry = {
  id: string;
  createdAt: number;
  data: AnalysisResult;
};

const TTL = 1000 * 60 * 30; // 30 mins
const REPORTS_DIR = path.join(os.tmpdir(), "chat_wrapped_reports");

function ensureDir() {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }
}

function cleanExpired() {
  ensureDir();
  const now = Date.now();
  const files = fs.readdirSync(REPORTS_DIR);

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const filePath = path.join(REPORTS_DIR, file);
    try {
      const stats = fs.statSync(filePath);
      if (now - stats.mtimeMs > TTL) {
        fs.unlinkSync(filePath);
      }
    } catch {
      // Ignore errors
    }
  }
}

export function saveAnalysis(data: AnalysisResult) {
  cleanExpired();
  const id = crypto.randomUUID();
  const filePath = path.join(REPORTS_DIR, `${id}.json`);
  
  const entry: Entry = {
    id,
    createdAt: Date.now(),
    data,
  };

  fs.writeFileSync(filePath, JSON.stringify(entry), "utf-8");
  return id;
}

export function getAnalysis(id: string) {
  cleanExpired();
  const filePath = path.join(REPORTS_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const entry = JSON.parse(raw) as Entry;
    return entry.data;
  } catch {
    return null;
  }
}