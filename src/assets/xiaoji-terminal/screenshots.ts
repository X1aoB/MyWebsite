import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";

/** Full, uncropped screenshots supplied on 2026-09-09. Original PNGs stay public. */
export const xiaojiScreenshots = [
  {
    id: "face-to-face",
    src: "/images/xiaoji-terminal/face-to-face.png",
    alt: { zh: "小吉终端 0.10.0-rc.3：米娅在基地休息区的立绘、场景叙述与面对面对话", en: "Xiaoji Terminal 0.10.0-rc.3: a character in the base rest area, with artwork, scene narration, and face-to-face dialogue" },
    type: { zh: "面对面", en: "Face to face" },
    title: { zh: "见到她，也看见她的表情", en: "Meet her and see her expression" },
    description: { zh: "在角色所在的场景里说话、写下动作，或邀请她一起去别处。22 位角色的立绘与各 18 种基础表情已加入，部分角色还拥有特别表现。", en: "Speak, describe an action, or invite her somewhere else. Artwork and 18 basic expressions for each of the 22 characters are available, with additional special expressions for some characters." }
  },
  {
    id: "text-communication",
    src: "/images/xiaoji-terminal/text-communication.png",
    alt: { zh: "小吉终端 0.10.0-rc.3：与猫汐尔的文字通讯及表情消息，完整保留浏览器地址栏", en: "Xiaoji Terminal 0.10.0-rc.3: text and sticker messages with Mauxir, with the browser address bar preserved" },
    type: { zh: "文字通讯", en: "Messaging" },
    title: { zh: "从一句问候，聊进日常", en: "Turn a greeting into an everyday conversation" },
    description: { zh: "在通讯器里切换角色，用文字和表情接着上次的对话。想见面时，直接从聊天窗口走进她所在的地点。", en: "Switch characters in the messenger and pick up a conversation with text and stickers. When you want to meet, move from the chat window into her current location." }
  },
  {
    id: "feedback",
    src: "/images/xiaoji-terminal/feedback.png",
    alt: { zh: "小吉终端反馈窗口：可取消的对话上下文、内容预览、问题说明与可选 QQ", en: "Xiaoji Terminal feedback: optional conversation context, a preview, issue details, and an optional QQ contact" },
    type: { zh: "体验反馈", en: "Feedback" },
    title: { zh: "把问题说明白，也保留自己的选择", en: "Explain an issue and choose what to share" },
    description: { zh: "提交前可以预览或取消附带的一问一答与请求编号，再补充复现步骤。QQ 为可选项，加密保存并随反馈在 30 天后删除。", en: "Preview or remove the attached question, answer, and request ID before adding reproduction steps. QQ is optional, encrypted, and deleted with the feedback after 30 days." }
  },
  {
    id: "settings",
    src: "/images/xiaoji-terminal/settings.png",
    alt: { zh: "小吉终端体验设置：模型、记录与关于标签，模型服务商选择及 API Key 配置", en: "Xiaoji Terminal settings: model, history, and about tabs, provider selection, and API key configuration" },
    type: { zh: "体验设置", en: "Settings" },
    title: { zh: "用自己的模型，按习惯调整体验", en: "Use your own model and make the experience yours" },
    description: { zh: "集中管理模型、记录与相关说明。加密凭证只保留在当前标签页，最长有效 12 小时；获取模型列表或切换角色，无需重复输入 Key。", en: "Manage the model, history, and related information in one place. The encrypted credential stays in the current tab for up to 12 hours, without requiring key re-entry when listing models or switching characters." }
  },
  {
    id: "announcements",
    src: "/images/xiaoji-terminal/announcements.png",
    alt: { zh: "小吉终端公告与生日页面：9 月 9 日更名、全角色立绘表情及窄屏体验更新公告", en: "Xiaoji Terminal announcements and birthdays: the September 9 rename, character artwork and expressions, and narrow-screen improvements" },
    type: { zh: "公告与生日", en: "Announcements & birthdays" },
    title: { zh: "更新和她的生日，都有地方可看", en: "Keep up with updates and character birthdays" },
    description: { zh: "右上角消息入口集中展示更新公告与角色生日。9 月 9 日更新带来了小吉终端新名称、全角色舞台、窄屏输入与切换改善，以及设置中的减少动效选项。", en: "The message entry brings together release announcements and character birthdays. The September 9 update introduces the Xiaoji Terminal name, artwork for every character, smoother narrow-screen input and switching, and reduced-motion settings." }
  }
] as const;

const sources = import.meta.glob<{ default: ImageMetadata }>(
  "/public/images/xiaoji-terminal/*.png",
  { eager: true }
);

export interface XiaojiScreenshotImage {
  src: string;
  srcset: string;
  width: number;
  height: number;
  original: string;
}

const previews = new Map<string, Promise<XiaojiScreenshotImage>>();

/** Build-only helper shared by the home preview and project showcase. */
export const getXiaojiScreenshot = (publicPath: string): Promise<XiaojiScreenshotImage> => {
  const cached = previews.get(publicPath);
  if (cached) return cached;

  const pending = (async () => {
    const source = sources[`/public${publicPath}`]?.default;
    if (!source) throw new Error(`Xiaoji Terminal screenshot not found: ${publicPath}`);
    const image = await getImage({ src: source, widths: [480, 960, 1440], format: "webp", quality: 86 });
    const metadata = image.options.src as ImageMetadata;
    const fallback = image.srcSet.values.find((candidate) => candidate.descriptor === "960w") ?? image.srcSet.values.at(-1);
    return { src: fallback?.url ?? image.src, srcset: image.srcSet.attribute, width: metadata.width, height: metadata.height, original: publicPath };
  })();
  previews.set(publicPath, pending);
  return pending;
};
