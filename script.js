// تهيئة Supabase - يجب أن تتم بعد تحميل المكتبة
document.addEventListener ('DOMContentLoaded', function () {
  // الانتظار حتى يتم تحميل مكتبة Supabase
  function initSupabase () {
    if (typeof supabase !== 'undefined') {
      window.SUPABASE_URL = 'https://cldrmtjeqtshekwefoar.supabase.co';
      window.SUPABASE_ANON_KEY ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZHJtdGplcXRzaGVrd2Vmb2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNTE4MjksImV4cCI6MjA3MTYyNzgyOX0.0YdN2ZRHKLRWetRHCRMYur0gFrQZzAJi837dRMJ_-Uw';

      try {
        window.supabase = supabase.createClient (
          window.SUPABASE_URL,
          window.SUPABASE_ANON_KEY
        );
        console.log ('تم تهيئة Supabase Client بنجاح');
      } catch (error) {
        console.error ('خطأ في تهيئة Supabase:', error);
      }
    } else {
      // إعادة المحاولة بعد فترة إذا لم تكن المكتبة جاهزة
      setTimeout (initSupabase, 100);
    }
  }

  // بدء عملية التهيئة
  initSupabase ();
});

// التحقق من تسجيل الدخول
if (
  localStorage.getItem ('loggedIn') !== 'true' &&
  sessionStorage.getItem ('loggedIn') !== 'true'
) {
  window.location.href = 'login.html';
}

//window.SUPABASE_URL = 'https://cldrmtjeqtshekwefoar.supabase.co';
//window.SUPABASE_ANON_KEY ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZHJtdGplcXRzaGVrd2Vmb2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNTE4MjksImV4cCI6MjA3MTYyNzgyOX0.0YdN2ZRHKLRWetRHCRMYur0gFrQZzAJi837dRMJ_-Uw';
//window.supabase = supabase.createClient (window.SUPABASE_URL,window.SUPABASE_ANON_KEY);

// التحقق من تسجيل الدخول
if (localStorage.getItem ('loggedIn') !== 'true') {
  window.location.href = 'login.html';
}
// إضافة وظيفة تسجيل الخروج
function logout () {
  localStorage.removeItem ('loggedIn');
  localStorage.removeItem ('username');
  window.location.href = 'login.html';
}
// إضافة زر تسجيل الخروج إلى الواجهة
document.addEventListener ('DOMContentLoaded', function () {
  // إنشاء زر تسجيل الخروج وإضافته إلى الرأس
  const logoutBtn = document.createElement ('button');
  logoutBtn.className = 'btn btn-outline-light btn-sm';
  logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt me-1"></i>تسجيل الخروج';
  logoutBtn.onclick = logout;

  const header = document.querySelector ('header .container');
  if (header) {
    const logoutDiv = document.createElement ('div');
    logoutDiv.className = 'text-center mt-2';
    logoutDiv.appendChild (logoutBtn);
    header.appendChild (logoutDiv);
  }
});

// دالة لتنسيق درجة الحرارة (XX.X)
function formatTemperature (input) {
  let value = input.value.replace (/[^\d.-]/g, '');

  // إزالة أي علامات سالبة متعددة
  value = value.replace (/(\-)+/g, '-');

  // إذا كانت القيمة تبدأ بنقطة، أضف صفر قبلها
  if (value.startsWith ('.')) {
    value = '0' + value;
  }

  // إذا كانت القيمة تحتوي على أكثر من نقطة، احتفظ بالأولى فقط
  const dotCount = (value.match (/\./g) || []).length;
  if (dotCount > 1) {
    value = value.replace (/\.+$/, '');
    const parts = value.split ('.');
    value = parts[0] + '.' + parts.slice (1).join ('');
  }

  // إذا كانت القيمة تحتوي على نقطة، تأكد من وجود رقم واحد بعدها
  if (value.includes ('.')) {
    const parts = value.split ('.');
    if (parts[1].length > 1) {
      value = parts[0] + '.' + parts[1].charAt (0);
    }
  }

  // إذا كانت القيمة لا تحتوي على نقطة وكانت مكونة من رقم واحد، أضف صفر قبلها ونقطة وصفر بعدها
  if (!value.includes ('.') && value.length === 1 && value !== '-') {
    value = '0' + value + '.0';
  }

  // إذا كانت القيمة لا تحتوي على نقطة وكانت مكونة من رقمين، أضف نقطة وصفر
  if (!value.includes ('.') && value.length === 2 && value !== '-') {
    value = value + '.0';
  }

  // إذا كانت القيمة سالبة وتحتوي على نقطة في البداية
  if (value.startsWith ('-.')) {
    value = '-0.' + value.slice (2);
  }

  // إذا كانت القيمة سالبة ومكونة من رقم واحد، أضف صفر ونقطة وصفر
  if (value.startsWith ('-') && value.length === 2) {
    value = value + '0.0';
  }

  // إذا كانت القيمة سالبة ومكونة من رقمين بعد الإشارة، أضف نقطة وصفر
  if (value.startsWith ('-') && value.length === 3) {
    value = value + '.0';
  }

  input.value = value;
}

// دالة للتحقق من صحة درجة الحرارة
function validateTemperature (input, isDryTemp = false, compareWith = null) {
  let value = input.value;

  // إذا كانت القيمة فارغة، لا تفعل شيئاً
  if (!value) return true;

  // التحقق من التنسيق XX.X
  const temperatureRegex = /^-?\d{2}\.\d$/;
  if (!temperatureRegex.test (value)) {
    showFieldError (
      input,
      'التنسيق غير صحيح. يجب أن يكون بالصيغة XX.X (مثال: 25.3)'
    );
    return false;
  }

  // تحويل إلى رقم للتحقق من القيم
  const numValue = parseFloat (value);

  // التحقق من النطاق (-20 إلى 60)
  if (numValue < -20 || numValue > 60) {
    showFieldError (input, 'يجب أن تكون القيمة بين -20 و 60');
    return false;
  }

  // إذا كانت هذه درجة حرارة جافة، التحقق من عدم وجود علامة سالبة
  if (isDryTemp && numValue < 0) {
    showFieldError (input, 'درجة الحرارة الجافة لا يمكن أن تكون سالبة');
    return false;
  }

  // إذا كانت هناك قيمة للمقارنة (الرطبة يجب أن تكون أقل من الجافة)
  if (compareWith !== null) {
    const compareValue = parseFloat (compareWith.value);
    if (!isNaN (compareValue)) {
      if (numValue > compareValue) {
        showFieldError (
          input,
          'درجة الحرارة الرطبة يجب أن تكون أقل من أو تساوي الجافة'
        );
        return false;
      }

      // التحقق من أن الفرق لا يتجاوز 25 درجة
      const difference = compareValue - numValue;
      if (difference > 25) {
        showFieldError (
          input,
          'الفرق بين الحرارة الجافة والرطبة لا يمكن أن يتجاوز 25 درجة'
        );
        return false;
      }
    }
  }

  // إذا كانت كل الشروط صحيحة، إخفاء أي أخطاء
  hideFieldError (input);
  return true;
}// دالة محسنة لتنسيق ضغط المحطة
function formatPressure (input) {
  let value = input.value.replace (/[^\d.]/g, '');

  // إذا كانت القيمة فارغة
  if (!value) return;

  // منع القيم التي تبدأ بأرقام عالية جداً
  if (value.length >= 2) {
    const firstTwoDigits = parseInt (value.substring (0, 2));
    if (firstTwoDigits > 10) {
      showFieldError (input, 'القيمة لا يمكن أن تتجاوز 1050.0');
      return;
    }
  }

  // فصل الأجزاء قبل وبعد الفاصلة
  let integerPart = '';
  let decimalPart = '';

  if (value.includes ('.')) {
    const parts = value.split ('.');
    integerPart = parts[0];
    decimalPart = parts[1] || '0';
  } else {
    integerPart = value;
    decimalPart = '0';
  }

  // تقييد الجزء العشري إلى رقم واحد
  decimalPart = decimalPart.charAt (0);

  // التأكد من أن الجزء الصحيح مكون من 4 أرقام
  integerPart = integerPart.padStart (4, '0');

  // إذا تجاوز 4 أرقام، نأخذ آخر 4 أرقام
  if (integerPart.length > 4) {
    integerPart = integerPart.slice (-4);
  }

  // التحقق من عدم تجاوز 1050
  const numericValue = parseFloat (integerPart + '.' + decimalPart);
  if (numericValue > 1050.0) {
    showFieldError (input, 'القيمة لا يمكن أن تتجاوز 1050.0');
    input.value = '1050.0';
    return;
  }

  input.value = integerPart + '.' + decimalPart;
}
// دالة للتحقق من صحة ضغط المحطة (معدلة)
function validatePressure (input) {
  let value = input.value;

  // إذا كانت القيمة فارغة، لا تفعل شيئاً
  if (!value) return true;

  // التحقق من التنسيق XXXX.X
  const pressureRegex = /^\d{4}\.\d$/;
  if (!pressureRegex.test (value)) {
    showFieldError (
      input,
      'التنسيق غير صحيح. يجب أن يكون بالصيغة XXXX.X (مثال: 1013.5)'
    );
    return false;
  }

  // تحويل إلى رقم للتحقق من القيم
  const numValue = parseFloat (value);

  // التحقق من النطاق (850.0 إلى 1050.0)
  if (numValue < 850.0) {
    showFieldError (input, 'يجب أن تكون القيمة بين 850.0 و 1050.0');
    return false;
  }

  if (numValue > 1050.0) {
    showFieldError (input, 'القيمة لا يمكن أن تتجاوز 1050.0');
    // إعادة تعيين القيمة إلى الحد الأقصى
    input.value = '1050.0';
    return false;
  }

  // إذا كانت كل الشروط صحيحة، إخفاء أي أخطاء
  hideFieldError (input);
  return true;
}

