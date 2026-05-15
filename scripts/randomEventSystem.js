var randomEventSystem = (function() {

  function calcTheftChance() {
    var chance = BASE_THEFT_CHANCE;
    if (gameState.hasSecurityGuard) {
      chance -= SECURITY_THEFT_REDUCTION;
    }
    return Math.max(0, Math.min(1, chance));
  }

  function calcFireChance() {
    var chance = BASE_FIRE_CHANCE;
    if (gameState.hasSecurityGuard) {
      chance -= SECURITY_FIRE_REDUCTION;
    }
    return Math.max(0, Math.min(1, chance));
  }

  function rollEvents() {
    var theftChance = calcTheftChance();
    var fireChance = calcFireChance();
    var theftOccurred = Math.random() < theftChance;
    var fireOccurred = Math.random() < fireChance;
    return {
      theftOccurred: theftOccurred,
      fireOccurred: fireOccurred,
      theftChance: theftChance,
      fireChance: fireChance,
      hasSecurity: gameState.hasSecurityGuard,
      hasInsurance: gameState.hasInsurance
    };
  }

  function calcEventLosses(events) {
    var items = gameState.collectedItems.slice();
    var stolenItems = [];
    var burnedItems = [];
    var stolenValue = 0;
    var burnedValue = 0;

    if (events.theftOccurred && items.length > 0) {
      var stealCount = Math.max(1, Math.floor(items.length * 0.2));
      stealCount = Math.min(stealCount, items.length);
      var indices = [];
      while (indices.length < stealCount) {
        var idx = Math.floor(Math.random() * items.length);
        if (indices.indexOf(idx) === -1) {
          indices.push(idx);
        }
      }
      indices.sort(function(a, b) { return b - a; });
      indices.forEach(function(idx) {
        stolenItems.push(items[idx]);
        stolenValue += items[idx].value;
      });
    }

    if (events.fireOccurred && items.length > 0) {
      var remaining = items.filter(function(it) {
        return stolenItems.indexOf(it) === -1;
      });
      var burnCount = Math.max(1, Math.floor(remaining.length * 0.15));
      burnCount = Math.min(burnCount, remaining.length);
      var burnIndices = [];
      while (burnIndices.length < burnCount) {
        var bIdx = Math.floor(Math.random() * remaining.length);
        if (burnIndices.indexOf(bIdx) === -1) {
          burnIndices.push(bIdx);
        }
      }
      burnIndices.forEach(function(idx) {
        burnedItems.push(remaining[idx]);
        burnedValue += remaining[idx].value;
      });
    }

    var totalLoss = stolenValue + burnedValue;
    var insuranceComp = 0;

    if (events.hasInsurance && totalLoss > 0) {
      insuranceComp = Math.floor(stolenValue * INSURANCE_THEFT_COMP + burnedValue * INSURANCE_FIRE_COMP);
    }

    return {
      stolenItems: stolenItems,
      burnedItems: burnedItems,
      stolenValue: stolenValue,
      burnedValue: burnedValue,
      totalLoss: totalLoss,
      insuranceCompensation: insuranceComp,
      netLoss: totalLoss - insuranceComp
    };
  }

  function applyLosses(losses) {
    var toRemove = losses.stolenItems.concat(losses.burnedItems);
    toRemove.forEach(function(item) {
      var idx = gameState.collectedItems.indexOf(item);
      if (idx !== -1) {
        gameState.collectedItems.splice(idx, 1);
        gameState.collectedValues.splice(idx, 1);
      }
    });

    if (losses.insuranceCompensation > 0) {
      gameState.money += losses.insuranceCompensation;
    }
  }

  function renderRandomEventContent(events, losses) {
    var itemsHtml = '';

    if (events.hasSecurity) {
      itemsHtml += '<div class="event-status-item security-active">';
      itemsHtml += '<span class="event-status-icon">🛡️</span>';
      itemsHtml += '<span>保安服务已激活 — 失窃概率 ' + Math.floor(events.theftChance * 100) + '% / 失火概率 ' + Math.floor(events.fireChance * 100) + '%</span>';
      itemsHtml += '</div>';
    } else {
      itemsHtml += '<div class="event-status-item security-inactive">';
      itemsHtml += '<span class="event-status-icon">⚠️</span>';
      itemsHtml += '<span>未购买保安 — 失窃概率 ' + Math.floor(events.theftChance * 100) + '% / 失火概率 ' + Math.floor(events.fireChance * 100) + '%</span>';
      itemsHtml += '</div>';
    }

    if (events.theftOccurred) {
      itemsHtml += '<div class="event-loss-card theft">';
      itemsHtml += '<div class="event-loss-header">';
      itemsHtml += '<span class="event-loss-icon">🚨</span>';
      itemsHtml += '<span class="event-loss-title">失窃事件！</span>';
      itemsHtml += '</div>';
      itemsHtml += '<div class="event-loss-desc">你的仓库遭到入侵，' + losses.stolenItems.length + ' 件藏品被盗！</div>';
      itemsHtml += '<div class="event-loss-items">';
      losses.stolenItems.forEach(function(item) {
        itemsHtml += '<div class="event-item-badge ' + item.rarity + '">' + getItemName(item) + '</div>';
      });
      itemsHtml += '</div>';
      itemsHtml += '<div class="event-loss-value">损失估值：¥' + losses.stolenValue.toLocaleString() + '</div>';
      itemsHtml += '</div>';
    } else {
      itemsHtml += '<div class="event-safe-card">';
      itemsHtml += '<span class="event-safe-icon">✅</span>';
      itemsHtml += '<span>仓库安全，未发生失窃事件</span>';
      itemsHtml += '</div>';
    }

    if (events.fireOccurred) {
      itemsHtml += '<div class="event-loss-card fire">';
      itemsHtml += '<div class="event-loss-header">';
      itemsHtml += '<span class="event-loss-icon">🔥</span>';
      itemsHtml += '<span class="event-loss-title">失火事件！</span>';
      itemsHtml += '</div>';
      itemsHtml += '<div class="event-loss-desc">仓库突发火灾，' + losses.burnedItems.length + ' 件藏品被烧毁！</div>';
      itemsHtml += '<div class="event-loss-items">';
      losses.burnedItems.forEach(function(item) {
        itemsHtml += '<div class="event-item-badge ' + item.rarity + '">' + getItemName(item) + '</div>';
      });
      itemsHtml += '</div>';
      itemsHtml += '<div class="event-loss-value">损失估值：¥' + losses.burnedValue.toLocaleString() + '</div>';
      itemsHtml += '</div>';
    } else {
      itemsHtml += '<div class="event-safe-card">';
      itemsHtml += '<span class="event-safe-icon">✅</span>';
      itemsHtml += '<span>仓库安全，未发生失火事件</span>';
      itemsHtml += '</div>';
    }

    if (losses.insuranceCompensation > 0) {
      itemsHtml += '<div class="event-insurance-card">';
      itemsHtml += '<div class="event-insurance-header">';
      itemsHtml += '<span class="event-insurance-icon">📋</span>';
      itemsHtml += '<span class="event-insurance-title">保险赔付</span>';
      itemsHtml += '</div>';
      itemsHtml += '<div class="event-insurance-desc">你的保险生效，获得赔付：</div>';
      itemsHtml += '<div class="event-insurance-amount">+¥' + losses.insuranceCompensation.toLocaleString() + '</div>';
      itemsHtml += '</div>';
    }

    if (losses.totalLoss > 0) {
      itemsHtml += '<div class="event-summary">';
      itemsHtml += '<div class="event-summary-row">';
      itemsHtml += '<span>总损失</span>';
      itemsHtml += '<span class="loss">-¥' + losses.totalLoss.toLocaleString() + '</span>';
      itemsHtml += '</div>';
      if (losses.insuranceCompensation > 0) {
        itemsHtml += '<div class="event-summary-row">';
        itemsHtml += '<span>保险赔付</span>';
        itemsHtml += '<span class="gain">+¥' + losses.insuranceCompensation.toLocaleString() + '</span>';
        itemsHtml += '</div>';
        itemsHtml += '<div class="event-summary-row final">';
        itemsHtml += '<span>净损失</span>';
        itemsHtml += '<span class="loss">-¥' + losses.netLoss.toLocaleString() + '</span>';
        itemsHtml += '</div>';
      }
      itemsHtml += '</div>';
    }

    if (!events.theftOccurred && !events.fireOccurred) {
      itemsHtml += '<div class="event-all-safe">';
      itemsHtml += '<div class="event-all-safe-icon">🎉</div>';
      itemsHtml += '<div class="event-all-safe-text">风平浪静！你的藏品全部安全！</div>';
      itemsHtml += '</div>';
    }

    return itemsHtml;
  }

  function getItemName(item) {
    if (!item) return '未知';
    var base = collectionItems.find(function(c) { return c.src === item.src; });
    var rarityName = item.rarity === 'gold' ? '金色' : item.rarity === 'red' ? '红色' : '普通';
    if (base) {
      var parts = base.src.split('/').pop().replace(/\.\w+$/, '').split(' ');
      return rarityName + ' ' + (parts.length > 1 ? parts[1] : parts[0]);
    }
    return rarityName + ' 藏品';
  }

  function showRandomEvents(callback) {
    var events = rollEvents();
    var losses = calcEventLosses(events);
    var content = renderRandomEventContent(events, losses);

    var overlay = document.getElementById('randomEventOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'randomEventOverlay';
      overlay.className = 'random-event-overlay';
      document.body.appendChild(overlay);
    }

    var title = '⚠️ 风险评估';
    if (events.theftOccurred || events.fireOccurred) {
      title = '🚨 突发事件！';
    }

    overlay.innerHTML =
      '<div class="random-event-modal">' +
        '<div class="random-event-header">' +
          '<div class="random-event-title">' + title + '</div>' +
          '<div class="random-event-subtitle">仓库安全检查结果</div>' +
        '</div>' +
        '<div class="random-event-body">' +
          content +
        '</div>' +
        '<div class="random-event-footer">' +
          '<button class="btn btn-primary btn-lg" id="btnEventConfirm">' +
            (events.theftOccurred || events.fireOccurred ? '确认损失' : '继续') +
          '</button>' +
        '</div>' +
      '</div>';

    overlay.classList.add('show');

    document.getElementById('btnEventConfirm').onclick = function() {
      if (events.theftOccurred || events.fireOccurred) {
        applyLosses(losses);
      }
      overlay.classList.remove('show');
      if (callback) callback();
    };
  }

  return {
    rollEvents: rollEvents,
    calcEventLosses: calcEventLosses,
    applyLosses: applyLosses,
    showRandomEvents: showRandomEvents,
    renderRandomEventContent: renderRandomEventContent,
    getItemName: getItemName
  };
})();
