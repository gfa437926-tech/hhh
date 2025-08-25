// config.js - التكوين الموحد لـ Supabase
(function() {
    'use strict';
    
    // تعريف متغيرات Supabase العالمية
    window.SUPABASE_CONFIG = {
        URL: 'https://cldrmtjeqtshekwefoar.supabase.co',
        ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZHJtdGplcXRzaGVrd2Vmb2FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNTE4MjksImV4cCI6MjA3MTYyNzgyOX0.0YdN2ZRHKLRWetRHCRMYur0gFrQZzAJi837dRMJ_-Uw',
        TABLES: {
            HOURLY: 'hourly_weather_data',
            DAILY: 'daily_weather_data',
            USERS: 'users'
        }
    };

    // تهيئة Supabase Client فقط إذا كانت المكتبة متاحة
    if (typeof supabase !== 'undefined') {
        window.supabase = supabase.createClient(
            window.SUPABASE_CONFIG.URL,
            window.SUPABASE_CONFIG.ANON_KEY
        );
        
        console.log('تم تهيئة Supabase Client بنجاح');
    } else {
        console.warn('مكتبة Supabase غير محملة بعد، سيتم تهيئة العميل عند توفرها');
        
        // تأخير التهيئة حتى تحميل المكتبة
        const checkSupabase = setInterval(function() {
            if (typeof supabase !== 'undefined') {
                clearInterval(checkSupabase);
                window.supabase = supabase.createClient(
                    window.SUPABASE_CONFIG.URL,
                    window.SUPABASE_CONFIG.ANON_KEY
                );
                console.log('تم تهيئة Supabase Client بعد الانتظار');
            }
        }, 100);
    }

    // دالة للتحقق من اتصال Supabase
    window.checkSupabaseConnection = async function() {
        try {
            if (!window.supabase) {
                return {
                    connected: false,
                    error: 'Supabase Client غير مهيأ',
                    data: null
                };
            }
            
            const { data, error } = await window.supabase
                .from('users')
                .select('count')
                .limit(1);
            
            return {
                connected: !error,
                error: error ? error.message : null,
                data: data
            };
        } catch (error) {
            return {
                connected: false,
                error: error.message,
                data: null
            };
        }
    };

    // دالة للحصول على إعدادات Supabase
    window.getSupabaseConfig = function() {
        return window.SUPABASE_CONFIG;
    };

    console.log('تم تحميل ملف التكوين الموحد لـ Supabase');
})();