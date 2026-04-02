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
  "design": "디자인 변경",
  "hide": "요소 숨김",
  "addon": "기능 추가",
  "automation": "운영 자동화"
};

const CATEGORY_ICONS = {
  "design": "&#127912;",
  "hide": "&#128065;",
  "addon": "&#9889;",
  "automation": "&#128260;"
};

const CATEGORY_ORDER = ["design", "hide", "addon", "automation"];

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

// --- 카드 렌더링 ---

function renderCard(app) {
  const categoryIcon = CATEGORY_ICONS[app.marketplace.category] ?? "";
  const categoryLabel = label(CATEGORY_LABELS, app.marketplace.category);

  if (app.appType === "bundle") {
    return renderBundleCard(app, categoryIcon, categoryLabel);
  }
  return renderSingleCard(app, categoryIcon, categoryLabel);
}

function renderSingleCard(app, categoryIcon, categoryLabel) {
  return `
    <article class="app-card" data-app-id="${escapeHtml(app.id)}" data-category="${escapeHtml(app.marketplace.category)}">
      <div class="app-top">
        <div class="card-kicker"><span class="card-icon">${categoryIcon}</span> ${escapeHtml(categoryLabel)}</div>
        <div class="app-status app-status--beta">베타</div>
      </div>
      <h3>${escapeHtml(app.name)}</h3>
      <p>${escapeHtml(app.summary)}</p>
      <div class="app-tags">
        <span class="app-tag app-tag--free">무료</span>
        ${app.requires.slice(0, 2).map((r) => `<span class="app-tag">${escapeHtml(label(REQUIRE_LABELS, r))}</span>`).join("")}
      </div>
      <span class="app-link">${app.guideUrl ? "적용 가이드 보기" : "상세 보기"} &rarr;</span>
    </article>
  `;
}

function renderBundleCard(app, categoryIcon, categoryLabel) {
  const featureCount = app.features ? app.features.length : 0;
  // notionTag 기준으로 키워드 추출 (중복 제거)
  const keywords = app.features
    ? [...new Set(app.features.map((f) => f.notionTag))].join(" · ")
    : "";

  return `
    <article class="app-card app-card--bundle" data-app-id="${escapeHtml(app.id)}" data-category="${escapeHtml(app.marketplace.category)}">
      <div class="app-top">
        <div class="card-kicker"><span class="card-icon">${categoryIcon}</span> ${escapeHtml(categoryLabel)}</div>
        <div class="app-status app-status--bundle">${featureCount}개 기능</div>
      </div>
      <h3>${escapeHtml(app.name)}</h3>
      <p class="bundle-keywords">${escapeHtml(keywords)}</p>
      <div class="app-tags">
        <span class="app-tag app-tag--free">무료</span>
        <span class="app-tag">바디 코드</span>
      </div>
      <span class="app-link">세부 기능 보기 &rarr;</span>
    </article>
  `;
}

// --- 모달 렌더링 ---

function renderDetailModal(app) {
  if (app.appType === "bundle") {
    return renderBundleModal(app);
  }
  return renderSingleModal(app);
}

