<!doctype html>
<html lang="en">
<head>
<!-- TEMPLATE. Do not open in a browser: icon tokens in curly braces are placeholders. Edit here, then run build.py → index.html -->
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>SmartPill rework</title>
<link rel="stylesheet" href="sp.css">
<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
<style>
/* 01 Welcome */
.welcome .hero { position: absolute; left: 0; right: 0; top: 0; height: 520px; background: var(--jade-soft); border-radius: 0 0 48px 48px; overflow: hidden; }
.welcome .hero .pill { position: absolute; }
.welcome .copy { position: absolute; left: 24px; right: 24px; top: 556px; }
.welcome .copy p { margin-top: 10px; }
.welcome .copy h1 { text-wrap: balance; }
.appicon { width: 64px; height: 64px; border-radius: 16px; background: var(--jade); display: grid; place-items: center; box-shadow: 0 10px 24px rgb(15 138 99 / .3); }
.appicon svg { width: 48px; height: 48px; }
.welcome .hero-girl { position: absolute; left: 50%; bottom: 18px; height: 352px; transform: translateX(-50%); }

/* 02 Critical alerts */
.perm .mock { margin: 22px 0 0; height: 300px; border-radius: 34px; background: var(--jade-soft); position: relative; overflow: hidden; }
.perm .mock .moon { position: absolute; top: 72px; left: 16px; height: 28px; padding: 0 11px; border-radius: 14px; display: flex; align-items: center; gap: 6px; background: var(--card); color: var(--jade-ink); font: 600 12px var(--round); }
.perm .mock .moon .ic { width: 14px; height: 14px; }
.noti { border-radius: 24px; background: rgb(255 255 255 / .82); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); padding: 13px 14px; display: flex; gap: 11px; color: #14211B; }
.noti .appicon { width: 38px; height: 38px; border-radius: 10px; box-shadow: none; }
.noti .appicon svg { width: 28px; height: 28px; }
.noti .tag { display: flex; align-items: center; gap: 4px; color: #D9411B; font: 700 12px/16px var(--round); letter-spacing: .4px; }
.noti .tag .ic { width: 13px; height: 13px; }
.noti .when { margin-left: auto; color: rgb(20 33 27 / .5); font-size: 13px; }
.perm .mock .noti { position: absolute; left: 16px; top: 110px; width: 248px; z-index: 2; background: var(--card); box-shadow: 0 14px 30px -10px rgb(20 33 27 / .25); }
.perm .mock .hero-boy { position: absolute; right: 26px; bottom: 14px; height: 272px; }
.perm h1 { margin: 26px 8px 0; }
.perm .lead { margin: 8px 8px 0; }
.perm .pts { margin: 20px 8px 0; display: grid; gap: 14px; }
.perm .pt { display: flex; gap: 14px; align-items: flex-start; }
.perm .pt .ibox { width: 40px; height: 40px; border-radius: 14px; }
.perm .pt .ibox .ic { width: 21px; height: 21px; }

/* 03 Today */
.today .hdr { display: flex; align-items: flex-end; justify-content: space-between; margin-top: 2px; }
.today .hdr .d { font: 600 15px/20px var(--round); color: var(--ink2); }
.today .sum { margin-top: 14px; padding: 16px 18px; display: flex; align-items: center; gap: 18px; }
.today .sum .txt .big { font: 700 20px/25px var(--round); }
.today .sum .txt .chip { margin-top: 10px; }
.dose { padding: 6px 0; }
.dose .row { padding: 10px 16px; }
.now { background: var(--card); border-radius: 26px; box-shadow: 0 0 0 2px var(--coral), 0 12px 30px -12px rgb(242 100 61 / .45); padding: 16px; }
.now .top { display: flex; align-items: center; gap: 14px; }
.now .acts { display: flex; gap: 10px; margin-top: 14px; }
.now .acts .btn { height: 48px; border-radius: 24px; font-size: 16px; }
.now .acts .btn.pri { flex: 1.6; }
.now .acts .btn.sec2 { flex: 1; }
.taken-t { font-size: 13px; color: var(--jade-ink); font-weight: 600; font-family: var(--round); }

/* 04 Lock screen */
.lock { background: #0B3D2C; }
.lock .wall { position: absolute; inset: 0; background:
  radial-gradient(420px 360px at 85% 12%, #2E8F6A 0%, transparent 70%),
  radial-gradient(380px 420px at 0% 70%, #1B6B50 0%, transparent 70%),
  radial-gradient(300px 260px at 90% 95%, #F2A07B 0%, transparent 70%), #0B3D2C; }
.lock .lk { position: absolute; top: 72px; left: 0; right: 0; display: flex; justify-content: center; color: #fff; }
.lock .date { position: absolute; top: 108px; left: 0; right: 0; text-align: center; color: rgb(255 255 255 / .85); font: 600 19px var(--round); }
.lock .clock { position: absolute; top: 128px; left: 0; right: 0; text-align: center; color: rgb(255 255 255 / .92); font: 700 104px/1 var(--round); letter-spacing: -2px; }
.lock .stack { position: absolute; left: 12px; right: 12px; top: 432px; display: grid; gap: 8px; }
.lock .noti { padding: 14px; }
.lock .noti.big { flex-direction: column; gap: 0; }
.lock .noti.big .head { display: flex; gap: 11px; }
.lock .noti .ttl { font-weight: 600; font-size: 16px; line-height: 21px; letter-spacing: -.3px; }
.lock .noti .msg { font-size: 15px; line-height: 20px; letter-spacing: -.2px; }
.lock .nacts { display: flex; gap: 8px; margin-top: 12px; }
.lock .nacts span { flex: 1; height: 44px; border-radius: 22px; display: flex; align-items: center; justify-content: center; gap: 6px; font: 600 15px var(--round); background: rgb(20 33 27 / .07); }
.lock .nacts span.go { background: #0F8A63; color: #fff; }
.lock .nacts .ic { width: 18px; height: 18px; }
.lock .noti.ghost { opacity: .78; transform: scale(.96); margin-top: -4px; }
.lock .qa { position: absolute; bottom: 52px; left: 46px; right: 46px; display: flex; justify-content: space-between; }
.lock .qa span { width: 50px; height: 50px; border-radius: 25px; display: grid; place-items: center; background: rgb(0 0 0 / .25); color: #fff; backdrop-filter: blur(10px); }

/* 05 Add · look */
.add .bar { display: flex; align-items: center; justify-content: space-between; }
.add .steps { display: flex; gap: 6px; }
.add .steps i { width: 26px; height: 6px; border-radius: 3px; background: var(--fill2); }
.add .steps i.on { background: var(--jade); }
.add .preview { margin: 14px 0 0; height: 150px; border-radius: 32px; display: grid; place-items: center; }
.add .field { margin-top: 16px; padding: 4px 18px; }
.add .field .lbl { font: 600 13px/18px var(--round); color: var(--ink2); padding-top: 10px; }
.add .field .inp { font: 600 24px/32px var(--round); padding: 2px 0 10px; display: flex; align-items: center; }
.add .field .inp .caret { width: 2px; height: 28px; background: var(--jade); margin-left: 2px; border-radius: 1px; }
.add .field .inp .unit { margin-left: auto; font: 600 17px var(--round); color: var(--ink2); }
.add .field + .field { margin-top: 10px; }
.add .two { display: flex; gap: 10px; margin-top: 10px; }
.add .two .field { flex: 1; margin-top: 0; }
.forms { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.forms span { height: 86px; border-radius: 22px; background: var(--card); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; font: 600 13px var(--round); color: var(--ink2); }
.forms span.on { box-shadow: inset 0 0 0 2px var(--jade); color: var(--ink); }
.swatches { display: flex; justify-content: space-between; padding: 14px 16px; }
.swatches i { width: 36px; height: 36px; border-radius: 18px; box-shadow: inset 0 0 0 1px rgb(20 33 27 / .08); }
.swatches i.on { box-shadow: 0 0 0 3px var(--card), 0 0 0 5px var(--jade); }

/* 06 Add · schedule */
.sched .times .row { min-height: 58px; }
.tpill { height: 36px; padding: 0 14px; border-radius: 18px; background: var(--fill); display: inline-flex; align-items: center; font: 600 17px var(--round); font-variant-numeric: tabular-nums; }
.stepper { display: flex; align-items: center; gap: 2px; height: 36px; border-radius: 18px; background: var(--fill); padding: 0 4px; }
.stepper b { min-width: 58px; text-align: center; font: 600 15px var(--round); }
.stepper .ic { width: 16px; height: 16px; margin: 0 6px; color: var(--ink2); }
.addtime { color: var(--jade-ink); font: 600 17px var(--round); }

/* 07 Detail */
.det .head { display: flex; flex-direction: column; align-items: center; text-align: center; margin-top: 4px; }
.det .head .pbox { width: 96px; height: 96px; border-radius: 32px; }
.det .head .pbox .pill { width: 72px; height: 72px; }
.det .head h1 { margin-top: 14px; }
.det .head p { margin-top: 4px; }
.det .head .chips { display: flex; gap: 6px; margin-top: 12px; }
.det .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px; }
.det .stat { padding: 16px; }
.det .stat .v { font: 700 28px/34px var(--round); font-variant-numeric: tabular-nums; }
.det .stat .k { font-size: 13px; color: var(--ink2); margin-top: 2px; }
.det .stat .bar { height: 8px; border-radius: 4px; background: var(--fill); margin-top: 12px; overflow: hidden; }
.det .stat .bar i { display: block; height: 100%; border-radius: 4px; }
.dots { display: grid; grid-template-columns: repeat(15, 1fr); gap: 5px; margin-top: 12px; }
.dots i { aspect-ratio: 1; border-radius: 50%; background: var(--jade); }
.dots i.p { background: var(--jade-soft); box-shadow: inset 0 0 0 2px var(--jade); }
.dots i.m { background: var(--coral); }
.dots i.f { background: var(--fill2); }

/* 08 History */
.cal { padding: 14px 12px 12px; }
.cal .wk, .cal .grid { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; }
.cal .wk span { font: 600 12px var(--round); color: var(--ink3); padding-bottom: 6px; }
.cal .grid span { height: 44px; display: grid; place-items: center; }
.cal .grid b { width: 38px; height: 38px; border-radius: 19px; display: grid; place-items: center; font: 600 15px var(--round); font-variant-numeric: tabular-nums; }
.cal .grid b.ok { background: var(--jade); color: var(--on-jade); }
.cal .grid b.part { background: var(--jade-soft); color: var(--jade-ink); }
.cal .grid b.miss { background: var(--coral-soft); color: var(--coral); }
.cal .grid b.fut { color: var(--ink3); }
.cal .grid b.today { box-shadow: 0 0 0 2px var(--card), 0 0 0 4px var(--ink); }
.legend { display: flex; gap: 14px; justify-content: center; padding: 6px 0 4px; font-size: 12px; color: var(--ink2); }
.legend i { display: inline-block; width: 10px; height: 10px; border-radius: 5px; margin-right: 5px; vertical-align: -1px; }
.hist .row .tm { font: 600 15px var(--round); font-variant-numeric: tabular-nums; width: 46px; color: var(--ink2); }

/* 09 Plus */
.plus .hero { position: absolute; left: 0; right: 0; top: 0; height: 404px; background: var(--hero); border-radius: 0 0 44px 44px; overflow: hidden; }
.plus .hero::before { content: ""; position: absolute; left: 50%; top: 150px; width: 560px; height: 560px; margin-left: -280px; border-radius: 50%; background: rgb(255 255 255 / .08); }
.plus .hero .duo { position: absolute; left: 50%; bottom: 14px; width: 344px; transform: translateX(-50%); }
.plus .kicker { position: absolute; left: 24px; right: 24px; top: 424px; }

.plus .kicker p { margin-top: 2px; color: var(--ink2); font-size: 15px; line-height: 20px; }
.plus .gl { position: absolute; z-index: 5; top: 62px; background: rgb(255 255 255 / .2); color: #fff; box-shadow: inset 0 0 0 1px rgb(255 255 255 / .28); }
.plus .close { left: 16px; } .plus .restore { right: 16px; font-size: 15px; }
.plus .feats { position: absolute; left: 16px; right: 16px; top: 498px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.plus .feats > div { background: var(--card); border-radius: 22px; padding: 14px 12px 13px; }
.plus .feats .ibox { width: 36px; height: 36px; border-radius: 12px; }
.plus .feats .ibox .ic { width: 20px; height: 20px; }
.plus .feats b { display: block; margin-top: 10px; font: 600 14px/18px var(--round); }
.plus .plans { position: absolute; left: 16px; right: 16px; top: 614px; display: grid; grid-template-columns: 1.15fr 1fr; gap: 8px; }
.plan { position: relative; border-radius: 24px; background: var(--card); padding: 16px; }
.plan.on { box-shadow: inset 0 0 0 2.5px var(--jade); }
.plan .nm { display: flex; align-items: center; justify-content: space-between; font: 600 15px/20px var(--round); }
.plan .rad { width: 22px; height: 22px; border-radius: 11px; box-shadow: inset 0 0 0 2px var(--fill2); display: grid; place-items: center; }
.plan.on .rad { background: var(--jade); box-shadow: none; color: var(--on-jade); }
.plan .rad .ic { width: 13px; height: 13px; }
.plan .pr { margin-top: 8px; font: 700 26px/30px var(--round); font-variant-numeric: tabular-nums; }
.plan .pr small { font: 600 14px var(--round); color: var(--ink2); }
.plan .nt { margin-top: 2px; font-size: 13px; line-height: 17px; color: var(--ink2); }
.plan .badge { position: absolute; top: -10px; left: 14px; height: 22px; padding: 0 9px; border-radius: 11px; background: var(--coral); color: #fff; font: 700 11px/22px var(--round); letter-spacing: .3px; }
/* Dark: notifications are dark glass, as in iOS */
.dark .noti { background: rgb(38 46 41 / .82); color: #F1F5F2; }
.dark.perm .mock .noti { background: var(--card); box-shadow: 0 14px 30px -10px rgb(0 0 0 / .5); }
.dark .noti .tag { color: #FF7A55; }
.dark .noti .when { color: rgb(235 245 239 / .5); }
.dark .noti .sub { color: rgb(235 245 239 / .7) !important; }
.dark.lock .nacts span { background: rgb(255 255 255 / .12); }
.dark.lock .nacts span.go { background: #34C08E; color: #04140D; }
</style>
</head>
<body>

<header class="board-head">
  <h1>SmartPill — rework</h1>
  <p>HTML prototype before Figma. iPhone 402 × 874, iOS 27 structure with SmartPill's own soft brand: SF Pro Rounded, the capsule as the shape for buttons, chips and the tab bar, one jade accent for "taken", coral for "due now", flat pastel pills instead of 3D renders. Icons are inline SVG built by <code>build.py</code>.</p>
</header>

<main class="board">

<!-- 01 · WELCOME -->
<figure class="slot">
  <figcaption><b>01</b> Welcome</figcaption>
  <div class="phone"><div class="screen welcome">
    <div class="status"><span class="num">9:41</span>{i:statusbar}</div>
    <div class="hero">
      <span style="position:absolute;left:26px;top:92px">{p:capsule:peach:p72}</span>
      <span style="position:absolute;left:164px;top:62px">{p:tablet:white:p56}</span>
      <span style="position:absolute;left:300px;top:96px">{p:softgel:butter:p72}</span>
      <span style="position:absolute;left:-14px;top:236px">{p:tablet:sky:p72}</span>
      <span style="position:absolute;left:322px;top:176px">{p:capsule:lilac:p72}</span>
      <span style="position:absolute;left:18px;top:392px">{p:softgel:mint:p56}</span>
      <span style="position:absolute;left:352px;top:330px">{p:tablet:rose:p56}</span>
      <img class="hero-girl" src="img/girl.png" alt="">
    </div>
    <div class="copy">
      <h1 class="lt">The right pill at the right time</h1>
      <p class="body i2">Reminders that ring through silent mode, and a simple record of what you took.</p>
    </div>
    <div class="cta">
      <button class="btn pri">Get started</button>
      <button class="btn ghost">I already use SmartPill</button>
    </div>
    <div class="home-ind"></div>
  </div></div>
</figure>

<!-- 02 · CRITICAL ALERTS -->
<figure class="slot">
  <figcaption><b>02</b> Critical alerts</figcaption>
  <div class="phone"><div class="screen perm">
    <div class="status"><span class="num">9:41</span>{i:statusbar}</div>
    <div class="content">
      <div class="mock">
        <div class="moon">{i:moon}Sleep focus on</div>
        <div class="noti">
          <div class="appicon">{p:capsule:white}</div>
          <div style="flex:1;min-width:0">
            <div style="display:flex"><span class="tag">{i:bell-alert}CRITICAL</span><span class="when">now</span></div>
            <div class="hl" style="margin-top:1px">Metformin 500 mg</div>
            <div class="sub" style="color:rgb(20 33 27 / .7)">1 tablet after lunch</div>
          </div>
        </div>
        <img class="hero-boy" src="img/boy.png" alt="">
      </div>
      <h1 class="t1">Reminders that get through</h1>
      <p class="body i2 lead">A missed reminder is a missed dose. Critical alerts sound even when your phone is on silent or in Focus.</p>
      <div class="pts">
        <div class="pt"><span class="ibox">{i:bell-ring}</span><div><div class="hl">Rings through silent and Focus</div><div class="sub i2">The way an alarm clock does.</div></div></div>
        <div class="pt"><span class="ibox">{i:sliders}</span><div><div class="hl">Only for doses you choose</div><div class="sub i2">Vitamins can stay quiet.</div></div></div>
        <div class="pt"><span class="ibox">{i:shield}</span><div><div class="hl">Off in one tap</div><div class="sub i2">Change it any time in Settings.</div></div></div>
      </div>
    </div>
    <div class="cta">
      <button class="btn pri">Allow critical alerts</button>
      <button class="btn ghost">Not now</button>
    </div>
    <div class="home-ind"></div>
  </div></div>
</figure>

<!-- 03 · PLUS -->
<figure class="slot">
  <figcaption><b>03</b> SmartPill Plus</figcaption>
  <div class="phone"><div class="screen plus">
    <div class="status light"><span class="num">9:41</span>{i:statusbar}</div>
    <div class="hero"><img class="duo" src="img/duo.png" alt=""></div>
    <div class="kicker"><h1 class="t1">SmartPill Plus</h1><p>Every medication, on your schedule.</p></div>
    <span class="gbtn gl close">{i:x:s20}</span>
    <span class="gbtn txt gl restore">Restore</span>
    <div class="feats">
      <div><span class="ibox">{i:infinity}</span><b>Unlimited medications</b></div>
      <div><span class="ibox">{i:image}</span><b>Your own photos</b></div>
      <div><span class="ibox">{i:repeat}</span><b>Flexible schedules</b></div>
    </div>
    <div class="plans">
      <div class="plan on"><span class="badge">SAVE 50%</span><div class="nm">Yearly<span class="rad">{i:check}</span></div><div class="pr">$17.99</div><div class="nt">3 days free, then $1.50 a month</div></div>
      <div class="plan"><div class="nm">Monthly<span class="rad"></span></div><div class="pr">$2.99</div><div class="nt">Cancel any time</div></div>
    </div>
    <div class="cta" style="bottom:34px">
      <button class="btn pri">Try 3 days free</button>
      <p class="c1 i2" style="text-align:center;margin-top:4px">We'll remind you a day before the trial ends.</p>
    </div>
    <div class="home-ind"></div>
  </div></div>
</figure>

<!-- 04 · ADD · WHAT -->
<figure class="slot">
  <figcaption><b>04</b> Add medication · what</figcaption>
  <div class="phone"><div class="screen add">
    <div class="status"><span class="num">9:41</span>{i:statusbar}</div>
    <div class="content">
      <div class="nav bar"><span class="gbtn">{i:x:s20}</span><div class="steps"><i class="on"></i><i></i><i></i></div><span style="width:44px"></span></div>
      <h1 class="t1" style="margin:8px 4px 0">New medication</h1>
      <div class="preview bg-mint">{p:tablet:white:p120}</div>
      <div class="card field"><div class="lbl">Name</div><div class="inp">Metformin<span class="caret"></span></div></div>
      <div class="two">
        <div class="card field"><div class="lbl">Strength</div><div class="inp num">500<span class="unit">mg</span></div></div>
        <div class="card field"><div class="lbl">Per dose</div><div class="inp num">1<span class="unit">tablet</span></div></div>
      </div>
      <div class="sec"><span class="t">Form</span></div>
      <div class="forms">
        <span class="on">{p:tablet:white:p36}Tablet</span>
        <span>{p:capsule:peach:p36}Capsule</span>
        <span>{p:softgel:butter:p36}Softgel</span>
        <span>{p:liquid:sky:p36}Liquid</span>
      </div>
      <div class="sec"><span class="t">Colour</span><span class="m">Helps you spot it</span></div>
      <div class="card swatches"><i class="on" style="background:#fff"></i><i style="background:#FFB591"></i><i style="background:#FFD84D"></i><i style="background:#7BD9B0"></i><i style="background:#8FCBFF"></i><i style="background:#B9AEFF"></i><i style="background:#FF9DB5"></i></div>
    </div>
    <div class="cta" style="bottom:34px"><button class="btn pri">Next</button></div>
    <div class="home-ind"></div>
  </div></div>
</figure>

<!-- 05 · ADD · WHEN -->
<figure class="slot">
  <figcaption><b>05</b> Add medication · when</figcaption>
  <div class="phone"><div class="screen add sched">
    <div class="status"><span class="num">9:41</span>{i:statusbar}</div>
    <div class="content">
      <div class="nav bar"><span class="gbtn">{i:chev-l:s20}</span><div class="steps"><i class="on"></i><i class="on"></i><i></i></div><span style="width:44px"></span></div>
      <div style="display:flex;align-items:center;gap:12px;margin:8px 4px 0"><span class="pbox bg-white" style="width:44px;height:44px;border-radius:15px">{p:tablet:white:p32}</span><h1 class="t1">When to take it</h1></div>
      <div class="seg" style="margin-top:18px"><span class="on">Every day</span><span>Some days</span><span>Every X hours</span></div>
      <div class="sec"><span class="t">Times</span></div>
      <div class="card times">
        <div class="row"><span class="tpill">08:00</span><div class="grow"></div><span class="stepper">{i:minus}<b>1 tablet</b>{i:plus}</span></div>
        <div class="row"><span class="tpill">14:00</span><div class="grow"></div><span class="stepper">{i:minus}<b>1 tablet</b>{i:plus}</span></div>
        <div class="row"><span class="addtime">+ Add time</span></div>
      </div>
      <div class="sec"><span class="t">With food</span></div>
      <div class="seg"><span>Before</span><span>With</span><span class="on">After</span><span>Any</span></div>
      <div class="card" style="margin-top:18px">
        <div class="row"><span class="ibox">{i:cal}</span><div class="grow"><div class="ttl" style="font-weight:400">Course</div></div><span class="val">Ongoing</span>{i:chev-r:chev}</div>
        <div class="row"><span class="ibox" style="background:var(--coral-soft);color:var(--coral)">{i:bell-alert}</span><div class="grow"><div class="ttl" style="font-weight:400">Critical alert</div><div class="meta">Rings through silent</div></div><span class="sw on"></span></div>
        <div class="row"><span class="ibox">{i:box}</span><div class="grow"><div class="ttl" style="font-weight:400">Refill reminder</div><div class="meta">When 10 tablets are left</div></div><span class="sw on"></span></div>
      </div>
    </div>
    <div class="cta" style="bottom:34px"><button class="btn pri">Save</button></div>
    <div class="home-ind"></div>
  </div></div>
</figure>

<!-- 06 · TODAY -->
<figure class="slot">
  <figcaption><b>06</b> Today</figcaption>
  <div class="phone"><div class="screen today">
    <div class="status"><span class="num">14:00</span>{i:statusbar}</div>
    <div class="content">
      <div class="hdr" style="margin-top:14px"><div><div class="d">Monday, 9 November</div><h1 class="lt">Today</h1></div><span class="gbtn">{i:gear:s22}</span></div>
      <div class="card sum">
        <div class="ring">
          <svg viewBox="0 0 84 84"><circle cx="42" cy="42" r="36" fill="none" stroke="var(--fill)" stroke-width="10"/><circle cx="42" cy="42" r="36" fill="none" stroke="var(--jade)" stroke-width="10" stroke-linecap="round" stroke-dasharray="90.5 226.2"/></svg>
          <div class="lbl"><div>2<span class="i3">/5</span><small>taken</small></div></div>
        </div>
        <div class="txt">
          <div class="big">One due now,<br>two this evening</div>
          <span class="chip jade">{i:check}12 days on track</span>
        </div>
      </div>

      <div class="sec">{i:sunrise:s18}<span class="t">Morning</span><span class="m">08:00</span></div>
      <div class="card dose">
        <div class="row"><span class="pbox bg-butter">{p:softgel:butter}</span><div class="grow"><div class="ttl">Vitamin D3</div><div class="meta">2000 IU · 1 softgel</div></div><span class="taken-t num">08:04</span><span class="done">{i:check}</span></div>
        <div class="row"><span class="pbox bg-peach">{p:softgel:peach}</span><div class="grow"><div class="ttl">Omega-3</div><div class="meta">1000 mg · 2 softgels</div></div><span class="taken-t num">08:04</span><span class="done">{i:check}</span></div>
      </div>

      <div class="sec">{i:sun:s18}<span class="t coral">Now</span><span class="m">14:00</span></div>
      <div class="now">
        <div class="top"><span class="pbox bg-white">{p:tablet:white}</span><div class="grow" style="flex:1"><div class="hl">Metformin</div><div class="sub i2">500 mg · after lunch</div></div><span class="chip coral">{i:bell-alert}Critical</span></div>
        <div class="acts"><button class="btn sec2">{i:snooze:s20}10 min</button><button class="btn pri">{i:check:s20}Take</button></div>
      </div>

      <div class="sec">{i:moon:s18}<span class="t">Evening</span><span class="m">21:00</span></div>
      <div class="card dose">
        <div class="row"><span class="pbox bg-sky">{p:tablet:sky}</span><div class="grow"><div class="ttl">Atorvastatin</div><div class="meta">20 mg · 1 tablet</div></div><span class="todo"></span></div>
        <div class="row"><span class="pbox bg-lilac">{p:capsule:lilac}</span><div class="grow"><div class="ttl">Magnesium</div><div class="meta">400 mg · 1 capsule</div></div><span class="todo"></span></div>
      </div>
    </div>
    <div class="scrim-b"></div>
    <nav class="tabbar"><span class="tb on" data-tab="today"><i>{i:today}</i>Today</span><span class="tb" data-tab="meds"><i>{i:meds}</i>Medications</span><span class="tb" data-tab="history"><i>{i:history}</i>History</span><span class="add">{i:plus}</span></nav>
    <div class="home-ind"></div>
  </div></div>
</figure>

<!-- 07 · LOCK SCREEN -->
<figure class="slot">
  <figcaption><b>07</b> Critical alert on the lock screen</figcaption>
  <div class="phone"><div class="screen lock">
    <div class="wall"></div>
    <div class="status light"><span></span>{i:statusbar}</div>
    <div class="lk">{i:lock:s20}</div>
    <div class="date">Monday 9 November</div>
    <div class="clock num">14:00</div>
    <div class="stack">
      <div class="noti big">
        <div class="head">
          <div class="appicon">{p:capsule:white}</div>
          <div style="flex:1;min-width:0">
            <div style="display:flex"><span class="tag">{i:bell-alert}CRITICAL · SMARTPILL</span><span class="when">now</span></div>
            <div class="ttl">Time for Metformin</div>
            <div class="msg">500 mg · 1 tablet after lunch</div>
          </div>
        </div>
        <div class="nacts"><span>{i:snooze}Snooze 10 min</span><span class="go">{i:check}Taken</span></div>
      </div>
      <div class="noti ghost">
        <div class="appicon">{p:capsule:white}</div>
        <div style="flex:1;min-width:0"><div style="display:flex"><span class="ttl">SmartPill</span><span class="when">08:04</span></div><div class="msg">Morning done: Vitamin D3, Omega-3</div></div>
      </div>
    </div>
    <div class="qa"><span>{i:torch:s22}</span><span>{i:camera:s22}</span></div>
    <div class="home-ind light"></div>
  </div></div>
</figure>

<!-- 08 · MEDICATION -->
<figure class="slot">
  <figcaption><b>08</b> Medication</figcaption>
  <div class="phone"><div class="screen det">
    <div class="status"><span class="num">9:41</span>{i:statusbar}</div>
    <div class="content">
      <div class="nav"><span class="gbtn">{i:chev-l:s20}</span><span class="gbtn txt">Edit</span></div>
      <div class="head">
        <span class="pbox bg-white">{p:tablet:white}</span>
        <h1 class="t1">Metformin</h1>
        <p class="sub i2">500 mg · 1 tablet · after meal</p>
        <div class="chips"><span class="chip">{i:clock}08:00 · 14:00</span><span class="chip coral">{i:bell-alert}Critical</span></div>
      </div>
      <div class="stats">
        <div class="card stat"><div class="v jade">96%</div><div class="k">taken on time, 30 days</div><div class="bar"><i style="width:96%;background:var(--jade)"></i></div></div>
        <div class="card stat"><div class="v">28</div><div class="k">tablets left · 14 days</div><div class="bar"><i style="width:35%;background:var(--ink2)"></i></div></div>
      </div>
      <div class="card" style="margin-top:10px;padding:16px">
        <div style="display:flex;justify-content:space-between"><span class="cap">Last 30 days</span><span class="fn i2">58 of 60 doses</span></div>
        <div class="dots">
          <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i class="p"></i><i></i><i></i><i></i><i></i><i></i><i></i>
          <i></i><i></i><i></i><i></i><i class="m"></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i class="p"></i>
        </div>
      </div>
      <div class="card" style="margin-top:10px">
        <div class="row"><span class="ibox">{i:box}</span><div class="grow"><div class="ttl" style="font-weight:400">Refill reminder</div><div class="meta">On 19 November, 10 left</div></div>{i:chev-r:chev}</div>
        <div class="row"><span class="ibox">{i:camera}</span><div class="grow"><div class="ttl" style="font-weight:400">Photo of the box</div><div class="meta">So you buy the right one</div></div>{i:chev-r:chev}</div>
        <div class="row"><span class="ibox">{i:note}</span><div class="grow"><div class="ttl" style="font-weight:400">Note</div><div class="meta">Started in October, check sugar weekly</div></div>{i:chev-r:chev}</div>
      </div>
    </div>
    <div class="home-ind"></div>
  </div></div>
</figure>

<!-- 09 · HISTORY -->
<figure class="slot">
  <figcaption><b>09</b> History</figcaption>
  <div class="phone"><div class="screen hist">
    <div class="status"><span class="num">9:41</span>{i:statusbar}</div>
    <div class="content">
      <div class="nav" style="justify-content:flex-end"><span class="gbtn">{i:doc-out:s22}</span></div>
      <h1 class="lt" style="margin-top:2px">History</h1>
      <div style="display:flex;align-items:baseline;gap:8px;margin:12px 4px 0"><span class="t1 jade num">95%</span><span class="sub i2">of doses on time in November</span></div>
      <div class="card cal" style="margin-top:14px">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0 6px 12px"><span class="t3">November</span><span style="display:flex;gap:18px;color:var(--jade)">{i:chev-l:s20}{i:chev-r:s20}</span></div>
        <div class="wk"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>
        <div class="grid">
          <span></span><span></span><span></span><span></span><span></span><span></span><span><b class="ok">1</b></span>
          <span><b class="ok">2</b></span><span><b class="ok">3</b></span><span><b class="part">4</b></span><span><b class="ok">5</b></span><span><b class="ok">6</b></span><span><b class="ok">7</b></span><span><b class="part">8</b></span>
          <span><b class="part today">9</b></span><span><b class="fut">10</b></span><span><b class="fut">11</b></span><span><b class="fut">12</b></span><span><b class="fut">13</b></span><span><b class="fut">14</b></span><span><b class="fut">15</b></span>
        </div>
        <div class="legend"><span><i style="background:var(--jade)"></i>All taken</span><span><i style="background:var(--jade-soft);box-shadow:inset 0 0 0 1.5px var(--jade)"></i>Some</span><span><i style="background:var(--coral-soft);box-shadow:inset 0 0 0 1.5px var(--coral)"></i>Missed</span></div>
      </div>
      <div class="sec"><span class="t">Sunday, 8 November</span><span class="m">4 of 5</span></div>
      <div class="card">
        <div class="row"><span class="tm">08:02</span><span class="pbox bg-butter" style="width:40px;height:40px;border-radius:14px">{p:softgel:butter:p28}</span><div class="grow"><div class="ttl">Vitamin D3</div><div class="meta">Taken on time</div></div><span class="done">{i:check}</span></div>
        <div class="row"><span class="tm">14:26</span><span class="pbox bg-white" style="width:40px;height:40px;border-radius:14px">{p:tablet:white:p28}</span><div class="grow"><div class="ttl">Metformin</div><div class="meta">26 min late</div></div><span class="done">{i:check}</span></div>
        <div class="row"><span class="tm">21:00</span><span class="pbox bg-sky" style="width:40px;height:40px;border-radius:14px">{p:tablet:sky:p28}</span><div class="grow"><div class="ttl">Atorvastatin</div><div class="meta coral">Skipped · ran out</div></div><span class="done" style="background:var(--coral-soft);color:var(--coral)">{i:x:s16}</span></div>
      </div>
    </div>
    <div class="scrim-b"></div>
    <nav class="tabbar"><span class="tb" data-tab="today"><i>{i:today}</i>Today</span><span class="tb" data-tab="meds"><i>{i:meds}</i>Medications</span><span class="tb on" data-tab="history"><i>{i:history}</i>History</span><span class="add">{i:plus}</span></nav>
    <div class="home-ind"></div>
  </div></div>
</figure>

</main>
</body>
</html>
