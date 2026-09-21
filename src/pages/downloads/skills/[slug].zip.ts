import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { zipSync, strToU8 } from "fflate";
import { personalSkills } from "../../../config/personal-skills";

const skillRoot = resolve(process.cwd(), "skills");

export function getStaticPaths() {
  return personalSkills.map((skill) => ({ params: { slug: skill.slug }, props: { skill } }));
}

export async function GET({ props }: { props: { skill: (typeof personalSkills)[number] } }) {
  const { skill } = props;
  const content = await readFile(resolve(skillRoot, skill.slug, "SKILL.md"), "utf8");
  const archive = zipSync({ [`${skill.slug}/SKILL.md`]: strToU8(content) }, { level: 6 });
  return new Response(archive, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${skill.slug}.zip"`,
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
