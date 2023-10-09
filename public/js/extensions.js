$.lang = {};

$.lang.ko = {
    1: "앙부일구",
    2: "페이지",
    3: "3D 모델 제작",
    4: "학습하기",
    5: "확장 기능",
    6: "개발자",
    7: "기타",
    8: "앙부일구의 구조",
    9: "앙부일구 3D 뷰어",
    10: "온라인 상에서 앙부일구의 3D 모형을 돌려보며 앙부일구의 구조에 대하여 학습하여보세요!",
    11: `<i class="bi bi-arrow-right-circle-fill me-2"></i> 체험하기`,
    12: "더 많은 컨텐츠를 준비중입니다..."
}

$.lang.en = {
    1: "Angbuilgu",
    2: "Pages",
    3: "Render 3D Model",
    4: "Learn",
    5: "Extensions",
    6: "Developers",
    7: "Others",
    8: "Structure of Angbuilgu",
    9: "Angbuilgu 3D viewer",
    10: "Explore a 3D model of Angbuilgu online and learn about the structure of Angbuilgu!",
    11: `<i class="bi bi-arrow-right-circle-fill me-2"></i> Go try it`,
    12: "Preparing more contents...",
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