function renderSingleModal(app) {
  const requires = app.requires.map((r) => `<li>${escapeHtml(label(REQUIRE_LABELS, r))}</li>`).join("");
  const risks = app.risks
    .map(
      (r) =>
        `<li><span class="risk-level" data-level="${escapeHtml(r.level)}">${escapeHtml(r.level)}</span>${escapeHtml(r.description)}</li>`
    )
    .join("");
  const delivery = app.delivery.map((d) => `<li>${escapeHtml(label(DELIVERY_LABELS, d))}</li>`).join("");
  const categoryIcon = CATEGORY_ICONS[app.marketplace.category] ?? "";
  const categoryLabel = label(CATEGORY_LABELS, app.marketplace.category);

  const demoSection = app.demoUrl
    ? `<a class="modal-cta modal-cta--demo" href="${escapeHtml(app.demoUrl)}" target="_blank">데모 페이지 보기 &rarr;</a>`
    : "";

  const guideSection = app.guideUrl
    ? `<a class="modal-cta modal-cta--guide" href="${escapeHtml(app.guideUrl)}" target="_blank">적용 가이드 보기 &rarr;</a>`
    : `<a class="modal-cta modal-cta--guide" href="./guide/how-to-apply.html" target="_blank">적용 방법 알아보기 &rarr;</a>`;

  return `
    <div class="modal-top-badges">
      <span class="modal-badge">무료</span>
      <span class="modal-badge">베타</span>
      <span class="modal-badge">${categoryIcon} ${escapeHtml(categoryLabel)}</span>
    </div>
    <h2>${escapeHtml(app.name)}</h2>
    <p class="modal-summary">${escapeHtml(app.summary)}</p>
    ${demoSection}
    ${guideSection}
    <div class="detail-section">
      <h4>적용 조건</h4>
      <ul class="detail-list">${requires}</ul>
    </div>
    <div class="detail-section">
      <h4>제공 방식</h4>
      <ul class="detail-list">${delivery}</ul>
    </div>
    <div class="detail-section">
      <h4>알려진 제한 사항</h4>
      <ul class="risk-list">${risks}</ul>
    </div>
    <div class="modal-actions">
      <button class="modal-cta" data-app-name="${escapeHtml(app.name)}">지원 요청하기</button>
      <button class="modal-cta modal-cta--feedback" data-app-id="${escapeHtml(app.id)}" data-app-name="${escapeHtml(app.name)}">피드백 보내기</button>
    </div>
  `;
}

function renderBundleModal(app) {
  const categoryIcon = CATEGORY_ICONS[app.marketplace.category] ?? "";
  const categoryLabel = label(CATEGORY_LABELS, app.marketplace.category);
  const featureCount = app.features ? app.features.length : 0;

  const featuresHtml = (app.features || [])
    .map((feature, index) => {
      const isOpen = index === 0 ? "open" : "";
      const snippetHtml = feature.snippet
        ? `<div class="snippet-block">
            <pre><code>${escapeHtml(feature.snippet)}</code></pre>
            <button class="snippet-copy" data-snippet="${escapeHtml(feature.snippet)}" title="복사">복사</button>
          </div>`
        : "";
      return `
        <details class="accordion" ${isOpen}>
          <summary class="accordion-header">
            <span class="accordion-title">${escapeHtml(feature.name)}</span>
            <span class="accordion-tag">${escapeHtml(feature.notionTag)}</span>
          </summary>
          <div class="accordion-body">
            <p>${escapeHtml(feature.description)}</p>
            ${snippetHtml}
          </div>
        </details>
      `;
    })
    .join("");

  const risks = app.risks
    .map(
      (r) =>
        `<li><span class="risk-level" data-level="${escapeHtml(r.level)}">${escapeHtml(r.level)}</span>${escapeHtml(r.description)}</li>`
    )
    .join("");

  return `
    <div class="modal-top-badges">
      <span class="modal-badge">무료</span>
      <span class="modal-badge">베타</span>
      <span class="modal-badge">${categoryIcon} ${escapeHtml(categoryLabel)}</span>
      <span class="modal-badge">${featureCount}개 기능</span>
    </div>
    <h2>${escapeHtml(app.name)}</h2>
    <p class="modal-summary">${escapeHtml(app.summary)}</p>
    <a class="modal-cta modal-cta--guide" href="./guide/how-to-apply.html" target="_blank">적용 방법 알아보기 &rarr;</a>
    <div class="detail-section">
      <h4>세부 기능</h4>
      <div class="accordion-group">
        ${featuresHtml}
      </div>
    </div>
    <div class="detail-section">
      <h4>알려진 제한 사항</h4>
      <ul class="risk-list">${risks}</ul>
    </div>
    <div class="modal-actions">
      <button class="modal-cta" data-app-name="${escapeHtml(app.name)}">지원 요청하기</button>
      <button class="modal-cta modal-cta--feedback" data-app-id="${escapeHtml(app.id)}" data-app-name="${escapeHtml(app.name)}">피드백 보내기</button>
    </div>
  `;
}

