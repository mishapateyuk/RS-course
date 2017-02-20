function showPopupMessage(message) {
    $('body').css('overflow', 'hidden');
    $('.popup').show(300);
    $('.popup').click(function() {
        $('.popup').hide(200);
        $('body').css('overflow', 'auto');
    });
    $('.popup-message').html(message + '<hr><br>click anywhere if you\'re understand');
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

//CONVERTER WIDGET -----------------------------------------------------------------------------------------------------

$('.add-currency').on('click', function() {
    $('.currency-list li:last-child').toggle(600);
    $('.add-currency').toggleClass('minus active');
});

$('.currency-input').on('input', function() {
    let inputValue = this.value.replace(/£|\$|€/, '');
    if (!isNumeric(inputValue)) {
        showPopupMessage('Please, write only number in this field');
        this.value = this.value.slice(0, -1);
        return;
    }
    if (String(this.value).length > 6) {
        showPopupMessage('Currency should contains maximum five chars');
        this.value = this.value.slice(0, -1)
    }
    let usd = inputValue / $('.currency-input:focus').data('currency');
    let currencyIDs = ['usd', 'gbr', 'eur'];
    currencyIDs.splice(currencyIDs.indexOf(this.id), 1);
    currencyIDs.forEach((item) => {
        convertCurrency(item, usd);
    });
});

function convertCurrency(currencyID, usdValue) {
    const element = $(`#${currencyID}`);
    let converteredValue = element.data('currency') * usdValue;
    if (converteredValue < 100) {
        element.val(converteredValue.toFixed(2));
    }
    if (converteredValue < 1000 && converteredValue >= 100) {
        element.val(converteredValue.toFixed(1));
    }
    if (converteredValue > 1000) {
        element.val(converteredValue.toFixed(0));
    }
    if (converteredValue > 99999) {
        element.val('99999+');
    }
    if (currencyID === 'usd') {
        const tmp = '$' + element.val();
        element.val(tmp)
    }
    if (currencyID === 'gbr') {
        const tmp = '£' + element.val();
        element.val(tmp)
    }
    if (currencyID === 'eur') {
        const tmp = '€' + element.val();
        element.val(tmp)
    }
}

function currencyFocus(selector, currency) {
    $(selector).on('focus', function() {
        this.value = currency;
        $(selector).on('input', function() {
            let tmp = this.value.replace(/£|\$|€/, '');
            this.value = currency + tmp;
        });
    });
}

currencyFocus('#gbr', '£');
currencyFocus('#usd', '$');
currencyFocus('#eur', '€');

//CALENDAR WIDGET ------------------------------------------------------------------------------------------------------

$( function() {
    $( "#datepicker" ).datepicker({
        minDate: new Date()
    });
});

//CHAT WIDGET ----------------------------------------------------------------------------------------------------------

$('#add-new-user').on('click', function() {
    if (!$('#new-user').val()) {
        return null;
    }
    const userName = $('#new-user').val();
    $('#new-user').val('');
    console.log(userName);
    $('.message-list').prepend(`
        <li>
            <a href=""><img class="avatar" src="./img/Avatar.svg" alt="Profile photo"></a>
            <h3>${userName}</h3>
            <p class="message">There is no message</p>
        </li>`);
})

//SIGN IN/UP WIDGET ----------------------------------------------------------------------------------------------------

$('#email').on('input', function() {
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    if (validateEmail($('#email').val())) {
        $('.email-block').addClass('valid-user-data');
    } else {
        $('.email-block').removeClass('valid-user-data');
    }
    checkUserData();
});

$('#password').on('input', function() {
    if ($('#password').val().length > 7) {
        $('.password-block').addClass('valid-user-data');
    }
    if ($('.password-block').hasClass('valid-user-data') && $('#password').val().length <= 7) {
        $('.password-block').removeClass('valid-user-data');
    }
    checkUserData();
});

$('.signup-button').on('click', function() {
    if (checkUserData()) {
        $('.signed-up').show(900);
        $('.signed-in').hide(900);
    } else {
        return false;
    }
});

$('.signin-button').on('click', function() {
    if (checkUserData()) {
        $('.signed-in').show(900);
        $('.signed-up').hide(900);
    } else {
        return false;
    }
});

function checkUserData() {
    if (
    $('.password-block').hasClass('valid-user-data') && 
    $('.email-block').hasClass('valid-user-data')) {
        $('.signup-button').prop(
            {
            'disabled': false,
            'title': '',
            }
        );
        $('.signin-button').prop(
            {
            'disabled': false,
            'title': '',
            }
        );
        return true;
    } else {
        $('.signup-button').prop(
            {
            'disabled': true,
            'title': 'Please, check your pass or email',
            }
        );
        $('.signin-button').prop(
            {
            'disabled': true,
            'title': 'Please, check your pass or email',
            }
        );
        return false;
    }
}

//CIRCLES WIDGET -------------------------------------------------------------------------------------------------------

$('#draw-diagrams').click(function() {
    if (!isNumeric($('.circle-input-first-value').val()) ||
        !isNumeric($('.circle-input-second-value').val()) ||
        !isNumeric($('.circle-input-third-value').val())
        ) {
        showPopupMessage('Invalid data or empty field');
        setAllToZero();
    }
    const summ = Number($('.circle-input-first-value').val()) +
                 Number($('.circle-input-second-value').val()) +
                 Number($('.circle-input-third-value').val());
    if (summ > 100) {
        showPopupMessage('sum of percents should be maximum 100, please use your brain next time.');
        setAllToZero();
    }
    $('.circle-fill-additional').hide();
    const tmp = [$('.circle-straight-first-value'), $('.circle-straight-second-value'), $('.circle-straight-third-value')];
    tmp.forEach((item) => item.css('height', '0%'));
    let bottomPosition = 0;
    let lastDeg = -45;
    let zIndex = 1;
    const percents = [$('.circle-input-first-value'), 
                      $('.circle-input-second-value'), 
                      $('.circle-input-third-value')].sort((a, b) => b.val() - a.val());

    for (let i = 0; i < percents.length; i++) {
        const circleClass = '.' + percents[i].attr('class').replace(/input/, 'straight');
        $(circleClass).css(
            {
                'height': percents[i].val() + '%',
                'bottom': bottomPosition + '%',
            });
        bottomPosition += Number(percents[i].val());
    }
    for (let i = 0; i < percents.length; i++) {
        const circleClass = '.' + percents[i].attr('class').replace(/input/, 'fill');
        const color = percents[i].css('border-top-color');
        const val = percents[i].val();
        drawCircles(lastDeg, color, val, circleClass, zIndex);
        lastDeg += Number(percents[i].val()) * 3.6;
        zIndex++;
        if (i + 1 === percents.length) {
            $('.circle-fill-empty-value').css(
                {
                    'transform': `rotate(${lastDeg}deg)`,
                    'z-index': zIndex,
                }
            );
        }
    }
    if (summ > 75 && summ <= 100) {
        drawCircles(-45, percents[0].css('border-top-color'), 1, '.circle-fill-additional', zIndex + 1);
        $('.circle-fill-additional').show();
    }
    if (summ <= 100) {
        $('.circle-around-inside').html(summ + '%');
    }
    function drawCircles(lastDeg, color, val, elementClass, zIndex) {
        $(elementClass).css(
            {
                'border-color': 'transparent',
                'transform': `rotate(${lastDeg}deg)`,
                'z-index': zIndex,
            }
        );
        if (val > 75) {
            $(elementClass).css(
                {
                    'border-color': color,
                    'transform': `rotate(${lastDeg}deg)`,
                }
            );
            return;
        }
        if (val > 50) {
            $(elementClass).css(
                {
                    'border-left-color': color,
                    'border-bottom-color': color,
                    'border-right-color': color,
                    'transform': `rotate(${lastDeg}deg)`,
                }
            );
            return;
        }
        if (val > 25) {
            $(elementClass).css(
                {
                    'border-bottom-color': color,
                    'border-right-color': color,
                    'transform': `rotate(${lastDeg}deg)`,
                }
            );
            return;
        }
        if (val > 0) {
            $(elementClass).css(
                {
                    'border-right-color': color,
                    'transform': `rotate(${lastDeg}deg)`,
                }
            );
            return;
        }
    }
    function setAllToZero() {
        $('.circle-around-inside').html(0 + '%');
        $('.circle-input-first-value').val(0);
        $('.circle-input-second-value').val(0);
        $('.circle-input-third-value').val(0);
    }
});

//WEATHER WIDGET -------------------------------------------------------------------------------------------------------

$('.add-place-button').click(function() {
    $('.add-weather-form').toggle(200);
    $('.add-place-button').toggleClass('active-weather-button');
});

$('#add-new-weather').click(function() {
    const index = $('.slider label').length + 1;
    const cityName = $('#city-name').val();
    const temperature = $('#temperature').val();
    const imgSource = $('#img-source').val();
    const newSlide = $('.slide:first').clone();
    newSlide.attr('class', `slide slide-${index}`).css('background-image', `url(${imgSource})`)
        .find('.temperature').text(temperature).end()
        .find('.city-name').text(cityName).end()
        .find('.time').text((new Date()).getHours() + ': ' + (new Date()).getMinutes());
    $('.slider').append(`<label for="slide-dot-${index}"></label>`);
    $('.weather-list').append(`<li>${cityName}</li>`);
    $('.add-weather-form').hide(200);
    $('.add-place-button').removeClass('active-weather-button');
    $('.weather-board').append(`<input id="slide-dot-${index}" type="radio" name="slides">`);
    $('.weather-board').append(newSlide);

});

$('.list-view-button').click(function() {
    $('.list-view-button').toggleClass('active-weather-button');
    $('.weather-list').toggle(200);
});

$('.weather-list').on('click', 'li', function() {
    const index = $('.weather-list li').index(this);
    $('input[name="slides"]').eq(index).click();
    $('.weather-list').hide(200);
    $('.list-view-button').removeClass('active-weather-button');
    $('.slider label').removeClass('active-slide').eq(index).addClass('active-slide');
});

$('.slider').on('click', 'label', function() {
    $('.slider label').removeClass('active-slide');
    $(this).addClass('active-slide');
});

let temperatureScale = 'C';

$('#farh').click(function() {
    if (temperatureScale !== 'F') {
        $('.temperature').each(function() {
            const tmp = $(this).text();
            $(this).text((Number(tmp)*9/5 + 32).toFixed(0));
        });
    }
    temperatureScale = 'F';
    $('#farh').addClass('active-weather-button');
    $('#cels').removeClass('active-weather-button');
});

$('#cels').click(function() {
    if (temperatureScale !== 'C') {
        $('.temperature').each(function() {
            const tmp = $(this).text();
            $(this).text((5 / 9 * (Number(tmp) - 32)).toFixed(0));
        });
    }
    temperatureScale = 'C';
    $('#cels').addClass('active-weather-button');
    $('#farh').removeClass('active-weather-button');
});