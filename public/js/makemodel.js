let latitude, longitude, altitude, accuracy;
let zoomLevel = 15;
let coords, marker, position;
let decl;
let lang;

// toast bootstrap element
const toastLiveExample = document.getElementById('liveToast');
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);

$(window).on('load', async () => {
    $('#refresh-decl').hide();
    await fetchData().then(res => {
        decl = res.declination;
        if (decl !== null) {
            $('#mag-declination').val(decl);
            $('#ok-btn').attr('disabled', false);
        } else {
            $('#mag-declination').val("N/A");
            $('#refresh-decl').show();
        }
    });
});

function refresh_declination() {
    fetchData().then(res => {
        decl = res.declination;
        if (decl !== null) {
            if (decl !== null) {
                $('#mag-declination').val(decl);
                $('#ok-btn').attr('disabled', false);
            } else {
                $('#mag-declination').val("N/A");
            }
            $('#ok-btn').attr('disabled', false);
            $('#refresh-decl').hide();
        } else {
            $('#refresh-decl').show();
            $('#ok-btn').attr('disabled', true);
            toastBootstrap.show();
        }
    });
}

function initMap() {
    lang = getLanguageCookie();
    if (lang) {
        setLanguage(lang);
    } else {
        setLanguageCookie('ko');
        setLanguage('ko');
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            latitude = pos.coords.latitude;
            longitude = pos.coords.longitude;
            altitude = 10;
            accuracy = pos.coords.accuracy;
            coords = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
            $('#latitude').val(latitude);     // 위도
            $('#longitude').val(longitude); // 경도
            if (lang === 'ko') {
                $('#latitudeTT').html("위도");
                $('#longitudeTT').html("경도");
                $('#mag-declinationTT').html("편각");
                $('#pos-accuracy').html("위치 정확도: ±" +accuracy + " (m)");
            } else {
                $('#latitudeTT').html("latitude");
                $('#longitudeTT').html("longitude");
                $('#mag-declinationTT').html("mag declination");
                $('#pos-accuracy').html("position accuracy: ±" + accuracy + " (m)");
            }

            let map = new google.maps.Map(document.getElementById('map'), {
                zoom: zoomLevel,
                center: coords
            });

            marker = new google.maps.Marker({
                position: coords,
                map: map,
                draggable: true
            });
            google.maps.event.addListener(marker, 'dragend', async function () {
                $('#ok-btn').attr('disabled', true);
                
                position = marker.getPosition();
                latitude = position.lat();
                longitude = position.lng();

                $('#latitude').val(latitude);     // 위도
                $('#longitude').val(longitude); // 경도
                await fetchData().then(res => {
                    decl = res.declination;
                    console.log(decl);
                    $('#mag-declination').val(decl);
                });

                if (lang === 'ko') {
                    $('#pos-accuracy').html("위치 정확도: - (m)");
                } else {
                    $('#pos-accuracy').html("position accuracy: - (m)");
                }
                $('#ok-btn').attr('disabled', false);
            });
        });
    }
    else {
        if (lang === 'ko') {
            alert("이 브라우저에서는 Geolocation이 지원되지 않습니다.");
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }
}

const fetchData = async () => {
    const response = await fetch(`/api/decl?lat=${latitude}&lon=${longitude}`, { method: 'GET' });
    const data = await response.json();
    return data;
}

function laturl() {
    location.href = "/downloadmodel?latitude=" + String(latitude) + "&decl=" + String(decl);
}

// language setting

const setLanguage = (currentLanguage) => {
    if (currentLanguage === 'ko') {
        $('#latitudeTT').html("위도");
        $('#longitudeTT').html("경도");
        $('#mag-declinationTT').html("편각");
        $('#pos-accuracy').html("위치 정확도: ±" + accuracy + " (m)");
        $('#locDatatxt').html('위치 데이터');
        $('#refresh-decl').html('<i class="bi bi-arrow-clockwise me-1"></i>편각 재요청');
        $('#ok-btn').html('<i class="bi bi-arrow-right-circle-fill me-1"></i>생성');
        $('#toast-title').html('앙부일구 제작 프로그램');
        $('#toast-time').html('1초 전');
        $('#toast-content').html('편각 데이터를 가져오지 못하였습니다.<br>"편각 재요청" 버튼을 눌러 다시 시도해주세요!');
    } else {
        $('#latitudeTT').html("latitude");
        $('#longitudeTT').html("longitude");
        $('#mag-declinationTT').html("mag declination");
        $('#pos-accuracy').html("position accuracy: ±" + accuracy + " (m)");
        $('#locDatatxt').html('Location data');
        $('#refresh-decl').html('<i class="bi bi-arrow-clockwise me-1"></i>reload mag declination');
        $('#ok-btn').html('<i class="bi bi-arrow-right-circle-fill me-1"></i>Create');
        $('#toast-title').html('angbuilgu creator');
        $('#toast-time').html('1 second ago');
        $('#toast-content').html('Could not get magnetic declination data.<br>Please click <code>reload ...</code> to reload data.');

    }
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