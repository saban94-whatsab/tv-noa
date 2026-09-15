export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="he" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <title>ח. סבן · התאוששות וטעינת מערכת</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; background: #090d16; color: #f8fafc; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 32rem; width: 100%; text-align: center; padding: 2.5rem; background: #0f172a; border: 1px solid #1e293b; border-radius: 1.25rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
      .icon { width: 3rem; height: 3rem; margin: 0 auto 1.25rem; color: #38bdf8; }
      h1 { font-size: 1.35rem; font-weight: 800; margin: 0 0 0.75rem; color: #f1f5f9; }
      p { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin: 0 0 1.75rem; }
      .countdown { font-weight: bold; color: #38bdf8; }
      .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.7rem 1.4rem; border-radius: 0.625rem; font: inherit; font-size: 0.9rem; font-weight: 700; cursor: pointer; text-decoration: none; border: 1px solid transparent; transition: all 0.2s; }
      .primary { background: #0284c7; color: #fff; }
      .primary:hover { background: #0369a1; }
      .secondary { background: #1e293b; color: #cbd5e1; border-color: #334155; }
      .secondary:hover { background: #334155; color: #fff; }
    </style>
  </head>
  <body>
    <div class="card">
      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
      </svg>
      <h1>מרענן ומחבר את לוח ההפצה...</h1>
      <p>המערכת מתאוששת ומסנכרנת מחדש את הנתונים.<br>טעינה אוטומטית בעוד <span class="countdown" id="timer">2</span> שניות.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">טען מחדש עכשיו</button>
        <button class="secondary" onclick="try{localStorage.clear();}catch(e){}location.href='/'">איפוס מטמון מקומי</button>
      </div>
    </div>
    <script>
      let seconds = 2;
      const el = document.getElementById('timer');
      const iv = setInterval(() => {
        seconds--;
        if (el) el.textContent = seconds;
        if (seconds <= 0) {
          clearInterval(iv);
          location.reload();
        }
      }, 1000);
    </script>
  </body>
</html>`;
}