// دالة للتحقق من صحة تغطية الغيوم
function validateCloudCover (input) {
  let value = input.value;

  // إذا كانت القيمة فارغة، لا تفعل شيئاً
  if (!value) return true;

  // التحقق من أن القيمة رقمية بين 0 و 8
  if (!/^[0-8]$/.test (value)) {
    showFieldError (input, 'يجب إدخال رقم بين 0 و 8');
    return false;
  }

  // إذا كانت القيمة 0، تعطيل حقلي نوع وارتفاع السحب
  const cloudIndex = input.id.replace ('cloudAmount', '');
  if (value === '0') {
    document.getElementById (`cloudType${cloudIndex}`).disabled = true;
    document.getElementById (`cloudHeight${cloudIndex}`).disabled = true;
  } else {
    document.getElementById (`cloudType${cloudIndex}`).disabled = false;
    document.getElementById (`cloudHeight${cloudIndex}`).disabled = false;
  }

  // إذا كانت كل الشروط صحيحة، إخفاء أي أخطاء
  hideFieldError (input);
  return true;
}
// إضافة مستمعات الأحداث للتحقق من اتجاه الرياح
document
  .getElementById ('windDirSurface')
  .addEventListener ('blur', function () {
    validateWindDirection (this);
  });

document.getElementById ('windDirMean').addEventListener ('blur', function () {
  validateWindDirection (this);
});

// إضافة مستمعات الأحداث للتحقق من سرعة الرياح
document
  .getElementById ('windSpeedSurface')
  .addEventListener ('blur', function () {
    validateWindSpeed (this);
  });

document
  .getElementById ('windSpeedMean')
  .addEventListener ('blur', function () {
    validateWindSpeed (this);
  });


// دالة للتحقق من صحة سرعة الرياح
function validateWindSpeed (input) {
  let value = input.value;

  // إذا كانت القيمة فارغة، لا تفعل شيئاً
  if (!value) return true;

  // التحقق من أن القيمة رقمية
  if (!/^\d+$/.test (value)) {
    showFieldError (input, 'يجب إدخال أرقام فقط');
    return false;
  }

  // التأكد من أن القيمة مكونة من رقمين
  if (value.length < 2) {
    value = value.padStart (2, '0');
    input.value = value;
  }

  // التحقق من النطاق (00 إلى 99)
  const numValue = parseInt (value);
  if (numValue < 0 || numValue > 99) {
    showFieldError (input, 'يجب أن تكون القيمة بين 00 و 99');
    return false;
  }

  // إذا كانت كل الشروط صحيحة، إخفاء أي أخطاء
  hideFieldError (input);
  return true;
}

// دالة للتحقق من صحة الطقس الغابر (خانة واحدة)
function validatePastWeather (input) {
  let value = input.value;

  // إذا كانت القيمة فارغة، لا تفعل شيئاً
  if (!value) return true;

  // التحقق من أن القيمة رقمية بين 0 و 9
  if (!/^[0-9]$/.test (value)) {
    showFieldError (input, 'يجب إدخال رقم واحد بين 0 و 9');
    return false;
  }

  // إذا كانت كل الشروط صحيحة، إخفاء أي أخطاء
  hideFieldError (input);
  return true;
}

// دالة لعرض خطأ للحقل
function showFieldError (input, message) {
  // إزالة أي رسائل خطأ سابقة
  hideFieldError (input);

  // إضافة صنف الخطأ للحقل
  input.classList.add ('is-invalid');

  // إنشاء عنصر رسالة الخطأ
  const errorDiv = document.createElement ('div');
  errorDiv.className = 'invalid-feedback';
  errorDiv.textContent = message;
  errorDiv.id = input.id + 'Error';

  // إضافة رسالة الخطأ بعد الحقل
  input.parentNode.appendChild (errorDiv);
}

// دالة لإخفاء خطأ الحقل
function hideFieldError (input) {
  // إزالة صنف الخطأ
  input.classList.remove ('is-invalid');

  // إزالة رسالة الخطأ إذا كانت موجودة
  const errorDiv = document.getElementById (input.id + 'Error');
  if (errorDiv) {
    errorDiv.remove ();
  }
}

// دالة لتحديث التاريخ الحالي
function updateDate () {
  const now = new Date ();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  document.getElementById ('currentDate').textContent = now.toLocaleDateString (
    'ar-SY',
    options
  );
}

// تحديث معلومات المحطة عند التغيير
function updateStationInfo () {
  const stationSelect = document.getElementById ('station');
  const station = stationSelect.options[stationSelect.selectedIndex];

  if (station.value) {
    document.getElementById ('stationCode').value = station.value;
    document.getElementById ('stationName').value = station.dataset.name || '';

    const elevation = parseFloat (station.dataset.elevation) || 0;
    document.getElementById ('elevation').value = elevation;
  } else {
    document.getElementById ('stationCode').value = '';
    document.getElementById ('stationName').value = '';
    document.getElementById ('elevation').value = '';
  }
}

// دالة لتحويل التوقيت المحلي إلى التوقيت العالمي
function convertToUTC (localTime) {
  const localHour = parseInt (localTime);
  if (isNaN (localHour) || localHour < 0 || localHour > 23) return null;

  // سوريا في التوقيت الشتوي (UTC+2) والصيفي (UTC+3)
  // سنفترض أننا نستخدم التوقيت الشتوي (UTC+2) كافتراضي
  const utcOffset = 2; // UTC+2 للتوقيت الشتوي في سوريا
  let utcHour = (localHour - utcOffset + 24) % 24;

  // التأكد من أن القيمة مكونة من رقمين
  return utcHour.toString ().padStart (2, '0');
}

// دالة لعرض التوقيت العالمي
function showUTCTime (localTime) {
  const utcTime = convertToUTC (localTime);
  const utcInfoElement = document.getElementById ('utcTimeInfo');
  const utcTimeElement = document.getElementById ('utcTime');

  if (utcTime) {
    utcTimeElement.textContent = utcTime;
    utcInfoElement.style.display = 'block';
  } else {
    utcInfoElement.style.display = 'none';
  }
}

// متغير عام لتخزين رموز الطقس
let weatherCodes = [];

// دالة لتحميل وتفسير رموز الطقس الحاضر
async function loadWeatherCodes () {
  try {
    const response = await fetch ('طقس حاضر.json');
    if (!response.ok) {
      throw new Error (`خطأ في تحميل الملف: ${response.status}`);
    }
    const codes = await response.json ();
    console.log ('تم تحميل رموز الطقس:', codes.length, 'رمز');
    return codes;
  } catch (error) {
    console.error ('خطأ في تحميل رموز الطقس:', error);
    // إنشاء بيانات افتراضية للطوارئ
    return [
      {
        code: '00',
        description: 'رقم يدل على حالة الغيوم و الجو صافي خلال الساعة السابقة لوقت النشرة',
      },
      {
        code: '10',
        description: 'رقم يدل على شابورة مائية يعني ضباب الرؤية أقل من 1000م',
      },
      {
        code: '20',
        description: 'رزاز غير متجمد او حبيبات ثلجية فوق المحطة خلال الساعة السابقة',
      },
      // إضافة المزيد من الرموز الافتراضية حسب الحاجة
    ];
  }
}

