(function () {

  var blacklist = ['art.kkk3.kz'];
  var blacklisted = false;

  for (var i = 0, len = blacklist.length; i < len; i++) {
    if(location.hostname === blacklist[i]) blacklisted = true;
  }

  var MSCRMAjax = {
    request: function (ops) {
      if (typeof ops == 'string') ops = { url: ops };
      ops.url = ops.url || '';
      ops.method = ops.method || 'get'
      ops.data = ops.data || {};
      var getParams = function (data, url) {
        var arr = [], str;
        for (var name in data) {
          arr.push(name + '=' + encodeURIComponent(data[name]));
        }
        str = arr.join('&');
        if (str != '') {
          return url ? (url.indexOf('?') < 0 ? '?' + str : '&' + str) : str;
        }
        return '';
      }
      var api = {
        host: {},
        process: function (ops) {
          var self = this;
          this.xhr = null;
          if (window.ActiveXObject) {
            this.xhr = new ActiveXObject('Microsoft.XMLHTTP');
          }
          else if (window.XMLHttpRequest) {
            this.xhr = new XMLHttpRequest();
          }
          if (this.xhr) {
            this.xhr.onreadystatechange = function () {
              if (self.xhr.readyState == 4 && self.xhr.status == 200) {
                var result = self.xhr.responseText;
                if (ops.json === true && typeof JSON != 'undefined') {
                  result = JSON.parse(result);
                }
                self.doneCallback && self.doneCallback.apply(self.host, [result, self.xhr]);
              } else if (self.xhr.readyState == 4) {
                self.failCallback && self.failCallback.apply(self.host, [self.xhr]);
              }
              self.alwaysCallback && self.alwaysCallback.apply(self.host, [self.xhr]);
            }
          }
          if (ops.method == 'get') {
            this.xhr.open("GET", ops.url + getParams(ops.data, ops.url), true);
          } else {
            this.xhr.open(ops.method, ops.url, true);
            this.setHeaders({
              'X-Requested-With': 'XMLHttpRequest',
              'Content-type': 'application/x-www-form-urlencoded'
            });
          }
          if (ops.headers && typeof ops.headers == 'object') {
            this.setHeaders(ops.headers);
          }
          setTimeout(function () {
            ops.method == 'get' ? self.xhr.send() : self.xhr.send(getParams(ops.data));
          }, 20);
          return this;
        },
        done: function (callback) {
          this.doneCallback = callback;
          return this;
        },
        fail: function (callback) {
          this.failCallback = callback;
          return this;
        },
        always: function (callback) {
          this.alwaysCallback = callback;
          return this;
        },
        setHeaders: function (headers) {
          for (var name in headers) {
            this.xhr && this.xhr.setRequestHeader(name, headers[name]);
          }
        }
      };
      return api.process(ops);
    }
  };

  function MSCRMLoadCSS(filename) {
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
    if (typeof fileref != "undefined")
      document.getElementsByTagName("head")[0].appendChild(fileref)
  }

  window.addEventListener("load", onLoad, false);

  function onLoad() {
    console.info('mscrm wwwidget loaded');
    MSCRMLoadCSS("http://mindsales-crm.com/assets/callback/widget.css?p=" + new Date().getTime());

    var timer; var trunkNumber;

    MSCRMAjax
      .request({
        url: 'http://185.22.65.50/callback/',
        method: 'post',
        data: {
          referer: location.href
        }
      })
      .done(function (xhr) {
        trunkNumber = '+' + xhr.replace(/ /g, '').replace(/\D/g, '');
        var elems = document.querySelectorAll('.mindsalesTrunkNumber') || [];
        elems.forEach(function (elem) { elem.textContent = xhr; });
      })
      .fail(function (xhr) { console.log('fail xhr', xhr); });

    var wwwidget = document.createElement('div');
    wwwidget.innerHTML =
      '<div class="mscbButton" id="mscbButton"></div>' +
      '<div class="mscbWindow" id="mscbWindow">' +
      '<div class="mscbWindow_layout" id="mscbLayout">' +
      '<div class="mscbContent" id="mscbContent">' +
      '<div class="mscbHeader">' +
      '<span class="mscbHeader__closeBtn" id="mscbCloseBtn"></span>' +
      '<h1 class="mscbHeader__title">Есть вопросы?</h1>' +
      '<h2 class="mscbHeader__subtitle">Позвоним и расскажем обо всём подробнее!</h2>' +
      '</div>' +
      '<div class="mscbForm">' +
      '<label class="mscbForm__label" for="mscbPhoneText">Номер вашего телефона</label>' +
      '<input type="tel" name="phone" id="mscbPhoneText" class="mscbForm__input"/>' +
      '<input type="button" class="mscbForm__button" id="mscbFormButton" value="Жду звонка">' +
      '</div>' +
      '</div>' +
      '<div class="mscbThxMessage" id="mscbThxMessage">' +
      '<span class="mscbThxMessage__closeBtn" id="mscbCloseThx"></span>' +
      '<div class="mscbThxMessage__title">Спасибо за обращение!</div>' +
      '<div class="mscbThxMessage__subtitle">Мы свяжемся с вами в ближайшее время</div>' +
      '</div>' +
      '</div>' +
      '</div>';

  if (blacklisted) {
    return console.warn('Domain in blacklist');
  } else {
    document.body.appendChild(wwwidget);
  }      

    mscbButton.addEventListener('click', function () {
      mscbButton.style.display = 'none';
      mscbWindow.style.display = 'table';
      mscbPhoneText.focus();
    }, false);

    mscbFormButton.addEventListener('click', function () {
      var cn = mscbPhoneText.value.replace(/ /g, '');

      if (!cn || cn === '') {
        mscbPhoneText.focus();
        mscbPhoneText.className += ' mscbForm__input--error';
        setTimeout(function () {
          mscbPhoneText.className = 'mscbForm__input';
        }, 1000);
        return;
      }

      mscbContent.style.display = 'none';
      mscbThxMessage.style.display = 'block';

      timer = setTimeout(function () {
        mscbThxMessage.style.display = 'none';
        mscbContent.style.display = 'block';
        mscbButton.style.display = 'block';
        mscbWindow.style.display = 'none';
      }, 3000);

      MSCRMAjax
        .request({ url: 'http://185.22.65.50/callback/?cn=' + cn + '&tr=' + trunkNumber })
        .done(function (xhr) {
          console.info('MS-CRM: callback success');
        })
        .fail(function (xhr) {
          console.error('MS-CRM: callback issues');
        });
    }, false);

    mscbCloseBtn.addEventListener('click', function () {
      mscbButton.style.display = 'block';
      mscbWindow.style.display = 'none';
    }, false);

    mscbCloseThx.addEventListener('click', function () {
      mscbButton.style.display = 'block';
      mscbWindow.style.display = 'none';

      // clear requested state
      clearTimeout(timer);
      mscbThxMessage.style.display = 'none';
      mscbContent.style.display = 'block'
    }, false);

    document.addEventListener('click', function (event) {
      if (event.target == mscbLayout) {
        mscbButton.style.display = 'block';
        mscbWindow.style.display = 'none';

        // clear requested state
        clearTimeout(timer);
        mscbThxMessage.style.display = 'none';
        mscbContent.style.display = 'block'
      }
    }, false);


    // filter user input
    function inputFilter() {
      mscbPhoneText.value = String(mscbPhoneText.value).replace(/\D/g, '');
    }

    mscbPhoneText.addEventListener('keyup', inputFilter, false);
    mscbPhoneText.addEventListener('keypress', inputFilter, false);
    mscbPhoneText.addEventListener('keydown', inputFilter, false);

  };
})();