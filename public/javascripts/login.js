$(document).ready(function () {
  function checkForBlanks(targetForm, e) {
    targetForm
      .find(':input')
      .not(':button')
      .each(function () {
        if (!$(this).val()) {
          e.preventDefault();
          $('#message-box')
            .text('All fields are required.')
            .removeClass('invisible');
        }
      });
  }

  $('form').on('submit', function (e) {
    checkForBlanks($(this), e);
  });
});
