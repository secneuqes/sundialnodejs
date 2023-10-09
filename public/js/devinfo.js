$.lang = {};

$.lang.ko = {
    1: "앙부일구",
    2: "페이지",
    3: "3D 모델 제작",
    4: "학습하기",
    5: "확장 기능",
    6: "개발자",
    7: "기타",
    8: `현재 심사기간으로 <span class="text-danger">접속이 불가</span> 합니다.`,
    9: `<strong class="fw-bold">학생 및 소속 학교 정보가 포함된 페이지</strong> 입니다.<br>대회 규정에 따라 현재 해당 페이지에 접근이 불가한 점 양해 부탁드립니다.`,
    10: `<i class="bi bi-arrow-left-circle me-1"></i>이전 페이지`
}

$.lang.en = {
    1: "Angbuilgu",
    2: "Pages",
    3: "Render 3D Model",
    4: "Learn",
    5: "Extensions",
    6: "Developers",
    7: "Others",
    8: `<span class="text-danger">The page is not available</span> due to evaluation of the contest.`,
    9: `<strong class="fw-bold">This is a page containing student and affiliated school information.</strong><br>We apologize, but access to this page is currently unavailable in accordance with the competition regulations.`,
    10: `<i class="bi bi-arrow-left-circle me-1"></i>back to previous page`
}

$(document).ready(function () {
    let lang = getLanguageCookie();
    if (lang) {
        setLanguage(lang);
    } else {
        setLanguageCookie('ko')
        setLanguage('ko');
    }
});

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