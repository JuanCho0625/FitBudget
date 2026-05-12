const base = `font-family:'Segoe UI',Arial,sans-serif;background:#f4f6f9;margin:0;padding:0;`;
const card = `max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);`;
const hdr  = (bg: string) => `background:${bg};padding:36px 40px;text-align:center;`;
const bdy  = `padding:36px 40px;`;
const ftr  = `background:#f8f9fa;padding:20px 40px;text-align:center;border-top:1px solid #eee;`;
const btn  = (c: string) => `display:inline-block;background:${c};color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;`;
const ftrtxt = `<p style="color:#aaa;font-size:12px;margin:0;">FitBudget — Tu asistente financiero estudiantil<br>ITESO, Universidad Jesuita de Guadalajara — 2026</p>`;

// ── 1. BIENVENIDA ────────────────────────────────────────────────────────────
export const welcomeTemplate = ({ userName }: { userName: string }): string => `
<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"></head>
<body style="${base}">
  <div style="${card}">
    <div style="${hdr("linear-gradient(135deg,#1B4F8A,#2980b9)")}">
      <h1 style="color:#fff;margin:0;font-size:28px;font-weight:700;">💰 FitBudget</h1>
      <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px;">Plataforma de gestión financiera para estudiantes</p>
    </div>
    <div style="${bdy}">
      <h2 style="color:#1B4F8A;font-size:22px;margin:0 0 16px;">¡Hola, ${userName}! 👋</h2>
      <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 24px;">Tu cuenta en <strong>FitBudget</strong> ha sido creada exitosamente. Con FitBudget puedes:</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
        <tr><td style="padding:10px 0;width:40px;font-size:22px;">📥</td><td style="padding:10px 12px;"><strong style="color:#2c3e50;font-size:14px;">Registrar tus ingresos</strong><br><span style="color:#777;font-size:13px;">Sueldo, becas, apoyo familiar y más</span></td></tr>
        <tr><td style="padding:10px 0;font-size:22px;">📤</td><td style="padding:10px 12px;"><strong style="color:#2c3e50;font-size:14px;">Controlar tus gastos</strong><br><span style="color:#777;font-size:13px;">Con categorías como comida, transporte y ocio</span></td></tr>
        <tr><td style="padding:10px 0;font-size:22px;">📊</td><td style="padding:10px 12px;"><strong style="color:#2c3e50;font-size:14px;">Ver tu balance mensual</strong><br><span style="color:#777;font-size:13px;">Gráficas claras de tu situación financiera</span></td></tr>
        <tr><td style="padding:10px 0;font-size:22px;">🎯</td><td style="padding:10px 12px;"><strong style="color:#2c3e50;font-size:14px;">Crear metas de ahorro</strong><br><span style="color:#777;font-size:13px;">Y dar seguimiento a tu progreso</span></td></tr>
      </table>
      <div style="text-align:center;"><span style="${btn("#1B4F8A")}">Comenzar a usar FitBudget</span></div>
    </div>
    <div style="${ftr}">${ftrtxt}</div>
  </div>
</body></html>`;

