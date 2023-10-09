$.lang = {};

$.lang.ko = {
    1: "앙부일구",
    2: "페이지",
    3: "3D 모델 제작",
    4: "학습하기",
    5: "확장 기능",
    6: "개발자",
    7: "기타",
    8: `조선시대에 만들어진 우리의 위대한 문화유산 앙부일구가
    서울 종로의 위도대에서만 사용 가능하다는 것을 아셨나요?<br>
    직접 <strong>여러분의 위치에서 사용 가능한 앙부일구</strong>를 만들어보세요!`,
    9: `<i class="bi bi-arrow-right-circle-fill me-1"></i> 3D 모델 제작`
}

$.lang.en = {
    1: "Angbuilgu",
    2: "Pages",
    3: "Render 3D Model",
    4: "Learn",
    5: "Extensions",
    6: "Developers",
    7: "Others",
    8: `Did you know that Korea's great cultural heritage, Angbuilgu, created during the Joseon Dynasty,
    is usable only at the latitude of Seoul's Jongno district?<br>
    <strong>Why not create your own Angbuilgu that can be used from wherever you are!</strong>`,
    9: `<i class="bi bi-arrow-right-circle-fill me-1"></i> Render 3D Model`
}

$(document).ready(function () {
    $('.slider').slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 4000,
    });

    let lang = getLanguageCookie();
    if (lang) {
        setLanguage(lang);
    } else {
        setLanguageCookie('ko')
        setLanguage('ko');
    }

    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;

    if (!isMobile) {
        $('.mergedImg').hide();
        $('.slider').show();
    } else {
        $('.mergedImg').show();
        $('.slider').hide();
    }
});

const makemodel = () => {
    window.location.href = "./makemodel"
}

const setLanguage = (currentLanguage) => {
    $('[data-langnum]').each(function () {
        $(this).html($.lang[currentLanguage][$(this).data('langnum')]);
    });
}

$('.lang-select').on('click', function () {
    const changedLang = $(this).data('lang');
    setLanguageCookie(changedLang);
    setLanguage(changedLang);
});

const setLanguageCookie = (lang) => {
    document.cookie = `lang=${lang}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
}

const getLanguageCookie = () => {
    let value = document.cookie.match('(^|;) ?' + 'lang' + '=([^;]*)(;|$)');
    return value ? value[2] : null;
}