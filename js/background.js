function getCurrentTab(__callback) {
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
    __callback(tabs[0]);
  });
}

var checkInjection = function () {
  chrome.tabs.executeScript({
    file: '/js/check.js'
  }, function (p) {
    if (!p[0]) {
      var options = {
        type: "basic",
        title: 'Обновите страницу',
        iconUrl: '/img/128.png',
        message: 'Вы только что установили расширение и на этой странице оно ещё не работает.',
        contextMessage: 'Обновите страницу'
      };

      chrome.notifications.create('bbk', options, function (notification) {
        setTimeout(function () {
          chrome.notifications.clear(notification, function () {

          });
        }, 5000);
      })

    }
  });
};

chrome.notifications.onClicked.addListener(function (notification) {

  getCurrentTab(function (tab) {

    chrome.tabs.executeScript({
      code: 'location.reload()'
    });

  });

});

chrome.commands.onCommand.addListener(function (command) {
  getCurrentTab(function (tab) {

    checkInjection();
    chrome.tabs.sendMessage(tab.id, {action: 'encodeAll'}, function () {
    })

  });
});


chrome.contextMenus.create(
  {
    title: 'Сделать понятно',
    contexts: [
      'selection'
    ],
    onclick: function (info, tab) {

      checkInjection();
      chrome.tabs.sendMessage(tab.id, {action: 'encodeSelect'}, function () {
      })

    }
  }
);