// دالة لعرض شرح رمز الطقس الحاضر
function showWeatherCodeDescription (code) {
  // التأكد من أن الرمز مكون من رقمين
  if (code.length !== 2) {
    hideWeatherDescription ();
    return;
  }

  // البحث عن الرمز في المصفوفة
  const weatherInfo = weatherCodes.find (item => item.code === code);

  // إنشاء أو الحصول على عنصر عرض الشرح
  let descriptionElement = document.getElementById ('weatherCodeDescription');

  if (!descriptionElement) {
    descriptionElement = document.createElement ('div');
    descriptionElement.id = 'weatherCodeDescription';
    descriptionElement.className =
      'weather-description alert alert-info mt-2 p-2';
    document
      .getElementById ('currentWeather-group')
      .appendChild (descriptionElement);
  }

  if (weatherInfo) {
    // عرض الشرح إذا وجد الرمز
    descriptionElement.textContent = weatherInfo.description;
    descriptionElement.className =
      'weather-description alert alert-info mt-2 p-2';
    descriptionElement.style.display = 'block';
  } else {
    // إذا كان الرمز غير معروف
    descriptionElement.textContent =
      'رمز الطقس غير معروف - تأكد من إدخال رمز صحيح مكون من رقمين';
    descriptionElement.className =
      'weather-description alert alert-warning mt-2 p-2';
    descriptionElement.style.display = 'block';
  }
}

// دالة لإخفاء شرح الطقس
function hideWeatherDescription () {
  const descriptionElement = document.getElementById ('weatherCodeDescription');
  if (descriptionElement) {
    descriptionElement.style.display = 'none';
  }
}

// دالة لحساب القيم المشتقة
function calculateDerivedValues () {
  const dryTemp = parseFloat (document.getElementById ('dryTemp').value);
  const wetTemp = parseFloat (document.getElementById ('wetTemp').value);
  const stationPressure = parseFloat (
    document.getElementById ('stationPressure').value
  );

  if (isNaN (dryTemp) || isNaN (wetTemp) || isNaN (stationPressure)) {
    showAlert (
      'يجب إدخال قيم صحيحة لدرجة الحرارة الجافة والرطبة وضغط المحطة',
      'warning'
    );
    return;
  }

  // حساب ضغط بخار الماء (معادلة مبسطة)
  const vaporPressure = 6.11 * Math.pow (10, 7.5 * wetTemp / (237.3 + wetTemp));

  // حساب درجة الندى (معادلة مبسطة)
  const dewPoint =
    237.3 *
    Math.log (vaporPressure / 6.11) /
    (7.5 - Math.log (vaporPressure / 6.11));

  // حساب الرطوبة النسبية
  const saturationVaporPressure =
    6.11 * Math.pow (10, 7.5 * dryTemp / (237.3 + dryTemp));
  const relativeHumidity = vaporPressure / saturationVaporPressure * 100;

  // حساب فرق ضغط بخار الماء عن الإشباع
  const vaporPressureDiff = saturationVaporPressure - vaporPressure;

  // عرض النتائج
  document.getElementById (
    'vaporPressureResult'
  ).textContent = vaporPressure.toFixed (2);
  document.getElementById ('dewPointResult').textContent = dewPoint.toFixed (2);
  document.getElementById (
    'humidityResult'
  ).textContent = relativeHumidity.toFixed (2);
  document.getElementById (
    'vaporDiffResult'
  ).textContent = vaporPressureDiff.toFixed (2);

  // تحديث ملخص النتائج
  document.getElementById ('summaryVapor').textContent =
    vaporPressure.toFixed (2) + ' ميلبار';
  document.getElementById ('summaryDew').textContent =
    dewPoint.toFixed (2) + ' سْ';
  document.getElementById ('summaryHumidity').textContent =
    relativeHumidity.toFixed (2) + '%';
  document.getElementById ('summaryDiff').textContent =
    vaporPressureDiff.toFixed (2) + ' ميلبار';

  // إضافة تأثير للنتائج المحسوبة
  const results = document.querySelectorAll ('.calculated-value');
  results.forEach (result => {
    result.classList.add ('pulse');
    setTimeout (() => {
      result.classList.remove ('pulse');
    }, 1000);
  });

  showAlert ('تم حساب القيم المشتقة بنجاح', 'success');
}
// التحقق من صحة البيانات قبل الإرسال
function validateForm () {
  // إعادة تعيين جميع أخطاء التحقق
  resetAllValidationErrors ();

  let isValid = true;
  let missingFields = [];
  let invalidFields = [];

  // 1. التحقق من الحقول المطلوبة الأساسية
  const requiredFields = [
    {id: 'station', name: 'اسم المحطة'},
    {id: 'observationTime', name: 'توقيت الرصد المحلي'},
    {id: 'observationDate', name: 'تاريخ الرصد'},
    {id: 'observer', name: 'اسم الراصد'},
    {id: 'station-password', name: 'كلمة مرور المحطة'},
    {id: 'dryTemp', name: 'درجة الحرارة الجافة'},
    {id: 'wetTemp', name: 'درجة الحرارة الرطبة'},
    {id: 'stationPressure', name: 'ضغط المحطة'},
    {id: 'stationPressureMSL', name: 'ضغط المحطة المحول لسطح البحر'},
  ];

  requiredFields.forEach (field => {
    const fieldElement = document.getElementById (field.id);
    if (!fieldElement.value.trim ()) {
      isValid = false;
      missingFields.push (field.name);
      fieldElement.classList.add ('is-invalid');

      // إضافة رسالة خطأ محددة
      showFieldError (fieldElement, 'هذا الحقل مطلوب');
    }
  });

  // 2. التحقق من صحة التوقيت
  const observationTime = document.getElementById ('observationTime').value;
  if (observationTime && !/^([0-1][0-9]|2[0-3])$/.test (observationTime)) {
    isValid = false;
    invalidFields.push ('توقيت الرصد المحلي');
    showFieldError (
      document.getElementById ('observationTime'),
      'يجب أن يكون الوقت بين 00 و 23'
    );
  }

  // 3. التحقق من صحة درجات الحرارة
  const dryTemp = document.getElementById ('dryTemp');
  const wetTemp = document.getElementById ('wetTemp');

  if (dryTemp.value) {
    if (!validateTemperature (dryTemp, true)) {
      isValid = false;
      invalidFields.push ('درجة الحرارة الجافة');
    }
  }

  if (wetTemp.value) {
    if (!validateTemperature (wetTemp, false, dryTemp)) {
      isValid = false;
      invalidFields.push ('درجة الحرارة الرطبة');
    }
  }

  // 4. التحقق من صحة الضغط
  const stationPressure = document.getElementById ('stationPressure');
  const stationPressureMSL = document.getElementById ('stationPressureMSL');

  if (stationPressure.value && !validatePressure (stationPressure)) {
    isValid = false;
    invalidFields.push ('ضغط المحطة');
  }

  if (stationPressureMSL.value && !validatePressure (stationPressureMSL)) {
    isValid = false;
    invalidFields.push ('ضغط المحطة المحول لسطح البحر');
  }

  // 5. التحقق من صحة اتجاه الرياح
  const windDirSurface = document.getElementById ('windDirSurface');
  const windDirMean = document.getElementById ('windDirMean');

  if (windDirSurface.value && !validateWindDirection (windDirSurface)) {
    isValid = false;
    invalidFields.push ('اتجاه الرياح السطحية');
  }

  if (windDirMean.value && !validateWindDirection (windDirMean)) {
    isValid = false;
    invalidFields.push ('اتجاه المتوسط الساعي');
  }

  // 6. التحقق من صحة سرعة الرياح
  const windSpeedSurface = document.getElementById ('windSpeedSurface');
  const windSpeedMean = document.getElementById ('windSpeedMean');

  if (windSpeedSurface.value && !validateWindSpeed (windSpeedSurface)) {
    isValid = false;
    invalidFields.push ('سرعة الرياح السطحية');
  }

  if (windSpeedMean.value && !validateWindSpeed (windSpeedMean)) {
    isValid = false;
    invalidFields.push ('سرعة المتوسط الساعي');
  }

  // 7. التحقق من صحة الرؤية
  const visibility = document.getElementById ('visibility');
  if (visibility.value && !validateVisibility (visibility)) {
    isValid = false;
    invalidFields.push ('الرؤية السطحية الأفقية');
  }

  // 8. التحقق من صحة الطقس الحاضر
  const currentWeather = document.getElementById ('currentWeather');
  if (currentWeather.value && !validateCurrentWeather (currentWeather)) {
    isValid = false;
    invalidFields.push ('الطقس الحاضر');
  }

  // 9. التحقق من صحة الطقس الغابر
  const pastWeather = document.getElementById ('pastWeather');
  if (pastWeather.value && !validatePastWeather (pastWeather)) {
    isValid = false;
    invalidFields.push ('الطقس الغابر');
  }

  // 10. التحقق من صحة تغطية السحب
  for (let i = 1; i <= 4; i++) {
    const cloudAmount = document.getElementById (`cloudAmount${i}`);
    if (cloudAmount.value && !validateCloudCover (cloudAmount)) {
      isValid = false;
      invalidFields.push (`كمية السحب الطبقة ${i}`);
    }
  }

  // 11. التحقق من صحة ارتفاع السحب
  for (let i = 1; i <= 3; i++) {
    const cloudHeight = document.getElementById (`cloudHeight${i}`);
    const cloudAmount = document.getElementById (`cloudAmount${i}`);

    // التحقق من الارتفاع فقط إذا كانت كمية السحب > 0
    if (cloudAmount.value && cloudAmount.value !== '0' && cloudHeight.value) {
      if (!validateCloudHeight (cloudHeight)) {
        isValid = false;
        invalidFields.push (`ارتفاع السحب الطبقة ${i}`);
      }
    }
  }

  // 12. التحقق من الحقول الجديدة (cloudSum12 و cloudSum123)
  const cloudSum12 = document.getElementById ('cloudSum12');
  const cloudSum123 = document.getElementById ('cloudSum123');

  if (cloudSum12.value && !validateCloudSum (cloudSum12)) {
    isValid = false;
    invalidFields.push ('مجموع السحب 1+2');
  }

  if (cloudSum123.value && !validateCloudSum (cloudSum123)) {
    isValid = false;
    invalidFields.push ('مجموع السحب 1+2+3');
  }

  // 13. التحقق من تأكيد المسؤولية
  if (!document.getElementById ('responsibilityCheckbox').checked) {
    isValid = false;
    showAlert ('يجب الموافقة على تحمل المسؤولية قبل الإرسال', 'warning');

    // تسليط الضوء على خانة التأكيد
    const checkbox = document.getElementById ('responsibilityCheckbox');
    checkbox.classList.add ('is-invalid');
    const label = checkbox.nextElementSibling;
    label.classList.add ('text-danger', 'fw-bold');
  }

  // 14. إذا كان هناك أخطاء، عرض رسالة تفصيلية
  if (!isValid) {
    let errorMessage = 'يوجد أخطاء في النموذج:\n';

    if (missingFields.length > 0) {
      errorMessage += `\n• الحقول المطلوبة: ${missingFields.join ('، ')}`;
    }

    if (invalidFields.length > 0) {
      errorMessage += `\n• الحقول غير الصحيحة: ${invalidFields.join ('، ')}`;
    }

    showAlert (errorMessage, 'warning');

    // التمرير إلى أول حقل به خطأ
    scrollToFirstError ();
  }

  return isValid;
}

