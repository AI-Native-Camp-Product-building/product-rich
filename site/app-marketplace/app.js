// --- 한글 매핑 ---

const REQUIRE_LABELS = {
  "site-admin-access": "사이트 관리자 권한",
  "kakao-sync": "카카오싱크 연동",
  "biz-message-account": "비즈메시지 계정",
  "custom-html-access": "커스텀 HTML 접근",
  "static-hosting": "정적 호스팅",
  "coupon-bulk-generation": "쿠폰 대량 생성",
  "google-sheets": "Google Sheets",
  "solapi-account": "솔라피 계정"
};

const DELIVERY_LABELS = {
  "page-html": "페이지 HTML",
  "external-iframe": "외부 iframe",
  "body-code": "바디 코드",
  "external-hosting": "외부 호스팅",
  "iframe": "iframe 삽입",
  "google-sheet": "Google Sheet",
  "google-form": "Google Form",
  "skill-automation": "스킬 자동화",
  "message-delivery": "메시지 발송"
};

const GUIDANCE_LABELS = {
  "request-review": "요청 후 검토",
  "managed-service": "운영 대행"
};

const CATEGORY_LABELS = {
  "marketing": "마케팅",
  "design": "디자인",
  "migration": "이전/마이그레이션"
};

const CATEGORY_ICONS = {
  "marketing": "&#128226;",
  "design": "&#127912;",
  "migration": "&#128640;"
};

function label(map, key) {
  return map[key] ?? key;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderCard(app) {
  const requirements = app.requires.slice(0, 3).map((r) => label(REQUIRE_LABELS, r)).join(", ");
  const risk = app.risks[0]?.description ?? "제한 사항은 상담 과정에서 안내됩니다.";
  const categoryIcon = CATEGORY_ICONS[app.marketplace.category] ?? "";
  const categoryLabel = label(CATEGORY_LABELS, app.marketplace.category);
  const guidanceLabel = label(GUIDANCE_LABELS, app.marketplace.guidanceMode);

  return `
    <article class="app-card" data-app-id="${escapeHtml(app.id)}" data-category="${escapeHtml(app.marketplace.category)}">
      <div class="app-top">
        <div class="card-kicker"><span class="card-icon">${categoryIcon}</span> ${escapeHtml(categoryLabel)}</div>
        <div class="app-status">${escapeHtml(app.marketplace.ctaLabel)}</div>
      </div>
      <h3>${escapeHtml(app.name)}</h3>
      <p>${escapeHtml(app.summary)}</p>
      <div class="app-meta">
        <div>
          <strong>적용 조건</strong>
          <span>${escapeHtml(requirements)}</span>
        </div>
        <div>
          <strong>안내 방식</strong>
          <span>${escapeHtml(guidanceLabel)}</span>
        </div>
        <div>
          <strong>주요 제한</strong>
          <span>${escapeHtml(risk)}</span>
        </div>
      </div>
      <span class="app-link">${escapeHtml(app.marketplace.ctaLabel)} &rarr;</span>
    </article>
  `;
}

function renderDetailModal(app) {
  const requires = app.requires.map((r) => `<li>${escapeHtml(label(REQUIRE_LABELS, r))}</li>`).join("");
  const configs = app.customerConfig.map((c) => `<li>${escapeHtml(c)}</li>`).join("");
  const risks = app.risks
    .map(
      (r) =>
        `<li><span class="risk-level" data-level="${escapeHtml(r.level)}">${escapeHtml(r.level)}</span>${escapeHtml(r.description)}</li>`
    )
    .join("");
  const delivery = app.delivery.map((d) => `<li>${escapeHtml(label(DELIVERY_LABELS, d))}</li>`).join("");
  const categoryIcon = CATEGORY_ICONS[app.marketplace.category] ?? "";
  const categoryLabel = label(CATEGORY_LABELS, app.marketplace.category);

  return `
    <div class="card-kicker"><span class="card-icon">${categoryIcon}</span> ${escapeHtml(categoryLabel)}</div>
    <h2>${escapeHtml(app.name)}</h2>
    <p class="modal-summary">${escapeHtml(app.summary)}</p>
    <div class="detail-section">
      <h4>제공 방식</h4>
      <ul class="detail-list">${delivery}</ul>
    </div>
    <div class="detail-section">
      <h4>적용 조건</h4>
      <ul class="detail-list">${requires}</ul>
    </div>
    <div class="detail-section">
      <h4>고객사 설정 항목</h4>
      <ul class="detail-list">${configs}</ul>
    </div>
    <div class="detail-section">
      <h4>제한 사항</h4>
      <ul class="risk-list">${risks}</ul>
    </div>
    <button class="modal-cta" data-app-name="${escapeHtml(app.name)}">${escapeHtml(app.marketplace.ctaLabel)}</button>
  `;
}

function renderOption(app) {
  return `<option value="${escapeHtml(app.name)}">${escapeHtml(app.name)}</option>`;
}

function setStatus(element, message, tone = "neutral") {
  element.textContent = message;
  if (tone === "neutral") {
    element.removeAttribute("data-tone");
  } else {
    element.dataset.tone = tone;
  }
}

function buildRequestPayload({ form, catalog, config }) {
  const formData = new FormData(form);
  const requestedAppName = String(formData.get("requestedAppName") ?? "").trim();
  const matchedApp = catalog.publicApps.find((app) => app.name === requestedAppName);

  return {
    submittedAt: new Date().toISOString(),
    source: config.source || "extensions.liveklass.com",
    siteUrl: String(formData.get("siteUrl") ?? "").trim(),
    contactChannel: String(formData.get("contactChannel") ?? "").trim(),
    requestedAppId: matchedApp?.id ?? null,
    requestedAppName,
    desiredLaunchWindow: String(formData.get("desiredLaunchWindow") ?? "").trim(),
    problemStatement: String(formData.get("problemStatement") ?? "").trim(),
    accessMode: matchedApp?.accessMode ?? null
  };
}

async function submitRequest({ payload, config }) {
  if (!config.requestEndpoint) {
    throw new Error("REQUEST_ENDPOINT_MISSING");
  }

  const response = await fetch(config.requestEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`REQUEST_FAILED_${response.status}`);
  }
}

