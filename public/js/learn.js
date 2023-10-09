$.lang = {};

$.lang.ko = {
    1: "앙부일구",
    2: "페이지",
    3: "3D 모델 제작",
    4: "학습하기",
    5: "확장 기능",
    6: "개발자",
    7: "기타",
    8: "학습하기",
    9: "앙부일구",
    10: "개요",
    11: "앙부일구의 역사적 의의",
    12: "앙부일구의 과학",
    13: "앙부일구의 구조",
    14: "앙부일구의 원리",
    15: "경도차와 균시차",
    16: "태양의 일주권",
    17: "연구 소개",
    18: "연구 초록",
    19: "연구 보고서",
    20: "학습자료",
    21: "학습자료 소개",
    22: "자료 다운로드",
}

$.lang.en = {
    1: "Angbuilgu",
    2: "Pages",
    3: "Render 3D Model",
    4: "Learn",
    5: "Extensions",
    6: "Developers",
    7: "Others",
    8: "Learn",
    9: "Angbuilgu",
    10: "Overview",
    11: "Historical significance of Angbuilgu",
    12: "Science of Angbilgu",
    13: "Structure of Angbuilgu",
    14: "Principle of Angbuilgu",
    15: "Longitude difference and Equation of time",
    16: "Diurnal circle of the Sun",
    17: "Research introduction",
    18: "Research abstract",
    19: "Research report",
    20: "Learning materials",
    21: "Learning materials introduction",
    22: "Download materials",
}

let category = "앙부일구";
let title = "개요";

$(document).ready(function () {
    let lang = getLanguageCookie();
    if (lang) {
        setLanguage(lang);
        if (lang === "en") {
            $('.firstview-subtitle').html('Angbuilgu');
            $('.firstview-title').html('Overview');
            $('.firstview-content').html(`Did you know that there is a sundial called 'Angbuilgu' in Gwanghwamun Square in Seoul, in front of the statue of King Sejong? 
            Angbuilgu was created during the time of King Sejong 600 years ago. 
            It holds great scientific, historical, and cultural value and has been designated as Korean Treasure No. 845. 
            However, if we were to move Angbuilgu from Gwanghwamun Square to Busan, would it still accurately measure time and date? 
            What about if we took it outside of Korea to a foreign location? The answer is no. 
            Angbuilgu's appearance and functionality would need to be adjusted to match the latitude of the new location. 
            So, shall we now delve into more details about Angbuilgu?`)
        }
    } else {
        setLanguageCookie('ko');
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
    $('.content-container').load(`/learnContent/${changedLang}/${category.replaceAll('-','_')}/${title.replaceAll('-','_')}.html`);
});

const setLanguageCookie = (lang) => {
    document.cookie = `lang=${lang}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
}

const getLanguageCookie = () => {
    let value = document.cookie.match('(^|;) ?' + 'lang' + '=([^;]*)(;|$)');
    return value ? value[2] : null;
}

$('.link-dark').click(function () {
    category = $(this).data('category');
    // $('.learn-subtitle').text(category.replaceAll('-',' '));
    title = $(this).data('title');
    const lang = getLanguageCookie();
    // $('.learn-title').text(title.replaceAll('-',' '));  
    $('.content-container').load(`/learnContent/${lang}/${category.replaceAll('-','_')}/${title.replaceAll('-','_')}.html`);
})

// $(document).ready(function () {
//     $('.learn-subtitle').text("앙부일구");
//     $('.learn-title').text("개요");  
//     $('.content-container').load(`/learnContent/앙부일구/개요.html`);
// });