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
    console.log('Соединяю c', $(this).attr("to"))
  });

})(jQuery);