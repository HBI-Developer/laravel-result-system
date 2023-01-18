<!DOCTYPE html>

<html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">

        {{-- Yield title of page --}}

        <title> @yield('title', 'صفحة') </title>

        <link rel="shortcut icon" href="{{asset('images/logo.svg')}}" type="image/x-icon">
        <link rel="stylesheet" href="{{asset('css/general.css')}}">
        <link rel="stylesheet" href="{{asset('css/icons.css')}}">
        <link rel="stylesheet" href="{{asset('css/website/general/admin-pages.css')}}">
        <link rel="stylesheet" href="{{asset('css/website/general/page-title.css')}}">
        <link rel="stylesheet" href="{{asset('css/website/general/list.css')}}">

        {{-- Yield for add css files --}}

        @yield('css')

    </head>

    <body>

        <div class="page">

            <div class="header">

                <div class="logo">

                    <div class="icon logo-icon"></div>

                </div>

                <div class="title">نظام النتائج</div>

            </div>

            <div class="container">

                <div class='to-back'>
                    
                    <a class="back-arrow" href='{{route('admin.index')}}'>
                        &langle;
                    </a>

                    {{-- Yield title of page --}}

                    <div class="page-title"> @yield('title', 'صفحة') </div>

                </div>

                {{-- Yield of container  --}}

                @yield('container')

                <div class="confirm">

                    <div class="head">هل أنت متأكد؟</div>

                    <div class="body">

                        {{-- Yield of confirm --}}

                        <div class="message">@yield('confirm')</div>

                        <div class="buttons">
                            <div class="yes">نعم</div>
                            <div class="no">لا</div>
                            <div class="waiting">انتظر ريثما يتم الحذف</div>
                        </div>

                    </div>

                </div>

            </div>

        </div>

        <script src="{{asset('js/vendor/jQuery.js')}}"></script>
        <script src="{{asset('js/website/general.js')}}"></script>
        <script src="{{asset('js/website/admin/adminGeneral.js')}}"></script>

        {{-- Yield of JavaScript files --}}

        @yield('js')
        
    </body>
</html>