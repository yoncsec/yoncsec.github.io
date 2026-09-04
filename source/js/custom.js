/* ============================================
 * Yoncsec Blog - Ultra Custom JS
 * 粒子背景 + Matrix代码雨 + 3D卡片 + 滚动揭示
 * ============================================ */

// === 控制台欢迎 ===
console.log(
  '%c Yoncsec Blog %c https://yoncsec.github.io ',
  'background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 6px 12px; border-radius: 4px 0 0 4px; font-size: 14px; font-weight: bold;',
  'background: #0f0f1e; color: #a5b4fc; padding: 6px 12px; border-radius: 0 4px 4px 0; font-size: 14px;'
);
console.log('%c\n  ██    ██  █████  ███████  ██████  ██   ██ \n  ██    ██ ██   ██ ██      ██    ██ ██  ██  \n  ██    ██ ███████ ███████ ██    ██ █████   \n  ██    ██ ██   ██      ██ ██    ██ ██  ██  \n   ██████  ██   ██ ███████  ██████  ██   ██ \n\n  Welcome to Yoncsec Blog\n', 'color: #8b5cf6; font-size: 11px; line-height: 1.2;');

$(function () {

  // ========================================
  // 1. 粒子网络背景
  // ========================================
  var canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  document.body.insertBefore(canvas, document.body.firstChild);

  var ctx = canvas.getContext('2d');
  var particles = [];
  var mouse = { x: null, y: null, radius: 150 };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  var particleCount = Math.min(80, Math.floor(window.innerWidth / 18));
  for (var i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 0.5,
      color: ['99,102,241', '139,92,246', '168,85,247', '236,72,153'][Math.floor(Math.random() * 4)]
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx = -p.dx;
      if (p.y < 0 || p.y > canvas.height) p.dy = -p.dy;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.color + ', 0.6)';
      ctx.fill();

      // 连线
      for (var j = i + 1; j < particles.length; j++) {
        var p2 = particles[j];
        var distX = p.x - p2.x;
        var distY = p.y - p2.y;
        var dist = Math.sqrt(distX * distX + distY * distY);
        if (dist < 120) {
          var alpha = (1 - dist / 120) * 0.3;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(' + p.color + ', ' + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // 鼠标交互
      if (mouse.x !== null) {
        var mdx = p.x - mouse.x;
        var mdy = p.y - mouse.y;
        var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouse.radius) {
          var force = (mouse.radius - mdist) / mouse.radius;
          p.x += (mdx / mdist) * force * 2;
          p.y += (mdy / mdist) * force * 2;
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseout', function () {
    mouse.x = null;
    mouse.y = null;
  });

  // ========================================
  // 2. Matrix 代码雨 (Banner 区域)
  // ========================================
  var banner = document.getElementById('banner');
  if (banner) {
    var mCanvas = document.createElement('canvas');
    mCanvas.id = 'matrix-canvas';
    banner.appendChild(mCanvas);
    var mCtx = mCanvas.getContext('2d');

    function resizeMatrix() {
      mCanvas.width = banner.offsetWidth;
      mCanvas.height = banner.offsetHeight;
    }
    resizeMatrix();
    window.addEventListener('resize', resizeMatrix);

    var chars = '01<>{}/[];:()$#%=+-*ABCDEF0123456789';
    var fontSize = 14;
    var columns = Math.floor(mCanvas.width / fontSize);
    var drops = [];
    for (var i = 0; i < columns; i++) {
      drops[i] = Math.random() * mCanvas.height / fontSize;
    }

    function drawMatrix() {
      mCtx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      mCtx.fillRect(0, 0, mCanvas.width, mCanvas.height);
      mCtx.fillStyle = '#8b5cf6';
      mCtx.font = fontSize + 'px monospace';
      for (var i = 0; i < drops.length; i++) {
        var text = chars[Math.floor(Math.random() * chars.length)];
        var y = drops[i] * fontSize;
        mCtx.fillStyle = 'rgba(139, 92, 246, ' + (Math.random() * 0.3 + 0.2) + ')';
        mCtx.fillText(text, i * fontSize, y);
        if (y > mCanvas.height && Math.random() > 0.985) {
          drops[i] = 0;
        }
        drops[i] += 0.6;
      }
      setTimeout(function () {
        requestAnimationFrame(drawMatrix);
      }, 80);
    }
    drawMatrix();
  }

  // ========================================
  // 3. 霓虹星尘鼠标特效
  // ========================================
  var sparkCanvas = document.createElement('canvas');
  sparkCanvas.id = 'spark-canvas';
  sparkCanvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9998;';
  document.body.appendChild(sparkCanvas);
  var sCtx = sparkCanvas.getContext('2d');

  function resizeSpark() {
    sparkCanvas.width = window.innerWidth;
    sparkCanvas.height = window.innerHeight;
  }
  resizeSpark();
  window.addEventListener('resize', resizeSpark);

  var sparkles = [];
  var sparkColors = [
    '#818cf8', '#a78bfa', '#c084fc', '#e879f9',
    '#f0abfc', '#f472b6', '#67e8f9', '#a5f3fc'
  ];

  function createSparkle(x, y) {
    var angle = Math.random() * Math.PI * 2;
    var speed = Math.random() * 1.5 + 0.3;
    return {
      x: x, y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 2.5 + 0.5,
      color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
      life: 1,
      decay: Math.random() * 0.02 + 0.012
    };
  }

  var mouseX = 0, mouseY = 0, canSpawn = false;
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    canSpawn = true;
  });
  document.addEventListener('mouseout', function () { canSpawn = false; });

  function drawSparkles() {
    sCtx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);

    // 持续生成星尘
    if (canSpawn) {
      for (var k = 0; k < 1; k++) {
        sparkles.push(createSparkle(mouseX + (Math.random() - 0.5) * 10, mouseY + (Math.random() - 0.5) * 10));
      }
    }

    // 绘制和更新星尘
    for (var i = sparkles.length - 1; i >= 0; i--) {
      var s = sparkles[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.02; // 轻微重力
      s.life -= s.decay;

      if (s.life <= 0) {
        sparkles.splice(i, 1);
        continue;
      }

      sCtx.beginPath();
      sCtx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
      sCtx.fillStyle = s.color.replace(')', ', ' + s.life + ')').replace('rgb', 'rgba');
      sCtx.fill();

      // 发光效果
      if (s.life > 0.5) {
        sCtx.beginPath();
        sCtx.arc(s.x, s.y, s.size * s.life * 1.2, 0, Math.PI * 2);
        sCtx.fillStyle = s.color.replace(')', ', ' + (s.life * 0.3) + ')').replace('rgb', 'rgba');
        sCtx.fill();
      }
    }

    // 限制粒子数量
    if (sparkles.length > 80) {
      sparkles.splice(0, sparkles.length - 80);
    }

    requestAnimationFrame(drawSparkles);
  }
  drawSparkles();

  // ========================================
  // 4. 阅读进度条
  // ========================================
  if ($('.post-content').length > 0) {
    var $progress = $('<div id="reading-progress"></div>').css({
      position: 'fixed',
      top: '0', left: '0',
      height: '3px', width: '0%',
      background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
      boxShadow: '0 0 8px rgba(139, 92, 246, 0.5)',
      zIndex: '9999',
      transition: 'width 0.1s ease'
    });
    $('body').append($progress);

    $(window).on('scroll', function () {
      var scrollTop = $(this).scrollTop();
      var docHeight = $(document).height();
      var winHeight = $(this).height();
      var scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
      $progress.css('width', scrollPercent + '%');
    });
  }

  // ========================================
  // 5. 滚动揭示动画
  // ========================================
  var revealElements = document.querySelectorAll('.post-content > *');
  revealElements.forEach(function (el) {
    el.classList.add('reveal');
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, index) {
      if (entry.isIntersecting) {
        setTimeout(function () {
          entry.target.classList.add('revealed');
        }, index * 30);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(function (el) {
    observer.observe(el);
  });

  // ========================================
  // 6. 卡片 3D 倾斜效果
  // ========================================
  $('.index-card').on('mousemove', function (e) {
    var card = $(this);
    var x = e.clientX - card.offset().left;
    var y = e.clientY - card.offset().top;
    var centerX = card.outerWidth() / 2;
    var centerY = card.outerHeight() / 2;
    var rotateX = (centerY - y) / centerY * 5;
    var rotateY = (x - centerX) / centerX * 5;
    card.css('transform', 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-8px) scale(1.01)');
  }).on('mouseleave', function () {
    $(this).css('transform', '');
  });

  // ========================================
  // 7. 图片渐入
  // ========================================
  $('img').on('load', function () {
    $(this).css({ opacity: 0 }).animate({ opacity: 1 }, 500);
  });

  // ========================================
  // 8. 平滑返回顶部
  // ========================================
  $('#scroll-top-button').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 500);
  });

  // ========================================
  // 9. 页脚运行时间
  // ========================================
  var footerInner = document.querySelector('.footer-inner');
  if (footerInner) {
    var runtimeSpan = document.createElement('span');
    runtimeSpan.id = 'runtime_span';
    runtimeSpan.style.cssText = 'margin-left:12px;font-size:13px;';
    footerInner.appendChild(runtimeSpan);

    var startDate = new Date('2026-07-21 00:00:00');
    function updateRuntime() {
      var now = new Date();
      var diff = now - startDate;
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var minutes = Math.floor((diff % 3600000) / 60000);
      var seconds = Math.floor((diff % 60000) / 1000);
      runtimeSpan.textContent = '🚀 已运行 ' + days + ' 天 ' +
        (hours < 10 ? '0' : '') + hours + ' 时 ' +
        (minutes < 10 ? '0' : '') + minutes + ' 分 ' +
        (seconds < 10 ? '0' : '') + seconds + ' 秒';
    }
    updateRuntime();
    setInterval(updateRuntime, 1000);
  }

  // ========================================
  // 10. 标签页切换标题动画
  // ========================================
  var originalTitle = document.title;
  var titleTimer = null;
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      document.title = '🥷 别走，回来看看 Yoncsec Blog ～';
    } else {
      document.title = '🎯 欢迎回来！Yoncsec Blog';
      if (titleTimer) clearTimeout(titleTimer);
      titleTimer = setTimeout(function () {
        document.title = originalTitle;
      }, 2500);
    }
  });

  // ========================================
  // 11. 评论区增强（参考 txtmix.com 风格）
  // ========================================
  var commentsEl = document.getElementById('comments');
  if (commentsEl && commentsEl.children.length) {
    // 引导文案
    var head = document.createElement('div');
    head.className = 'comments-intro';
    head.innerHTML =
      '<h2 class="comments-intro-title">💬 参与讨论</h2>' +
      '<p class="comments-intro-text">使用 GitHub 账号登录即可评论。欢迎补充实战细节、提出异议、分享踩坑经验。</p>';
    commentsEl.insertBefore(head, commentsEl.firstChild);

    // 懒加载：滚动到评论区可见才让 giscus 脚本执行
    // Fluid 在 DOMContentLoaded 时注入 giscus script，这里延迟到可见时再注入
    var giscusMount = commentsEl.querySelector('.giscus, #giscus-container, [class*="giscus"]');
    if (giscusMount && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            io.disconnect();
            commentsEl.classList.add('comments-visible');
          }
        });
      }, { rootMargin: '200px' });
      io.observe(commentsEl);
    }
  }

});
