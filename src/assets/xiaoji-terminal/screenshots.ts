import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";

type Copy = { zh: string; en: string };

interface XiaojiShotRecord {
  /** File name under src/assets/xiaoji-terminal/shots/. */
  file: string;
  device: "desktop" | "phone";
  alt: Copy;
}

/**
 * Uncropped real-device frames from the 1.0.0 promo recordings (2026-10-21 to
 * 10-23): the live site, real model replies, 2560x1440 desktop / 780x1688 phone.
 */
export const xiaojiShots = {
  "bubu-night": {
    file: "bubu-night.jpg",
    device: "desktop",
    alt: {
      zh: "夜晚的基地走廊：卜卜在面对面舞台上，对白框显示第 1/2 页，下方是自动、跳过、回看等快捷菜单和输入栏",
      en: "The base corridor at night: a character on the face-to-face stage, dialogue page 1 of 2, with the quick menu and input bar below"
    }
  },
  "enya-messenger": {
    file: "enya-messenger.jpg",
    device: "desktop",
    alt: {
      zh: "清晨的文字通讯：恩雅回复「早安~分析员，当然可以，先收下这个吧！」并发来一张表情包，左侧是联系人列表",
      en: "Morning messaging: a character replies with a greeting and a sticker, with the contact list on the left"
    }
  },
  "chenxing-morning": {
    file: "chenxing-morning.jpg",
    device: "desktop",
    alt: {
      zh: "清晨的 B-04 基地休息区：辰星恢复初见时的语气，说出原作台词「分析员，我对你个人并没有任何偏见……」",
      en: "The B-04 rest area at dawn: a character returns to the tone of their first meeting and quotes a line from the game"
    }
  },
  "yao-park-day": {
    file: "yao-park-day.jpg",
    device: "desktop",
    alt: {
      zh: "白天的公园：白雪转场之后，肴说「当然好呀，郎君。走吧，一起去公园散散步。」",
      en: "The park by day: after the snow transition, a character agrees to take a walk in the park together"
    }
  },
  "lifu-dusk": {
    file: "lifu-dusk.jpg",
    device: "desktop",
    alt: {
      zh: "黄昏的暮色通讯器：顶部是「约定提醒 · 观景区」提醒卡，下方是里芙到点主动发来的消息「亲爱的，今天在观景区的约定我还记得」",
      en: "The messenger in dusk tones: a reminder card for a plan at the viewing deck, followed by a message the character sent on time"
    }
  },
  "kaixiya-onsen": {
    file: "kaixiya-onsen.jpg",
    device: "desktop",
    alt: {
      zh: "夜晚的基地温泉：极光与飘雪下的凯茜娅，对白「好啊，亲爱的。一起去基地温泉吧，正好把身子暖起来。」",
      en: "The base hot spring at night: a character under the aurora and falling snow agrees to warm up at the hot spring"
    }
  },
  "base-map": {
    file: "base-map.jpg",
    device: "desktop",
    alt: {
      zh: "基地地图：平面图上标出 22 位角色此刻所在的房间，右侧名单选中观景区的里芙，底部是「去见她」按钮",
      en: "The base map: a floor plan showing which room each of the 22 characters is in, a selected character in the list, and a Meet her button"
    }
  },
  "memory-archive": {
    file: "memory-archive.jpg",
    device: "desktop",
    alt: {
      zh: "记忆档案「里芙记得的事」：可按全部、一起经历、她答应的筛选，每条记忆都能单独删除",
      en: "The memory archive: what a character remembers, filterable by shared experiences and promises, with a delete button on each entry"
    }
  },
  "reminder-setup": {
    file: "reminder-setup.jpg",
    device: "desktop",
    alt: {
      zh: "发出邀约时设置到点提醒：可选不提醒、30 分钟后、1 小时后或指定时间，并预览邀请内容",
      en: "Setting a reminder while inviting her: no reminder, in 30 minutes, in an hour, or at a set time, with a preview of the invitation"
    }
  },
  "phone-lock": {
    file: "phone-lock.jpg",
    device: "phone",
    alt: {
      zh: "手机锁屏：17:23，10 月 23 日星期五，一条「约定提醒 · 观景区」通知",
      en: "Phone lock screen at 17:23 with a reminder notification for a plan at the viewing deck"
    }
  },
  "phone-messenger": {
    file: "phone-messenger.jpg",
    device: "phone",
    alt: {
      zh: "手机上的通讯器：约定提醒卡和里芙主动发来的消息，可以直接去见她或 10 分钟后再提醒",
      en: "The messenger on a phone: a reminder card and a message from the character, with Meet her and Remind me in 10 minutes"
    }
  },
  "phone-face": {
    file: "phone-face.jpg",
    device: "phone",
    alt: {
      zh: "手机上的面对面：黄昏的观景区，里芙说「嗯，亲爱的。晚霞确实很美……能和你一起看，我很高兴。」",
      en: "Face to face on a phone: the viewing deck at dusk, where the character says she is glad to watch the sunset together"
    }
  },
  "phone-map": {
    file: "phone-map.jpg",
    device: "phone",
    alt: {
      zh: "手机上的基地地图：平面图可以左右拖动，角色名单在下方",
      en: "The base map on a phone: the floor plan scrolls sideways and the character list sits below it"
    }
  }
} as const satisfies Record<string, XiaojiShotRecord>;

export type XiaojiShotId = keyof typeof xiaojiShots;

const sources = import.meta.glob<{ default: ImageMetadata }>("/src/assets/xiaoji-terminal/shots/*.jpg", { eager: true });

export interface XiaojiShotImage {
  id: XiaojiShotId;
  device: "desktop" | "phone";
  alt: Copy;
  src: string;
  srcset: string;
  /** Largest generated rendition, opened by the lightbox. */
  full: string;
  width: number;
  height: number;
}

const widths = { desktop: [640, 960, 1280, 1920, 2560], phone: [390, 780] } as const;
const processed = new Map<XiaojiShotId, Promise<XiaojiShotImage>>();

/** Build-only helper shared by the home preview and the project page. */
export const getXiaojiShot = (id: XiaojiShotId): Promise<XiaojiShotImage> => {
  const cached = processed.get(id);
  if (cached) return cached;

  const pending = (async () => {
    const record: XiaojiShotRecord = xiaojiShots[id];
    const source = sources[`/src/assets/xiaoji-terminal/shots/${record.file}`]?.default;
    if (!source) throw new Error(`Xiaoji Terminal screenshot not found: ${record.file}`);
    const image = await getImage({ src: source, widths: [...widths[record.device]], format: "webp", quality: 82 });
    const candidates = image.srcSet.values;
    const fallback = candidates.find((candidate) => candidate.descriptor === (record.device === "phone" ? "390w" : "960w")) ?? candidates[0];
    return {
      id,
      device: record.device,
      alt: record.alt,
      src: fallback?.url ?? image.src,
      srcset: image.srcSet.attribute,
      full: candidates.at(-1)?.url ?? image.src,
      width: source.width,
      height: source.height
    };
  })();
  processed.set(id, pending);
  return pending;
};