// دالة مساعدة لإعادة تعيين جميع أخطاء التحقق
function resetAllValidationErrors () {
  // إزالة جميع أخطاء التحقق
  document.querySelectorAll ('.is-invalid').forEach (element => {
    element.classList.remove ('is-invalid');
  });

  // إزالة جميع رسائل الخطأ
  document.querySelectorAll ('.invalid-feedback').forEach (element => {
    element.remove ();
  });

  // إعادة تعيين تنسيق خانة التأكيد
  const checkbox = document.getElementById ('responsibilityCheckbox');
  if (checkbox) {
    checkbox.classList.remove ('is-invalid');
    const label = checkbox.nextElementSibling;
    if (label) {
      label.classList.remove ('text-danger', 'fw-bold');
    }
  }
}

// دالة للتمرير إلى أول حقل به خطأ
function scrollToFirstError () {
  const firstError = document.querySelector ('.is-invalid');
  if (firstError) {
    firstError.scrollIntoView ({
      behavior: 'smooth',
      block: 'center',
    });

    // إضافة تأثير اهتزاز للحقل
    firstError.classList.add ('shake');
    setTimeout (() => {
      firstError.classList.remove ('shake');
    }, 500);

    // التركيز على الحقل
    firstError.focus ();
  }
}

// دالة للتحقق من صحة الرؤية
function validateVisibility (input) {
  let value = input.value;

  // إذا كانت القيمة فارغة، لا تفعل شيئاً
  if (!value) return true;

  // التحقق من أن القيمة رقمية
  if (!/^\d+$/.test (value)) {
    showFieldError (input, 'يجب إدخال أرقام فقط');
    return false;
  }

  // التحقق من النطاق (0 إلى 999)
  const numValue = parseInt (value);
  if (numValue < 0 || numValue > 999) {
    showFieldError (input, 'يجب أن تكون القيمة بين 000 و 999');
    return false;
  }

  // إذا كانت كل الشروط صحيحة، إخفاء أي أخطاء
  hideFieldError (input);
  return true;
}

// دالة للتحقق من صحة الطقس الحاضر
function validateCurrentWeather (input) {
  let value = input.value;

  // إذا كانت القيمة فارغة، لا تفعل شيئاً
  if (!value) return true;

  // التحقق من أن القيمة رقمية ومكونة من رقمين
  if (!/^\d{2}$/.test (value)) {
    showFieldError (input, 'يجب إدخال رمز مكون من رقمين');
    return false;
  }

  // التحقق من النطاق (00 إلى 99)
  const numValue = parseInt (value);
  if (numValue < 0 || numValue > 99) {
    showFieldError (input, 'يجب أن يكون الرمز بين 00 و 99');
    return false;
  }

  // إذا كانت كل الشروط صحيحة، إخفاء أي أخطاء
  hideFieldError (input);
  return true;
}

// دالة للتحقق من صحة مجموع السحب
function validateCloudSum (input) {
  let value = input.value;

  // إذا كانت القيمة فارغة، لا تفعل شيئاً
  if (!value) return true;

  // التحقق من أن القيمة رقمية
  if (!/^\d+$/.test (value)) {
    showFieldError (input, 'يجب إدخال أرقام فقط');
    return false;
  }

  // التحقق من النطاق (0 إلى 16 لمجموع 1+2، 0 إلى 24 لمجموع 1+2+3)
  const numValue = parseInt (value);
  const maxValue = input.id === 'cloudSum12' ? 16 : 24;

  if (numValue < 0 || numValue > maxValue) {
    showFieldError (input, `يجب أن تكون القيمة بين 0 و ${maxValue}`);
    return false;
  }

  // إذا كانت كل الشروط صحيحة، إخفاء أي أخطاء
  hideFieldError (input);
  return true;
}

// دالة للتحقق من صحة ارتفاع السحب
function validateCloudHeight (input) {
  let value = input.value;

  // إذا كانت القيمة فارغة، لا تفعل شيئاً
  if (!value) return true;

  // التحقق من أن القيمة رقمية
  if (!/^\d+$/.test (value)) {
    showFieldError (input, 'يجب إدخال أرقام فقط');
    return false;
  }

  // التحقق من النطاق (0 إلى 999)
  const numValue = parseInt (value);
  if (numValue < 0 || numValue > 999) {
    showFieldError (input, 'يجب أن تكون القيمة بين 000 و 999');
    return false;
  }

  // إذا كانت كل الشروط صحيحة، إخفاء أي أخطاء
  hideFieldError (input);
  return true;
}

// دالة لعرض خطأ للحقل
function showFieldError (input, message) {
  // إزالة أي رسائل خطأ سابقة
  hideFieldError (input);

  // إضافة صنف الخطأ للحقل
  input.classList.add ('is-invalid');

  // إنشاء عنصر رسالة الخطأ
  const errorDiv = document.createElement ('div');
  errorDiv.className = 'invalid-feedback';
  errorDiv.textContent = message;
  errorDiv.id = input.id + 'Error';

  // إضافة رسالة الخطأ بعد الحقل
  input.parentNode.appendChild (errorDiv);
}

