var bad_bad_key = true;

var languages = {
  ru: "\"№;:?ёйцукенгшщзхъфывапролджэячсмитьбю.,",
  en: "@#$^&`qwertyuiop[]asdfghjkl;'zxcvbnm,./?"
};

var directions = {
  ru: 'en',
  en: 'ru'
};

var concatenation = '';

for (var index in languages) {
  concatenation += languages[index];
}

var detectLanguage = function (s) {

  var statistic = {};

  for (var index in languages) {
    statistic[index] = 0;
    for (var i = 0, len = s.length; i < len; i++) {
      if (concatenation.indexOf(s[i]) > -1) {
        if (languages[index].indexOf(s[i]) > -1) {
          statistic[index]++;
        }
      }
    }
  }

  var result;
  var result_count = 0;
  for (var index in statistic) {
    if (statistic[index] >= result_count) {
      result = index;
      result_count = statistic[index];
    }
  }

  return result;
};

var encodeText = function (s) {
  var result = '';
  var from = detectLanguage(s);
  var to = directions[from];
  var letterRegexp = /[a-zA-Zа-яА-Я]/;

  for (var i = 0, len = s.length; i < len; i++) {

    if (languages[from].indexOf(s[i].toLowerCase()) > -1) {

      for (var index in languages[from]) {
        var temp = {};
        temp[languages[from][index]] = languages[to][index];

        if (!temp[languages[from][index].toUpperCase()])
          temp[languages[from][index].toUpperCase()] = languages[to][index].toUpperCase();

        for (var char_from in temp) {
          if (s[i].indexOf(char_from) > -1) {
            result += s[i].replace(new RegExp(
              (!letterRegexp.exec(char_from) ? '\\' : '') + char_from, 'g'),
              temp[char_from]
            );

            break;
          }
        }

      }

    } else {

      result += s[i];

    }

  }

  return result;
};

var getSelectionText = function () {
  var text = "";
  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
    text = document.selection.createRange().text;
  }
  return text;
};

var encodeSelect = function () {
  var $focus = $(':focus');

  if ($focus.is('textarea') || $focus.is('input')) {
    replaceSelectedTextInTextarea($focus.get(0), encodeText(getSelectionText()));
  } else {
    replaceSelectedTextInDiv(encodeText(getSelectionText()));
    placeCaretAtEnd($focus.get(0));
  }
};

var encodeAll = function () {
  var $focus = $(':focus');

  if ($focus.length) {
    if ($focus.is('textarea') || $focus.is('input')) {
      $focus.get(0).select();
    } else {
      selectAll($focus.get(0));
    }

    encodeSelect();
  }
};

chrome.extension.onMessage.addListener(function (info, sender, sendResponse) {
  switch (info.action) {
    case 'encodeSelect':
      encodeSelect();
      break;
    case 'encodeAll':
      encodeAll();
      break;
    default:
      break;
  }
});
