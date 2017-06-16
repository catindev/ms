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
    MSCRMLoadCSS("http://mindsales-crm.com/assets/callback/widget.css");

    var sid = mindsalesCallbackWidget.getAttribute("site-id");

    mindsalesCallbackWidget.innerHTML =
      '<div id="mscrmWidgetButton"></div>' +
      '<div id="mscrmWidgetWindow">' +
        '<div class="mscrmWidgetWindow__formWrapper" id="mscrmWidgetFormWrapper">' +
          '<div class="mscrmWidgetWindow__formContent">' +
            '<div class="mscrmWidgetWindow__formHeader">' +
              '<span class="mscrmWidgetWindow__close" id="mscrmWidgetFormClose"></span>' +
              '<h1 class="mscrmWidgetWindow__title">Остались вопросы?</h1>' +
              '<h2 class="mscrmWidgetWindow__subtitle">Мы позвоним вам и проконсультируем</h2>' +
            '</div>' +
            '<div class="mscrmWidgetWindow__formForm">' +
              '<label class="mscrmWidgetWindow__formLabel">Номер вашего телефона</label>' +
              '<input type="text" name="mscrmCustomerPhoneNumber" id="mscrmCustomerPhoneNumber" class="mscrmWidgetWindow__formInput"/>' +
              '<input type="button" class="mscrmWidgetWindow__formButton" id="MSCRMCallback" value="Жду звонка">' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    mscrmWidgetButton.addEventListener('click', function() {
      mscrmWidgetButton.style.display = 'none';
      mscrmWidgetWindow.style.display = 'table';
    }, false);

    MSCRMCallback.addEventListener('click', function() {
      var cn = mscrmCustomerPhoneNumber.value;
      MSCRMAjax
      .request({ url: 'http://185.22.65.50/call2.php?cn=' + cn + '&site_guid=' + sid })
      .done(function (xhr) {
        console.info('Коллбек: запрос отправлен');
        mscrmWidgetButton.style.display = 'block';
        mscrmWidgetWindow.style.display = 'none';
      })
      .fail(function (xhr) {
        console.error('Коллбек: проблемы на сервере');
        mscrmWidgetButton.style.display = 'block';
        mscrmWidgetWindow.style.display = 'none';
      });
    }, false);

    mscrmWidgetFormClose.addEventListener('click', function() {
      mscrmWidgetButton.style.display = 'block';
      mscrmWidgetWindow.style.display = 'none';
    }, false);

    document.addEventListener('click', function(event) {
      if (event.target == mscrmWidgetFormWrapper) {
        mscrmWidgetButton.style.display = 'block';
        mscrmWidgetWindow.style.display = 'none';
      }
    }, false);

  };
})();