// دالة لإخفاء خطأ الحقل
function hideFieldError (input) {
  // إزالة صنف الخطأ
  input.classList.remove ('is-invalid');

  // إزالة رسالة الخطأ إذا كانت موجودة
  const errorDiv = document.getElementById (input.id + 'Error');
  if (errorDiv) {
    errorDiv.remove ();
  }
}

// إعادة تعيين النموذج
function resetForm () {
  if (
    confirm (
      'هل أنت متأكد من أنك تريد إعادة تعيين النموذج؟ سيتم فقدان جميع البيانات المدخلة.'
    )
  ) {
    document.getElementById ('station').selectedIndex = 0;
    document.getElementById ('observationTime').value = '';
    document.getElementById ('observer').value = '';
    document.getElementById ('station-password').value = '';
    document.getElementById ('dryTemp').value = '';
    document.getElementById ('wetTemp').value = '';
    document.getElementById ('stationPressure').value = '';
    document.getElementById ('stationPressureMSL').value = '';
    document.getElementById ('windDirSurface').value = '';
    document.getElementById ('windSpeedSurface').value = '';
    document.getElementById ('windDirMean').value = '';
    document.getElementById ('windSpeedMean').value = '';
    document.getElementById ('visibility').value = '';
    document.getElementById ('currentWeather').value = '';
    document.getElementById ('pastWeather').value = '';
    document.getElementById ('cloudCoverTotal').value = '';
    document.getElementById ('cloudAmount1').value = '';
    document.getElementById ('cloudType1').value = '';
    document.getElementById ('cloudHeight1').value = '';
    document.getElementById ('cloudAmount2').value = '';
    document.getElementById ('cloudType2').value = '';
    document.getElementById ('cloudHeight2').value = '';
    document.getElementById ('cloudAmount3').value = '';
    document.getElementById ('cloudType3').value = '';
    document.getElementById ('cloudHeight3').value = '';
    document.getElementById ('cloudAmount4').value = '';
    document.getElementById ('responsibilityCheckbox').checked = false;

    // إخفاء جميع شروح السحب
    for (let i = 1; i <= 3; i++) {
      const descElement = document.getElementById (`cloudDescription${i}`);
      if (descElement) descElement.style.display = 'none';
    }

    // إعادة تعيين النتائج المحسوبة
    document.querySelectorAll ('.calculated-value').forEach (el => {
      el.textContent = 'لا توجد قيمة';
    });

    // إعادة تعيين ملخص النتائج
    document.getElementById ('summaryVapor').textContent = 'لا توجد قيمة';
    document.getElementById ('summaryDew').textContent = 'لا توجد قيمة';
    document.getElementById ('summaryHumidity').textContent = 'لا توجد قيمة';
    document.getElementById ('summaryDiff').textContent = 'لا توجد قيمة';

    hideWeatherDescription ();
    updateStationInfo ();

    showAlert ('تم إعادة تعيين النموذج بنجاح', 'info');
  }
}

// تعريف رموز السحب وشرحها
const cloudCodes = {
  // الطبقة الأولى
  '0': '0 - لا يوجد غيوم',
  cu1: 'CU1 - سحب كومولوس صغيرة مع تطور رأسي محدود',
  cu2: 'CU2 - سحب كومولوس متوسطة مع تطور رأسي واضح',
  cb3: 'CB3 - سحب كومولونيمبوس متوسطة مع عواصف رعدية محتملة',
  sc4: 'SC4 - سحب ستراتوكومولوس تغطي جزءًا من السماء',
  sc5: 'SC5 - سحب ستراتوكومولوس تغطي معظم السماء',
  st: 'ST - سحب ستراتوس منخفضة تغطي السماء',
  'f5-fc': 'F5-FC - ضباب مع انخفاض شديد في الرؤية',
  'sc8-sc': 'SC8-SC - سحب ستراتوكومولوس كثيفة مع إمكانية هطول خفيف',
  cb: 'CB - سحب كومولونيمبوس مع عواصف رعدية وهطول غزير',

  // الطبقة الثانية
  as1: 'AS1 - سحب ألتوستراتوس رقيقة شبه شفافة',
  'ns-as1': 'NS-AS1 - خليط من سحب نيمبوستراتوس وألتوستراتوس مع هطول',
  'ns-as2': 'NS-AS2 - سحب نيمبوستراتوس وألتوストratos مع هطول مستمر',
  ac2: 'AC2 - سحب ألتوكومولوس على شكل صفائف أو طبقات',
  ac4: 'AC4 - سحب ألتوكومولوس متزايدة تدريجياً',
  ac5: 'AC5 - سحب ألتوكومولوس تغطي السماء بشكل غير متجانس',
  ac6: 'AC6 - سحب ألتوكومولوس ذات أشكال متغيرة سريعاً',
  'ns-as7': 'NS-AS7 - سحب نيمبوستراتوس كثيفة مع هطول غزير',
  ac8: 'AC8 - سحب ألتوكومولوس ذات قمم متكتلة',
  ac9: 'AC9 - سحب ألتوكومولوس ذات أشكال برجية',

  // الطبقة الثالثة
  ci1: 'CI1 - سحب سيروس خيطية غير متصلة',
  ci2: 'CI2 - سحب سيروس كثيفة متصلة',
  ci3: 'CI3 - سحب سيروس على شكل خطافات',
  ci4: 'CI4 - سحب سيروس كثيفة مع تزايد تدريجي',
  'cs-ci5': 'CS-CI5 - خليط من سحب سيروستراتوس وسيروس',
  cs7: 'CS7 - سحب سيروستراتوس تغطي السماء كلياً',
  cs8: 'CS8 - سحب سيروستراتوس لا تغطي السماء كلياً',
  cs9: 'CS9 - سحب سيروستراتوس ذات مظهر ليفي',
};

// دالة للحصول على وصف مفصل للسحابة حسب الرمز والطبقة
function getCloudDescriptionByCode (code, layer) {
  const descriptions = {
    // الطبقة الأولى
    '0': 'السماء صافية تماماً بدون أي غيوم.',
    cu1: 'سحب كومولوس صغيرة الحجم ذات تطور رأسي محدود، تشير إلى طقس مستقر.',
    cu2: 'سحب كومولوس متوسطة الحجم ذات تطور رأسي واضح، قد تتطور إلى سحب ركامية.',
    cb3: 'سحب كومولونيمبوس متوسطة الحجم مع إمكانية تكون عواصف رعدية وهطول أمطار.',
    sc4: 'سحب ستراتوكومولوس تغطي جزءاً من السماء، عادة ما تكون غير مصحوبة بهطول.',
    sc5: 'سحب ستراتوكومولوس تغطي معظم السماء، قد تكون مصحوبة برذاذ خفيف.',
    st: 'سحب ستراتوس منخفضة تغطي السماء بشكل كامل، غالباً ما تكون مصحوبة برذاذ.',
    'f5-fc': 'ضباب كثيف مع انخفاض شديد في الرؤية الأفقية إلى أقل من 1000 متر.',
    'sc8-sc': 'سحب ستراتوكومولوس كثيفة قد تكون مصحوبة بهطول خفيف من المطر أو الثلج.',
    cb: 'سحب كومولونيمبوس ضخمة مصحوبة بعواصف رعدية وهطول غزير ورياح قوية.',

    // الطبقة الثانية
    as1: 'سحب ألتوستراتوس رقيقة شبه شفافة، لا تحجب الشمس تماماً.',
    'ns-as1': 'خليط من سحب نيمبوستراتوس وألتوستراتوس مصحوب بهطول مطر خفيف إلى متوسط.',
    'ns-as2': 'سحب نيمبوستراتوس وألتوستراتوس كثيفة مصحوبة بهطول مطر مستمر.',
    ac2: 'سحب ألتوكومولوس على شكل صفائف أو طبقات منتظمة، تشير إلى استقرار جوي.',
    ac4: 'سحب ألتوكومولوس في حالة تزايد تدريجي، قد تشير إلى تغير في الطقس.',
    ac5: 'سحب ألتوكومولوس تغطي السماء بشكل غير متجانس مع وجود فجوات.',
    ac6: 'سحب ألتوكومولوس سريعة التغير في الشكل، تشير إلى عدم استقرار في الطبقات المتوسطة.',
    'ns-as7': 'سحب نيمبوستراتوس كثيفة جداً مصحوبة بهطول غزير ومستمر.',
    ac8: 'سحب ألتوكومولوس ذات قمم متكتلة تشبه القلنسوة، تدل على وجود تيارات صاعدة.',
    ac9: 'سحب ألتوكومولوس ذات أشكال برجية، تشير إلى عدم استقرار في الطبقات المتوسطة.',

    // الطبقة الثالثة
    ci1: 'سحب سيروس خيطية غير متصلة، تشير إلى طقس مستقر.',
    ci2: 'سحب سيروس كثيفة ومتصلة، قد تكون نذيراً بتغير الطقس.',
    ci3: 'سحب سيروس على شكل خطافات، تدل على وجود تيارات هوائية علوية.',
    ci4: 'سحب سيروس كثيفة في حالة تزايد تدريجي، غالباً ما تسبق المنخفضات الجوية.',
    'cs-ci5': 'خليط من سحب سيروستراتوس وسيروس، تشير إلى اقتراب جبهة دافئة.',
    cs7: 'سحب سيروستراتوس تغطي السماء كلياً، تسبب هالة حول الشمس أو القمر.',
    cs8: 'سحب سيروستراتوس لا تغطي السماء كلياً، تكون على شكل طبقات متقطعة.',
    cs9: 'سحب سيروستراتوس ذات مظهر ليفي، تدل على وجود رطوبة في الطبقات العليا.',
  };

  return descriptions[code] || 'لا يوجد وصف مفصل لهذا النوع من السحب.';
}