// --- 필터 탭 ---

function renderFilterTabs(apps) {
  const counts = { all: apps.length };
  for (const cat of CATEGORY_ORDER) {
    counts[cat] = apps.filter((a) => a.marketplace.category === cat).length;
  }

  const allTab = `<button class="filter-tab filter-tab--active" data-category="all">전체(${counts.all})</button>`;
  const categoryTabs = CATEGORY_ORDER
    .filter((cat) => counts[cat] > 0)
    .map((cat) => {
      const icon = CATEGORY_ICONS[cat] ?? "";
      return `<button class="filter-tab" data-category="${cat}">${icon} ${escapeHtml(CATEGORY_LABELS[cat])}(${counts[cat]})</button>`;
    })
    .join("");

  return `<div class="filter-tabs">${allTab}${categoryTabs}</div>`;
}

function filterByCategory(category) {
  const cards = document.querySelectorAll(".app-card");
  cards.forEach((card) => {
    if (category === "all" || card.dataset.category === category) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });

  const tabs = document.querySelectorAll(".filter-tab");
  tabs.forEach((tab) => {
    tab.classList.toggle("filter-tab--active", tab.dataset.category === category);
  });
}

// --- 유틸 ---

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
    site_url: String(formData.get("siteUrl") ?? "").trim(),
    contact_channel: String(formData.get("contactChannel") ?? "").trim(),
    requested_app_id: matchedApp?.id ?? null,
    requested_app_name: requestedAppName,
    desired_launch_window: String(formData.get("desiredLaunchWindow") ?? "").trim(),
    problem_statement: String(formData.get("problemStatement") ?? "").trim(),
    source: config.source || "extensions.liveklass.com"
  };
}

