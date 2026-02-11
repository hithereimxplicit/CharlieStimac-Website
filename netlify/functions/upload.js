import { createClient } from "@supabase/supabase-js";
import Busboy from "busboy";
import { nanoid } from "nanoid";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  const adminKey = event.headers["x-admin-key"];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) return { statusCode: 401, body: "Unauthorized" };

  const bb = Busboy({ headers: event.headers });

  let fileBuffer, filename = "file", mime = "application/octet-stream";
  const token = nanoid(32);

  const done = new Promise((resolve, reject) => {
    bb.on("file", (_name, file, info) => {
      filename = info.filename || filename;
      mime = info.mimeType || mime;
      const chunks = [];
      file.on("data", d => chunks.push(d));
      file.on("end", () => (fileBuffer = Buffer.concat(chunks)));
    });
    bb.on("finish", resolve);
    bb.on("error", reject);
  });

  bb.end(Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8"));
  await done;

  if (!fileBuffer) return { statusCode: 400, body: "No file uploaded" };

  const path = `${token}/${filename}`;

  const up = await supabase.storage.from("one-time").upload(path, fileBuffer, {
    contentType: mime,
    upsert: false,
  });
  if (up.error) return { statusCode: 500, body: up.error.message };

  const ins = await supabase.from("shares").insert({ token, path, filename, mime, used: false });
  if (ins.error) return { statusCode: 500, body: ins.error.message };

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url: `/share/${token}` }),
  };
};