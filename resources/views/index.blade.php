<!DOCTYPE html>

<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>نظام نتائج</title>
        <link rel="shortcut icon" href="{{asset('images/logo.svg')}}" type="image/x-icon">
        <link rel="stylesheet" href="{{asset('css/general.css')}}">
        <link rel="stylesheet" href="{{asset('css/icons.css')}}">
        <link rel="stylesheet" href="{{asset('css/website/main.page.css')}}">
    </head>

    <body dir="rtl">

        <div class="main-page">

            <div class="header">

                <div class="logo">
                    <div class="icon logo-icon"></div>
                </div>

                <div class="welcome">
                    <p>مرحباً بك في</p>
                    <div class="title">نظام النتائج</div>
                </div>

            </div>

            <div class="container">

                <a class="admin" href="{{route('admin.login')}}">
                    <div class="icon user-icon"></div>
                    <div class="name">مسؤول النظام</div>
                </a>

                <a class="student" href="{{route('student.login')}}">
                    <div class="icon student-icon"></div>
                    <div class="name">طالب</div>
                </a>

            </div>

        </div>

        <div class="loading-screen">

            <div class="container">
                <div class="part"></div>
                <div class="part"></div>
                <div class="part"></div>
                <div class="part"></div>
            </div>

        </div>
        
        <script src="{{asset('js/vendor/jQuery.js')}}"></script>
        <script src="{{asset('js/website/mainPage.js')}}"></script>
    </body>

</html>