// --- 모달 ---

function openModal(app) {
  const overlay = document.getElementById("modal-overlay");
  const body = document.getElementById("modal-body");
  body.innerHTML = renderDetailModal(app);
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  history.replaceState(null, "", `#app/${app.id}`);
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  history.replaceState(null, "", window.location.pathname);
}

function selectAppInForm(appName) {
  const appSelect = document.getElementById("app-select");
  for (const option of appSelect.options) {
    if (option.value === appName) {
      appSelect.value = appName;
      break;
    }
  }
  document.getElementById("request").scrollIntoView({ behavior: "smooth" });
}

// --- 메인 ---

function main() {
  const catalog = window.__MARKETPLACE_CATALOG__;
  const config = window.__MARKETPLACE_CONFIG__ ?? {};
  if (!catalog) {
    throw new Error("Marketplace catalog is missing. Run npm run build first.");
  }

  const allApps = [...catalog.publicApps, ...catalog.privateApps];
  const appGrid = document.getElementById("app-grid");
  const appSelect = document.getElementById("app-select");
  const publicSummary = document.getElementById("public-summary");
  const requestForm = document.getElementById("request-form");
  const submitButton = document.getElementById("request-submit");
  const formStatus = document.getElementById("form-status");

  appGrid.innerHTML = catalog.publicApps.map(renderCard).join("\n");
  appSelect.innerHTML = `${catalog.publicApps.map(renderOption).join("\n")}\n<option>기타</option>`;
  publicSummary.textContent = `공개 카탈로그에는 검증을 통과한 앱만 노출합니다. 현재 비공개 운영형 확장 기능은 ${catalog.privateApps.length}개입니다.`;

  if (!config.requestEndpoint) {
    setStatus(formStatus, "현재 요청 접수 준비 중입니다. 곧 활성화될 예정입니다.");
  }

  // 카드 클릭 → 모달
  appGrid.addEventListener("click", (event) => {
    const card = event.target.closest(".app-card");
    if (!card) return;
    const app = allApps.find((a) => a.id === card.dataset.appId);
    if (app) openModal(app);
  });

  // 모달 닫기
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-overlay").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });

  // 모달 내 CTA → 폼 앱 자동 선택
  document.getElementById("modal-body").addEventListener("click", (event) => {
    const ctaButton = event.target.closest(".modal-cta");
    if (!ctaButton) return;
    const appName = ctaButton.dataset.appName;
    closeModal();
    selectAppInForm(appName);
  });

  // URL hash 딥링크
  function handleHash() {
    const hash = window.location.hash;
    const match = hash.match(/^#app\/(.+)$/);
    if (match) {
      const app = allApps.find((a) => a.id === decodeURIComponent(match[1]));
      if (app) openModal(app);
    }
  }
  handleHash();
  window.addEventListener("hashchange", handleHash);

  // 폼 제출
  requestForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    setStatus(formStatus, "요청을 전송하고 있습니다...");

    try {
      await submitRequest({
        payload: buildRequestPayload({ form: requestForm, catalog, config }),
        config
      });
      requestForm.reset();
      appSelect.innerHTML = `${catalog.publicApps.map(renderOption).join("\n")}\n<option>기타</option>`;
      setStatus(formStatus, "요청이 접수되었습니다. 내부 팀이 확인 후 안내드릴 예정입니다.", "success");
    } catch (error) {
      if (error instanceof Error && error.message === "REQUEST_ENDPOINT_MISSING") {
        setStatus(formStatus, "요청 접수 시스템이 아직 준비 중입니다. 잠시 후 다시 시도해 주세요.", "error");
      } else {
        setStatus(formStatus, "요청 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.", "error");
      }
    } finally {
      submitButton.disabled = false;
    }
  });
}

main();