// ── 2. ALERTA DE PRESUPUESTO ─────────────────────────────────────────────────
export const budgetAlertTemplate = ({
  userName, monthlyLimit, totalSpent, percentageUsed, month, year,
}: { userName:string; monthlyLimit:number; totalSpent:number; percentageUsed:number; month:number; year:number; }): string => {
  const isOver = percentageUsed >= 100;
  const accent = isOver ? "#c0392b" : "#e67e22";
  const bg     = isOver ? "linear-gradient(135deg,#c0392b,#e74c3c)" : "linear-gradient(135deg,#e67e22,#f39c12)";
  const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const rem    = monthlyLimit - totalSpent;
  const bar    = Math.min(percentageUsed, 100).toFixed(0);
  return `
<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"></head>
<body style="${base}">
  <div style="${card}">
    <div style="${hdr(bg)}">
      <div style="font-size:48px;margin-bottom:12px;">${isOver ? "🚨" : "⚠️"}</div>
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">${isOver ? "¡Presupuesto superado!" : "Alerta de presupuesto"}</h1>
      <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:14px;">${months[month-1]} ${year}</p>
    </div>
    <div style="${bdy}">
      <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 24px;">Hola <strong>${userName}</strong>, ${isOver ? "has <strong>superado</strong> tu presupuesto mensual." : `has utilizado el <strong>${percentageUsed.toFixed(0)}%</strong> de tu presupuesto mensual.`}</p>
      <div style="margin-bottom:28px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:13px;color:#777;">Progreso del mes</span>
          <span style="font-size:13px;font-weight:700;color:${accent};">${bar}%</span>
        </div>
        <div style="background:#eee;border-radius:99px;height:12px;overflow:hidden;">
          <div style="background:${accent};width:${bar}%;height:100%;border-radius:99px;"></div>
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse;background:#f8f9fa;border-radius:8px;overflow:hidden;margin-bottom:24px;">
        <tr>
          <td style="padding:14px 20px;border-bottom:1px solid #eee;"><span style="font-size:13px;color:#777;">Límite mensual</span><br><strong style="font-size:18px;color:#2c3e50;">$${monthlyLimit.toLocaleString("es-MX")}</strong></td>
          <td style="padding:14px 20px;border-bottom:1px solid #eee;border-left:1px solid #eee;"><span style="font-size:13px;color:#777;">Total gastado</span><br><strong style="font-size:18px;color:${accent};">$${totalSpent.toLocaleString("es-MX")}</strong></td>
        </tr>
        <tr><td colspan="2" style="padding:14px 20px;"><span style="font-size:13px;color:#777;">${isOver ? "Exceso" : "Restante"}</span><br><strong style="font-size:18px;color:${isOver?"#c0392b":"#27ae60"};">${isOver?"-":""}$${Math.abs(rem).toLocaleString("es-MX")}</strong></td></tr>
      </table>
      <div style="text-align:center;"><span style="${btn(accent)}">Ver mis gastos en FitBudget</span></div>
    </div>
    <div style="${ftr}">${ftrtxt}</div>
  </div>
</body></html>`;
};

// ── 3. META COMPLETADA ───────────────────────────────────────────────────────
export const goalCompletedTemplate = ({
  userName, goalName, targetAmount,
}: { userName:string; goalName:string; targetAmount:number; }): string => `
<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"></head>
<body style="${base}">
  <div style="${card}">
    <div style="${hdr("linear-gradient(135deg,#1e7e34,#28a745)")}">
      <div style="font-size:56px;margin-bottom:12px;">🎯</div>
      <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">¡Meta alcanzada!</h1>
      <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:14px;">Has completado una meta de ahorro</p>
    </div>
    <div style="${bdy}">
      <h2 style="color:#1e7e34;font-size:20px;margin:0 0 16px;">¡Felicidades, ${userName}! 🎉</h2>
      <p style="color:#555;font-size:15px;line-height:1.7;margin:0 0 24px;">Has alcanzado tu meta <strong>"${goalName}"</strong>. Este es un gran logro que demuestra tu disciplina financiera.</p>
      <div style="background:linear-gradient(135deg,#d4edda,#c3e6cb);border-radius:10px;padding:24px;text-align:center;margin-bottom:28px;border:1px solid #b8dfc4;">
        <p style="color:#155724;font-size:13px;font-weight:600;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.5px;">Meta completada</p>
        <p style="color:#1e7e34;font-size:22px;font-weight:700;margin:0 0 4px;">${goalName}</p>
        <p style="color:#155724;font-size:28px;font-weight:800;margin:0;">$${targetAmount.toLocaleString("es-MX")}</p>
      </div>
      <div style="margin-bottom:28px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:13px;color:#777;">Progreso final</span>
          <span style="font-size:13px;font-weight:700;color:#1e7e34;">100% ✓</span>
        </div>
        <div style="background:#eee;border-radius:99px;height:12px;overflow:hidden;">
          <div style="background:linear-gradient(90deg,#1e7e34,#28a745);width:100%;height:100%;border-radius:99px;"></div>
        </div>
      </div>
      <div style="text-align:center;"><span style="${btn("#1e7e34")}">Crear nueva meta</span></div>
    </div>
    <div style="${ftr}">${ftrtxt}</div>
  </div>
</body></html>`;
