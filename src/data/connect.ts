export interface ConnectLink {
  id: string;
  label: string;
  href: string | null;
  external: boolean;
}

export const CONNECT_LINKS: ConnectLink[] = [
  { id: "linkedin",   label: "LinkedIn",   href: "https://www.linkedin.com/in/haydenjbaxter/", external: true },
  { id: "worldpulse", label: "WorldPulse", href: "https://worldxpulse.com",                    external: true },
  { id: "email",      label: "Email",      href: "mailto:haydenjbaxter@gmail.com",              external: false },
  { id: "whatsapp",   label: "WhatsApp",   href: "https://wa.me/14355123025",                   external: true },
  { id: "wechat",     label: "WeChat",     href: null,                                          external: false },
];

export const WECHAT_ID = "haydenjbaxter";

export const CALENDLY_URL = "https://calendly.com/haydenjbaxter";
