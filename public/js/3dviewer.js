$.lang = {};

$.lang.ko = {
    1: "앙부일구",
    2: "페이지",
    3: "3D 모델 제작",
    4: "학습하기",
    5: "확장 기능",
    6: "개발자",
    7: "기타",
    8: "온라인 상에서 체험해보세요!",
    9: "앙부일구 3D 뷰어",
    10: `온라인 상에서 앙부일구의 구조를 입체적으로 확인해보세요! '학습하기'에서 학습할 수 있는 앙부일구의 구조를 직접 확인하고, 각 구조가 갖는 역할에 대하여 알아봄으로써 앙부일구의 과학적 가치를 느껴보시길 바랍니다.<br>
    아래의 버튼을 눌러 '학습하기' 세션에서 앙부일구의 구조에 대하여 자세히 학습해보세요!`,
    11: `<i class="bi bi-arrow-right-circle-fill me-1"></i>학습하기`,
}

$.lang.en = {
    1: "Angbuilgu",
    2: "Pages",
    3: "Render 3D Model",
    4: "Learn",
    5: "Extensions",
    6: "Developers",
    7: "Others",
    8: "Try it out online!",
    9: "Angbuilgu 3D Viewer",
    10: `Check out the 3D structure of the solar system online! Explore the structure of the solar system in the 'Learn' section, directly examine each structure's role, and appreciate the scientific value of the solar system.<br> 
    Please click the buttons below to dive into the 'Learn' session and explore the details of the solar system's structure`,
    11: `<i class="bi bi-arrow-right-circle-fill me-1"></i>Learn Structure of Angbuilgu`,
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