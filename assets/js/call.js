(function ($) {

  var callCard, isCallback = false;

  function resetQuestions() {
    callCard = null;
    $(".call").removeClass('call-window');
    $(".call .call-content").show();
    $(".call .newCustomer").hide();
  }

  $(".js-newCustomer").click(function (e) {
    resetQuestions();
    callCard = $("#call_" + $(this).attr("call"));
    callCard.addClass('call-window');
    $('.call-content', callCard).hide();
    $('.newCustomer', callCard).show();
  });

  $(".newCustomerClose").click(resetQuestions);

  $(".js-callback").click(function (e) {
    if (isCallback === true) return;

    isCallback = true;
    $("#callLoader").show();

    const un = $(this).attr("from").replace('+7', '8');
    const cn = $(this).attr("to").replace('+7', '8');
    const tr = $(this).attr("trunk").replace('+7', '8');
    const cid = $(this).attr("call-id") || '';

    $.get('http://185.22.65.50/call.php?cn='+ cn +'&un='+ un + '&tr=' + tr + '&call_id='+ cid)
      .done(data => {
          $("#callLoader").hide();
          isCallback = false;
      })
      .fail( error => {
        $("#callLoader").hide();
        isCallback = false;
        alert('Ошибка. Вызов отклонён');
      });
  });

})(jQuery);