import { SITE_CONTENT } from "./data/site-content.js?v=20260224-scv1";
import { renderPage } from "./renderers/page.js?v=20260224-scv1";
import { initSplash } from "./features/splash.js";
import { initWorkScroll } from "./features/work-scroll.js";
import { initEmergingTechBuilds } from "./features/emerging-tech-builds.js?v=20260224-scv1";
import {
  initSupplyChainSection,
  initConsultingSection
} from "./features/supply-consulting.js?v=20260224-scv1";

export function bootstrap() {
  renderPage(SITE_CONTENT);
  initSplash();
  initWorkScroll(SITE_CONTENT.workScroll);

  var etbScreen = (SITE_CONTENT.work && SITE_CONTENT.work.detailScreens || []).find(function(screen) {
    return screen.type === "emerging-tech-builds" && screen.etb;
  });

  if (etbScreen && etbScreen.etb) {
    initEmergingTechBuilds(etbScreen.etb);
  }

  var supplyChainScreen = (SITE_CONTENT.work && SITE_CONTENT.work.detailScreens || []).find(function(screen) {
    return screen.type === "supply-chain" && screen.supplyChain;
  });

  if (supplyChainScreen && supplyChainScreen.supplyChain) {
    initSupplyChainSection(supplyChainScreen.supplyChain);
  }

  var consultingScreen = (SITE_CONTENT.work && SITE_CONTENT.work.detailScreens || []).find(function(screen) {
    return screen.type === "consulting" && screen.consulting;
  });

  if (consultingScreen && consultingScreen.consulting) {
    initConsultingSection(consultingScreen.consulting);
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }
}