// دالة لعرض تفاصيل السحابة المختارة
function showCloudDescription (selectElement, layerNumber) {
  const code = selectElement.value;
  const descriptionElement = document.getElementById (
    `cloudDescription${layerNumber}`
  );

  if (code && cloudCodes[code]) {
    descriptionElement.innerHTML = `
            <h6 class="fw-bold">${cloudCodes[code]}</h6>
            <div class="small">
                <p>${getCloudDescriptionByCode (code, layerNumber)}</p>
            </div>
        `;
    descriptionElement.style.display = 'block';

    // إضافة تأثير للظهور
    descriptionElement.classList.add ('fade-in');
  } else {
    descriptionElement.style.display = 'none';
  }
}

// دالة لعرض رسائل تنبيه جميلة
function showAlert (message, type = 'info') {
  // إزالة أي تنبيهات سابقة
  const existingAlerts = document.querySelectorAll ('.custom-alert');
  existingAlerts.forEach (alert => alert.remove ());

  const alertDiv = document.createElement ('div');
  alertDiv.className = `custom-alert alert alert-${type} alert-dismissible fade show`;
  alertDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'warning' ? 'fa-exclamation-triangle' : type === 'danger' ? 'fa-times-circle' : 'fa-info-circle'} me-2"></i>
            <div>${message}</div>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

  // إضافة أنيميشن للتنبيه
  alertDiv.style.cssText =
    'position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';

  // إضافة التنبيه في أعلى الصفحة
  document.body.appendChild (alertDiv);

  // إزالة التنبيه تلقائياً بعد 5 ثوان
  setTimeout (() => {
    if (alertDiv.parentElement) {
      alertDiv.remove ();
    }
  }, 5000);
}

// دالة لتسليط الضوء على الحقول المطلوبة الفارغة
function highlightEmptyFields() {
    const requiredFields = document.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            
            // إزالة التمييز عند ملء الحقل
            field.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.classList.remove('is-invalid');
                }
            });
        }
    });
}

// دالة لتحميل البيانات كملف JSON
function downloadData() {
    if (!validateForm()) return;
    
    // جمع البيانات من النموذج
    const formData = {
        station: {
            code: document.getElementById('stationCode').value,
            name: document.getElementById('stationName').value,
            elevation: document.getElementById('elevation').value
        },
        observation: {
            date: document.getElementById('observationDate').value,
            time: document.getElementById('observationTime').value,
            utcTime: convertToUTC(document.getElementById('observationTime').value)
        },
        observer: document.getElementById('observer').value,
        temperature: {
            dry: document.getElementById('dryTemp').value,
            wet: document.getElementById('wetTemp').value
        },
        pressure: {
            station: document.getElementById('stationPressure').value,
            msl: document.getElementById('stationPressureMSL').value
        },
        calculated: {
            vaporPressure: document.getElementById('vaporPressureResult').textContent,
            dewPoint: document.getElementById('dewPointResult').textContent,
            humidity: document.getElementById('humidityResult').textContent,
            vaporDiff: document.getElementById('vaporDiffResult').textContent
        },
        wind: {
            surfaceDir: document.getElementById('windDirSurface').value,
            surfaceSpeed: document.getElementById('windSpeedSurface').value,
            meanDir: document.getElementById('windDirMean').value,
            meanSpeed: document.getElementById('windSpeedMean').value
        },
        visibility: document.getElementById('visibility').value,
        weather: {
            current: document.getElementById('currentWeather').value,
            past: document.getElementById('pastWeather').value
        },
        clouds: {
            totalCover: document.getElementById('cloudCoverTotal').value,
            layer1: {
                amount: document.getElementById('cloudAmount1').value,
                type: document.getElementById('cloudType1').value,
                height: document.getElementById('cloudHeight1').value
            },
            layer2: {
                amount: document.getElementById('cloudAmount2').value,
                type: document.getElementById('cloudType2').value,
                height: document.getElementById('cloudHeight2').value
            },
            layer3: {
                amount: document.getElementById('cloudAmount3').value,
                type: document.getElementById('cloudType3').value,
                height: document.getElementById('cloudHeight3').value
            },
            layer4: {
                amount: document.getElementById('cloudAmount4').value
            }
        },
        metadata: {
            generated: new Date().toISOString(),
            version: "1.0"
        }
    };
    
    // تحويل البيانات إلى JSON
    const jsonData = JSON.stringify(formData, null, 2);
    
    // إنشاء رابط تحميل
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weather_data_${formData.station.code}_${formData.observation.date}_${formData.observation.time}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showAlert('تم تحميل البيانات بنجاح', 'success');
}

// دالة لإضافة تأثير كتابة آلي للنصوص
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = "";
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// دالة لتحريك العناصر عند التمرير
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', async function() {
    updateDate();
    
    // تعيين تاريخ اليوم كقيمة افتراضية
    document.getElementById('observationDate').valueAsDate = new Date();
    
    // تحديث معلومات المحطة عند التغيير
    document.getElementById("station").addEventListener("change", updateStationInfo);
    
    // تحميل رموز الطقس
    weatherCodes = await loadWeatherCodes();
    console.log('عدد الرموز المحملة:', weatherCodes.length);
    
    // إضافة مستمعات الأحداث لحقول إدخال رموز السحب
    for (let i = 1; i <= 3; i++) {
        const select = document.getElementById(`cloudType${i}`);
        if (select) {
            select.addEventListener('change', function() {
                showCloudDescription(this, i);
            });
        }
    }
    
    // إضافة مستمع حدث لحقل الطقس الحاضر
    document.getElementById('currentWeather').addEventListener('input', function() {
        const code = this.value.trim();
        showWeatherCodeDescription(code);
    });
    
    // إضافة مستمع حدث لحقل الطقس الحاضر عند فقدان التركيز
    document.getElementById('currentWeather').addEventListener('blur', function() {
        const code = this.value.trim();
        showWeatherCodeDescription(code);
    });
    
    // إضافة مستمع لزر حساب القيم المشتقة
    document.getElementById('calculateBtn').addEventListener('click', calculateDerivedValues);
    document.getElementById ('sendBtn').addEventListener ('click', sendData);

    
    // إضافة مستمع لزر تحميل البيانات
    document.getElementById("downloadDataBtn").addEventListener("click", downloadData);
    
    // إعادة تعيين النموذج
    document.getElementById("resetBtn").addEventListener("click", resetForm);
    
    // إضافة تحقق من صحة وقت الرصد (00-23)
    document.getElementById("observationTime").addEventListener("change", function() {
        const time = parseInt(this.value);
        if (isNaN(time) || time < 0 || time > 23) {
            showAlert("وقت الرصد يجب أن يكون بين 00 و 23", "warning");
            this.value = "";
            this.focus();
        } else {
            // تأكد من أن القيمة مكونة من رقمين
            this.value = time.toString().padStart(2, '0');
            // عرض التوقيت العالمي
            showUTCTime(this.value);
        }
    });
    
    // إضافة مستمع حدث لحقل التوقيت المحلي
    document.getElementById('observationTime').addEventListener('input', function() {
        const time = this.value.trim();
        if (time.length === 2) {
            showUTCTime(time);
        } else {
            document.getElementById('utcTimeInfo').style.display = 'none';
        }
    });
    
    // إضافة مستمع حدث عند فقدان التركيز
    document.getElementById('observationTime').addEventListener('blur', function() {
        const time = this.value.trim();
        if (time.length === 2) {
            showUTCTime(time);
        }
    });
    
    // إضافة تأثيرات للعناصر عند التمرير
    window.addEventListener('scroll', animateOnScroll);
    // تشغيل مرة أولى عند التحميل
    animateOnScroll();
    
    // إضافة تأثيرات للبطاقات
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.add('animate-on-scroll');
    });
    
    // إضافة تأثيرات للأزرار
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('scale-105');
        });
        button.addEventListener('mouseleave', function() {
            this.classList.remove('scale-105');
        });
    });
    
    // إضافة تأثيرات للحقول
    const inputs = document.querySelectorAll('.form-control, .form-select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('shadow-soft');
        });
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('shadow-soft');
        });
    });
    
    // إضافة تأثيرات للبطاقات الداخلية
    const innerCards = document.querySelectorAll('.wind-section .card');
    innerCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('shadow-medium');
        });
        card.addEventListener('mouseleave', function() {
            this.classList.remove('shadow-medium');
        });
    });
    
    // إضافة تأثيرات للنتائج
    const resultItems = document.querySelectorAll('.result-item');
    resultItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.classList.add('bg-light');
        });
        item.addEventListener('mouseleave', function() {
            this.classList.remove('bg-light');
        });
    });
    
    // إضافة تأثيرات للرأس
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('shadow-medium');
        } else {
            header.classList.remove('shadow-medium');
        }
    });
    
    // إضافة مستمعات الأحداث للتحقق من المدخلات
    document.getElementById('dryTemp').addEventListener('blur', function() {
        formatTemperature(this);
        validateTemperature(this, true);
        
        // التحقق من العلاقة مع الحرارة الرطبة
        const wetTemp = document.getElementById('wetTemp');
        if (wetTemp.value) {
            validateTemperature(wetTemp, false, this);
        }
    });
    
    document.getElementById('wetTemp').addEventListener('blur', function() {
        formatTemperature(this);
        validateTemperature(this, false, document.getElementById('dryTemp'));
    });
    
    document.getElementById('stationPressure').addEventListener('blur', function() {
        formatPressure(this);
        validatePressure(this);
    });
    
    document.getElementById('stationPressureMSL').addEventListener('blur', function() {
        formatPressure(this);
        validatePressure(this);
    });
    
    document.getElementById('visibility').addEventListener('blur', function() {
        validateVisibility(this);
    });
    const windDirSurface = document.getElementById ('windDirSurface');