async function submitRequest({ payload, config }) {
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    throw new Error("REQUEST_ENDPOINT_MISSING");
  }

  const response = await fetch(`${config.supabaseUrl}/rest/v1/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": config.supabaseAnonKey,
      "Authorization": `Bearer ${config.supabaseAnonKey}`,
      "Prefer": "return=minimal"
    },
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
  document.getElementById("support").scrollIntoView({ behavior: "smooth" });
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
  const filterContainer = document.getElementById("filter-container");
  const appSelect = document.getElementById("app-select");
  const publicSummary = document.getElementById("public-summary");
  const requestForm = document.getElementById("request-form");
  const submitButton = document.getElementById("request-submit");
  const formStatus = document.getElementById("form-status");

  // 필터 탭 렌더링
  if (filterContainer) {
    filterContainer.innerHTML = renderFilterTabs(catalog.publicApps);
    filterContainer.addEventListener("click", (event) => {
      const tab = event.target.closest(".filter-tab");
      if (!tab) return;
      filterByCategory(tab.dataset.category);
    });
  }

  // 카드 렌더링
  appGrid.innerHTML = catalog.publicApps.map(renderCard).join("\n");
  appSelect.innerHTML = `${catalog.publicApps.map(renderOption).join("\n")}\n<option>기타</option>`;
  publicSummary.textContent = `모든 확장 기능은 무료 베타로 제공됩니다. 가이드를 따라 직접 적용하거나, 어려운 부분은 지원을 요청하세요.`;

  if (!config.supabaseAnonKey) {
    setStatus(formStatus, "지원 요청 시스템을 준비 중입니다. 곧 활성화될 예정입니다.");
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

  // 모달 내 CTA
  document.getElementById("modal-body").addEventListener("click", (event) => {
    // 스니펫 복사
    const copyBtn = event.target.closest(".snippet-copy");
    if (copyBtn) {
      const snippet = copyBtn.dataset.snippet;
      navigator.clipboard.writeText(snippet).then(() => {
        copyBtn.textContent = "복사됨!";
        setTimeout(() => { copyBtn.textContent = "복사"; }, 1500);
      });
      return;
    }

    // 지원 요청 → 폼으로 이동
    const ctaButton = event.target.closest(".modal-cta:not(.modal-cta--feedback):not(.modal-cta--guide):not(.modal-cta--demo)");
    if (ctaButton && ctaButton.dataset.appName) {
      const appName = ctaButton.dataset.appName;
      closeModal();
      selectAppInForm(appName);
      return;
    }

    // 피드백 보내기
    const feedbackBtn = event.target.closest(".modal-cta--feedback");
    if (feedbackBtn) {
      const appId = feedbackBtn.dataset.appId;
      const appName = feedbackBtn.dataset.appName;
      showFeedbackForm(appId, appName);
      return;
    }

    // 피드백 폼 제출
    const feedbackSubmit = event.target.closest(".feedback-submit");
    if (feedbackSubmit) {
      const appId = feedbackSubmit.dataset.appId;
      const appName = feedbackSubmit.dataset.appName;
      submitFeedback(appId, appName);
      return;
    }
  });

  function showFeedbackForm(appId, appName) {
    const actions = document.querySelector(".modal-actions");
    if (!actions) return;
    actions.innerHTML = `
      <div class="feedback-form">
        <textarea class="feedback-input" id="feedback-message" placeholder="이 기능에 대한 의견이나 개선 아이디어를 알려주세요." rows="3"></textarea>
        <input class="feedback-contact" id="feedback-contact" type="text" placeholder="연락처 (선택, 회신이 필요하면 입력)" />
        <div class="feedback-form-actions">
          <button class="modal-cta feedback-submit" data-app-id="${escapeHtml(appId)}" data-app-name="${escapeHtml(appName)}">피드백 보내기</button>
          <div class="feedback-status" id="feedback-status"></div>
        </div>
      </div>
    `;
    document.getElementById("feedback-message").focus();
  }

  async function submitFeedback(appId, appName) {
    const message = document.getElementById("feedback-message")?.value?.trim();
    const contact = document.getElementById("feedback-contact")?.value?.trim();
    const statusEl = document.getElementById("feedback-status");

    if (!message) {
      if (statusEl) statusEl.textContent = "내용을 입력해주세요.";
      return;
    }

    if (statusEl) statusEl.textContent = "전송 중...";

    try {
      const response = await fetch(`${config.supabaseUrl}/rest/v1/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": config.supabaseAnonKey,
          "Authorization": `Bearer ${config.supabaseAnonKey}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          app_id: appId,
          app_name: appName,
          message,
          contact: contact || null,
          source: config.source || "extensions.liveklass.com"
        })
      });

      if (!response.ok) throw new Error(`FEEDBACK_FAILED_${response.status}`);

      const actions = document.querySelector(".modal-actions");
      if (actions) {
        actions.innerHTML = `<div class="feedback-success">피드백을 보내주셔서 감사합니다! 개선에 반영하겠습니다.</div>`;
      }
    } catch (error) {
      if (statusEl) statusEl.textContent = "전송에 실패했습니다. 잠시 후 다시 시도해주세요.";
    }
  }

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
      setStatus(formStatus, "지원 요청이 접수되었습니다. 확인 후 안내드릴게요.", "success");
    } catch (error) {
      if (error instanceof Error && error.message === "REQUEST_ENDPOINT_MISSING") {
        setStatus(formStatus, "지원 요청 시스템이 아직 준비 중입니다. 잠시 후 다시 시도해 주세요.", "error");
      } else {
        setStatus(formStatus, "요청 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.", "error");
      }
    } finally {
      submitButton.disabled = false;
    }
  });
}

main();
