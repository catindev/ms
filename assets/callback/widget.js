(function () {
  var MSCRMAjax = {
    request: function (ops) {
      if (typeof ops == 'string') ops = {url: ops};
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

  function MSCRMLoadCSS(filename){
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
    if (typeof fileref!="undefined")
      document.getElementsByTagName("head")[0].appendChild(fileref)
  }

  window.onload = function () {
    MSCRMLoadCSS("http://mindsales-crm.com/assets/callback/widget.css?p=" + new Date().getTime());

    var timer;
    var sid = mindsalesCallbackWidget.getAttribute("site-id");

    mindsalesCallbackWidget.innerHTML =
      '<div class="mscbButton" id="widgetButton"></div>' +
      '<div class="mscbWindow" id="widgetWindow">' +
        '<div class="mscbWindow_layout" id="layout">' +
          '<div class="mscbContent" id="content">' +
            '<div class="mscbHeader">' +
              '<span class="mscbHeader__closeBtn" id="closeBtn"></span>' +
              '<h1 class="mscbHeader__title">Есть вопросы?</h1>' +
              '<h2 class="mscbHeader__subtitle">Мы позвоним вам и расскажем обо всём подробнее</h2>' +
            '</div>' +
            '<div class="mscbForm">' +
              '<label class="mscbForm__label" for="phoneText">Номер вашего телефона</label>' +
              '<input type="text" name="mscrmPhone" id="phoneText" class="mscbForm__input"/>' +
              '<input type="button" class="mscbForm__button" id="formButton" value="Жду звонка">' +
            '</div>' +
          '</div>' +
          '<div class="mscbThxMessage" id="thxMessage">' +
            'Спасибо, мы свяжемся с вами в ближайшее время' +
          '</div>' +
        '</div>' +
      '</div>';

    widgetButton.addEventListener('click', function() {
      widgetButton.style.display = 'none';
      widgetWindow.style.display = 'table';
      phoneText.focus();
    }, false);

    formButton.addEventListener('click', function() {
      content.style.display = 'none';
      thxMessage.style.display = 'block';
      timer = setTimeout(function() {
        thxMessage.style.display = 'none';
        content.style.display = 'block';
        widgetButton.style.display = 'block';
        widgetWindow.style.display = 'none';
      }, 2500);

      var cn = phoneText.value;
      MSCRMAjax
      .request({ url: 'http://185.22.65.50/call2.php?cn=' + cn + '&site_guid=' + sid })
      .done(function (xhr) {
        console.info('MS-CRM: callback success');
      })
      .fail(function (xhr) {
        console.error('MS-CRM: callback issues');
      });
    }, false);

    closeBtn.addEventListener('click', function() {
      widgetButton.style.display = 'block';
      widgetWindow.style.display = 'none';
    }, false);

    document.addEventListener('click', function(event) {
      if (event.target == layout) {
        widgetButton.style.display = 'block';
        widgetWindow.style.display = 'none';

        // clear requested state
        clearTimeout(timer);
        thxMessage.style.display = 'none';
        content.style.display = 'block'
      }
    }, false);

  };
})();