const windDirMean = document.getElementById ('windDirMean');
const windSpeedSurface = document.getElementById ('windSpeedSurface');
const windSpeedMean = document.getElementById ('windSpeedMean');

if (windDirSurface) {
  windDirSurface.addEventListener ('blur', function () {
    validateWindDirection (this);
  });
}

if (windDirMean) {
  windDirMean.addEventListener ('blur', function () {
    validateWindDirection (this);
  });
}

if (windSpeedSurface) {
  windSpeedSurface.addEventListener ('blur', function () {
    validateWindSpeed (this);
  });
}

if (windSpeedMean) {
  windSpeedMean.addEventListener ('blur', function () {
    validateWindSpeed (this);
  });
}

    // إضافة مستمعات الأحداث لتغطية الغيوم
    for (let i = 1; i <= 4; i++) {
        const cloudInput = document.getElementById(`cloudAmount${i}`);
        if (cloudInput) {
            cloudInput.addEventListener('blur', function() {
                validateCloudCover(this);
            });
        }
    }
    
    // منع إدخال أكثر من 3 أحرف في درجة الحرارة
    document.getElementById('dryTemp').addEventListener('input', function(e) {
        if (this.value.length > 5) { // -XX.X
            this.value = this.value.slice(0, 5);
        }
    });
    
    document.getElementById('wetTemp').addEventListener('input', function(e) {
        if (this.value.length > 5) { // -XX.X
            this.value = this.value.slice(0, 5);
        }
    });
    
    // منع إدخال علامة سالب في درجة الحرارة الجافة
    document.getElementById('dryTemp').addEventListener('keydown', function(e) {
        if (e.key === '-') {
            e.preventDefault();
        }
    });
});
const currentWeather = document.getElementById ('currentWeather');
if (currentWeather) {
  currentWeather.addEventListener ('input', function () {
    const code = this.value.trim ();
    showWeatherCodeDescription (code);
  });

  currentWeather.addEventListener ('blur', function () {
    const code = this.value.trim ();
    showWeatherCodeDescription (code);
  });
}

// تحقق من وجود الأزرار قبل إضافة المستمعات
const calculateBtn = document.getElementById ('calculateBtn');
if (calculateBtn) {
  calculateBtn.addEventListener ('click', calculateDerivedValues);
}

const sendBtn = document.getElementById ('sendBtn');
if (sendBtn) {
  sendBtn.addEventListener ('click', function () {
    if (validateForm ()) {
      showAlert ('تم إرسال البيانات بنجاح!', 'success');
    }
  });
}
// دالة للتحقق من صحة سرعة الرياح
function validateWindSpeed (input) {
  let value = input.value;

  // إذا كانت القيمة فارغة، لا تفعل شيئاً
  if (!value) return true;

  // التحقق من أن القيمة رقمية
  if (!/^\d+$/.test (value)) {
    showFieldError (input, 'يجب إدخال أرقام فقط');
    return false;
  }

  // التأكد من أن القيمة مكونة من رقمين
  if (value.length < 2) {
    value = value.padStart (2, '0');
    input.value = value;
  }

  // التحقق من النطاق (00 إلى 99)
  const numValue = parseInt (value);
  if (numValue < 0 || numValue > 99) {
    showFieldError (input, 'يجب أن تكون القيمة بين 00 و 99');
    return false;
  }

  // إذا كانت كل الشروط صحيحة، إخفاء أي أخطاء
  hideFieldError (input);
  return true;
}
// دالة للتحقق من صحة اتجاه الرياح
function validateWindDirection (input) {
  let value = input.value;

  // إذا كانت القيمة فارغة، لا تفعل شيئاً
  if (!value) return true;

  // التحقق من أن القيمة رقمية
  if (!/^\d+$/.test (value)) {
    showFieldError (input, 'يجب إدخال أرقام فقط');
    return false;
  }

  // التأكد من أن القيمة مكونة من رقمين
  if (value.length < 2) {
    value = value.padStart (2, '0');
    input.value = value;
  }

  // التحقق من النطاق (00 إلى 36)
  const numValue = parseInt (value);
  if (numValue < 0 || numValue > 36) {
    showFieldError (input, 'يجب أن تكون القيمة بين 00 و 36');
    return false;
  }

  // إذا كانت كل الشروط صحيحة، إخفاء أي أخطاء
  hideFieldError (input);
  return true;
}

// إضافة مستمعات الأحداث للتحقق من اتجاه الرياح
document
  .getElementById ('windDirSurface')
  .addEventListener ('blur', function () {
    validateWindDirection (this);
  });

document.getElementById ('windDirMean').addEventListener ('blur', function () {
  validateWindDirection (this);
});

// إضافة مستمعات الأحداث للتحقق من سرعة الرياح
document
  .getElementById ('windSpeedSurface')
  .addEventListener ('blur', function () {
    validateWindSpeed (this);
  });

document
  .getElementById ('windSpeedMean')
  .addEventListener ('blur', function () {
    validateWindSpeed (this);
  });

// إضافة مستمعات الأحداث للتحقق أثناء الكتابة (للمنع الفوري)
document
  .getElementById ('windDirSurface')
  .addEventListener ('input', function (e) {
    let value = this.value;

    // منع إدخال أكثر من رقمين
    if (value.length > 2) {
      this.value = value.slice (0, 2);
    }

    // التحقق من القيمة أثناء الكتابة
    if (value.length === 2) {
      validateWindDirection (this);
    }
  });

document
  .getElementById ('windDirMean')
  .addEventListener ('input', function (e) {
    let value = this.value;

    // منع إدخال أكثر من رقمين
    if (value.length > 2) {
      this.value = value.slice (0, 2);
    }

    // التحقق من القيمة أثناء الكتابة
    if (value.length === 2) {
      validateWindDirection (this);
    }
  });
