<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="shortcut icon" href="{{asset('images/logo.svg')}}" type="image/x-icon">
        <title>تسجيل الدخول</title>
        <link rel="stylesheet" href="{{asset('css/general.css')}}">
        <link rel="stylesheet" href="{{asset('css/icons.css')}}">
        <link rel="stylesheet" href="{{asset('css/website/login.page.css')}}">
    </head>
    
    <body>

        <div class="login-page">

            <div class="header">

                <div class="logo">
                    <div class="icon logo-icon"></div>
                </div>

                <div class="title">نظام النتائج</div>

            </div>

            {{-- If type variable equal 'admin' route to check admin else route to check student --}}

            <form class="container" action="{{ $type === 'admin' ? route('check.admin') : route('check.student') }}" method="POST">

                @csrf

                {{-- Yield form --}}

                @yield('form')

                <button type="submit" class="btn send-btn">
                    <p> تسجيل الدخول </p>
                    <div class="waiting">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </button>

                <a class="btn back-btn" href="{{route('main')}}">عودة</a>

            </form>

        </div>

    </body>

</html>