// إضافة مستمعات الأحداث للتحقق أثناء الكتابة
document
  .getElementById ('stationPressure')
  .addEventListener ('input', function (e) {
    // التحقق أثناء الكتابة لمنع القيم العالية
    let value = this.value.replace (/[^\d.]/g, '');

    if (value.length >= 2) {
      const firstTwoDigits = parseInt (value.substring (0, 2));
      if (firstTwoDigits > 10) {
        showFieldError (this, 'القيمة لا يمكن أن تتجاوز 1050.0');
        this.value = this.value.slice (0, -1); // إزالة آخر حرف مدخل
      }
    }
  });

document
  .getElementById ('stationPressureMSL')
  .addEventListener ('input', function (e) {
    // نفس المنطق للحقل الثاني
    let value = this.value.replace (/[^\d.]/g, '');

    if (value.length >= 2) {
      const firstTwoDigits = parseInt (value.substring (0, 2));
      if (firstTwoDigits > 10) {
        showFieldError (this, 'القيمة لا يمكن أن تتجاوز 1050.0');
        this.value = this.value.slice (0, -1);
      }
    }
  });

// التحقق عند فقدان التركيز (blur)
document
  .getElementById ('stationPressure')
  .addEventListener ('blur', function () {
    formatPressure (this);
    validatePressure (this);
  });

document
  .getElementById ('stationPressureMSL')
  .addEventListener ('blur', function () {
    formatPressure (this);
    validatePressure (this);
  });
// دالة لعرض خطأ للحقل (معدلة)
function showFieldError (input, message) {
  // إزالة أي رسائل خطأ سابقة
  hideFieldError (input);

  // إضافة صنف الخطأ للحقل
  input.classList.add ('is-invalid');

  // إضافة تأثير اهتزاز
  input.classList.add ('shake');
  setTimeout (() => {
    input.classList.remove ('shake');
  }, 500);

  // إنشاء عنصر رسالة الخطأ
  const errorDiv = document.createElement ('div');
  errorDiv.className = 'invalid-feedback';
  errorDiv.textContent = message;
  errorDiv.id = input.id + 'Error';
  errorDiv.style.display = 'block';
  errorDiv.style.opacity = '1';

  // إضافة رسالة الخطأ بعد الحقل
  input.parentNode.appendChild (errorDiv);

  // جعل الرسالة تظهر بشكل سلس
  setTimeout (() => {
    errorDiv.style.opacity = '1';
  }, 10);
}
// دالة لعرض خطأ للحقل (معدلة)
function showFieldError (input, message) {
  // إزالة أي رسائل خطأ سابقة
  hideFieldError (input);

  // إضافة صنف الخطأ للحقل
  input.classList.add ('is-invalid');

  // إضافة تأثير اهتزاز
  input.classList.add ('shake');
  setTimeout (() => {
    input.classList.remove ('shake');
  }, 500);

  // إنشاء عنصر رسالة الخطأ
  const errorDiv = document.createElement ('div');
  errorDiv.className = 'invalid-feedback';
  errorDiv.textContent = message;
  errorDiv.id = input.id + 'Error';
  errorDiv.style.display = 'block';
  errorDiv.style.opacity = '1';

  // إضافة رسالة الخطأ بعد الحقل
  input.parentNode.appendChild (errorDiv);

  // جعل الرسالة تظهر بشكل سلس
  setTimeout (() => {
    errorDiv.style.opacity = '1';
  }, 10);
}





// دالة جديدة للإرسال والتنزيل
async function sendData () {
  if (!validateForm ()) return;

  try {
    // جمع البيانات من النموذج
    const formData = {
      station_code: document.getElementById ('stationCode').value,
      station_name: document.getElementById ('stationName').value,
      elevation: parseInt (document.getElementById ('elevation').value) || 0,
      observation_date: document.getElementById ('observationDate').value,
      observation_time: document.getElementById ('observationTime').value,
      utc_time: convertToUTC (
        document.getElementById ('observationTime').value
      ),
      observer_name: document.getElementById ('observer').value,
      dry_temperature: parseFloat (document.getElementById ('dryTemp').value) ||
        null,
      wet_temperature: parseFloat (document.getElementById ('wetTemp').value) ||
        null,
      station_pressure: parseFloat (
        document.getElementById ('stationPressure').value
      ) || null,
      pressure_msl: parseFloat (
        document.getElementById ('stationPressureMSL').value
      ) || null,
      vapor_pressure: parseFloat (
        document.getElementById ('vaporPressureResult').textContent
      ) || null,
      dew_point: parseFloat (
        document.getElementById ('dewPointResult').textContent
      ) || null,
      humidity: parseFloat (
        document.getElementById ('humidityResult').textContent
      ) || null,
      vapor_diff: parseFloat (
        document.getElementById ('vaporDiffResult').textContent
      ) || null,
      wind_dir_surface: document.getElementById ('windDirSurface').value,
      wind_speed_surface: document.getElementById ('windSpeedSurface').value,
      wind_dir_mean: document.getElementById ('windDirMean').value,
      wind_speed_mean: document.getElementById ('windSpeedMean').value,
      visibility: document.getElementById ('visibility').value,
      current_weather: document.getElementById ('currentWeather').value,
      past_weather: document.getElementById ('pastWeather').value,
      cloud_cover_total: document.getElementById ('cloudCoverTotal').value,
      cloud_amount1: document.getElementById ('cloudAmount1').value,
      cloud_type1: document.getElementById ('cloudType1').value,
      cloud_height1: document.getElementById ('cloudHeight1').value,
      cloud_amount2: document.getElementById ('cloudAmount2').value,
      cloud_type2: document.getElementById ('cloudType2').value,
      cloud_height2: document.getElementById ('cloudHeight2').value,
      cloud_amount3: document.getElementById ('cloudAmount3').value,
      cloud_type3: document.getElementById ('cloudType3').value,
      cloud_height3: document.getElementById ('cloudHeight3').value,
      cloud_amount4: document.getElementById ('cloudAmount4').value,
      cloud_sum12: document.getElementById ('cloudSum12').value,
      cloud_sum123: document.getElementById ('cloudSum123').value,
      responsibility_accepted: document.getElementById (
        'responsibilityCheckbox'
      ).checked,
    };

    // إظهار مؤشر التحميل
    const sendBtn = document.getElementById ('sendBtn');
    const originalText = sendBtn.innerHTML;
    sendBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin me-2"></i>جاري الإرسال...';
    sendBtn.disabled = true;

    // إرسال البيانات إلى Supabase
    const {data, error} = await supabase
      .from ('hourly_weather_data')
      .insert ([formData])
      .select ();

    if (error) {
      throw new Error (`فشل في إرسال البيانات: ${error.message}`);
    }

    // تنزيل البيانات كملف JSON (الوظيفة الأصلية)
    downloadData ();

    showAlert ('تم إرسال البيانات وتخزينها في قاعدة البيانات بنجاح', 'success');
  } catch (error) {
    console.error ('Error in sendData:', error);
    showAlert ('حدث خطأ في الإرسال: ' + error.message, 'danger');
  } finally {
    // استعادة حالة الزر
    const sendBtn = document.getElementById ('sendBtn');
    sendBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>إرسال البيانات';
    sendBtn.disabled = false;
  }
}
// دالة مساعدة للتحقق من اتصال الإنترنت
async function checkInternetConnection() {
    try {
        const response = await fetch('https://httpbin.org/status/200', {
            method: 'HEAD'
        });
        return response.ok;
    } catch {
        return false;
    }
}

// دالة للإرسال المتكرر في حالة فشل المحاولة الأولى
async function sendDataWithRetry(maxRetries = 3, delay = 2000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            await sendData();
            return true;
        } catch (error) {
            if (attempt === maxRetries) {
                throw error;
            }
            
            console.log(`محاولة إرسال ${attempt} فشلت، إعادة المحاولة بعد ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
        }
    }
}

// إضافة مستمع حدث لزر الإرسال
document.getElementById('sendBtn').addEventListener('click', function() {
    // التحقق من اتصال الإنترنت قبل الإرسال
    checkInternetConnection().then(isOnline => {
        if (!isOnline) {
            if (confirm('يبدو أنك غير متصل بالإنترنت. هل تريد المتابعة مع التنزيل فقط؟')) {
                downloadData();
            }
            return;
        }
        
        sendDataWithRetry().catch(error => {
            console.error('فشلت جميع محاولات الإرسال:', error);
            showAlert('فشلت جميع محاولات الإرسال. تم التنزيل فقط.', 'warning');
        });
    });
});